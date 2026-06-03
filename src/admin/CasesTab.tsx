import { useRef, useState } from "react";
import { useContent } from "@/content/ContentContext";
import type { CaseSection, CaseSectionType, Project } from "@/types/content";
import {
  ColorField,
  GradientField,
  ImageField,
  ListField,
  OpacityField,
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
  const id = "proyecto-" + Date.now().toString(36);
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
    name: "Nuevo proyecto",
    ghost: "NUEVO",
    mono: "NP",
    img: "",
    tags: ["Tag"],
    desc: "Descripción del proyecto.",
    gradA: "#7c5cff",
    gradB: "#06182e",
    angle: 140,
    opacity: 1,
    accent: "#7c5cff",
    category: "Website",
    duration: "1 mes",
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
        SECCIONES DE LA LANDING — arrastra <span aria-hidden>⠿</span> para
        reordenar, usa el switch para mostrar/ocultar
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
                  title="Arrastrar"
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
                Eliminar sección
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
          + Agregar sección
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
      <h2>Case Studies · Proyectos</h2>
      <div className="desc">
        Alta y edición de proyectos. Cada proyecto edita su PREVIEW
        (home/tarjetas) y su LANDING por secciones (reordena y muestra/oculta
        cada componente). Los ajustes de la página de listado (label y título)
        están en Páginas → Case Studies.
      </div>

      <div className="ad-grouplabel first">
        PROYECTOS — arrastra <span aria-hidden>⠿</span> para reordenar
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
                  title="Arrastrar proyecto"
                >
                  ⠿
                </span>
                {p.name || "Proyecto"}
              </span>
            </summary>
            <div className="accbody">
            <div className="ad-grouplabel first">
              PREVIEW (panel del home · tarjetas · caso)
            </div>
            <TextField label="Nombre" path={`projects.${i}.name`} />
            <div className="row">
              <TextField
                label="Texto fantasma (detras)"
                path={`projects.${i}.ghost`}
              />
              <TextField label="Monograma" path={`projects.${i}.mono`} />
            </div>
            <ImageField
              label="Imagen central (PNG sin texto)"
              path={`projects.${i}.img`}
            />
            <ListField
              label="Tags (separados por coma)"
              path={`projects.${i}.tags`}
              mode="commas"
              hint="Tambien son los filtros de Case Studies"
            />
            <TextField
              label="Descripcion (panel)"
              path={`projects.${i}.desc`}
              area
            />
            <GradientField prefix={`projects.${i}`} />
            <OpacityField prefix={`projects.${i}`} />
            <ColorField label="Color de acento" path={`projects.${i}.accent`} />

            <div className="ad-grouplabel">META DE LA LANDING (cabecera)</div>
            <div className="row">
              <TextField label="Categoria" path={`projects.${i}.category`} />
              <TextField label="Duracion" path={`projects.${i}.duration`} />
            </div>
            <div className="row">
              <TextField label="Ano" path={`projects.${i}.year`} />
              <TextField label="Lugar" path={`projects.${i}.location`} />
            </div>

            <div className="ad-grouplabel">BANNER PRINCIPAL DE LA LANDING</div>
            <SelectField
              label="Tipo de banner"
              path={`projects.${i}.heroMode`}
              options={[
                ["auto", "Variante 1 — Automatico (degradado + monograma/imagen)"],
                ["custom", "Variante 2 — Imagen a medida (subida)"],
              ]}
            />
            {p.heroMode === "custom" ? (
              <ImageField
                label="Imagen del banner"
                path={`projects.${i}.heroImage`}
                hint="Medidas recomendadas: 2400 × 1200 px (relacion 2:1), JPG/PNG/WebP, < 600 KB. Se recorta para cubrir el area."
              />
            ) : (
              <div className="hint">
                La variante automatica usa el degradado, el texto fantasma y la
                imagen central / monograma del PREVIEW de arriba.
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
              Eliminar proyecto
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
        + Agregar proyecto
      </button>
    </>
  );
}
