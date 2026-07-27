interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

interface SitemapIndexEntry {
  loc: string;
  lastmod?: string;
}

export class SitemapGenerator {
  private baseUrl: string;

  constructor(baseUrl: string = 'https://www.storelocator.in') {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    console.log('SitemapGenerator baseUrl:', this.baseUrl);
  }

  generateSitemapIndex(sitemaps: SitemapIndexEntry[]): string {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(sitemap => 
  `  <sitemap>
    <loc>${sitemap.loc}</loc>${sitemap.lastmod ? `
    <lastmod>${sitemap.lastmod}</lastmod>` : ''}
  </sitemap>`
).join('\n')}
</sitemapindex>`;
    return xml;
  }

  generateUrlSetSitemap(urls: SitemapEntry[]): string {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
              http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

${urls.map(url => 
  `<url>
  <loc>${url.loc}</loc>${url.lastmod ? `
  <lastmod>${url.lastmod}</lastmod>` : ''}${url.changefreq ? `
  <changefreq>${url.changefreq}</changefreq>` : ''}${url.priority !== undefined ? `
  <priority>${url.priority}</priority>` : ''}
</url>`
).join('\n\n\n')}

</urlset>`;
    return xml;
  }

  generateCoreSitemap(): string {
    const corePages: SitemapEntry[] = [
      {
        loc: `${this.baseUrl}/`,
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: 1.0
      },
      {
        loc: `${this.baseUrl}/features`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.8
      },
      {
        loc: `${this.baseUrl}/blog`,
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: 0.7
      }
    ];

    return this.generateUrlSetSitemap(corePages);
  }

  generateStoresSitemap(stores: Array<{id: string, slug: string, lastmod?: string}>): string {
    const storePages: SitemapEntry[] = stores.map(store => ({
      loc: `${this.baseUrl}/stores/${store.slug}`,
      lastmod: store.lastmod || new Date().toISOString(),
      changefreq: 'weekly' as const,
      priority: 0.6
    }));

    return this.generateUrlSetSitemap(storePages);
  }

  generateBlogSitemap(posts: Array<{id: string, slug: string, lastmod?: string}>): string {
    const blogPages: SitemapEntry[] = posts.map(post => ({
      loc: `${this.baseUrl}/blog/${post.slug}`,
      lastmod: post.lastmod || new Date().toISOString(),
      changefreq: 'monthly' as const,
      priority: 0.5
    }));

    return this.generateUrlSetSitemap(blogPages);
  }

  generateMainSitemap(): string {
    const sitemaps: SitemapIndexEntry[] = [
      {
        loc: `${this.baseUrl}/sitemap/core.xml`,
        lastmod: new Date().toISOString()
      },
      {
        loc: `${this.baseUrl}/sitemap/stores.xml`,
        lastmod: new Date().toISOString()
      },
      {
        loc: `${this.baseUrl}/sitemap/blog.xml`,
        lastmod: new Date().toISOString()
      }
    ];

    return this.generateSitemapIndex(sitemaps);
  }

  // Plain text index similar to the provided reference sitemap
  generateMainSitemapPlain(): string {
    const entries: SitemapIndexEntry[] = [
      { loc: `${this.baseUrl}/sitemap/core.xml`, lastmod: new Date().toISOString() },
      { loc: `${this.baseUrl}/sitemap/stores.xml`, lastmod: new Date().toISOString() },
      { loc: `${this.baseUrl}/sitemap/blog.xml`, lastmod: new Date().toISOString() },
    ];

    return entries.map(e => `${e.loc} ${e.lastmod ?? ''}`.trim()).join('\n');
  }
}

export const sitemapGenerator = new SitemapGenerator('https://www.storelocator.in');