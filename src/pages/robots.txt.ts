import type { APIRoute } from 'astro';

// Mientras la web nueva está en vista previa, no se indexa nada.
// Al publicar en producción, cambiar a Allow y dejar el sitemap.
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('sitemap-index.xml', site).href;
  return new Response(`User-agent: *\nDisallow: /\n\nSitemap: ${sitemap}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
