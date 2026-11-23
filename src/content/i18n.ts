import type { Overlay, SiteContent } from "@/types/content";
import { getByPath } from "@/lib/path";

/* ============================================================
   Two languages, one document.
   English is the base. Spanish is `doc.i18n.es`, a sparse overlay that holds
   translated strings only and is addressed by the same paths as the base:
     - objects by key
     - lists by index
     - lists whose items carry a string `id` (projects, case sections) by id
   Everything the overlay does not say falls back to English, string by
   string. All overlay logic lives here so the rest of the code never has to
   know how translations are stored.
   ============================================================ */

export type Lang = "en" | "es";
export const LANGS: Lang[] = ["en", "es"];
export const DEFAULT_LANG: Lang = "en";

export const isLang = (v: unknown): v is Lang => v === "en" || v === "es";

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj =>
  !!v && typeof v === "object" && !Array.isArray(v);
const hasId = (el: unknown): el is Obj & { id: string } =>
  isObj(el) && typeof el.id === "string";

/** A list is id-addressed when its items carry string ids. */
const idAddressed = (arr: unknown[]) => arr.length > 0 && arr.every(hasId);

/* ---------- reading ---------- */

/** Merges an overlay over a base value. Only non-empty strings override;
 *  numbers, booleans, media and ids always come from the base. */
export function mergeOverlay<T>(base: T, ov: unknown): T {
  if (ov == null) return base;
  if (typeof base === "string") {
    return (typeof ov === "string" && ov.trim() !== "" ? ov : base) as T;
  }
  if (Array.isArray(base)) {
    if (Array.isArray(ov)) {
      return base.map((el, i) => (i < ov.length ? mergeOverlay(el, ov[i]) : el)) as T;
    }
    if (isObj(ov)) {
      return base.map((el) =>
        hasId(el) && el.id in ov ? mergeOverlay(el, ov[el.id]) : el
      ) as T;
    }
    return base;
  }
  if (isObj(base) && isObj(ov)) {
    const out: Obj = { ...base };
    for (const k of Object.keys(ov)) {
      if (k === "id" || !(k in base)) continue;
      out[k] = mergeOverlay(base[k], ov[k]);
    }
    return out as T;
  }
  return base;
}

/** The document a visitor sees in the given language. */
export function localize(doc: SiteContent, lang: Lang): SiteContent {
  if (lang === "en") return doc;
  return mergeOverlay(doc, doc.i18n?.es);
}

/* ---------- addressing (admin) ---------- */

/** Resolves an admin path ("projects.2.sections.3.title") into the keys used
 *  inside the overlay ("projects", <project id>, "sections", <section id>,
 *  "title"). Returns the kind of container each segment sits in as well. */
function segments(
  doc: unknown,
  path: string
): { key: string | number; childIsIdList: boolean; childIsArray: boolean }[] {
  const out: { key: string | number; childIsIdList: boolean; childIsArray: boolean }[] = [];
  let node: unknown = doc;
  for (const k of path.split(".")) {
    let key: string | number = k;
    let child: unknown;
    if (Array.isArray(node)) {
      const idx = Number(k);
      child = node[idx];
      key = hasId(child) ? child.id : idx;
    } else {
      child = isObj(node) ? node[k] : undefined;
    }
    out.push({
      key,
      childIsArray: Array.isArray(child),
      childIsIdList: Array.isArray(child) && idAddressed(child),
    });
    node = child;
  }
  return out;
}

/** Reads the Spanish overlay value for a base path, if any. */
export function getOverlay(doc: SiteContent, path: string): unknown {
  let ov: unknown = doc.i18n?.es;
  for (const s of segments(doc, path)) {
    if (ov == null || typeof ov !== "object") return undefined;
    ov = (ov as Record<string | number, unknown>)[s.key];
  }
  return ov;
}

/** Writes the Spanish overlay value for a base path, creating containers. */
export function setOverlay(doc: SiteContent, path: string, value: unknown): void {
  if (!doc.i18n) doc.i18n = { es: {} };
  if (!doc.i18n.es) doc.i18n.es = {};
  let ov = doc.i18n.es as unknown as Record<string | number, unknown>;
  const segs = segments(doc, path);
  segs.forEach((s, i) => {
    if (i === segs.length - 1) {
      ov[s.key] = value;
      return;
    }
    const cur = ov[s.key];
    if (cur == null || typeof cur !== "object") {
      ov[s.key] = s.childIsArray && !s.childIsIdList ? [] : {};
    }
    ov = ov[s.key] as Record<string | number, unknown>;
  });
}

