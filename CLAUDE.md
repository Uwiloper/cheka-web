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
- Portada tipo app (decisión del usuario, 2026-11-11): la página no se desplaza. Cada pestaña (Inicio, Funciones, Planes, ¿Es seguro?, Preguntas, Probar) es una pantalla completa en `src/pages/index.astro`; se cambia con la barra, deslizando, con la rueda, las flechas o un `#enlace`. El movimiento está en `src/scripts/app.ts`. Nada de animaciones atadas al scroll. Con «reducir movimiento» del sistema solo se calman los deslizamientos de pantalla y las formas del fondo: el titular que se escribe, los pagos que llegan y los bucles de Funciones siguen (el usuario los quiere siempre; su Windows tiene los efectos apagados).
- Estilo «tipo Yape y Plin»: verde Cheka a pantalla llena, tinta oscura encima, tarjetas blancas y azul marino; Inter en todo (el logo es SVG). Sin sombras ni bordes: las capas se separan por tono. Los colores son los del panel (`src/styles/global.css`).
- Las maquetas de Funciones copian el producto real y se actualizan si el panel o la app cambian: `components/app/MockPanel.astro` (panel claro con barra marino + terminal oscura del cajero) en computadora y `MockTelefono.astro` (app Android) en el celular. Estilos en `src/styles/maquetas.css`; se dibujan a tamaño fijo y se escalan con `data-escala`.
- Todos los textos de la portada están en `src/data/portada.json`. Solo se promete lo que Cheka hace hoy (skill `cheka-marketing`): sin precios inventados (Gratis + Premium «pronto»), sin cifras de clientes, sin bancos que no lee.
- Cada pantalla debe caber sin desplazar en 1366×768, 1280×720 y 390×844. En celulares más chicos se permite desplazar dentro de la pantalla.
- Pie con enlaces legales al final de la pantalla «Probar» (lista `probar.pie` de `portada.json`). Páginas de texto con `src/layouts/Texto.astro`: `/legal`, `/promociones` y `/libro-de-reclamaciones` (provisional por WhatsApp; falta el formulario virtual con domicilio y correo del responsable). Solo la portada pasa `app` a `Base.astro` (sin desplazar y con chat).
- El formulario «Quiero probar» pasa por `src/pages/api/postular.ts` (función de Vercel) hacia `/api/postular` del panel.
- Cada página usa `src/layouts/Base.astro` (título, descripción, canónica, Open Graph con `public/og.png`). Nada de páginas sin descripción.
- `robots.txt` e indexación se abren solos en producción (`ES_PRODUCCION` en `src/config/sitio.ts`); vistas previas y local no se indexan ni miden.
- Los componentes de la portada anterior (`Hero`, `Recorrido`, `Pricing`, `Contact`, `Faq`, `Header`, `Footer`, `BanksCarousel`, `DashboardMock` y sus `src/data/*.json`) ya no se usan; se borran cuando el usuario apruebe la portada nueva.
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
