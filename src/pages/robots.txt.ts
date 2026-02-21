import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  const robots = `User-agent: *
Allow: /

# Sitemap
Sitemap: https://purelogic-solutions.com/sitemap-index.xml

# Disallow admin/internal paths if any
Disallow: /api/
`;

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
