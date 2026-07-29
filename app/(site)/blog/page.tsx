import type { Metadata } from "next";
import BlogPageClient from "./BlogPageClient";
import { pageSeo } from "@/lib/seo";
import { prisma } from "@/lib/db";
import { buildBlogSchema } from "@/lib/blog-schema";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

const BLOG_NAME = "Store Locator Blog";
const BLOG_DESCRIPTION =
  "Practical tips and insights on boosting customer reach, improving store visibility, and growing your business locally.";

export const metadata: Metadata = pageSeo({
  title: "Store Locator Blogs I MSPL Shopify Store Locator App",
  description:
    "Stay updated with practical tips and insights on boosting customer reach, improving store visibility, and growing your business locally.",
  path: "/blog",
});

export default async function BlogPage() {
  // Server-side fetch so the Blog JSON-LD is present in the initial HTML.
  const posts = await prisma.blogPost.findMany({
    where: { slug: { not: null } },
    orderBy: [{ published_at: "desc" }, { created_at: "desc" }],
    include: { author: { select: { name: true } } },
    take: 50,
  });

  const blogSchema = buildBlogSchema(posts, {
    name: BLOG_NAME,
    description: BLOG_DESCRIPTION,
  });

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <BlogPageClient />
    </>
  );
}

