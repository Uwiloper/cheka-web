// Datos del sitio que no son contenido editable (eso vive en src/content).

/** Solo la web de producción (master en Vercel) se indexa y mide. Vistas previas y local, no. */
export const ES_PRODUCCION = process.env.VERCEL_ENV === 'production';

/** Panel de Cheka (Cloudflare). Cambiar al subdominio propio cuando se compre el dominio. */
export const PANEL_URL = 'https://panel-cheka.wilmeran12438.workers.dev';

/** Formulario «Quiero probar Cheka»: lo recibe el panel y aparece en el admin. */
export const POSTULAR_URL = `${PANEL_URL}/api/postular`;

/** Google Tag Manager. Carga en Vercel (producción y vistas previas, para probar con Tag Assistant), nunca en local.
 *  Con el modo de consentimiento de Google: todo empieza «denegado» y solo se concede si el visitante acepta. */
export const GTM_ID = 'GTM-KKCCKQS8';
export const CARGA_GTM = !!process.env.VERCEL_ENV;

/** Microsoft Clarity: mapas de calor y grabaciones. Solo carga si el visitante acepta. */
export const CLARITY_ID = 'zarpo4au1j';
