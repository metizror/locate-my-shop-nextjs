import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { jsonField } from "@/lib/blog-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Admin: get the current admin's settings (or null).
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const settings = await prisma.blogSettings.findUnique({
    where: { user_id: session.sub },
  });
  return NextResponse.json(settings);
}

// Admin: create or update settings for the current admin.
export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const b = await req.json();
  const common = {
    site_name: b.site_name ?? "My Blog",
    site_description: b.site_description ?? null,
    site_url: b.site_url ?? null,
    contact_email: b.contact_email ?? null,
    social_links: jsonField(b.social_links),
    seo_settings: jsonField(b.seo_settings),
    email_settings: jsonField(b.email_settings),
    comment_settings: jsonField(b.comment_settings),
    analytics_settings: jsonField(b.analytics_settings),
  };

  const settings = await prisma.blogSettings.upsert({
    where: { user_id: session.sub },
    create: { user_id: session.sub, ...common },
    update: common,
  });
  return NextResponse.json(settings);
}
