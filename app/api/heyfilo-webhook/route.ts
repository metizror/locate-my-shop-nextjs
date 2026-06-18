import { createWebhookHandler } from "@heyfilo/sdk/next";
import type { HeyfiloPost, HeyfiloPayload } from "@heyfilo/sdk/next";
import { prisma } from "@/lib/db";
import { slugify, ensureUniqueSlug, dateParts } from "@/lib/blog-helpers";
import { deriveExcerpt } from "@/lib/text";

// Server-to-server webhook receiver — never cache / statically optimize, and
// force the Node runtime (the SDK reads/writes the local media dir via fs).
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const PUBLIC_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "";

function buildLiveUrl(slug: string): string {
  return PUBLIC_SITE_URL ? `${PUBLIC_SITE_URL}/blog/${slug}` : `/blog/${slug}`;
}

/** Rough "N min read" estimate from HTML body (~200 wpm). */
function estimateReadTime(html: string): string {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const words = text ? text.split(" ").length : 0;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

/** Find an author by name (case-insensitive) or create one. Returns id or null. */
async function resolveAuthorId(author: HeyfiloPost["author"]): Promise<string | null> {
  const name = author?.name?.trim();
  if (!name) return null;

  // MySQL's default utf8mb4_unicode_ci collation makes this match
  // case-insensitively.
  const existing = await prisma.blogAuthor.findFirst({ where: { name } });
  if (existing) return existing.id;

  const created = await prisma.blogAuthor.create({
    data: {
      name,
      bio: author?.bio || null,
      avatar_url: author?.avatarUrl || null,
    },
  });
  return created.id;
}

/**
 * App-specific mapping. By the time this runs, the SDK has already:
 *   - verified the HMAC signature + timestamp freshness,
 *   - downloaded heroImage + every inlineImages[] entry into the local media
 *     dir (HEYFILO_MEDIA_DIR), and rewritten those URLs in `post.body`,
 *     `post.heroImage.url` and `post.inlineImages[].url` to `/media/...` paths.
 * We only handle DB persistence, slug disambiguation, read time, SEO and
 * idempotency-by-event here.
 */
async function onPost(post: HeyfiloPost, raw: HeyfiloPayload) {
  const postId = raw.postId;
  const eventId = raw.eventId || null;

  // UPSERT by heyfilo_post_id: if heyfilo re-publishes the same post (an edit
  // re-sent as post.created), update the existing row instead of inserting a
  // duplicate. heyfilo_post_id is @unique, so a blind create would otherwise
  // throw and trigger endless webhook retries.
  const existing = postId
    ? await prisma.blogPost.findUnique({ where: { heyfilo_post_id: postId } })
    : null;

  const authorId = await resolveAuthorId(post.author);
  const slug = await ensureUniqueSlug(
    slugify(post.slug || post.title),
    existing?.id
  );

  // Images are already localized by the SDK — just read the rewritten URLs.
  const body = post.body || "";
  const imageUrl = post.heroImage?.url || null;

  const publishedAt = post.publishedAt ? new Date(post.publishedAt) : new Date();
  const category =
    (Array.isArray(post.categories) && post.categories[0]) ||
    (Array.isArray(post.tags) && post.tags[0]) ||
    null;

  const data = {
    title: post.title,
    slug,
    excerpt: post.excerpt || deriveExcerpt(body) || null,
    content: body,
    author_id: authorId,
    image_url: imageUrl,
    category,
    read_time: estimateReadTime(body),
    seo_title: post.seo?.metaTitle || null,
    seo_description: post.seo?.metaDescription || null,
    published_at: publishedAt,
    ...dateParts(publishedAt),
    heyfilo_post_id: postId || null,
    // Persisted so isDuplicate() below can dedupe re-deliveries by eventId.
    heyfilo_event_id: eventId,
  };

  const saved = existing
    ? await prisma.blogPost.update({ where: { id: existing.id }, data })
    : await prisma.blogPost.create({ data });

  // This object becomes the JSON response body returned to heyfilo.
  return { id: saved.id, url: buildLiveUrl(slug) };
}

export const POST = createWebhookHandler({
  // Standardized on HEYFILO_SECRET (the SDK's documented name).
  secret: process.env.HEYFILO_SECRET,
  authType: "hmac",
  // Reject deliveries whose signed timestamp is older than 5 minutes.
  timestampToleranceSec: 300,

  onTest: () => {
    console.log("[heyfilo-webhook] connection.test received");
  },

  onPost,

  // Idempotency (eventId-only): the SDK calls isDuplicate() before onPost and
  // markProcessed() after. We persist the eventId as part of onPost (above), so
  // isDuplicate just checks for an existing row and markProcessed is a no-op.
  isDuplicate: async (eventId: string) => {
    if (!eventId) return false;
    const dup = await prisma.blogPost.findUnique({
      where: { heyfilo_event_id: eventId },
    });
    return Boolean(dup);
  },
  markProcessed: () => {
    /* eventId is persisted inside onPost via heyfilo_event_id */
  },
});

// Some webhook configurators send a GET/HEAD health check first.
export async function GET() {
  return Response.json({ ok: true, receiver: "heyfilo-webhook" });
}
