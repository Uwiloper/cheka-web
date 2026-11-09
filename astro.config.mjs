// @ts-check
import { defineConfig } from 'astro/config';

import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

// Dominio público. Cambiar aquí cuando haya dominio propio (cheka.pe u otro):
// lo usan el sitemap, las URL canónicas y las tarjetas para redes.
const SITIO = process.env.SITIO_URL ?? 'https://cheka-pe-six.vercel.app';

// https://astro.build/config
export default defineConfig({
  site: SITIO,
  trailingSlash: 'never',
  adapter: vercel({ webAnalytics: { enabled: false } }),
  integrations: [sitemap(), mdx()],
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  vite: {
    plugins: [tailwindcss()],
  },
});
