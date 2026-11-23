import { getOverlay } from "@/content/i18n";
import { getByPath } from "@/lib/path";
import type { SiteContent } from "@/types/content";

/* ============================================================
   What still lacks Spanish. A text counts when the English has words and the
   Spanish overlay has none. Fields that are the same in both languages
   (links, names, numbers, images, ids) are not text and never count.
   ============================================================ */

/** Keys whose strings are shared between languages. */
const SHARED_KEYS = new Set([
  "id", "type", "img", "image", "images", "logo", "logoImg", "url", "poster",
  "layout", "num", "flag", "suffix", "heroImage", "year", "enabled",
]);

/** Shared fields that live under a key which is text elsewhere (path, with
 *  list indexes written as *). */
const SHARED_PATHS = [
  /^brand\.name$/,
  /^contact\.(email|whatsapp|phone|mapQuery)$/,
  /^products\.items\.\*\.name$/,
  /^clients\.logos\.\*\.name$/,
  /^about\.gallery(\.|$)/,
  /^projects\.\*\.sections\.\*\.steps\.\*\.0$/,
];

const isShared = (segs: string[]) => {
  if (SHARED_KEYS.has(segs[segs.length - 1]) || segs.some((s) => s === "images")) return true;
  const norm = segs.map((s) => (/^\d+$/.test(s) ? "*" : s)).join(".");
  return SHARED_PATHS.some((re) => re.test(norm));
};

const hasText = (v: unknown) => typeof v === "string" && v.trim() !== "";

export interface Stats {
  /** Text fields with English words. */
  total: number;
  /** Of those, the ones with no Spanish. */
  missing: number;
}

/** Counts the text fields under the given roots (document paths). */
export function translationStats(doc: SiteContent, roots: string[]): Stats {
  const st: Stats = { total: 0, missing: 0 };
  const walk = (v: unknown, segs: string[]) => {
    if (typeof v === "string") {
      if (v.trim() === "" || isShared(segs)) return;
      st.total++;
      if (!hasText(getOverlay(doc, segs.join(".")))) st.missing++;
    } else if (Array.isArray(v)) {
      v.forEach((x, i) => walk(x, [...segs, String(i)]));
    } else if (v && typeof v === "object") {
      for (const k of Object.keys(v)) walk((v as Record<string, unknown>)[k], [...segs, k]);
    }
  };
  for (const r of roots) walk(getByPath(doc, r), r.split("."));
  return st;
}
