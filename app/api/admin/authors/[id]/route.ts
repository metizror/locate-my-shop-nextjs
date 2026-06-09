import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Admin: update author.
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const author = await prisma.blogAuthor.update({
    where: { id: params.id },
    data: {
      name: body.name,
      bio: body.bio ?? null,
      avatar_url: body.avatar_url ?? null,
      twitter_url: body.twitter_url ?? null,
      linkedin_url: body.linkedin_url ?? null,
      facebook_url: body.facebook_url ?? null,
    },
  });
  return NextResponse.json(author);
}

// Admin: delete author. (Posts keep existing; author_id is set to NULL.)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.blogAuthor.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
