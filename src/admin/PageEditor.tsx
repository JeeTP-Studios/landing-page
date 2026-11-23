import { useMemo } from "react";
import { useContent } from "@/content/ContentContext";
import { localize } from "@/content/i18n";
import { getByPath, setByPath } from "@/lib/path";
import { useEditLang } from "./editLang";
import { moveAt } from "./listOps";
import { useAdminNav } from "./nav";
import SectionCard from "./SectionCard";
import { FieldSearchContext, textOf } from "./search";
import type { PageDef, SectionDef } from "./sections";
import SortableList from "./SortableList";
import { translationStats } from "./translation";
import { Note, TranslationBadge } from "./ui";

/** The card list of a page, built from its section definitions. */
export default function PageEditor({ page }: { page: PageDef }) {
  const { content, update } = useContent();
  const lang = useEditLang();
  const es = lang === "es";
  const { openKey, setOpenKey, go, query } = useAdminNav();
  const view = useMemo(() => localize(content, lang), [content, lang]);

  const byKey = new Map(page.sections.map((s) => [s.key, s]));
  const fixed = page.fixed;
  const ordered = fixed ? content.order.filter((k) => byKey.has(k)) : [];
  const head = fixed ? fixed.head : [];
  const tail = fixed ? fixed.tail : [];
  const flat = fixed ? [] : page.sections.map((s) => s.key);

  const pageStats = translationStats(content, page.sections.flatMap((s) => s.roots));
  const matches = (def: SectionDef) =>
    !query ||
    def.title.toLowerCase().includes(query) ||
    def.roots.some((r) => textOf(getByPath(view, r)).includes(query));

  const card = (def: SectionDef, handle?: Parameters<typeof SectionCard>[0]["handle"]) => {
    const st = translationStats(content, def.roots);
    const alone = page.sections.length === 1;
    const enabled = def.enabledPath ? !!getByPath(content, def.enabledPath) : undefined;
    return (
      <SectionCard
        key={def.key}
        id={def.key}
        title={def.title}
        summary={def.summary(view)}
        open={openKey === def.key}
        forceOpen={alone}
        onToggle={() => setOpenKey(openKey === def.key ? null : def.key)}
        handle={handle}
        locked={def.locked}
        enabled={enabled}
        eyeLocked={es}
        onEnabled={(v) => update((d) => setByPath(d, def.enabledPath!, v))}
        missing={st.missing}
        total={st.total}
      >
        <p className="ad-card-about">{def.about}</p>
        <FieldSearchContext.Provider
          value={{ query, sectionHit: !query || def.title.toLowerCase().includes(query) }}
        >
          {def.pointer ? (
            <button
              type="button"
              className="btn ghost"
              onClick={() => go(def.pointer!.page, def.pointer!.section)}
            >
              {def.pointer.label}
            </button>
          ) : def.Fields ? (
            <def.Fields />
          ) : null}
        </FieldSearchContext.Provider>
      </SectionCard>
    );
  };

  const shown = (keys: string[]) =>
    keys.map((k) => byKey.get(k)).filter((d): d is SectionDef => !!d && matches(d));

  const visibleCount =
    shown(head).length + shown(ordered).length + shown(tail).length + shown(flat).length;

  return (
    <>
      <div className="page-head">
        <div>
          <h2>{page.label}</h2>
          <p>{page.blurb}</p>
        </div>
        <TranslationBadge missing={pageStats.missing} total={pageStats.total} />
      </div>

      {es && fixed ? (
        <Note title="Order and visibility are locked in Spanish.">
          Both languages share the same sections in the same order. Reorder or hide them in English.
        </Note>
      ) : null}

      {visibleCount === 0 ? (
        <div className="ad-empty">Nothing on this page matches “{query}”.</div>
      ) : null}

      <div className="ad-cards">
        {shown(head).map((d) => card(d))}
        {fixed ? (
          <SortableList
            count={ordered.length}
            keyOf={(i) => ordered[i]}
            disabled={es || !!query}
            onMove={(from, to) => update((d) => moveAt(d, "order", from, to))}
            renderItem={(i, handle) => {
              const def = byKey.get(ordered[i])!;
              return matches(def) ? card(def, handle) : null;
            }}
          />
        ) : null}
        {shown(tail).map((d) => card(d))}
        {shown(flat).map((d) => card(d))}
      </div>
    </>
  );
}

