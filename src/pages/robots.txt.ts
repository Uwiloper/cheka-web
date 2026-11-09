import type { APIRoute } from 'astro';
import { ES_PRODUCCION } from '../config/sitio';

// Producción se indexa; las vistas previas de Vercel y el local, no.
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('sitemap-index.xml', site).href;
  const regla = ES_PRODUCCION ? 'Allow: /' : 'Disallow: /';
  return new Response(`User-agent: *\n${regla}\n\nSitemap: ${sitemap}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
