// Colecciones de contenido. El texto de la portada vive en src/data/*.json (uno por sección);
// cuando exista la base propia del CMS, esos datos pasarán a una colección con su loader.
import { defineCollection } from 'astro:content';
import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';

export const collections = {
  // Documentación pública (/docs). Solo lo general para dueños y cajeros:
  // lo de admin, técnica y desarrollo se queda en el repo del panel.
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
  // Textos de la interfaz de la documentación (buscador, «Siguiente», etc.).
  i18n: defineCollection({ loader: i18nLoader(), schema: i18nSchema() }),
};
