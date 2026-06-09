import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';
import { getSiteBaseUrl } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteBaseUrl();

  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/blog',
    '/features',
    '/contact',
    '/privacy-policy',
    '/store-locator-examples',
    '/store-locator-layout',
  ].map((path) => ({ url: `${baseUrl}${path}`, lastModified: new Date() }));

  const posts = await prisma.blogPost.findMany({
    where: { slug: { not: null } },
    select: { slug: true, updated_at: true },
  });

  const blogRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${baseUrl}/blog/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
  }));

  return [...staticRoutes, ...blogRoutes];
}


