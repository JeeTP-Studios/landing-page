import { useContent } from "@/content/ContentContext";
import { getByPath } from "./path";
import type { CaseSection } from "@/types/content";
import {
  ImageField,
  ListField,
  SelectField,
  StepsField,
  TextField,
} from "./fields";

/** Editor de imágenes (array de URLs) con agregar/eliminar. */
function ImageListEditor({ basePath }: { basePath: string }) {
  const { content, update } = useContent();
  const imgs = (getByPath(content, basePath) as string[]) || [];
  return (
    <div className="fld">
      <label>Imágenes</label>
      {imgs.map((_, i) => (
        <div key={i} style={{ marginBottom: 8 }}>
          <ImageField label={`Imagen ${i + 1}`} path={`${basePath}.${i}`} />
          <button
            className="ad-btn warn"
            onClick={() =>
              update((d) => {
                (getByPath(d, basePath) as string[]).splice(i, 1);
              })
            }
          >
            Eliminar imagen
          </button>
        </div>
      ))}
      <button
        className="miniadd"
        onClick={() =>
          update((d) => {
            (getByPath(d, basePath) as string[]).push("");
          })
        }
      >
        + Agregar imagen
      </button>
    </div>
  );
}

/** Editor de items de galería (imagen o video, URL o YouTube + póster). */
function GalleryItemsEditor({ basePath }: { basePath: string }) {
  const { content, update } = useContent();
  const items =
    (getByPath(content, basePath) as { type: string; url: string }[]) || [];
  return (
    <div className="fld">
      <label>Items de la galería (imágenes o videos)</label>
      <div className="hint" style={{ marginBottom: 10 }}>
        Video acepta URL de archivo (.mp4) o de YouTube; se detecta solo. Al dar
        clic en el sitio, el medio se expande.
      </div>
      {items.map((it, i) => (
        <details className="acc" key={i}>
          <summary>
            {(it.type === "video" ? "🎬 " : "🖼 ") +
              (it.url ? it.url.slice(0, 40) : `Item ${i + 1}`)}
          </summary>
          <div className="accbody">
            <SelectField
              label="Tipo"
              path={`${basePath}.${i}.type`}
              options={[
                ["image", "Imagen"],
                ["video", "Video (URL o YouTube)"],
              ]}
            />
            {it.type === "video" ? (
              <>
                <TextField
                  label="URL del video (.mp4 o YouTube)"
                  path={`${basePath}.${i}.url`}
                />
                <ImageField
                  label="Póster / miniatura (opcional)"
                  path={`${basePath}.${i}.poster`}
                  hint="Para YouTube se usa su miniatura si lo dejas vacío."
                />
              </>
            ) : (
              <ImageField label="Imagen" path={`${basePath}.${i}.url`} />
            )}
            <button
              className="ad-btn warn"
              onClick={() =>
                update((d) => {
                  (getByPath(d, basePath) as unknown[]).splice(i, 1);
                })
              }
            >
              Eliminar item
            </button>
          </div>
        </details>
      ))}
      <div className="row" style={{ marginTop: 8 }}>
        <button
          className="miniadd"
          onClick={() =>
            update((d) => {
              (getByPath(d, basePath) as unknown[]).push({
                type: "image",
                url: "",
              });
            })
          }
        >
          + Agregar imagen
        </button>
        <button
          className="miniadd"
          onClick={() =>
            update((d) => {
              (getByPath(d, basePath) as unknown[]).push({
                type: "video",
                url: "",
                poster: "",
              });
            })
          }
        >
          + Agregar video
        </button>
      </div>
    </div>
  );
}

/** Editor de items de metodología (heading + body). */
function MethodologyItemsEditor({ basePath }: { basePath: string }) {
  const { content, update } = useContent();
  const items =
    (getByPath(content, basePath) as { heading: string; body: string }[]) || [];
  return (
    <div className="fld">
      <label>Etapas / bloques</label>
      {items.map((it, i) => (
        <details className="acc" key={i}>
          <summary>{it.heading || `Etapa ${i + 1}`}</summary>
          <div className="accbody">
            <TextField label="Encabezado" path={`${basePath}.${i}.heading`} />
            <TextField label="Texto" path={`${basePath}.${i}.body`} area />
            <button
              className="ad-btn warn"
              onClick={() =>
                update((d) => {
                  (
                    getByPath(d, basePath) as { heading: string; body: string }[]
                  ).splice(i, 1);
                })
              }
            >
              Eliminar etapa
            </button>
          </div>
        </details>
      ))}
      <button
        className="miniadd"
        onClick={() =>
          update((d) => {
            (
              getByPath(d, basePath) as { heading: string; body: string }[]
            ).push({ heading: "Nueva etapa", body: "" });
          })
        }
      >
        + Agregar etapa
      </button>
    </div>
  );
}

/** Campos específicos según el tipo de sección. */
export default function SectionEditor({
  base,
  section,
}: {
  base: string;
  section: CaseSection;
}) {
  switch (section.type) {
    case "overview":
      return (
        <>
          <TextField label="Label" path={`${base}.label`} />
          <TextField label="Título" path={`${base}.title`} />
          <TextField label="Texto" path={`${base}.body`} area />
          <ImageField label="Imagen (opcional)" path={`${base}.image`} />
        </>
      );
    case "process":
      return (
        <>
          <TextField label="Título" path={`${base}.title`} />
          <StepsField
            label="Pasos (uno por renglón)"
            path={`${base}.steps`}
            hint="Se numeran automáticamente."
          />
        </>
      );
    case "challenge":
      return (
        <>
          <TextField label="Título" path={`${base}.title`} />
          <TextField label="Intro" path={`${base}.intro`} area />
          <ListField
            label="El reto (uno por renglón)"
            path={`${base}.problems`}
          />
          <TextField label="Título de la solución" path={`${base}.approachTitle`} />
          <ListField
            label="Solución (uno por renglón)"
            path={`${base}.approach`}
          />
          <ImageListEditor basePath={`${base}.images`} />
        </>
      );
    case "methodology":
      return (
        <>
          <TextField label="Título" path={`${base}.title`} />
          <MethodologyItemsEditor basePath={`${base}.items`} />
        </>
      );
    case "gallery":
      return (
        <>
          <TextField label="Título" path={`${base}.title`} />
          <SelectField
            label="Layout"
            path={`${base}.layout`}
            options={[
              ["grid", "Grid (3 col)"],
              ["masonry", "Mosaico (4 col)"],
              ["wide", "Ancho completo"],
            ]}
          />
          <GalleryItemsEditor basePath={`${base}.items`} />
        </>
      );
    case "conclusion":
      return (
        <>
          <TextField label="Título" path={`${base}.title`} />
          <TextField label="Texto" path={`${base}.body`} area />
          <ImageField label="Imagen (opcional)" path={`${base}.image`} />
        </>
      );
    case "cta":
      return (
        <>
          <TextField label="Texto" path={`${base}.text`} />
          <TextField label="Texto del botón" path={`${base}.buttonLabel`} />
        </>
      );
    default:
      return null;
  }
}
