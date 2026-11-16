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

// Google Tag Manager en /docs (Starlight tiene su propio <head>). Mismo id y consentimiento que src/layouts/Base.astro.
const GTM_DOCS = process.env.VERCEL_ENV
  ? [{
      tag: 'script',
      content: `window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};var a=null;try{a=localStorage.getItem('cheka_cookie_consent')}catch(e){}var s=a==='granted'?'granted':'denied';gtag('consent','default',{analytics_storage:s,ad_storage:s,ad_user_data:s,ad_personalization:s});(function(w,d,s,l,i){w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i;f.parentNode.insertBefore(j,f)})(window,document,'script','dataLayer','GTM-KKCCKQS8');`,
    }]
  : [];

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
      customCss: ['./src/styles/docs.css'],
      head: GTM_DOCS,
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
