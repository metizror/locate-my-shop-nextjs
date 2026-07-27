// Builders for blog structured data (JSON-LD) — a `Blog` schema for the listing
// page and `BlogPosting` for individual posts, for rich-result eligibility.
// All URLs are absolute against the canonical www host.
import { getSiteBaseUrl } from "./site";
import { SITE_NAME, LOGO_IMAGE } from "./seo";

export type BlogPostLike = {
  slug: string | null;
  title: string;
  excerpt?: string | null;
  seo_description?: string | null;
  image_url?: string | null;
  published_at?: Date | null;
  created_at?: Date | null;
  updated_at?: Date | null;
  author?: { name: string } | null;
};

/** Resolve a possibly-relative asset URL to an absolute one. */
function absUrl(base: string, url?: string | null): string | undefined {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  return `${base}${url.startsWith("/") ? "" : "/"}${url}`;
}

function iso(d?: Date | null): string | undefined {
  return d ? new Date(d).toISOString() : undefined;
}

function publisher(base: string) {
  return {
    "@type": "Organization",
    name: SITE_NAME,
    logo: {
      "@type": "ImageObject",
      url: `${base}${LOGO_IMAGE}`,
      width: 1200,
      height: 1200,
    },
  };
}

/** BlogPosting/Article schema for a single post. Undefined fields are dropped by JSON.stringify. */
export function buildBlogPostingSchema(post: BlogPostLike) {
  const base = getSiteBaseUrl();
  const url = `${base}/blog/${post.slug}`;
  const published = post.published_at ?? post.created_at ?? null;
  const image = absUrl(base, post.image_url);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    headline: post.title,
    description: post.seo_description ?? post.excerpt ?? undefined,
    image: image ? [image] : undefined,
    datePublished: iso(published),
    dateModified: iso(post.updated_at) ?? iso(published),
    author: post.author?.name
      ? { "@type": "Person", name: post.author.name }
      : { "@type": "Organization", name: SITE_NAME },
    publisher: publisher(base),
  };
}

/** Blog schema for the listing page, embedding recent posts. */
export function buildBlogSchema(
  posts: BlogPostLike[],
  meta: { name: string; description: string }
) {
  const base = getSiteBaseUrl();
  const blogUrl = `${base}/blog`;
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${blogUrl}#blog`,
    url: blogUrl,
    name: meta.name,
    description: meta.description,
    publisher: publisher(base),
    blogPost: posts
      .filter((p) => p.slug)
      .slice(0, 20)
      .map((p) => {
        const url = `${base}/blog/${p.slug}`;
        const published = p.published_at ?? p.created_at ?? null;
        const image = absUrl(base, p.image_url);
        return {
          "@type": "BlogPosting",
          "@id": `${url}#article`,
          url,
          headline: p.title,
          image,
          datePublished: iso(published),
          author: p.author?.name ? { "@type": "Person", name: p.author.name } : undefined,
        };
      }),
  };
}
