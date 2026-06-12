import { useRef, useState } from "react";
import { useContent } from "@/content/ContentContext";
import type { CaseSection, CaseSectionType, Project } from "@/types/content";
import {
  ColorField,
  GradientField,
  ImageField,
  ListField,
  OpacityField,
  RangeField,
  SelectField,
  TextField,
} from "./fields";
import SectionEditor from "./SectionEditor";
import {
  SECTION_LABELS,
  SECTION_TYPES,
  createSection,
} from "@/sections/sectionMeta";

/** Crea un proyecto nuevo con un set de secciones por defecto. */
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
    ghost: "NEW",
    mono: "NP",
    img: "",
    bg: { type: "none", url: "" },
    pattern: "none",
    patternOpacity: 0.25,
    detailVariant: "standard",
    tags: ["Tag"],
    desc: "Project description.",
    gradA: "#7c5cff",
    gradB: "#06182e",
    angle: 140,
    opacity: 1,
    accent: "#7c5cff",
    category: "Website",
    duration: "1 month",
    year: "2025",
    location: "Mexico",
    heroMode: "auto",
    heroImage: "",
    sections,
  };
}

/* ---------- Manager de secciones con drag-and-drop ---------- */
function SectionManager({ pi, project }: { pi: number; project: Project }) {
  const { update } = useContent();
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
      const [moved] = arr.splice(fromIdx, 1);
      arr.splice(overIdx, 0, moved);
    });
  };

  return (
    <div>
      <div className="ad-grouplabel">
        LANDING SECTIONS — drag <span aria-hidden>⠿</span> para
        reorder, use the switch to show/hide
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
                  draggable
                  style={{ cursor: "grab" }}
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
              <button
                className="ad-btn warn"
                onClick={() =>
                  update((d) => {
                    d.projects[pi].sections.splice(si, 1);
                  })
                }
              >
                Remove section
              </button>
            </div>
          </details>
        </div>
      ))}

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
    </div>
  );
}

/* ---------- Tab: alta y edición de proyectos ---------- */
export default function ProjectsTab() {
  const { content, update } = useContent();
  const dragPid = useRef<string | null>(null);

  const reorderProjects = (overId: string) => {
    const from = dragPid.current;
    if (!from || from === overId) return;
    update((d) => {
      const arr = d.projects;
      const fromIdx = arr.findIndex((p) => p.id === from);
      const overIdx = arr.findIndex((p) => p.id === overId);
      if (fromIdx === -1 || overIdx === -1) return;
      const [moved] = arr.splice(fromIdx, 1);
      arr.splice(overIdx, 0, moved);
    });
  };

  return (
    <>
      <h2>Case Studies · Projects</h2>
      <div className="desc">
        Add and edit projects. Each project edits its PREVIEW
        (home/cards) and its LANDING by sections (reorder and show/hide
        each component). The listing page settings (label and title)
        are in Pages → Case Studies.
      </div>

      <div className="ad-grouplabel first">
        PROJECTS — drag <span aria-hidden>⠿</span> to reorder
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
                  draggable
                  style={{ cursor: "grab" }}
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
            <div className="ad-grouplabel first">
              PREVIEW (home panel · cards · case)
            </div>
            <TextField label="Name" path={`projects.${i}.name`} />
            <div className="row">
              <TextField
                label="Ghost text (behind)"
                path={`projects.${i}.ghost`}
              />
              <TextField label="Monogram" path={`projects.${i}.mono`} />
            </div>
            <ImageField
              label="Center image (PNG without text)"
              path={`projects.${i}.img`}
            />
            <ListField
              label="Tags (comma separated)"
              path={`projects.${i}.tags`}
              mode="commas"
              hint="Also used as the Case Studies filters"
            />
            <TextField
              label="Description (panel)"
              path={`projects.${i}.desc`}
              area
            />
            <GradientField prefix={`projects.${i}`} />
            <OpacityField prefix={`projects.${i}`} />
            <ColorField label="Accent color" path={`projects.${i}.accent`} />

            <div className="ad-grouplabel">
              CARD PATTERN (between color and image)
            </div>
            <SelectField
              label="Pattern"
              path={`projects.${i}.pattern`}
              options={[
                ["none", "None"],
                ["dots", "Dots"],
                ["grid", "Grid"],
                ["lines", "Diagonal lines"],
                ["cross", "Crosshatch"],
                ["rings", "Rings"],
                ["waves", "Waves"],
              ]}
            />
            <RangeField
              label="Pattern opacity"
              path={`projects.${i}.patternOpacity`}
              min={0}
              max={1}
              step={0.05}
              fallback={0.25}
              format={(v) => `${Math.round(v * 100)}%`}
            />

            <div className="ad-grouplabel">
              PANEL BACKGROUND (home) — image or video under the color layer
            </div>
            <SelectField
              label="Background type"
              path={`projects.${i}.bg.type`}
              options={[
                ["none", "None (gradient only)"],
                ["image", "Image"],
                ["video", "Video (.mp4)"],
              ]}
            />
            {p.bg?.type === "video" ? (
              <>
                <TextField
                  label="Video URL (.mp4)"
                  path={`projects.${i}.bg.url`}
                  hint="Paste the direct .mp4 URL (S3 or another host). Lower the opacity above so it shows under the color."
                />
                <ImageField
                  label="Poster (while the video loads)"
                  path={`projects.${i}.bg.poster`}
                />
              </>
            ) : p.bg?.type === "image" ? (
              <ImageField
                label="Background image"
                path={`projects.${i}.bg.url`}
                hint="Lower the opacity above so the image shows under the color layer."
              />
            ) : (
              <div className="hint">
                No background: the panel uses only the color gradient.
              </div>
            )}

            <div className="ad-grouplabel">LANDING META (header)</div>
            <div className="row">
              <TextField label="Category" path={`projects.${i}.category`} />
              <TextField label="Duration" path={`projects.${i}.duration`} />
            </div>
            <div className="row">
              <TextField label="Year" path={`projects.${i}.year`} />
              <TextField label="Place" path={`projects.${i}.location`} />
            </div>

            <div className="ad-grouplabel">LANDING STYLE (detail)</div>
            <SelectField
              label="Design variant"
              path={`projects.${i}.detailVariant`}
              options={[
                ["standard", "Standard — balanced"],
                ["editorial", "Editorial — large type, asymmetric"],
                ["bold", "Bold — accent blocks, giant numbers"],
              ]}
            />

            <div className="ad-grouplabel">MAIN LANDING BANNER</div>
            <SelectField
              label="Banner type"
              path={`projects.${i}.heroMode`}
              options={[
                ["auto", "Variant 1 — Automatic (gradient + monogram/image)"],
                ["custom", "Variant 2 — Custom image (uploaded)"],
              ]}
            />
            {p.heroMode === "custom" ? (
              <ImageField
                label="Banner image"
                path={`projects.${i}.heroImage`}
                hint="Recommended size: 2400 × 1200 px (2:1 ratio), JPG/PNG/WebP, < 600 KB. Cropped to cover the area."
              />
            ) : (
              <div className="hint">
                The automatic variant uses the gradient, the ghost text and the
                center image / monogram from the PREVIEW above.
              </div>
            )}

            <SectionManager pi={i} project={p} />

            <button
              className="ad-btn warn"
              style={{ marginTop: 18 }}
              onClick={() =>
                update((d) => {
                  d.projects.splice(i, 1);
                })
              }
            >
              Remove project
            </button>
          </div>
          </details>
        </div>
      ))}

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
    </>
  );
}
