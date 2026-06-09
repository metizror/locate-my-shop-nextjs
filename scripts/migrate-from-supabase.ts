/**
 * One-off migration: copy all data from Supabase -> local MySQL (via Prisma),
 * download Supabase Storage images to public/uploads/blog-images, rewrite their
 * URLs, and seed the first admin user.
 *
 * Run with:  npx tsx scripts/migrate-from-supabase.ts
 * Idempotent: re-running upserts by id and skips already-downloaded images.
 */
import "dotenv/config";
import { config as loadEnv } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

// .env is loaded by dotenv/config; also pull in .env.local (Next convention).
loadEnv({ path: ".env.local", override: false });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "blog-images");
const PUBLIC_PREFIX = "/uploads/blog-images";

const prisma = new PrismaClient();

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Missing Supabase env (NEXT_PUBLIC_SUPABASE_URL / _ANON_KEY).");
  process.exit(1);
}
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});

const jsonOrDbNull = (v: any) =>
  v === null || v === undefined ? Prisma.DbNull : (v as Prisma.InputJsonValue);
const toDate = (v: any): Date | null => (v ? new Date(v) : null);

/** Is this a Supabase Storage public URL we should localize? */
function isSupabaseStorageUrl(url?: string | null): boolean {
  return (
    !!url &&
    !!SUPABASE_URL &&
    url.startsWith(SUPABASE_URL) &&
    url.includes("/storage/v1/object/public/")
  );
}

const downloadCache = new Map<string, string>();

/** Download a Supabase image to local disk; return the new public path. */
async function localizeImage(url?: string | null): Promise<string | null> {
  if (!url) return null;
  if (!isSupabaseStorageUrl(url)) return url; // leave non-supabase URLs as-is
  if (downloadCache.has(url)) return downloadCache.get(url)!;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`  ! download failed (${res.status}): ${url}`);
      return url;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    // Preserve original basename when possible, else hash it.
    const base = decodeURIComponent(url.split("?")[0].split("/").pop() || "");
    const safe =
      base && /\.[a-z0-9]{2,5}$/i.test(base)
        ? base
        : `${crypto.randomBytes(8).toString("hex")}.jpg`;
    await fs.writeFile(path.join(UPLOAD_DIR, safe), buf);
    const publicPath = `${PUBLIC_PREFIX}/${safe}`;
    downloadCache.set(url, publicPath);
    console.log(`  ↓ ${safe}`);
    return publicPath;
  } catch (e: any) {
    console.warn(`  ! download error: ${url} (${e.message})`);
    return url;
  }
}

