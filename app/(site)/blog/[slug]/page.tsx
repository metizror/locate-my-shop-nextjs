import type { Metadata } from "next";
import BlogDetailPage from "@/components/blog/BlogDetailPage";
import { prisma } from "@/lib/db";

// Force dynamic rendering to ensure schema updates appear immediately
// This prevents static generation caching that would hide schema updates
export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Params = { params: { slug: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const slug = decodeURIComponent(params.slug);
  const data = await prisma.blogPost.findUnique({ where: { slug } });
  if (!data) return { title: "Article | MSPL Store Locator" };
  const seoTitle = (data as any)?.seo_title ?? data.title;
  const seoDescription = (data as any)?.seo_description ?? data.excerpt ?? undefined;
  return {
    title: seoTitle,
    description: seoDescription,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: 'article',
      title: seoTitle,
      description: seoDescription,
      images: data.image_url ? [{ url: data.image_url as string }] : undefined,
    }
  };
}

export default async function BlogPostPage({ params }: Params) {
  const slug = decodeURIComponent(params.slug);
  const data = await prisma.blogPost.findUnique({ where: { slug } });

  const schema = (data as any)?.seo_schema;
  
  // Handle schema: can be null, an object, or an array of objects
  // This ensures old posts with null/undefined schema are handled correctly
  let schemaArray: any[] = [];
  if (schema !== null && schema !== undefined) {
    if (Array.isArray(schema)) {
      // Filter out null/undefined values from array and validate each item
      schemaArray = schema.filter((item: any) => {
        return item !== null && 
               item !== undefined && 
               typeof item === 'object' && 
               !Array.isArray(item);
      });
    } else if (typeof schema === 'object' && !Array.isArray(schema)) {
      // Single schema object - validate it's a proper object
      schemaArray = [schema];
    }
  }

  return (
    <>
      {schemaArray.length > 0 && schemaArray.map((obj: any, idx: number) => {
        // Final validation before rendering
        if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
          return null;
        }
        
        try {
          // Validate JSON can be stringified (catches circular references, etc.)
          const jsonString = JSON.stringify(obj);
          return (
            <script
              key={`schema-${idx}`}
              type="application/ld+json"
              // Rendered on the server so it's visible in page source
              dangerouslySetInnerHTML={{ __html: jsonString }}
            />
          );
        } catch (error) {
          // Silently skip invalid schema objects
          console.error('Error rendering schema object:', error);
          return null;
        }
      })}
      <BlogDetailPage slug={slug} />
    </>
  );
}


