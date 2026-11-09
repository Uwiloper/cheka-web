// Chat de la web pública: Gemini 3.1 Flash Lite y, si falla o tarda, Groq (gpt-oss-120b).
// Lo que sabe sale de la documentación pública (/docs), así no hay que mantener otro texto.
// Corre como función de Vercel; las claves van en las variables de entorno del proyecto.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import config from '../../data/chatbot.json';

export const prerender = false;

const MAX_PREGUNTA = config.ui.maxLength;
const MAX_TURNOS = 8;
const MAX_TOKENS = 400;
const ESPERA_MS = 12_000;
const WHATSAPP = `https://wa.me/${config.ai.whatsapp}`;

type Mensaje = { rol: 'yo' | 'bot'; texto: string };

// Límite por visitante (en memoria de la función: es un freno simple, no una garantía)
const POR_MINUTO = 8;
const uso = new Map<string, number[]>();
function permitido(ip: string): boolean {
  const ahora = Date.now();
  const recientes = (uso.get(ip) ?? []).filter((t) => ahora - t < 60_000);
  if (recientes.length >= POR_MINUTO) return false;
  recientes.push(ahora);
  uso.set(ip, recientes);
  if (uso.size > 5000) uso.clear();
  return true;
}

let sistemaCache = '';
async function sistema(): Promise<string> {
  if (sistemaCache) return sistemaCache;
  const docs = (await getCollection('docs')).sort((a, b) => a.id.localeCompare(b.id));
  const conocimiento = docs
    .map((d) => `## ${d.data.title} (enlace: /${d.id === 'docs' ? 'docs' : d.id})\n${(d.body ?? '').replace(/:::[a-z]*(\[[^\]]*\])?/g, '').trim()}`)
    .join('\n\n');
  sistemaCache = `${config.ai.rules.map((r) => `- ${r}`).join('\n')}\n- WhatsApp de atención: [Escríbenos por WhatsApp](${WHATSAPP}).\n\n# Documentación de Cheka\n${conocimiento}`;
  return sistemaCache;
}

const env = (k: string) => (import.meta.env[k] as string | undefined) ?? process.env[k];

async function gemini(s: string, m: Mensaje[]): Promise<string> {
  const clave = env('GEMINI_API_KEY');
  if (!clave) throw new Error('sin GEMINI_API_KEY');
  const r = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent', {
    method: 'POST',
    signal: AbortSignal.timeout(ESPERA_MS),
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': clave },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: s }] },
      contents: m.map((x) => ({ role: x.rol === 'yo' ? 'user' : 'model', parts: [{ text: x.texto }] })),
      generationConfig: { maxOutputTokens: MAX_TOKENS },
    }),
  });
  if (!r.ok) throw new Error(`gemini ${r.status}`);
  const j = (await r.json()) as any;
  return (j?.candidates?.[0]?.content?.parts ?? []).map((p: any) => p.text ?? '').join('');
}

async function groq(s: string, m: Mensaje[]): Promise<string> {
  const clave = env('GROQ_API_KEY');
  if (!clave) throw new Error('sin GROQ_API_KEY');
  const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    signal: AbortSignal.timeout(ESPERA_MS),
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${clave}` },
    body: JSON.stringify({
      model: 'openai/gpt-oss-120b',
      reasoning_effort: 'low',
      max_tokens: MAX_TOKENS,
      messages: [{ role: 'system', content: s }, ...m.map((x) => ({ role: x.rol === 'yo' ? 'user' : 'assistant', content: x.texto }))],
    }),
  });
  if (!r.ok) throw new Error(`groq ${r.status}`);
  const j = (await r.json()) as any;
  return j?.choices?.[0]?.message?.content ?? '';
}

const json = (cuerpo: unknown, status = 200) =>
  new Response(JSON.stringify(cuerpo), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || clientAddress || 'local';
  if (!permitido(ip)) return json({ error: 'limite' }, 429);

  const b = (await request.json().catch(() => ({}))) as { mensajes?: unknown };
  const mensajes: Mensaje[] = (Array.isArray(b.mensajes) ? b.mensajes : [])
    .filter((x: any) => x && (x.rol === 'yo' || x.rol === 'bot') && typeof x.texto === 'string')
    .slice(-MAX_TURNOS)
    .map((x: any) => ({ rol: x.rol, texto: String(x.texto).slice(0, x.rol === 'yo' ? MAX_PREGUNTA : 1200) }));
  // La conversación debe empezar con el visitante y terminar con su pregunta
  while (mensajes.length && mensajes[0].rol !== 'yo') mensajes.shift();
  if (!mensajes.length || mensajes[mensajes.length - 1].rol !== 'yo' || !mensajes[mensajes.length - 1].texto.trim()) {
    return json({ error: 'vacio' }, 400);
  }

  const s = await sistema();
  for (const [nombre, fn] of [['gemini', gemini], ['groq', groq]] as const) {
    try {
      const texto = (await fn(s, mensajes)).trim();
      if (texto) return json({ reply: texto, proveedor: nombre });
    } catch (e) {
      console.warn('chat', nombre, (e as Error)?.message ?? e);
    }
  }
  return json({ error: 'sin_respuesta' }, 503);
};
