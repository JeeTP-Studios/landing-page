/* Utilidades para leer/escribir valores por ruta tipo "a.b.0.c". */

export function getByPath(obj: unknown, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>(
      (o, k) => (o == null ? undefined : (o as Record<string, unknown>)[k]),
      obj
    );
}

export function setByPath(obj: unknown, path: string, value: unknown): void {
  const ks = path.split(".");
  let o = obj as Record<string, unknown>;
  for (let i = 0; i < ks.length - 1; i++) {
    o = o[ks[i]] as Record<string, unknown>;
  }
  o[ks[ks.length - 1]] = value;
}
