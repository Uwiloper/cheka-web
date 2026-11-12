// @ts-check
import { defineConfig } from 'astro/config';

import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';

// Dominio público. Cambiar aquí cuando haya dominio propio (cheka.pe u otro):
// lo usan el sitemap, las URL canónicas y las tarjetas para redes.
const SITIO = process.env.SITIO_URL ?? 'https://cheka-pe-six.vercel.app';

// https://astro.build/config
export default defineConfig({
  site: SITIO,
  trailingSlash: 'never',
  adapter: vercel({ webAnalytics: { enabled: false } }),
  integrations: [
    // Documentación pública en /docs (src/content/docs/docs/*.md).
    starlight({
      title: 'Ayuda de Cheka',
      defaultLocale: 'root',
      locales: { root: { label: 'Español', lang: 'es-PE' } },
      disable404Route: true,
      lastUpdated: false,
      // La misma cabecera que el resto de la web (pestañas, Para ti, Ingresar y Quiero probar)
      components: { Header: './src/components/CabeceraDocs.astro' },
      sidebar: [
        { label: 'Primeros pasos', items: ['docs', 'docs/empezar', 'docs/no-perder-pagos'] },
        {
          label: 'Usar Cheka',
          items: [
            'docs/inicio',
            'docs/cobros',
            'docs/cajero-seguro',
            'docs/finanzas',
            'docs/gastos-automaticos',
            'docs/asistente',
          ],
        },
        { label: 'Tu cuenta', items: ['docs/cuenta', 'docs/privacidad', 'docs/preguntas-frecuentes'] },
      ],
    }),
    sitemap(),
    mdx(),
  ],
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  vite: {
    plugins: [tailwindcss()],
  },
});
