// Sitemap generator utility for RangLeela
export interface SitemapUrl {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const generateSitemap = (urls: SitemapUrl[]): string => {
  const header = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
  
  const footer = `</urlset>`;
  
  const urlEntries = urls.map(({ url, lastmod, changefreq, priority }) => {
    const lastmodStr = lastmod ? `    <lastmod>${lastmod}</lastmod>` : '';
    const changefreqStr = changefreq ? `    <changefreq>${changefreq}</changefreq>` : '';
    const priorityStr = priority ? `    <priority>${priority}</priority>` : '';
    
    return `  <url>
    <loc>${url}</loc>${lastmodStr ? '\n' + lastmodStr : ''}${changefreqStr ? '\n' + changefreqStr : ''}${priorityStr ? '\n' + priorityStr : ''}
  </url>`;
  }).join('\n');
  
  return `${header}\n${urlEntries}\n${footer}`;
};

export const getStaticSitemapUrls = (): SitemapUrl[] => {
  const baseUrl = 'https://rangleela.com';
  const currentDate = new Date().toISOString().split('T')[0];
  
  return [
    {
      url: `${baseUrl}/dashboard`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 1.0
    },
    {
      url: `${baseUrl}/about`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/shop/painting`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 0.9
    },
    {
      url: `${baseUrl}/shop/apparel`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 0.9
    },
    {
      url: `${baseUrl}/shop/accessories`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 0.9
    },
    {
      url: `${baseUrl}/contact`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.7
    },
    {
      url: `${baseUrl}/help`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.6
    },
    {
      url: `${baseUrl}/privacy`,
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: 0.3
    },
    {
      url: `${baseUrl}/terms`,
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: 0.3
    },
    {
      url: `${baseUrl}/shipping`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.5
    },
    {
      url: `${baseUrl}/refund-policy`,
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: 0.3
    }
  ];
};
