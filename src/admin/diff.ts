import { SECTION_LABELS } from "@/sections/sectionMeta";
import type { SiteContent } from "@/types/content";
import { ALL_PAGES } from "./sections";

/* ============================================================
   What the draft changes against the published file, in words a person can
   read: which block, how many fields, English or Spanish.
   ============================================================ */

type Kind = "edited" | "added" | "removed" | "moved";
interface Raw {
  segs: string[];
  kind: Kind;
  n: number;
  lang: "EN" | "ES";
}

export interface Change {
  where: string;
  lang: "EN" | "ES";
  /** "3 fields edited, 1 item added" */
  what: string;
}

export interface Summary {
  changes: Change[];
  /** Every edited, added or removed value. */
  fieldCount: number;
  /** Distinct blocks touched. */
  blockCount: number;
}

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => !!v && typeof v === "object" && !Array.isArray(v);
const hasId = (v: unknown): v is { id: string } => isObj(v) && typeof v.id === "string";

function walk(a: unknown, b: unknown, segs: string[], lang: "EN" | "ES", out: Raw[]) {
  if (a === b) return;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length > 0 && b.length > 0 && a.every(hasId) && b.every(hasId)) {
      // Projects and case sections: matched by id, so an insert is not noise.
      const aIds = a.map((x) => x.id);
      const bIds = b.map((x) => x.id);
      const added = bIds.filter((id) => !aIds.includes(id)).length;
      const removed = aIds.filter((id) => !bIds.includes(id)).length;
      if (added) out.push({ segs, kind: "added", n: added, lang });
      if (removed) out.push({ segs, kind: "removed", n: removed, lang });
      const common = aIds.filter((id) => bIds.includes(id));
      if (common.join() !== bIds.filter((id) => aIds.includes(id)).join()) {
        out.push({ segs, kind: "moved", n: 1, lang });
      }
      b.forEach((item, i) => {
        const prev = a.find((x) => x.id === item.id);
        if (prev) walk(prev, item, [...segs, String(i)], lang, out);
      });
      return;
    }
    if (b.length > a.length) out.push({ segs, kind: "added", n: b.length - a.length, lang });
    if (b.length < a.length) out.push({ segs, kind: "removed", n: a.length - b.length, lang });
    for (let i = 0; i < Math.min(a.length, b.length); i++) walk(a[i], b[i], [...segs, String(i)], lang, out);
    return;
  }
  if (isObj(a) || isObj(b)) {
    const oa = isObj(a) ? a : {};
    const ob = isObj(b) ? b : {};
    for (const k of new Set([...Object.keys(oa), ...Object.keys(ob)])) {
      if (segs.length === 0 && k === "i18n") continue;
      walk(oa[k], ob[k], [...segs, k], lang, out);
    }
    return;
  }
  out.push({ segs, kind: "edited", n: 1, lang });
}

/** Overlay paths name projects and sections by id; the document names them by
 *  position. Turns the first into the second so one function can label both. */
function toIndexes(doc: SiteContent, segs: string[]): string[] {
  const out: string[] = [];
  let node: unknown = doc;
  for (const s of segs) {
    if (Array.isArray(node)) {
      const idx = node.findIndex((x) => hasId(x) && x.id === s);
      const k = idx >= 0 ? idx : Number(s);
      out.push(String(k));
      node = node[k];
    } else {
      out.push(s);
      node = isObj(node) ? node[s] : undefined;
    }
  }
  return out;
}

/** The block of the editor that owns a document path. */
function whereOf(segs: string[], draft: SiteContent, published: SiteContent): string {
  const path = segs.join(".");
  if (segs[0] === "projects") {
    if (segs.length < 2) return "Projects · List";
    const i = Number(segs[1]);
    const p = draft.projects[i] ?? published.projects[i];
    const name = p?.name ?? "Project";
    if (segs[2] === "sections" && segs[3] !== undefined) {
      const s = draft.projects[i]?.sections[Number(segs[3])];
      return `Project “${name}” · ${s ? SECTION_LABELS[s.type] : "Section"}`;
    }
    if (segs[2] === "sections") return `Project “${name}” · Sections`;
    return `Project “${name}” · Details`;
  }
  if (path === "order") return "Home · Section order";
  for (const page of ALL_PAGES) {
    for (const s of page.sections) {
      if (s.roots.some((r) => path === r || path.startsWith(`${r}.`))) {
        return `${page.label} · ${s.title}`;
      }
    }
  }
  // Switches and a few paths belong to a block by name rather than by root.
  const toggled: Record<string, string> = {
    manifesto: "Home · Manifesto",
    aboutBlock: "Home · About and figures",
    stats: "Home · About and figures",
    solutions: "Home · Solutions",
    work: "Home · Work list",
    clients: "Clients · Client logos",
    products: "Home · Own products",
    process: "Home · Method steps",
    faq: "Home · FAQ",
  };
  return toggled[segs[0]] ?? `Other · ${segs[0]}`;
}

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/** Compares the draft with the published document. */
export function summarizeChanges(published: SiteContent, draft: SiteContent): Summary {
  const raw: Raw[] = [];
  walk(published, draft, [], "EN", raw);
  walk(published.i18n?.es ?? {}, draft.i18n?.es ?? {}, [], "ES", raw);

  const groups = new Map<string, { where: string; lang: "EN" | "ES"; edited: number; added: number; removed: number; moved: number }>();
  for (const r of raw) {
    const segs = r.lang === "ES" ? toIndexes(draft, r.segs) : r.segs;
    const where = whereOf(segs, draft, published);
    const id = `${r.lang}|${where}`;
    const g = groups.get(id) ?? { where, lang: r.lang, edited: 0, added: 0, removed: 0, moved: 0 };
    g[r.kind] += r.n;
    groups.set(id, g);
  }

  const changes: Change[] = [...groups.values()]
    .sort((x, y) => x.where.localeCompare(y.where) || x.lang.localeCompare(y.lang))
    .map((g) => {
      const parts: string[] = [];
      if (g.edited) parts.push(plural(g.edited, "field edited", "fields edited"));
      if (g.added) parts.push(`${plural(g.added, "item", "items")} added`);
      if (g.removed) parts.push(`${plural(g.removed, "item", "items")} removed`);
      if (g.moved) parts.push("reordered");
      return { where: g.where, lang: g.lang, what: parts.join(", ") };
    });

  return {
    changes,
    fieldCount: raw.reduce((n, r) => n + r.n, 0),
    blockCount: new Set(changes.map((c) => c.where)).size,
  };
}
