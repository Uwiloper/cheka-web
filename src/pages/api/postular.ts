// «Quiero probar Cheka»: reenvía el formulario al panel (/api/postular), que lo guarda y avisa al admin.
// Pasa por aquí (función de Vercel) porque el panel no acepta pedidos directos desde otro dominio.
import type { APIRoute } from 'astro';
import { POSTULAR_URL } from '../../config/sitio';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const cuerpo = await request.text();
    if (cuerpo.length > 2000) return Response.json({ success: false, error: 'Datos demasiado largos.' }, { status: 413 });
    const r = await fetch(POSTULAR_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: cuerpo,
      signal: AbortSignal.timeout(10_000),
    });
    const j = await r.json().catch(() => ({ success: false, error: 'No se pudo enviar. Escríbenos por WhatsApp.' }));
    return Response.json(j, { status: r.status });
  } catch {
    return Response.json({ success: false, error: 'No se pudo enviar. Escríbenos por WhatsApp.' }, { status: 502 });
  }
};
