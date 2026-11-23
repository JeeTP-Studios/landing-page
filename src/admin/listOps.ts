import { getOverlay, overlayInsertCopy, overlayMove, overlayRemoveAt } from "@/content/i18n";
import { getByPath } from "@/lib/path";
import { duplicateSection } from "@/sections/sectionMeta";
import type { SiteContent } from "@/types/content";

/* ============================================================
   Structural changes to a list, applied to a draft. Each one is mirrored in
   the Spanish overlay in the same step (see content/i18n.ts), so a
   translation never ends up on the wrong item. Always run inside `update`.
   ============================================================ */

type Renumber = (list: unknown[]) => void;

const listAt = (d: SiteContent, path: string) => getByPath(d, path) as unknown[];

export function moveAt(d: SiteContent, path: string, from: number, to: number, renum?: Renumber) {
  const list = listAt(d, path);
  if (to < 0 || to >= list.length || from === to) return;
  overlayMove(d, path, from, to);
  const [it] = list.splice(from, 1);
  list.splice(to, 0, it);
  renum?.(list);
}

export function removeAt(d: SiteContent, path: string, i: number, renum?: Renumber) {
  const list = listAt(d, path);
  overlayRemoveAt(d, path, i);
  list.splice(i, 1);
  renum?.(list);
}

/** Inserts a copy of item `i` right after it. `copy` gives the new item (a new
 *  id for id-addressed lists); it defaults to a plain deep copy. */
export function duplicateAt(
  d: SiteContent,
  path: string,
  i: number,
  copy: (item: unknown) => unknown = (x) => JSON.parse(JSON.stringify(x)),
  renum?: Renumber
) {
  const list = listAt(d, path);
  const next = copy(list[i]);
  const newId = (next as { id?: unknown } | null)?.id;
  overlayInsertCopy(d, path, i, i + 1, typeof newId === "string" ? newId : undefined);
  list.splice(i + 1, 0, next);
  renum?.(list);
}

export function push(d: SiteContent, path: string, item: unknown, renum?: Renumber) {
  const list = listAt(d, path);
  list.push(item);
  renum?.(list);
}

/** Copies project `i` right after itself, with new ids for it and its
 *  sections. The copy keeps the original's Spanish, section by section. */
export function duplicateProject(d: SiteContent, i: number) {
  duplicateAt(d, "projects", i, (p) => {
    const src = p as SiteContent["projects"][number];
    return {
      ...JSON.parse(JSON.stringify(src)),
      id: "project-" + Date.now().toString(36),
      name: `${src.name} (copy)`,
      sections: src.sections.map(duplicateSection),
    };
  });
  // The overlay copy still names the original's section ids: follow the new ones.
  const ov = getOverlay(d, `projects.${i + 1}`) as { sections?: Record<string, unknown> } | undefined;
  const from = d.projects[i].sections;
  const to = d.projects[i + 1].sections;
  if (ov?.sections && !Array.isArray(ov.sections)) {
    const next: Record<string, unknown> = {};
    from.forEach((s, k) => {
      if (s.id in ov.sections!) next[to[k].id] = ov.sections![s.id];
    });
    ov.sections = next;
  }
}
