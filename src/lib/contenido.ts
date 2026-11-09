import { getEntry, type CollectionEntry } from 'astro:content';

type Seccion = CollectionEntry<'inicio'>['data'];

/** Trae una sección de la portada ya tipada según su id. Falla el build si falta. */
export async function seccion<I extends Seccion['id']>(id: I): Promise<Extract<Seccion, { id: I }>> {
  const e = await getEntry('inicio', id);
  if (!e) throw new Error(`Falta la sección «${id}» en src/content/inicio.json`);
  return e.data as Extract<Seccion, { id: I }>;
}

export const soles = (n: number) =>
  'S/ ' + n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