/** Rewrite any supabase storage URLs embedded in post body HTML. */
async function localizeBodyImages(html?: string | null): Promise<string> {
  if (!html) return html || "";
  const urls = Array.from(
    html.matchAll(/https?:\/\/[^"')\s]+/g),
    (m) => m[0]
  ).filter(isSupabaseStorageUrl);
  let out = html;
  for (const u of Array.from(new Set(urls))) {
    const local = await localizeImage(u);
    if (local && local !== u) out = out.split(u).join(local);
  }
  return out;
}

async function migrateAuthors() {
  const { data, error } = await supabase.from("blog_authors").select("*");
  if (error) throw error;
  console.log(`\nAuthors: ${data?.length ?? 0}`);
  for (const a of data ?? []) {
    const avatar = await localizeImage(a.avatar_url);
    await prisma.blogAuthor.upsert({
      where: { id: a.id },
      create: {
        id: a.id,
        name: a.name,
        bio: a.bio,
        avatar_url: avatar,
        twitter_url: a.twitter_url,
        linkedin_url: a.linkedin_url,
        facebook_url: a.facebook_url,
        created_at: toDate(a.created_at) ?? new Date(),
        updated_at: toDate(a.updated_at) ?? new Date(),
      },
      update: {
        name: a.name,
        bio: a.bio,
        avatar_url: avatar,
        twitter_url: a.twitter_url,
        linkedin_url: a.linkedin_url,
        facebook_url: a.facebook_url,
      },
    });
  }
}

async function migratePosts() {
  const { data, error } = await supabase.from("blog_posts").select("*");
  if (error) throw error;
  console.log(`\nPosts: ${data?.length ?? 0}`);
  for (const p of data ?? []) {
    const image = await localizeImage(p.image_url);
    const content = await localizeBodyImages(p.content);
    const common = {
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      content,
      image_url: image,
      category: p.category,
      read_time: p.read_time,
      author_id: p.author_id,
      user_id: p.user_id,
      seo_title: p.seo_title ?? null,
      seo_description: p.seo_description ?? null,
      seo_schema: jsonOrDbNull(p.seo_schema),
      date_day: p.date_day,
      date_month: p.date_month,
      date_year: p.date_year,
      heyfilo_post_id: p.heyfilo_post_id ?? null,
      heyfilo_event_id: p.heyfilo_event_id ?? null,
      published_at: toDate(p.published_at),
    };
    await prisma.blogPost.upsert({
      where: { id: p.id },
      create: {
        id: p.id,
        ...common,
        created_at: toDate(p.created_at) ?? new Date(),
        updated_at: toDate(p.updated_at) ?? new Date(),
      },
      update: common,
    });
    console.log(`  • ${p.title}`);
  }
}

async function migrateSettings() {
  const { data, error } = await supabase.from("blog_settings").select("*");
  if (error) {
    console.warn(`Settings skipped: ${error.message}`);
    return;
  }
  console.log(`\nSettings rows: ${data?.length ?? 0}`);
  for (const s of data ?? []) {
    const common = {
      site_name: s.site_name ?? "My Blog",
      site_description: s.site_description,
      site_url: s.site_url,
      contact_email: s.contact_email,
      social_links: jsonOrDbNull(s.social_links),
      seo_settings: jsonOrDbNull(s.seo_settings),
      email_settings: jsonOrDbNull(s.email_settings),
      comment_settings: jsonOrDbNull(s.comment_settings),
      analytics_settings: jsonOrDbNull(s.analytics_settings),
    };
    await prisma.blogSettings.upsert({
      where: { user_id: s.user_id },
      create: {
        id: s.id,
        user_id: s.user_id,
        ...common,
        created_at: toDate(s.created_at) ?? new Date(),
        updated_at: toDate(s.updated_at) ?? new Date(),
      },
      update: common,
    });
  }
}

async function migrateAnalytics() {
  const { data, error } = await supabase.from("blog_analytics").select("*");
  if (error) {
    console.warn(`Analytics skipped: ${error.message}`);
    return;
  }
  console.log(`\nAnalytics rows: ${data?.length ?? 0}`);
  for (const r of data ?? []) {
    await prisma.blogAnalytics.upsert({
      where: { id: r.id },
      create: {
        id: r.id,
        post_id: r.post_id,
        event_type: r.event_type,
        user_id: r.user_id,
        ip_address: r.ip_address ? String(r.ip_address) : null,
        user_agent: r.user_agent,
        created_at: toDate(r.created_at) ?? new Date(),
      },
      update: {},
    });
  }
}

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.warn("\nAdmin seed skipped: ADMIN_EMAIL / ADMIN_PASSWORD not set.");
    return;
  }
  const password_hash = await bcrypt.hash(password, 12);
  await prisma.adminUser.upsert({
    where: { email },
    create: { email, password_hash },
    update: { password_hash },
  });
  console.log(`\nAdmin user ready: ${email}`);
}

async function main() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  console.log("Starting migration Supabase -> MySQL ...");
  await migrateAuthors();
  await migratePosts();
  await migrateSettings();
  await migrateAnalytics();
  await seedAdmin();
  console.log("\n✅ Migration complete.");
}

main()
  .catch((e) => {
    console.error("\n❌ Migration failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
