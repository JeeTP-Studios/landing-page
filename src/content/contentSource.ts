import { DEFAULTS } from "@/data/defaults";
import type { HomeSectionKey, Overlay, SiteContent } from "@/types/content";
import { pruneStaleOverlay } from "./i18n";

export const STORAGE_KEY = "jeetp_cfg";

/** URL of the published JSON (S3 / bucket). Configurable by env. */
export const CONTENT_URL: string =
  (import.meta.env.VITE_CONTENT_URL as string | undefined) || "/content.json";

export function clone<T>(o: T): T {
  return JSON.parse(JSON.stringify(o));
}

type Raw = Record<string, any>;

const HOME_KEYS: HomeSectionKey[] = [
  "manifesto",
  "about",
  "solutions",
  "work",
  "clients",
  "products",
  "process",
  "faq",
];

/** Home section keys of the previous design and where they went. */
const OLD_ORDER_KEYS: Record<string, HomeSectionKey | undefined> = {
  highlighted: "work",
  stats: "about",
  services: "solutions",
};

/** Fields a project still has; anything else came from the previous design. */
const PROJECT_FIELDS = [
  "id",
  "name",
  "tagline",
  "category",
  "duration",
  "year",
  "location",
  "tags",
  "desc",
  "heroImage",
  "sections",
] as const;

/**
 * Brings a document written by an older admin to the current shape. It runs on
 * each raw layer (published JSON, local override, imported file) BEFORE the
 * layer is merged over the defaults, so it can tell what the layer actually
 * said. It never throws: a field it does not understand is left for the merge
 * to ignore.
 *
 * Old documents carry no `i18n`; that absence is what marks them as legacy.
 */
export function migrateContent(input: unknown): Raw {
  const c: Raw = input && typeof input === "object" ? clone(input as Raw) : {};
  const legacy = !c.i18n;

  // services.items (cards) became solutions.items (title, body, chips).
  if (!c.solutions && Array.isArray(c.services?.items)) {
    c.solutions = {
      items: c.services.items.map((s: Raw) => ({
        title: String(s.h ?? ""),
        body: String(s.a ?? ""),
        chips: String(s.b ?? "")
          .split(/[·|,]/)
          .map((x) => x.trim())
          .filter(Boolean),
      })),
    };
  }
  delete c.services;

  if (legacy) {
    // The previous hero (typewriter titles, chips) has no equivalent.
    delete c.hero;
    // The previous order arranged another layout; the new default order is
    // the one the 3D choreography is built for.
    delete c.order;
    // An empty logo would hide the mark the defaults ship.
    if (c.brand && !c.brand.logoImg) delete c.brand.logoImg;
  }

  // A social link whose url is "#" or empty is a placeholder: treat it as
  // missing so the shipped default (same label) is used instead.
  const social = c.ui?.footer?.social;
  if (Array.isArray(social)) {
    const isReal = (s: Raw) =>
      !!s && typeof s.url === "string" && s.url.trim() !== "" && s.url.trim() !== "#";
    if (social.every(isReal)) {
      // all real: keep as is
    } else if (!social.some(isReal)) {
      delete c.ui.footer.social;
    } else {
      c.ui.footer.social = social.map((s: Raw) => {
        if (isReal(s)) return s;
        const d = DEFAULTS.ui.footer.social.find((x) => x.label === s?.label);
        return d ? { ...d } : s;
      });
    }
  }

  // Projects: drop the previous card and banner fields, add the new ones.
  if (Array.isArray(c.projects)) {
    c.projects = c.projects.map((p: Raw) => {
      const out: Raw = {};
      for (const k of PROJECT_FIELDS) if (k in p) out[k] = p[k];
      if (typeof out.tagline !== "string") out.tagline = "";
      if (!Array.isArray(out.tags)) out.tags = [];
      if (typeof out.heroImage !== "string") out.heroImage = "";
      out.sections = (Array.isArray(out.sections) ? out.sections : []).map((s: Raw) => {
        // Oldest galleries stored plain URLs in `images`.
        if (s?.type === "gallery" && !Array.isArray(s.items)) {
          s.items = Array.isArray(s.images)
            ? s.images.filter(Boolean).map((u: string) => ({ type: "image", url: u }))
            : [];
        }
        if (s?.type === "gallery") delete s.images;
        return s;
      });
      return out;
    });
  }

  // Home order of a current document: map old keys, drop unknown ones, then
  // slot in what is missing after the nearest earlier section so the manifesto
  // stays right after the hero, which the 3D stage depends on.
  if (Array.isArray(c.order)) {
    const seen = new Set<HomeSectionKey>();
    const order: HomeSectionKey[] = [];
    for (const raw of c.order as string[]) {
      const k = HOME_KEYS.includes(raw as HomeSectionKey)
        ? (raw as HomeSectionKey)
        : OLD_ORDER_KEYS[raw];
      if (k && !seen.has(k)) {
        seen.add(k);
        order.push(k);
      }
    }
    HOME_KEYS.forEach((k, i) => {
      if (seen.has(k)) return;
      let at = 0;
      for (let j = i - 1; j >= 0; j--) {
        const p = order.indexOf(HOME_KEYS[j]);
        if (p !== -1) {
          at = p + 1;
          break;
        }
      }
      order.splice(at, 0, k);
      seen.add(k);
    });
    c.order = order;
  }
  return c;
}

