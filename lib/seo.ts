import type { Metadata } from "next";

export const SITE_NAME = "StoreLocator.in";

// Default social-share image (a real 1200x630 PNG in /public). Relative URLs are
// resolved against `metadataBase` (the canonical www host) by Next.js, so the
// emitted og:image / twitter:image are absolute — required by WhatsApp,
// LinkedIn, Facebook and X to render a preview.
export const OG_IMAGE = "/og-image.png";
export const OG_IMAGE_ALT = "StoreLocator.in — Shopify Store Locator App";

// Organization logo (real 1200x1200 asset used in Navbar/Footer/favicon). Used
// as the `publisher.logo` in blog structured data.
export const LOGO_IMAGE = "/lovable-uploads/e38b2a7e-a356-4be7-a266-c52662189454.png";

type SeoInput = {
  title: string;
  description?: string;
  /** Canonical path, e.g. "/features" (defaults to home). */
  path?: string;
  /** Optional image override (e.g. a blog post's hero). Falls back to OG_IMAGE. */
  image?: string;
  type?: "website" | "article";
};

/**
 * Build complete SEO metadata — canonical + Open Graph + Twitter card — for a
 * page, always including a real share image. Every page uses this so links
 * shared on any platform render a rich preview with an image.
 *
 * Note: Next.js replaces (does not deep-merge) a child segment's `openGraph` /
 * `twitter` over the parent's, so each page must carry its own image. Routing
 * everything through this helper guarantees that.
 */
export function pageSeo({
  title,
  description,
  path = "/",
  image = OG_IMAGE,
  type = "website",
}: SeoInput): Metadata {
  const isDefaultImage = image === OG_IMAGE;
  const ogImage = isDefaultImage
    ? { url: image, width: 1200, height: 630, alt: OG_IMAGE_ALT }
    : { url: image, alt: title };

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      type,
      locale: "en_US",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
