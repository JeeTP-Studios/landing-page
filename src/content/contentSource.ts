import { DEFAULTS } from "@/data/defaults";
import type { SiteContent } from "@/types/content";

export const STORAGE_KEY = "jeetp_cfg";

/** URL del JSON remoto (S3 / bucket). Configurable por env. */
export const CONTENT_URL: string =
  (import.meta.env.VITE_CONTENT_URL as string | undefined) || "/content.json";

export function clone<T>(o: T): T {
  return JSON.parse(JSON.stringify(o));
}

/**
 * Migra contenidos en formato viejo al actual:
 * unifica los clientes en `clients.logos` desde `clients.items` (texto) o
 * desde `about.intro.logos` cuando existan.
 */
export function migrate(content: SiteContent): SiteContent {
  const c = content as unknown as Record<string, any>;
  c.clients = c.clients || {};
  const hasLogos =
    Array.isArray(c.clients.logos) && c.clients.logos.length > 0;
  if (!hasLogos) {
    const oldAbout = c.about?.intro?.logos;
    const oldItems = c.clients?.items;
    if (Array.isArray(oldAbout) && oldAbout.length) {
      c.clients.logos = oldAbout;
    } else if (Array.isArray(oldItems) && oldItems.length) {
      c.clients.logos = oldItems.map((n: unknown) => ({
        name: String(n),
        img: "",
      }));
    } else {
      c.clients.logos = c.clients.logos || [];
    }
  }
  // limpia campos obsoletos
  if (c.clients) delete c.clients.items;
  if (c.about?.intro) delete c.about.intro.logos;

  // galerías: images[] (strings) -> items[{type,url}]
  if (Array.isArray(c.projects)) {
    for (const p of c.projects) {
      if (!Array.isArray(p?.sections)) continue;
      for (const s of p.sections) {
        if (s?.type !== "gallery") continue;
        if (!Array.isArray(s.items)) {
          s.items = Array.isArray(s.images)
            ? s.images
                .filter(Boolean)
                .map((u: string) => ({ type: "image", url: u }))
            : [];
        }
        delete s.images;
      }
    }
  }
  return content;
}

/** Merge profundo. Los arrays se reemplazan completos (no se fusionan). */
export function deepMerge<T>(base: T, ov: unknown): T {
  if (Array.isArray(base)) {
    return (Array.isArray(ov) ? ov : base) as T;
  }
  if (base && typeof base === "object") {
    const out: Record<string, unknown> = { ...(base as object) } as Record<
      string,
      unknown
    >;
    const o = (ov as Record<string, unknown>) || {};
    for (const k in base as object) {
      if (o && k in o) {
        out[k] = deepMerge((base as Record<string, unknown>)[k], o[k]);
      }
    }
    return out as T;
  }
  return (ov === undefined ? base : (ov as T)) as T;
}

/** Override local guardado en el navegador (ediciones del admin sin publicar). */
export function readLocalOverride(): Partial<SiteContent> | null {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? (JSON.parse(s) as Partial<SiteContent>) : null;
  } catch {
    return null;
  }
}

export function writeLocalOverride(content: SiteContent): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  } catch {
    /* almacenamiento no disponible */
  }
}

export function clearLocalOverride(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* noop */
  }
}

/** Trae el JSON remoto del bucket. Si falla, regresa null y se usan defaults. */
export async function fetchRemoteContent(): Promise<Partial<SiteContent> | null> {
  try {
    const res = await fetch(CONTENT_URL, { cache: "no-cache" });
    if (!res.ok) return null;
    return (await res.json()) as Partial<SiteContent>;
  } catch {
    return null;
  }
}

/**
 * Resuelve el contenido efectivo:
 *   DEFAULTS  ←  JSON remoto (S3)  ←  override local (admin sin publicar)
 * Cada capa se fusiona sobre la anterior; los arrays se reemplazan.
 */
export async function resolveContent(): Promise<{
  content: SiteContent;
  hasLocalOverride: boolean;
  remoteLoaded: boolean;
}> {
  let content = clone(DEFAULTS);

  const remote = await fetchRemoteContent();
  const remoteLoaded = !!remote;
  if (remote) content = deepMerge(content, remote);

  const local = readLocalOverride();
  const hasLocalOverride = !!local;
  if (local) content = deepMerge(content, local);

  return { content: migrate(content), hasLocalOverride, remoteLoaded };
}

/** Descarga el contenido actual como archivo JSON (para subir al bucket). */
export function downloadContent(content: SiteContent, filename = "content.json"): void {
  const blob = new Blob([JSON.stringify(content, null, 2)], {
    type: "application/json",
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

/** Lee un archivo JSON importado y lo fusiona sobre los defaults. */
export function parseImportedContent(text: string): SiteContent {
  const parsed = JSON.parse(text) as Partial<SiteContent>;
  return migrate(deepMerge(clone(DEFAULTS), parsed));
}
