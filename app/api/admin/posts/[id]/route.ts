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

// Admin: update a post.
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = params.id;
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const data: any = {};

  if (body.title !== undefined) data.title = body.title;
  if (body.excerpt !== undefined) data.excerpt = body.excerpt;
  if (body.content !== undefined) data.content = body.content;
  if (body.image_url !== undefined) data.image_url = body.image_url;
  if (body.category !== undefined) data.category = body.category;
  if (body.read_time !== undefined) data.read_time = body.read_time;
  if (body.seo_title !== undefined) data.seo_title = body.seo_title;
  if (body.seo_description !== undefined) data.seo_description = body.seo_description;
  if (body.seo_schema !== undefined) data.seo_schema = jsonField(body.seo_schema);
  if (body.author_id !== undefined)
    data.author_id = body.author_id?.trim() ? body.author_id : null;

  if (body.slug !== undefined || body.title !== undefined) {
    const base = slugify(body.slug || body.title || existing.title);
    data.slug = await ensureUniqueSlug(base, id);
  }

  if (body.published_at !== undefined) {
    const published = new Date(body.published_at);
    data.published_at = published;
    Object.assign(data, dateParts(published));
  }

  const post = await prisma.blogPost.update({
    where: { id },
    data,
    include: { author: true },
  });
  return NextResponse.json(post);
}

// Admin: delete a post.
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.blogPost.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
