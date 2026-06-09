import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { downloadImageToLocal } from "@/lib/storage";
import { slugify, ensureUniqueSlug, dateParts } from "@/lib/blog-helpers";
import { deriveExcerpt } from "@/lib/text";

// Server-to-server webhook receiver — never cache / statically optimize.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// --- Configuration (all optional; pick ONE auth mode in heyfilo) -------------
const WEBHOOK_SECRET = process.env.HEYFILO_WEBHOOK_SECRET; // HMAC mode
const BEARER_TOKEN = process.env.HEYFILO_BEARER_TOKEN; // Bearer mode
const API_KEY = process.env.HEYFILO_API_KEY; // API key mode

const PUBLIC_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "";

// --- Helpers -----------------------------------------------------------------

/** Read a header, preferring the current X-Heyfilo-* name with X-WPCP-* fallback. */
function readHeader(req: NextRequest, name: string): string {
  return (
    req.headers.get(`x-heyfilo-${name}`) ||
    req.headers.get(`x-wpcp-${name}`) ||
    ""
  );
}

/** Constant-time HMAC-SHA256 verification of `${timestamp}.${rawBody}`. */
function verifyHmac(
  secret: string,
  timestamp: string,
  body: string,
  signature: string
): boolean {
  const computed = crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}.${body}`)
    .digest("hex");
  const expected = `sha256=${computed}`;
  if (!signature || signature.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

/** Rough "N min read" estimate from HTML body (~200 wpm). */
function estimateReadTime(html: string): string {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const words = text ? text.split(" ").length : 0;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

/** Find an author by name (case-insensitive) or create one. Returns id or null. */
async function resolveAuthorId(author: any): Promise<string | null> {
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

function buildLiveUrl(slug: string): string {
  return PUBLIC_SITE_URL ? `${PUBLIC_SITE_URL}/blog/${slug}` : `/blog/${slug}`;
}

// --- Route -------------------------------------------------------------------

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  const eventType = readHeader(req, "event-type");
  const timestamp = readHeader(req, "timestamp");
  const signature = readHeader(req, "signature");
  const eventId = readHeader(req, "event-id");

  // 1. Authenticate based on whichever mode is configured.
  if (WEBHOOK_SECRET) {
    if (!verifyHmac(WEBHOOK_SECRET, timestamp, rawBody, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
    if (timestamp) {
      const age = Math.abs(Date.now() / 1000 - Number(timestamp));
      if (Number.isFinite(age) && age > 300) {
        return NextResponse.json({ error: "Request too old" }, { status: 408 });
      }
    }
  } else if (BEARER_TOKEN) {
    if (req.headers.get("authorization") !== `Bearer ${BEARER_TOKEN}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } else if (API_KEY) {
    if (req.headers.get("x-api-key") !== API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // 2. Parse payload.
  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const event = eventType || payload?.event || "";

  // 3. Test ping — acknowledge without saving anything.
  if (event === "connection.test") {
    return NextResponse.json({ success: true });
  }

  // 4. Post creation.
  if (event === "post.created") {
    const post = payload?.post;
    const postId: string = payload?.postId;
    const deliveryId = eventId || payload?.eventId || "";

    if (!post || !postId) {
      return NextResponse.json(
        { error: "Missing post or postId" },
        { status: 400 }
      );
    }

    try {
      // 4a. Idempotency — same delivery already processed?
      if (deliveryId) {
        const dup = await prisma.blogPost.findUnique({
          where: { heyfilo_event_id: deliveryId },
        });
        if (dup) {
          return NextResponse.json({
            id: dup.id,
            url: buildLiveUrl(dup.slug || post.slug),
          });
        }
      }

      // 4b. Is this an update of a post we already have?
      const existing = await prisma.blogPost.findUnique({
        where: { heyfilo_post_id: postId },
      });

      // 4c. Re-host images (hero + inline) to local disk, rewriting body HTML.
      let body: string = post.body || "";
      let imageUrl: string | null = post.heroImage?.url || null;
      if (imageUrl) imageUrl = await downloadImageToLocal(imageUrl);

      if (Array.isArray(post.inlineImages)) {
        for (const img of post.inlineImages) {
          if (!img?.url) continue;
          const rehosted = await downloadImageToLocal(img.url);
          if (rehosted !== img.url) body = body.split(img.url).join(rehosted);
        }
      }

      // 4d. Resolve author + unique slug + date parts.
      const authorId = await resolveAuthorId(post.author);
      const slug = await ensureUniqueSlug(
        slugify(post.slug || post.title),
        existing?.id
      );
      const publishedAt = post.publishedAt
        ? new Date(post.publishedAt)
        : new Date();
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
        heyfilo_post_id: postId,
        heyfilo_event_id: deliveryId || null,
      };

      const saved = existing
        ? await prisma.blogPost.update({ where: { id: existing.id }, data })
        : await prisma.blogPost.create({ data });

      return NextResponse.json({ id: saved.id, url: buildLiveUrl(slug) });
    } catch (err: any) {
      console.error("[heyfilo-webhook] processing error:", err?.message || err);
      return NextResponse.json(
        { error: "Failed to ingest post" },
        { status: 500 }
      );
    }
  }

  // Unknown / future event types — ack so heyfilo doesn't retry.
  return NextResponse.json({ success: true });
}

// Some webhook configurators send a GET/HEAD health check first.
export async function GET() {
  return NextResponse.json({ ok: true, receiver: "heyfilo-webhook" });
}
