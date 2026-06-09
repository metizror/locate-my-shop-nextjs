import { prisma } from "./db";
import { Prisma } from "@prisma/client";

export function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "post"
  );
}

/** Return a slug unique across blog_posts, ignoring the post being updated. */
export async function ensureUniqueSlug(
  base: string,
  selfId?: string
): Promise<string> {
  const root = base || "post";
  let slug = root;
  let n = 1;
  while (n < 200) {
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (!existing || existing.id === selfId) return slug;
    n += 1;
    slug = `${root}-${n}`;
  }
  return `${root}-${Date.now()}`;
}

export function dateParts(d: Date) {
  return {
    date_day: String(d.getDate()),
    date_month: d.toLocaleDateString("en-US", { month: "short" }),
    date_year: String(d.getFullYear()),
  };
}

/** Coerce a value for a nullable Prisma Json column (SQL NULL vs JSON null). */
export const jsonField = (v: any): Prisma.InputJsonValue | typeof Prisma.DbNull =>
  v === null || v === undefined ? Prisma.DbNull : (v as Prisma.InputJsonValue);
