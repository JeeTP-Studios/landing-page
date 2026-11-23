import { useMemo, useState } from "react";
import { useContent } from "@/content/ContentContext";
import { localize } from "@/content/i18n";
import { projectPoster } from "@/lib/project";
import { SECTION_LABELS, SECTION_TYPES, createSection, duplicateSection } from "@/sections/sectionMeta";
import type { CaseSection, CaseSectionType, Project, SiteContent } from "@/types/content";
import { useEditLang } from "./editLang";
import { Group, ImageField, ListField, Row, TextField } from "./fields";
import { Icon } from "./icons";
import { duplicateAt, duplicateProject, moveAt, push, removeAt } from "./listOps";
import { useAdminNav } from "./nav";
import SectionCard from "./SectionCard";
import SectionEditor from "./SectionEditor";
import { FieldSearchContext, textOf } from "./search";
import SortableList, { DragHandle } from "./SortableList";
import { translationStats } from "./translation";
import { ConfirmButton, Note, TranslationBadge } from "./ui";

/** A new project with the usual set of sections. */
function newProject(): Project {
  const types: CaseSectionType[] = ["overview", "challenge", "process", "methodology", "conclusion", "cta"];
  return {
    id: "project-" + Date.now().toString(36),
    name: "New project",
    tagline: "One short line about it",
    category: "Website",
    duration: "1 month",
    year: "2026",
    location: "Mexico",
    tags: ["Tag"],
    desc: "Project description.",
    heroImage: "",
    sections: types.map(createSection),
  };
}

/** What a case-study section says now, in one line. */
function sectionSummary(s: CaseSection): string {
  switch (s.type) {
    case "process":
      return `${s.steps.length} steps: ${s.title}`;
    case "methodology":
      return `${s.items.length} stages: ${s.title}`;
    case "gallery":
      return `${s.items.length} items: ${s.title}`;
    case "cta":
      return s.text;
    default:
      return s.title;
  }
}

const detailsFields = (i: number) => (
  <>
    <Group title="In the lists and cards">
      <TextField label="Name" path={`projects.${i}.name`} max={40} />
      <TextField
        label="One-line tagline"
        path={`projects.${i}.tagline`}
        max={70}
        hint="Shown beside the name in the Home work list and on the Work page."
      />
      <TextField
        label="Type"
        path={`projects.${i}.category`}
        max={24}
        hint="Short, for example Mobile game."
      />
      <ListField
        label="Tags, separated by commas"
        path={`projects.${i}.tags`}
        mode="commas"
        hint="They are also the filters of the Work page."
      />
      <ImageField
        label="Cover image"
        path={`projects.${i}.heroImage`}
        hint="Shown in the lists and at the top of the case study (16:9). Use a JPG for screenshots; a PNG on transparency is shown whole, not cropped."
      />
    </Group>
    <Group title="On the case-study page">
      <TextField label="Description" path={`projects.${i}.desc`} area max={260} />
      <Row>
        <TextField label="Duration" path={`projects.${i}.duration`} />
        <TextField label="Place" path={`projects.${i}.location`} />
      </Row>
      <TextField label="Year" path={`projects.${i}.year`} shared />
    </Group>
  </>
);