/* ---------- structural list operations (admin) ----------
   Every add, remove or reorder of a translatable list must be mirrored in the
   overlay or Spanish strings would end up on the wrong item. Call these
   BEFORE changing the base list, because they read the base list to learn
   the id of the item involved. */

/** The overlay container of a list: an array (index-addressed), an object
 *  (id-addressed) or undefined when nothing was translated yet. */
function overlayList(doc: SiteContent, arrPath: string): unknown[] | Obj | undefined {
  const v = getOverlay(doc, arrPath);
  return Array.isArray(v) || isObj(v) ? (v as unknown[] | Obj) : undefined;
}

/** Item `index` of the base list is about to be removed. */
export function overlayRemoveAt(doc: SiteContent, arrPath: string, index: number): void {
  const list = overlayList(doc, arrPath);
  if (!list) return;
  if (Array.isArray(list)) {
    list.splice(index, 1);
    return;
  }
  const base = getByPath(doc, arrPath);
  const el = Array.isArray(base) ? base[index] : undefined;
  if (hasId(el)) delete list[el.id];
}

/** Item `from` of the base list is about to move to position `to`. */
export function overlayMove(
  doc: SiteContent,
  arrPath: string,
  from: number,
  to: number
): void {
  const list = overlayList(doc, arrPath);
  // Id-addressed lists keep their translations wherever the item lands.
  if (!Array.isArray(list)) return;
  const [moved] = list.splice(from, 1);
  list.splice(to, 0, moved ?? null);
}

/** Item `from` of the base list is about to be copied to position `to` (the
 *  copy carries `newId` when the list is id-addressed). The copy starts with
 *  the original's translations. */
export function overlayInsertCopy(
  doc: SiteContent,
  arrPath: string,
  from: number,
  to: number,
  newId?: string
): void {
  const list = overlayList(doc, arrPath);
  if (!list) return;
  if (Array.isArray(list)) {
    // Nothing translated at or after `from`: nothing to shift.
    if (from >= list.length) return;
    const src = list[from];
    list.splice(to, 0, src == null ? null : JSON.parse(JSON.stringify(src)));
    return;
  }
  const base = getByPath(doc, arrPath);
  const el = Array.isArray(base) ? base[from] : undefined;
  if (newId && hasId(el) && el.id in list) {
    list[newId] = JSON.parse(JSON.stringify(list[el.id]));
  }
}

/** Text lists edited as lines (tags, chips, bullet lists): turns the change
 *  from `before` to `after` into the overlay operation it implies. A line
 *  added or removed shifts the translations below it; an edited line keeps its
 *  translation. */
export function overlayAlignLines(
  doc: SiteContent,
  arrPath: string,
  before: unknown[],
  after: unknown[]
): void {
  const list = overlayList(doc, arrPath);
  if (!Array.isArray(list)) return;
  let head = 0;
  while (head < before.length && head < after.length && before[head] === after[head]) head++;
  let tail = 0;
  while (
    tail < before.length - head &&
    tail < after.length - head &&
    before[before.length - 1 - tail] === after[after.length - 1 - tail]
  ) {
    tail++;
  }
  const removed = before.length - head - tail;
  const added = after.length - head - tail;
  if (removed === added) return;
  list.splice(head, removed, ...Array(added).fill(null));
}

/* ---------- legacy documents ---------- */

/** Documents written before the overlay existed carry no `i18n`. The shipped
 *  Spanish then only fits strings that still equal the shipped English, so
 *  every other translation is dropped (that string shows in English). */
export function pruneStaleOverlay(
  merged: SiteContent,
  shipped: SiteContent
): void {
  const walk = (base: unknown, ship: unknown, ov: unknown): unknown => {
    if (ov == null) return ov;
    if (typeof ov === "string") return base === ship ? ov : null;
    if (Array.isArray(ov)) {
      const b = Array.isArray(base) ? base : [];
      const s = Array.isArray(ship) ? ship : [];
      return ov.map((x, i) => walk(b[i], s[i], x));
    }
    if (isObj(ov)) {
      const out: Obj = {};
      for (const k of Object.keys(ov)) {
        let b: unknown;
        let s: unknown;
        if (Array.isArray(base) && idAddressed(base)) {
          b = base.find((e) => hasId(e) && e.id === k);
          s = Array.isArray(ship) ? ship.find((e) => hasId(e) && e.id === k) : undefined;
          out[k] = walk(b, s, ov[k]);
        } else {
          b = isObj(base) ? base[k] : undefined;
          s = isObj(ship) ? ship[k] : undefined;
          out[k] = walk(b, s, ov[k]);
        }
      }
      return out;
    }
    return ov;
  };
  merged.i18n = { es: walk(merged, shipped, merged.i18n?.es) as Overlay };
}
