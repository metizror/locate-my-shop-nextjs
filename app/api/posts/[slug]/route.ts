import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Public: fetch a single post by slug with its author.
export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const slug = decodeURIComponent(params.slug);
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: { author: true },
  });
  if (!post) return NextResponse.json(null, { status: 404 });
  return NextResponse.json(post);
}
