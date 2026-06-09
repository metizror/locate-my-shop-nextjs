import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Admin: list authors.
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const authors = await prisma.blogAuthor.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(authors);
}

// Admin: create author.
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (!body.name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  const author = await prisma.blogAuthor.create({
    data: {
      name: body.name,
      bio: body.bio ?? null,
      avatar_url: body.avatar_url ?? null,
      twitter_url: body.twitter_url ?? null,
      linkedin_url: body.linkedin_url ?? null,
      facebook_url: body.facebook_url ?? null,
    },
  });
  return NextResponse.json(author, { status: 201 });
}
