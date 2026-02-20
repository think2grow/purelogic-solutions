import type { APIRoute } from 'astro';

const SITE_URL = 'https://purelogicsolutions.com';

const pages = [
  { url: '/', priority: '1.0', changefreq: 'weekly' },
  { url: '/about', priority: '0.9', changefreq: 'monthly' },
  { url: '/services', priority: '0.9', changefreq: 'monthly' },
  { url: '/services/kitchen-remodeling', priority: '0.9', changefreq: 'monthly' },
  { url: '/services/bathroom-remodeling', priority: '0.9', changefreq: 'monthly' },
  { url: '/services/basement-finishing', priority: '0.9', changefreq: 'monthly' },
  { url: '/services/home-additions', priority: '0.8', changefreq: 'monthly' },
  { url: '/services/custom-homes', priority: '0.8', changefreq: 'monthly' },
  { url: '/services/whole-home-remodels', priority: '0.8', changefreq: 'monthly' },
  { url: '/process', priority: '0.8', changefreq: 'monthly' },
  { url: '/pricing', priority: '0.8', changefreq: 'monthly' },
  { url: '/service-area', priority: '0.8', changefreq: 'monthly' },
  { url: '/faq', priority: '0.7', changefreq: 'monthly' },
  { url: '/contact', priority: '0.9', changefreq: 'monthly' },
  { url: '/blog', priority: '0.7', changefreq: 'weekly' },
  { url: '/blog/how-to-choose-a-general-contractor-utah', priority: '0.7', changefreq: 'monthly' },
  { url: '/blog/kitchen-remodel-cost-utah-2025', priority: '0.7', changefreq: 'monthly' },
  { url: '/blog/basement-finishing-utah-permits', priority: '0.7', changefreq: 'monthly' },
  { url: '/blog/bathroom-remodel-roi-utah', priority: '0.7', changefreq: 'monthly' },
];

export const GET: APIRoute = () => {
  const today = new Date().toISOString().split('T')[0];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${pages
  .map(
    (page) => `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
