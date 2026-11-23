import { useRef, useState } from "react";
import { useContent } from "@/content/ContentContext";
import { overlayMove, overlayRemoveAt } from "@/content/i18n";
import type { CaseSection, CaseSectionType, Project } from "@/types/content";
import { ImageField, ListField, TextField } from "./fields";
import { useEditLang } from "./editLang";
import SectionEditor from "./SectionEditor";
import {
  SECTION_LABELS,
  SECTION_TYPES,
  createSection,
} from "@/sections/sectionMeta";

/** A new project with the usual set of sections. */
function newProject(): Project {
  const id = "project-" + Date.now().toString(36);
  const sections: CaseSection[] = [
    createSection("overview"),
    createSection("challenge"),
    createSection("process"),
    createSection("methodology"),
    createSection("conclusion"),
    createSection("cta"),
  ];
  return {
    id,
    name: "New project",
    tagline: "One short line about it",
    category: "Website",
    duration: "1 month",
    year: "2026",
    location: "Mexico",
    tags: ["Tag"],
    desc: "Project description.",
    heroImage: "",
    sections,
  };
}

/* ---------- Manager de secciones con drag-and-drop ---------- */
function SectionManager({ pi, project }: { pi: number; project: Project }) {
  const { update } = useContent();
  const es = useEditLang() === "es";
  const dragId = useRef<string | null>(null);
  const [addType, setAddType] = useState<CaseSectionType>("gallery");
  const sections = project.sections || [];

  const reorder = (overId: string) => {
    const from = dragId.current;
    if (!from || from === overId) return;
    update((d) => {
      const arr = d.projects[pi].sections;
      const fromIdx = arr.findIndex((s) => s.id === from);
      const overIdx = arr.findIndex((s) => s.id === overId);
      if (fromIdx === -1 || overIdx === -1) return;
      // Sections are keyed by id in the overlay, so their translations follow.
      overlayMove(d, `projects.${pi}.sections`, fromIdx, overIdx);
      const [moved] = arr.splice(fromIdx, 1);
      arr.splice(overIdx, 0, moved);
    });
  };

  return (
    <div>
      <div className="ad-grouplabel">
        SECTIONS: drag <span aria-hidden>⠿</span> to reorder, use the switch
        to show or hide
      </div>

      {sections.map((s, si) => (
        <div
          key={s.id}
          onDragOver={(e) => {
            e.preventDefault();
            reorder(s.id);
          }}
        >
          <details className="acc">
            <summary>
              <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span
                  className="grip"
                  draggable={!es}
                  style={{ cursor: es ? "default" : "grab" }}
                  onDragStart={() => (dragId.current = s.id)}
                  onDragEnd={() => (dragId.current = null)}
                  title="Drag"
                >
                  ⠿
                </span>
                <span className="sectiontag">{SECTION_LABELS[s.type]}</span>
                {"title" in s && s.title ? (
                  <span style={{ color: "#9a9aa8", fontWeight: 500 }}>
                    {s.title}
                  </span>
                ) : null}
              </span>
              <label
                className="switch"
                onClick={(e) => e.stopPropagation()}
                style={{ marginLeft: "auto" }}
              >
                <input
                  type="checkbox"
                  checked={s.enabled}
                  onChange={(e) =>
                    update((d) => {
                      d.projects[pi].sections[si].enabled = e.target.checked;
                    })
                  }
                />
                <span className="sl" />
              </label>
            </summary>
            <div className="accbody">
              <SectionEditor base={`projects.${pi}.sections.${si}`} section={s} />
              {!es && (
                <button
                  className="ad-btn warn"
                  onClick={() =>
                    update((d) => {
                      overlayRemoveAt(d, `projects.${pi}.sections`, si);
                      d.projects[pi].sections.splice(si, 1);
                    })
                  }
                >
                  Remove section
                </button>
              )}
            </div>
          </details>
        </div>
      ))}

      {!es && (
      <div className="row" style={{ marginTop: 10 }}>
        <select
          className="selfld"
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
          className="miniadd"
          onClick={() =>
            update((d) => {
              d.projects[pi].sections.push(createSection(addType));
            })
          }
        >
          + Add section
        </button>
      </div>
      )}
    </div>
  );
}

