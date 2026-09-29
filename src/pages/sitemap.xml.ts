import type { APIRoute } from 'astro';

export const prerender = true;

const routes = ['/', '/portfolio/', '/packages/', '/contact/'];

export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const origin = site ?? new URL('https://nitchanwork.github.io');
  const urls = routes.map(path => {
    const loc = new URL(`${base}${path}`, origin).toString();
    return `  <url><loc>${loc}</loc></url>`;
  }).join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};
