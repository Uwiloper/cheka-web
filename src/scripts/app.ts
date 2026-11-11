// Movimiento de la portada tipo app: pantallas (pestañas, deslizar, rueda, flechas y #enlace),
// escala de las maquetas, pagos de ejemplo que llegan, check del cajero, funciones en bucle y formulario.

type Pago = { nombre: string; billetera: string; monto: number; frase: string; gasto: boolean };

const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));
// El destino de un evento puede no ser un elemento (la ventana, el documento)
const dentroDe = (e: Event, sel: string) => e.target instanceof Element && !!e.target.closest(sel);
const espera = (ms: number) => new Promise((r) => setTimeout(r, ms));
const sol = (n: number) => `S/ ${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const raiz = $('.app')!;
const pantallas = $$('[data-pantalla]');
const orden = pantallas.map((p) => p.id);
const pestanas = $$<HTMLAnchorElement>('[data-pestana]');
const indicador = $('.nav-ind')!;
// Anclas de la web anterior (las usa el chat y enlaces ya compartidos)
const ALIAS: Record<string, string> = { contacto: 'probar', registro: 'probar', precios: 'planes', faq: 'preguntas', funcionalidades: 'funciones', seguridad: 'seguro' };
let actual = 'inicio';

/* ── Pantallas ───────────────────────────────────────────────────────── */
function moverIndicador() {
  const a = pestanas.find((p) => p.dataset.pestana === actual);
  if (!a) { indicador.style.opacity = '0'; return; }
  indicador.style.opacity = '1';
  indicador.style.width = `${a.offsetWidth}px`;
  indicador.style.transform = `translateX(${a.offsetLeft}px)`;
}

function mostrar(id: string, animar = true) {
  id = ALIAS[id] ?? id;
  if (!orden.includes(id)) id = 'inicio';
  const entra = pantallas.find((p) => p.id === id)!;
  const sale = pantallas.find((p) => p.id === actual)!;
  if (entra !== sale) {
    const dir = orden.indexOf(id) > orden.indexOf(actual) ? 1 : -1;
    // La que entra se coloca del lado correcto sin animar; luego se sueltan las dos
    entra.style.transition = 'none';
    $('.pantallas')!.style.setProperty('--dir', String(dir));
    void entra.offsetWidth;
    entra.style.transition = '';
    pantallas.forEach((p) => p.classList.remove('sale'));
    if (animar) { sale.classList.add('sale'); setTimeout(() => sale.classList.remove('sale'), 600); }
    sale.classList.remove('activa');
    entra.classList.add('activa');
    entra.scrollTop = 0;
  }
  actual = id;
  pantallas.forEach((p) => { p.inert = p.id !== id; });
  pestanas.forEach((p) => p.dataset.pestana === id ? p.setAttribute('aria-current', 'page') : p.removeAttribute('aria-current'));
  moverIndicador();
  ajustarEscalas();
  if (id === 'funciones') reiniciarTurno();
}

function ir(id: string) {
  id = ALIAS[id] ?? id;
  if (!orden.includes(id) || id === actual) return;
  if (location.hash.slice(1) === id) mostrar(id); else location.hash = id; // el cambio de # dispara mostrar()
}
const vecino = (paso: number) => { const i = orden.indexOf(actual) + paso; if (i >= 0 && i < orden.length) ir(orden[i]); };

addEventListener('hashchange', () => { scrollTo(0, 0); mostrar(location.hash.slice(1) || 'inicio'); });
document.addEventListener('click', (e) => {
  const a = e.target instanceof Element ? e.target.closest<HTMLAnchorElement>('a[href^="#"]') : null;
  if (!a) return;
  const id = a.getAttribute('href')!.slice(1);
  if (orden.includes(ALIAS[id] ?? id)) { e.preventDefault(); ir(id); }
});
addEventListener('keydown', (e) => {
  if (dentroDe(e, 'input, textarea, [contenteditable], #chatbot')) return;
  if (e.key === 'ArrowRight' || e.key === 'PageDown') vecino(1);
  if (e.key === 'ArrowLeft' || e.key === 'PageUp') vecino(-1);
});

// Rueda o panel táctil: si la pantalla ya no tiene más que mostrar hacia ese lado, pasa a la siguiente
let ruedaLibre = 0, ruedaSuma = 0;
addEventListener('wheel', (e) => {
  if (dentroDe(e, '#chatbot')) return;
  const p = pantallas.find((x) => x.id === actual)!;
  const baja = e.deltaY > 0;
  const tope = baja ? p.scrollTop + p.clientHeight >= p.scrollHeight - 2 : p.scrollTop <= 0;
  if (!tope || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
  const ahora = performance.now();
  if (ahora < ruedaLibre) return;
  ruedaSuma += e.deltaY;
  if (Math.abs(ruedaSuma) > 60) { ruedaSuma = 0; ruedaLibre = ahora + 900; vecino(baja ? 1 : -1); }
}, { passive: true });

// Deslizar de lado en el celular
let tx = 0, ty = 0, tocando = false;
addEventListener('touchstart', (e) => {
  tocando = !dentroDe(e, '#chatbot, input, .nav');
  tx = e.touches[0].clientX; ty = e.touches[0].clientY;
}, { passive: true });
addEventListener('touchend', (e) => {
  if (!tocando) return;
  const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
  if (Math.abs(dx) > 56 && Math.abs(dx) > Math.abs(dy) * 1.6) vecino(dx < 0 ? 1 : -1);
}, { passive: true });

/* ── Maquetas a escala ───────────────────────────────────────────────── */
function ajustarEscalas() {
  for (const el of $$('[data-escala]')) {
    const caja = el.closest<HTMLElement>('.ini-escena, .fun-escena');
    if (!caja || !el.getClientRects().length) continue;
    const [w, h] = el.dataset.escala!.split('x').map(Number);
    const cw = caja.clientWidth, ch = caja.clientHeight;
    if (!cw || !ch) continue;
    let k = Math.min(cw / w, ch / h, 1.15);
    const movil = innerWidth < 900;
    // En el celular el teléfono no se achica hasta volverse ilegible: se recorta por abajo
    if (movil && el.dataset.recorta) k = Math.max(k, Math.min(Number(el.dataset.recorta), (cw - 8) / w));
    const arriba = movil && k * h > ch;
    el.style.transformOrigin = arriba ? 'center top' : 'center center';
    el.style.transform = `scale(${k})`;
    // El hueco que deja la escala no debe empujar a los vecinos
    el.style.margin = arriba ? `0 ${-(w - w * k) / 2}px ${-(h - h * k)}px` : `${-(h - h * k) / 2}px ${-(w - w * k) / 2}px`;
  }
}
addEventListener('resize', () => { ajustarEscalas(); moverIndicador(); });

/* ── Pagos de ejemplo que llegan ─────────────────────────────────────── */
const pagos: Pago[] = JSON.parse(raiz.dataset.datos ?? '[]');
const enVivo = (el: HTMLElement) => {
  if (document.hidden || !el.getClientRects().length) return false;
  if (!el.closest('[data-pantalla]')?.classList.contains('activa')) return false;
  const vista = el.closest<HTMLElement>('[data-vista]');
  if (vista && !vista.classList.contains('viva')) return false;
  const maq = el.closest<HTMLElement>('.caja-pan');
  if (maq && el.classList.contains('term') && maq.dataset.escena !== 'cajero') return false;
  return true;
};
// Reloj de mentira: sigue desde las 9:41 de las maquetas, un minuto por pago
let minuto = 41;
const horaAhora = () => { minuto++; return `${9 + Math.floor(minuto / 60)}:${String(minuto % 60).padStart(2, '0')} a. m.`; };

function agregarFila(lista: HTMLElement, p: Pago) {
  const li = document.createElement('li');
  li.className = 'fila nueva';
  li.innerHTML = `<span class="av" data-b="${p.billetera}">${p.billetera[0]}</span><span class="quien"><b>${p.nombre}</b><small>${p.billetera} · ${horaAhora()}</small></span><span class="mas${p.gasto ? ' menos' : ''}">${p.gasto ? '−' : '+'} ${sol(p.monto)}</span>`;
  lista.prepend(li);
  const max = Number(lista.dataset.max ?? 4);
  while (lista.children.length > max) lista.lastElementChild!.remove();
}

function contar(el: HTMLElement, hasta: number) {
  const desde = Number(el.dataset.valor ?? 0);
  el.dataset.valor = String(hasta);
  const t0 = performance.now();
  const paso = (t: number) => {
    const x = Math.min(1, (t - t0) / 700), s = 1 - Math.pow(1 - x, 3);
    el.textContent = sol(desde + (hasta - desde) * s);
    if (x < 1) requestAnimationFrame(paso);
  };
  requestAnimationFrame(paso);
}

async function cicloPagos(el: HTMLElement, inicio: number) {
  let i = inicio;
  const noti = $('[data-noti]', el);
  const burbuja = el.dataset.burbuja ? $(el.dataset.burbuja) : null;
  const total = $('[data-total]', el), cobros = $('[data-cobros]', el), frase = $('[data-frase]', el);
  const lista = $('[data-lista]', el)!;
  await espera(1600);
  for (;;) {
    if (!enVivo(el)) { await espera(600); continue; }
    const p = pagos[i++ % pagos.length];
    if (noti) {
      $('[data-noti-av]', noti)!.dataset.b = p.billetera;
      $('[data-noti-av]', noti)!.textContent = p.billetera[0];
      $('[data-noti-app]', noti)!.textContent = `${p.billetera} · ahora`;
      $('[data-noti-txt]', noti)!.textContent = p.gasto
        ? `${p.billetera === 'Yape' ? 'Yapeaste' : 'Pagaste'} ${sol(p.monto)} a ${p.nombre}`
        : `${p.nombre} te envió un pago por ${sol(p.monto)}`;
      noti.classList.add('ve');
      await espera(900);
    }
    // La voz canta los cobros; un gasto solo se anota
    if (!p.gasto) {
      if (burbuja) { $('[data-burbuja-txt]', burbuja)!.textContent = `«${p.frase}»`; burbuja.classList.add('ve'); }
      if (frase) { frase.textContent = `«${p.frase}»`; frase.parentElement!.classList.add('suena'); }
    }
    await espera(noti ? 1500 : 500);
    noti?.classList.remove('ve');
    agregarFila(lista, p);
    if (p.gasto) $$('[data-gastos]', el).forEach((g) => contar(g, Number(g.dataset.valor) + p.monto));
    else {
      if (total) contar(total, Number(total.dataset.valor) + p.monto);
      if (cobros) cobros.textContent = String(Number(cobros.textContent) + 1);
    }
    await espera(1700);
    burbuja?.classList.remove('ve');
    frase?.parentElement!.classList.remove('suena');
    await espera(1500);
  }
}

async function cicloCajero(el: HTMLElement) {
  let i = 4;
  const nombre = $('[data-pagado-nombre]', el)!, monto = $('[data-pagado-monto]', el)!, lista = $('[data-lista]', el)!;
  for (;;) {
    if (!enVivo(el)) { el.classList.remove('pagado'); await espera(500); continue; }
    await espera(2400);
    if (!enVivo(el)) continue;
    let p = pagos[i++ % pagos.length];
    while (p.gasto) p = pagos[i++ % pagos.length]; // el cajero solo ve cobros
    nombre.textContent = p.nombre;
    monto.textContent = `${sol(p.monto)} · ${p.billetera}`;
    el.classList.add('pagado');
    await espera(900);
    agregarFila(lista, p);
    await espera(2300);
    el.classList.remove('pagado');
  }
}

// Las maquetas ya muestran los 4 primeros pagos: el bucle sigue con el quinto
$$('[data-ciclo="pagos"]').forEach((el) => cicloPagos(el, 4));
$$('[data-ciclo="cajero"]').forEach((el) => cicloCajero(el));

/* ── Analíticas: cambia sola entre 7 días, mes y año ─────────────────── */
const PERIODOS = [
  { et: 'Vendido en 7 días', total: 8420, nota: '148 cobros', barras: [52, 18, 64, 12, 48, 22, 70, 15, 82, 26, 100, 20, 58, 9] },
  { et: 'Vendido este mes', total: 34180, nota: '612 cobros', barras: [70, 24, 58, 30, 92, 20, 66, 16, 100, 34, 84, 22, 76, 18] },
  { et: 'Vendido este año', total: 412600, nota: '7,340 cobros', barras: [40, 14, 55, 18, 62, 25, 78, 22, 70, 30, 88, 24, 100, 28] },
];
async function cicloAnaliticas(el: HTMLElement) {
  const segs = $$('.m-seg span', el), barras = $$('.columnas i', el);
  const et = $('[data-vendido-et]', el), total = $('[data-vendido]', el), nota = $('[data-vendido-nota]', el);
  let i = 0;
  for (;;) {
    await espera(2600);
    if (!enVivo(el)) { i = 0; continue; }
    const p = PERIODOS[++i % PERIODOS.length];
    segs.forEach((s, n) => s.classList.toggle('on', n === i % PERIODOS.length));
    barras.forEach((b, n) => { b.style.height = `${p.barras[n % p.barras.length]}%`; });
    if (et) et.textContent = p.et;
    if (nota) nota.textContent = p.nota;
    if (total) contar(total, p.total);
  }
}
$$('[data-ciclo="analiticas"]').forEach((el) => cicloAnaliticas(el));

/* ── Asistente: la conversación se escribe sola y vuelve a empezar ───── */
async function cicloIa(el: HTMLElement) {
  const chat = $('.chat', el)!, msjs = $$('.msj', chat);
  const puntos = document.createElement('span');
  puntos.className = 'msj bot puntos';
  puntos.innerHTML = '<i></i><i></i><i></i>';
  for (;;) {
    msjs.forEach((m) => m.classList.remove('ve'));
    puntos.classList.remove('ve');
    await espera(700);
    if (!enVivo(el)) continue;
    for (const m of msjs) {
      if (m.classList.contains('bot')) { m.before(puntos); puntos.classList.add('ve'); await espera(900); puntos.classList.remove('ve'); }
      else await espera(700);
      m.classList.add('ve');
      await espera(500);
      if (!enVivo(el)) break;
    }
    await espera(2600);
  }
}
$$('[data-ciclo="ia"]').forEach((el) => cicloIa(el));

/* ── Titular: la palabra se escribe y se borra sola (yape, plin, sip, pago BCP…) ── */
const rota = $('[data-rota]');
if (rota) {
  const palabras: string[] = JSON.parse(rota.dataset.rota!);
  (async () => {
    let n = 0;
    for (;;) {
      await espera(2200);
      if (actual !== 'inicio' || document.hidden) continue;
      for (let t = rota.textContent ?? ''; t.length; ) { t = t.slice(0, -1); rota.textContent = t; await espera(45); }
      const nueva = palabras[++n % palabras.length];
      await espera(180);
      for (let k = 1; k <= nueva.length; k++) { rota.textContent = nueva.slice(0, k); await espera(85); }
    }
  })();
}

/* ── Funciones: pestañas que avanzan solas ───────────────────────────── */
const tabs = $$<HTMLButtonElement>('[data-funcion]');
const descMovil = $('[data-fun-desc]');
let turno = 0;
const TURNO_MS = 8000;
function elegirFuncion(id: string) {
  const tab = tabs.find((t) => t.dataset.funcion === id) ?? tabs[0];
  tabs.forEach((t) => t.setAttribute('aria-selected', String(t === tab)));
  if (descMovil) descMovil.textContent = tab.dataset.texto ?? '';
  for (const maq of $$('#funciones [data-maqueta]')) {
    maq.dataset.escena = id;
    $('.pan', maq)?.setAttribute('data-escena', id);
    $$('[data-vista]', maq).forEach((v) => v.classList.toggle('viva', v.dataset.vista === id || (v.dataset.vista === 'voz' && id === 'cajero' && !!v.closest('.pan'))));
  }
  reiniciarTurno();
}
function reiniciarTurno() {
  clearTimeout(turno);
  // La barra de avance de la pestaña vuelve a empezar
  const sel = tabs.find((t) => t.getAttribute('aria-selected') === 'true');
  if (sel) { sel.style.setProperty('--turno', `${TURNO_MS}ms`); sel.setAttribute('aria-selected', 'false'); void sel.offsetWidth; sel.setAttribute('aria-selected', 'true'); }
  turno = window.setTimeout(() => {
    if (actual !== 'funciones' || document.hidden) return reiniciarTurno();
    const i = tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true');
    elegirFuncion(tabs[(i + 1) % tabs.length].dataset.funcion!);
  }, TURNO_MS);
}
tabs.forEach((t) => t.addEventListener('click', () => elegirFuncion(t.dataset.funcion!)));

/* ── Planes (en el celular se ve uno a la vez) ───────────────────────── */
const planes = $('.planes');
$$<HTMLButtonElement>('[data-plan]').forEach((b) => b.addEventListener('click', () => {
  $$('[data-plan]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  planes?.setAttribute('data-ver', b.dataset.plan!);
}));

/* ── Formulario «Quiero probar» ──────────────────────────────────────── */
const form = $<HTMLFormElement>('#form-probar');
if (form) {
  const error = $('.form-error', form)!;
  const boton = $<HTMLButtonElement>('button[type="submit"]', form)!;
  const textoBoton = boton.firstChild!.textContent;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const datos = Object.fromEntries(new FormData(form));
    const falla = (m: string, campo?: string) => { error.textContent = m; error.hidden = false; if (campo) $<HTMLInputElement>(`[name="${campo}"]`, form)?.focus(); };
    error.hidden = true;
    if (String(datos.nombre).trim().length < 2) return falla('Escribe tu nombre.', 'nombre');
    if (String(datos.negocio).trim().length < 2) return falla('Cuéntanos qué vendes.', 'negocio');
    if (!/^9\d{8}$/.test(String(datos.whatsapp).replace(/\D/g, '').replace(/^51(?=9\d{8}$)/, ''))) return falla('Escribe tu WhatsApp de 9 dígitos (empieza con 9).', 'whatsapp');
    boton.disabled = true;
    boton.firstChild!.textContent = form.dataset.enviando ?? 'Enviando…';
    try {
      const r = await fetch('/api/postular', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datos) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.success) throw new Error(j.error || 'No se pudo enviar. Escríbenos por WhatsApp.');
      form.classList.add('enviado');
    } catch (err) {
      falla(err instanceof Error && err.message !== 'Failed to fetch' ? err.message : 'No hay conexión. Inténtalo otra vez o escríbenos por WhatsApp.');
    } finally {
      boton.disabled = false;
      boton.firstChild!.textContent = textoBoton;
    }
  });
}

/* ── Preguntas: se abren y cierran con el alto animado, una a la vez ─── */
const dudas = $$<HTMLDetailsElement>('details.duda');
const CURVA = 'cubic-bezier(.2, .8, .2, 1)';
function cerrarDuda(d: HTMLDetailsElement) {
  if (!d.open || d.classList.contains('cerrando')) return;
  const cab = $('summary', d)!;
  d.classList.add('cerrando');
  const a = d.animate({ height: [`${d.offsetHeight}px`, `${cab.offsetHeight}px`] }, { duration: 320, easing: CURVA });
  a.onfinish = () => { d.open = false; d.classList.remove('cerrando'); };
}
function abrirDuda(d: HTMLDetailsElement) {
  dudas.forEach((x) => x !== d && cerrarDuda(x));
  const desde = d.offsetHeight;
  d.open = true;
  d.animate({ height: [`${desde}px`, `${d.offsetHeight}px`] }, { duration: 420, easing: CURVA });
}
dudas.forEach((d) => {
  d.removeAttribute('name'); // la exclusividad la lleva este código, para poder animar la que se cierra
  $('summary', d)!.addEventListener('click', (e) => { e.preventDefault(); d.open ? cerrarDuda(d) : abrirDuda(d); });
});

// El chat se abre también desde Preguntas (en el celular es su única entrada)
$('[data-abrir-chat]')?.addEventListener('click', () => $<HTMLButtonElement>('#chatbot-toggle')?.click());

/* ── Arranque ────────────────────────────────────────────────────────── */
mostrar(location.hash.slice(1) || 'inicio', false);
document.fonts?.ready.then(() => { moverIndicador(); ajustarEscalas(); });
new ResizeObserver(() => ajustarEscalas()).observe($('.pantallas')!);
