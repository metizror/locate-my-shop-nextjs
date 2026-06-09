import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Admin: raw analytics events (newest first).
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const events = await prisma.blogAnalytics.findMany({
    orderBy: { created_at: "desc" },
    take: 500,
  });
  return NextResponse.json(events);
}
