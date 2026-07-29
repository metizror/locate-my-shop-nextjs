// Builder for BreadcrumbList JSON-LD (invisible structured data — no visible
// UI). URLs are absolute against the canonical www host.
import { getSiteBaseUrl } from "./site";

export interface Crumb {
  name: string;
  /** Path, e.g. "/features" or "/" for home. */
  path: string;
}

export function buildBreadcrumbSchema(items: Crumb[]) {
  const base = getSiteBaseUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${base}${c.path === "/" ? "" : c.path}`,
    })),
  };
}