/* ---------- one project, open ---------- */
function ProjectEditor({ pi, project, view }: { pi: number; project: Project; view: SiteContent }) {
  const { content, update } = useContent();
  const es = useEditLang() === "es";
  const { openKey, setOpenKey, setProjectId, query } = useAdminNav();
  const [addType, setAddType] = useState<CaseSectionType>("gallery");
  const sections = project.sections || [];
  const sp = `projects.${pi}.sections`;
  const detailsKey = `project:${project.id}`;
  const dst = translationStats(content, [`projects.${pi}.name`, `projects.${pi}.tagline`, `projects.${pi}.category`, `projects.${pi}.tags`, `projects.${pi}.desc`, `projects.${pi}.duration`, `projects.${pi}.location`]);
  const all = translationStats(content, [`projects.${pi}`]);
  const vp = view.projects[pi];

  const hit = (title: string, v: unknown) =>
    !query || title.toLowerCase().includes(query) || textOf(v).includes(query);

  return (
    <>
      <div className="page-head">
        <div>
          <button type="button" className="crumb" onClick={() => setProjectId(null)}>
            <Icon name="back" size={15} /> All projects
          </button>
          <h2>{vp?.name || "Project"}</h2>
          <p>
            Its fields, then its case-study sections: drag to reorder, use the eye to hide one.
          </p>
        </div>
        <TranslationBadge missing={all.missing} total={all.total} />
      </div>

      <div className="ad-cards">
        {hit("Details", [vp?.name, vp?.tagline, vp?.category, vp?.desc, vp?.tags]) ? (
          <SectionCard
            id={detailsKey}
            title="Details"
            summary={`${vp?.category ?? ""} · ${vp?.tagline ?? ""}`}
            open={openKey === detailsKey}
            onToggle={() => setOpenKey(openKey === detailsKey ? null : detailsKey)}
            locked
            missing={dst.missing}
            total={dst.total}
          >
            <p className="ad-card-about">The cover, the name and the facts about the project.</p>
            <FieldSearchContext.Provider
              value={{ query, sectionHit: !query || "details".includes(query) }}
            >
              {detailsFields(pi)}
            </FieldSearchContext.Provider>
          </SectionCard>
        ) : null}

        <SortableList
          count={sections.length}
          keyOf={(i) => sections[i].id}
          disabled={es || !!query}
          onMove={(from, to) => update((d) => moveAt(d, sp, from, to))}
          renderItem={(si, handle) => {
            const s = sections[si];
            const key = `section:${s.id}`;
            const st = translationStats(content, [`${sp}.${si}`]);
            const title = SECTION_LABELS[s.type];
            if (!hit(title, view.projects[pi]?.sections[si])) return null;
            return (
              <SectionCard
                id={key}
                title={title}
                summary={sectionSummary(view.projects[pi]?.sections[si] ?? s)}
                open={openKey === key}
                onToggle={() => setOpenKey(openKey === key ? null : key)}
                handle={handle}
                enabled={s.enabled}
                eyeLocked={es}
                onEnabled={(v) => update((d) => void (d.projects[pi].sections[si].enabled = v))}
                missing={st.missing}
                total={st.total}
                actions={
                  es ? null : (
                    <button
                      type="button"
                      className="btn icon ghost"
                      aria-label={`Duplicate ${title}`}
                      title="Duplicate"
                      onClick={() =>
                        update((d) =>
                          duplicateAt(d, sp, si, (x) => duplicateSection(x as CaseSection))
                        )
                      }
                    >
                      <Icon name="copy" size={16} />
                    </button>
                  )
                }
              >
                <FieldSearchContext.Provider
                  value={{ query, sectionHit: !query || title.toLowerCase().includes(query) }}
                >
                  <SectionEditor base={`${sp}.${si}`} section={s} />
                </FieldSearchContext.Provider>
                {es ? null : (
                  <div className="ad-card-foot">
                    <ConfirmButton
                      icon="trash"
                      label="Delete section"
                      question="Delete this section?"
                      confirmLabel="Delete"
                      onConfirm={() => update((d) => removeAt(d, sp, si))}
                    />
                  </div>
                )}
              </SectionCard>
            );
          }}
        />
      </div>

      {sections.length === 0 ? (
        <div className="ad-empty">This case study has no sections yet. Add the first one below.</div>
      ) : null}

      {es ? (
        <Note title="Structure is locked in Spanish.">
          Adding, deleting, duplicating and reordering sections is done in English; both languages
          share it.
        </Note>
      ) : (
        <div className="addbar">
          <select
            className="selfld"
            aria-label="Kind of section to add"
            value={addType}
            onChange={(e) => setAddType(e.target.value as CaseSectionType)}
          >
            {SECTION_TYPES.map((t) => (
              <option key={t} value={t}>
                {SECTION_LABELS[t]}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="btn ghost"
            onClick={() => {
              const s = createSection(addType);
              update((d) => push(d, sp, s));
              setOpenKey(`section:${s.id}`);
            }}
          >
            <Icon name="plus" size={15} /> Add section
          </button>
        </div>
      )}

      {es ? null : (
        <div className="danger-zone">
          <ConfirmButton
            icon="trash"
            label="Delete this project"
            question="Delete the project and all its sections?"
            confirmLabel="Delete project"
            onConfirm={() => {
              update((d) => removeAt(d, "projects", pi));
              setProjectId(null);
            }}
          />
        </div>
      )}
    </>
  );
}

/* ---------- the projects page: cards, or one project ---------- */
export default function ProjectsPage() {
  const { content, update } = useContent();
  const lang = useEditLang();
  const es = lang === "es";
  const { projectId, setProjectId, setOpenKey, query } = useAdminNav();
  const view = useMemo(() => localize(content, lang), [content, lang]);

  const pi = projectId ? content.projects.findIndex((p) => p.id === projectId) : -1;
  if (projectId && pi >= 0) {
    return <ProjectEditor pi={pi} project={content.projects[pi]} view={view} />;
  }

  const shown = content.projects
    .map((p, i) => ({ p, i }))
    .filter(({ i }) => {
      const v = view.projects[i];
      return !query || textOf([v.name, v.tagline, v.category, v.tags]).includes(query);
    });
  const total = translationStats(content, ["projects"]);

  return (
    <>
      <div className="page-head">
        <div>
          <h2>Projects</h2>
          <p>
            Each project feeds the Home work list, the Work page and its own case study. The order
            here is the order on the site. Click a project to edit it.
          </p>
        </div>
        <TranslationBadge missing={total.missing} total={total.total} />
      </div>

      {es ? (
        <Note title="Adding, deleting and reordering is locked in Spanish.">
          Open a project to translate it; change the list itself in English.
        </Note>
      ) : null}

      <SortableList
        layout="grid"
        count={content.projects.length}
        keyOf={(i) => content.projects[i].id}
        disabled={es || !!query}
        onMove={(from, to) => update((d) => moveAt(d, "projects", from, to))}
        renderItem={(i, handle) => {
          const p = content.projects[i];
          const v = view.projects[i];
          if (!shown.some((x) => x.i === i)) return null;
          const st = translationStats(content, [`projects.${i}`]);
          const cover = projectPoster(p);
          return (
            <article className="pcard">
              <button
                type="button"
                className="pcard-cover"
                aria-label={`Edit ${v.name}`}
                onClick={() => {
                  setProjectId(p.id);
                  setOpenKey(null);
                }}
              >
                {cover ? <img src={cover} alt="" loading="lazy" /> : <Icon name="image" size={28} />}
              </button>
              <div className="pcard-body">
                <button
                  type="button"
                  className="pcard-main"
                  onClick={() => {
                    setProjectId(p.id);
                    setOpenKey(null);
                  }}
                >
                  <b>{v.name || "Untitled project"}</b>
                  <span>{v.tagline}</span>
                  <small>{v.category}</small>
                </button>
                <TranslationBadge missing={st.missing} total={st.total} />
              </div>
              {es ? null : (
                <div className="pcard-actions">
                  {handle ? <DragHandle handle={handle} label={v.name} /> : null}
                  <span className="spacer" />
                  <button
                    type="button"
                    className="btn icon ghost"
                    aria-label={`Duplicate ${v.name}`}
                    title="Duplicate"
                    onClick={() => update((d) => duplicateProject(d, i))}
                  >
                    <Icon name="copy" size={16} />
                  </button>
                  <ConfirmButton
                    iconOnly
                    icon="trash"
                    label={`Delete ${v.name}`}
                    question="Delete this project?"
                    confirmLabel="Delete"
                    onConfirm={() => update((d) => removeAt(d, "projects", i))}
                  />
                </div>
              )}
            </article>
          );
        }}
      />

      {content.projects.length === 0 ? (
        <div className="ad-empty">No projects yet. Create the first one below.</div>
      ) : shown.length === 0 ? (
        <div className="ad-empty">No project matches “{query}”.</div>
      ) : null}

      {es ? null : (
        <button
          type="button"
          className="btn ghost add"
          onClick={() => {
            const p = newProject();
            update((d) => push(d, "projects", p));
            setProjectId(p.id);
            setOpenKey(`project:${p.id}`);
          }}
        >
          <Icon name="plus" size={15} /> New project
        </button>
      )}
    </>
  );
}