/** Merges `ov` over `base`. Only keys the base knows are kept (so stray
 *  fields of old documents vanish); lists are replaced whole. */
export function deepMerge<T>(base: T, ov: unknown): T {
  if (Array.isArray(base)) {
    return (Array.isArray(ov) ? ov : base) as T;
  }
  if (base && typeof base === "object") {
    const out: Record<string, unknown> = { ...(base as object) } as Record<string, unknown>;
    const o = (ov as Record<string, unknown>) || {};
    for (const k in base as object) {
      if (o && typeof o === "object" && k in o) {
        out[k] = deepMerge((base as Record<string, unknown>)[k], o[k]);
      }
    }
    return out as T;
  }
  return (ov === undefined || ov === null ? base : (ov as T)) as T;
}

/** Open merge for the overlay, whose keys are not known to the defaults
 *  (project ids, section ids). Objects merge, everything else is replaced. */
function mergeOpen(base: unknown, ov: unknown): unknown {
  if (ov === undefined) return base;
  if (
    base && ov && typeof base === "object" && typeof ov === "object" &&
    !Array.isArray(base) && !Array.isArray(ov)
  ) {
    const out: Record<string, unknown> = { ...(base as object) };
    for (const k of Object.keys(ov as object)) {
      out[k] = mergeOpen((base as Record<string, unknown>)[k], (ov as Record<string, unknown>)[k]);
    }
    return out;
  }
  return ov;
}

/** Puts one raw layer over the current content. */
function applyLayer(content: SiteContent, layer: unknown): { next: SiteContent; legacy: boolean } {
  const raw = migrateContent(layer);
  const legacy = !raw.i18n;
  const { i18n, ...rest } = raw;
  const next = deepMerge(content, rest);
  const es = i18n && typeof i18n === "object" ? (i18n as Raw).es : undefined;
  next.i18n = { es: mergeOpen(content.i18n.es, es) as Overlay };
  // Projects of a legacy layer have no tagline: take the one that shipped.
  next.projects = next.projects.map((p) =>
    p.tagline
      ? p
      : { ...p, tagline: DEFAULTS.projects.find((d) => d.id === p.id)?.tagline ?? "" }
  );
  return { next, legacy };
}

/** Local override saved by the admin (edits not yet published). */
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
    /* storage unavailable */
  }
}

export function clearLocalOverride(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* noop */
  }
}

/** Fetches the published JSON. On failure returns null and defaults are used. */
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
 * Builds the document from layers: defaults, then the published JSON, then the
 * admin's local override. Each layer is migrated, then merged. When the layer
 * on top is a legacy one (no `i18n`), translations that no longer match its
 * English are dropped.
 */
function build(layers: unknown[]): SiteContent {
  let content = clone(DEFAULTS);
  let topIsLegacy = false;
  for (const layer of layers) {
    const r = applyLayer(content, layer);
    content = r.next;
    topIsLegacy = r.legacy;
  }
  if (topIsLegacy) pruneStaleOverlay(content, DEFAULTS);
  return content;
}

export async function resolveContent(): Promise<{
  content: SiteContent;
  /** What the site ships: defaults plus the published file, without the local override. */
  published: SiteContent;
  hasLocalOverride: boolean;
  remoteLoaded: boolean;
}> {
  const remote = await fetchRemoteContent();
  const local = readLocalOverride();
  const layers: unknown[] = [];
  if (remote) layers.push(remote);
  if (local) layers.push(local);
  return {
    content: build(layers),
    published: build(remote ? [remote] : []),
    hasLocalOverride: !!local,
    remoteLoaded: !!remote,
  };
}

/** Downloads the current content as a JSON file (to upload to the bucket). */
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

/** Reads an imported JSON file over the defaults. */
export function parseImportedContent(text: string): SiteContent {
  return build([JSON.parse(text)]);
}
