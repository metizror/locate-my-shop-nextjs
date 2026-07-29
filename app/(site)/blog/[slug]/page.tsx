import type { Metadata } from "next";
import BlogDetailPage from "@/components/blog/BlogDetailPage";
import { prisma } from "@/lib/db";
import { pageSeo } from "@/lib/seo";
import { buildBlogPostingSchema } from "@/lib/blog-schema";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

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
  // Use the post's hero image for the social preview when available; otherwise
  // fall back to the site's default 1200x630 OG image (handled by pageSeo).
  return pageSeo({
    title: seoTitle,
    description: seoDescription,
    path: `/blog/${slug}`,
    image: (data.image_url as string) || undefined,
    type: "article",
  });
}

export default async function BlogPostPage({ params }: Params) {
  const slug = decodeURIComponent(params.slug);
  const data = await prisma.blogPost.findUnique({
    where: { slug },
    include: { author: { select: { name: true } } },
  });

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

  // Auto-generate a BlogPosting schema from the post's own fields for
  // rich-result eligibility — unless the admin-provided seo_schema already
  // contains an Article-family type (avoid emitting a duplicate).
  const hasArticleSchema = schemaArray.some((o: any) => {
    const t = o?.["@type"];
    const types = Array.isArray(t) ? t : [t];
    return types.some(
      (x: any) => typeof x === "string" && /(Article|BlogPosting)/i.test(x)
    );
  });
  const autoPostingSchema =
    data && !hasArticleSchema ? buildBlogPostingSchema(data) : null;

  return (
    <>
      {data && (
        <BreadcrumbJsonLd
          items={[
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: data.title, path: `/blog/${slug}` },
          ]}
        />
      )}
      {autoPostingSchema && (
        <script
          type="application/ld+json"
          // Rendered on the server so it's visible in page source
          dangerouslySetInnerHTML={{ __html: JSON.stringify(autoPostingSchema) }}
        />
      )}
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


