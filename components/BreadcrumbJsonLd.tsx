import { buildBreadcrumbSchema, type Crumb } from "@/lib/breadcrumb";

/**
 * Renders a server-side BreadcrumbList JSON-LD <script>. Invisible — it adds no
 * visible UI, only structured data for search engines.
 */
export default function BreadcrumbJsonLd({ items }: { items: Crumb[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(buildBreadcrumbSchema(items)),
      }}
    />
  );
}
