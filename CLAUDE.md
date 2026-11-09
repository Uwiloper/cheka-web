## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Cheka web (landing, blog y documentación pública)

- Repo `Uwiloper/cheka-web`, desplegado por Vercel. `master` = producción (cheka-pe-six.vercel.app). Todo se trabaja en ramas: cada push da una vista previa de Vercel. A `master` solo entra lo aprobado por el usuario.
- El panel y la app viven en otros repos (`D:\Trabajos\cheka-panel`, `D:\androidapps`). Esta web solo vende, explica y enlaza al panel; no lee Firestore.
- La web anterior (diseño de referencia que gusta) está en `master` antes de `rediseno` y en `D:\proyectos\cheka-web`.
- Español peruano, `lang="es-PE"`. Textos cortos y concretos: el público es dueño de negocio en Gamarra, mercados y bodegas (skill `cheka-marketing`).
- Fuentes: Mulish solo en el logo, Inter en el resto. Sin sombras ni bordes; movimiento con propósito (skills `emil-design-eng`, `animate`, `review-animations`).
- Cada página usa `src/layouts/Base.astro` (título, descripción, canónica, Open Graph). Nada de páginas sin descripción.
- `robots.txt` e indexación se abren solos en producción (`ES_PRODUCCION` en `src/config/sitio.ts`); vistas previas y local no se indexan ni miden.
- Diseño: es el del usuario (componentes originales) sin sombras ni bordes; las capas se separan por tono. No reemplazarlo por plantillas propias.
- Pantallas bajas (720p/768p): reglas en `src/styles/global.css` para que cada sección entre en una pantalla. Probar en 1280×720 y 1366×768 al cambiar una sección.
- Chat (`src/components/Chatbot.astro` + `src/pages/api/chat.ts`, función de Vercel): Gemini 3.1 Flash Lite → Groq gpt-oss-120b; sabe lo que dice `/docs`. Variables: `GEMINI_API_KEY` y `GROQ_API_KEY` en `.env` (local, no se sube) y en Vercel › Settings › Environment Variables.

## Skills instaladas (en `.claude/skills`, fijadas en `skills-lock.json`)

- Diseño y movimiento: emil-design-eng, animate, choreograph, improve/review/remove-animations, find-animation-opportunities, animation-performance, animation-vocabulary, gestures, mobile-native, apple-design, prototype, break-ui, pick-ui-library, impeccable, frontend-design, web-design-guidelines, baseline-ui, improve-ui, fixing-accessibility, fixing-metadata, fixing-motion-performance.
- SEO/GEO: plugin `claude-seo` (en `.claude/settings.json`; incluye Search Console, PageSpeed, GA4, schema, GEO, llms.txt).
- Marketing y medición: analytics, conversion-tracking (GA4, Meta Pixel, Clarity), copywriting, copy-editing, cro, content-strategy, site-architecture, product-marketing, pricing, social, ads, ad-creative, launch, marketing-psychology, aso, cheka-marketing.
- Pruebas y despliegue: webapp-testing, deploy-to-vercel.
- Actualizar: `npx skills update -p`.

## Documentation

Full documentation: https://docs.astro.build (también por el MCP `astro-docs` en `.mcp.json`).

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
