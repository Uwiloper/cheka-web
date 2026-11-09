// Colecciones de contenido. Todo texto de la web vive aquí (no en los componentes)
// para que el CMS propio de Cheka pueda editarlo sin tocar el diseño.
// Hoy los datos salen de archivos; cuando exista la base propia del CMS, solo cambia el loader.
import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';
import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';

const enlace = z.object({ texto: z.string(), url: z.string() });
const billetera = z.enum(['yape', 'plin', 'bcp', 'sip', 'bbva']);

// Una entrada por sección de la portada; el `id` dice qué forma tiene.
const seccionInicio = z.discriminatedUnion('id', [
  z.object({ id: z.literal('cabecera'), enlaces: z.array(enlace), ingresar: z.string(), probar: z.string() }),
  z.object({
    id: z.literal('portada'),
    etiqueta: z.string(),
    antes: z.string(),
    palabras: z.array(z.object({ texto: z.string(), color: billetera })).min(1),
    despues: z.string(),
    descripcion: z.string(),
    principal: enlace,
    secundario: enlace,
    nota: z.string(),
    demo: z.array(z.object({ nombre: z.string(), billetera: z.string(), color: billetera, monto: z.number().positive() })).min(3),
  }),
  z.object({
    id: z.literal('bancos'),
    titulo: z.string(),
    logos: z.array(z.object({ nombre: z.string(), imagen: z.string() })),
    otros: z.array(z.string()),
  }),
  z.object({
    id: z.literal('funciones'),
    titulo: z.string(),
    texto: z.string(),
    modulos: z.array(z.object({
      clave: z.enum(['voz', 'cajero', 'analiticas', 'auditoria', 'exportar', 'asistente']),
      titulo: z.string(),
      resumen: z.string(),
      detalle: z.array(z.string()).min(1),
      enlace,
    })).length(6),
  }),
  z.object({ id: z.literal('pasos'), titulo: z.string(), pasos: z.array(z.object({ titulo: z.string(), texto: z.string() })).length(3) }),
  z.object({
    id: z.literal('probar'),
    titulo: z.string(),
    texto: z.string(),
    campos: z.object({
      nombre: z.string(), negocio: z.string(), negocioEjemplo: z.string(), lugar: z.string(), lugarEjemplo: z.string(),
      whatsapp: z.string(), android: z.string(),
      androidOpciones: z.array(z.object({ valor: z.enum(['si', 'no', 'no_se']), texto: z.string() })),
    }),
    enviar: z.string(), enviando: z.string(), listo: z.string(), aviso: z.string(),
  }),
  z.object({
    id: z.literal('preguntas'),
    titulo: z.string(),
    lista: z.array(z.object({ pregunta: z.string(), respuesta: z.string() })),
    masAyuda: enlace,
  }),
  z.object({
    id: z.literal('pie'),
    lema: z.string(),
    columnas: z.array(z.object({ titulo: z.string(), enlaces: z.array(enlace) })),
    derechos: z.string(),
  }),
  z.object({ id: z.literal('cookies'), texto: z.string(), aceptar: z.string(), rechazar: z.string() }),
]);

export const collections = {
  // Portada (/). Una entrada por sección.
  inicio: defineCollection({ loader: file('src/content/inicio.json'), schema: seccionInicio }),
  // Documentación pública (/docs). Solo lo general para dueños y cajeros:
  // lo de admin, técnica y desarrollo se queda en el repo del panel.
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
  // Textos de la interfaz de la documentación (buscador, «Siguiente», etc.).
  i18n: defineCollection({ loader: i18nLoader(), schema: i18nSchema() }),
};
