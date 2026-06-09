import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { deriveExcerpt } from "../lib/text";
const prisma = new PrismaClient();
async function main() {
  const posts = await prisma.blogPost.findMany({ where: { OR: [{ excerpt: null }, { excerpt: "" }] } });
  let n = 0;
  for (const p of posts) {
    const ex = deriveExcerpt(p.content);
    if (ex) { await prisma.blogPost.update({ where: { id: p.id }, data: { excerpt: ex } }); n++; console.log("•", p.title, "→", ex.slice(0, 60)); }
  }
  console.log(`\nBackfilled ${n} post(s).`);
}
main().finally(() => prisma.$disconnect());
