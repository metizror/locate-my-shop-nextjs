import type { Metadata } from "next";
import BlogPageClient from "./BlogPageClient";
import { pageSeo } from "@/lib/seo";

export const metadata: Metadata = pageSeo({
  title: "Store Locator Blogs I MSPL Shopify Store Locator App",
  description:
    "Stay updated with practical tips and insights on boosting customer reach, improving store visibility, and growing your business locally.",
  path: "/blog",
});

export default function BlogPage() {
  return <BlogPageClient />;
}

