import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node'; // Importamos el adaptador

export default defineConfig({
  output: 'server',       // Activamos el modo servidor para las APIs
  adapter: node({
    mode: 'standalone'    // Ideal para probar en local o en VPS
  }),
  vite: {
    plugins: [tailwindcss()]
  }
});