/* ---------- Tab: add and edit projects ---------- */
export default function ProjectsTab() {
  const { content, update } = useContent();
  const es = useEditLang() === "es";
  const dragPid = useRef<string | null>(null);

  const reorderProjects = (overId: string) => {
    const from = dragPid.current;
    if (!from || from === overId) return;
    update((d) => {
      const arr = d.projects;
      const fromIdx = arr.findIndex((p) => p.id === from);
      const overIdx = arr.findIndex((p) => p.id === overId);
      if (fromIdx === -1 || overIdx === -1) return;
      overlayMove(d, "projects", fromIdx, overIdx);
      const [moved] = arr.splice(fromIdx, 1);
      arr.splice(overIdx, 0, moved);
    });
  };

  return (
    <>
      <h2>Case Studies · Projects</h2>
      <div className="desc">
        Each project feeds the home work list, the case index and its own page, built from
        sections you can reorder and show or hide. The order here is the order on the site. The
        header of the index page is in Pages, Case Studies.
      </div>

      <div className="ad-grouplabel first">
        PROJECTS{es ? "" : <> — drag <span aria-hidden>⠿</span> to reorder</>}
      </div>

      {content.projects.map((p, i) => (
        <div
          key={p.id}
          onDragOver={(e) => {
            e.preventDefault();
            reorderProjects(p.id);
          }}
        >
          <details className="acc">
            <summary>
              <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span
                  className="grip"
                  draggable={!es}
                  style={{ cursor: es ? "default" : "grab" }}
                  onDragStart={() => (dragPid.current = p.id)}
                  onDragEnd={() => (dragPid.current = null)}
                  title="Drag project"
                >
                  ⠿
                </span>
                {p.name || "Project"}
              </span>
            </summary>
            <div className="accbody">
              <div className="ad-grouplabel first">LIST AND CARD</div>
              <TextField label="Name" path={`projects.${i}.name`} />
              <TextField
                label="Tagline"
                path={`projects.${i}.tagline`}
                hint="One short line shown beside the name in the home work list."
              />
              <TextField
                label="Type"
                path={`projects.${i}.category`}
                hint="Short, e.g. Mobile game. Shown in the work list and on the case page."
              />
              <ListField
                label="Tags (comma separated)"
                path={`projects.${i}.tags`}
                mode="commas"
                hint="Also the filters of the case index."
              />
              <TextField label="Description" path={`projects.${i}.desc`} area />
              <ImageField
                label="Cover image"
                path={`projects.${i}.heroImage`}
                hint="Shown in the work list, the case index and the top of the case page (16:9). JPG for screens; a PNG on transparency is letterboxed."
              />

              <div className="ad-grouplabel">CASE PAGE DETAILS</div>
              <div className="row">
                <TextField label="Duration" path={`projects.${i}.duration`} />
                <TextField label="Place" path={`projects.${i}.location`} />
              </div>
              <TextField label="Year" path={`projects.${i}.year`} shared />

              <SectionManager pi={i} project={p} />

              {!es && (
                <button
                  className="ad-btn warn"
                  style={{ marginTop: 18 }}
                  onClick={() =>
                    update((d) => {
                      overlayRemoveAt(d, "projects", i);
                      d.projects.splice(i, 1);
                    })
                  }
                >
                  Remove project
                </button>
              )}
            </div>
          </details>
        </div>
      ))}

      {!es && (
        <button
          className="miniadd"
          onClick={() =>
            update((d) => {
              d.projects.push(newProject());
            })
          }
        >
          + Add project
        </button>
      )}
    </>
  );
}
