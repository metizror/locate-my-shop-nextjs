import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import {
  slugify,
  ensureUniqueSlug,
  dateParts,
  jsonField,
} from "@/lib/blog-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Admin: create a post.
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (!body.title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const published = body.published_at ? new Date(body.published_at) : new Date();
  const slug = await ensureUniqueSlug(slugify(body.slug || body.title));

  const post = await prisma.blogPost.create({
    data: {
      title: body.title,
      slug,
      excerpt: body.excerpt ?? null,
      content: body.content ?? null,
      author_id: body.author_id?.trim() ? body.author_id : null,
      image_url: body.image_url ?? null,
      category: body.category ?? null,
      read_time: body.read_time ?? null,
      seo_title: body.seo_title ?? null,
      seo_description: body.seo_description ?? null,
      seo_schema: jsonField(body.seo_schema),
      published_at: published,
      ...dateParts(published),
      user_id: session.sub,
    },
    include: { author: true },
  });

  return NextResponse.json(post, { status: 201 });
}
