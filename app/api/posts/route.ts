import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Public: list all posts (newest first) with their author.
export async function GET() {
  const posts = await prisma.blogPost.findMany({
    include: { author: true },
    orderBy: [{ published_at: "desc" }, { created_at: "desc" }],
  });
  return NextResponse.json(posts);
}
