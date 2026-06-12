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
      <label>Images</label>
      {imgs.map((_, i) => (
        <div key={i} style={{ marginBottom: 8 }}>
          <ImageField label={`Image ${i + 1}`} path={`${basePath}.${i}`} />
          <button
            className="ad-btn warn"
            onClick={() =>
              update((d) => {
                (getByPath(d, basePath) as string[]).splice(i, 1);
              })
            }
          >
            Remove image
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
        + Add image
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
      <label>Gallery items (images or videos)</label>
      <div className="hint" style={{ marginBottom: 10 }}>
        Video accepts a file URL (.mp4) or YouTube; auto-detected. On
        click on the site, the media expands.
      </div>
      {items.map((it, i) => (
        <details className="acc" key={i}>
          <summary>
            {(it.type === "video" ? "🎬 " : "🖼 ") +
              (it.url ? it.url.slice(0, 40) : `Item ${i + 1}`)}
          </summary>
          <div className="accbody">
            <SelectField
              label="Type"
              path={`${basePath}.${i}.type`}
              options={[
                ["image", "Image"],
                ["video", "Video (URL or YouTube)"],
              ]}
            />
            {it.type === "video" ? (
              <>
                <TextField
                  label="Video URL (.mp4 or YouTube)"
                  path={`${basePath}.${i}.url`}
                />
                <ImageField
                  label="Poster / thumbnail (optional)"
                  path={`${basePath}.${i}.poster`}
                  hint="For YouTube its thumbnail is used if left empty."
                />
              </>
            ) : (
              <ImageField label="Image" path={`${basePath}.${i}.url`} />
            )}
            <button
              className="ad-btn warn"
              onClick={() =>
                update((d) => {
                  (getByPath(d, basePath) as unknown[]).splice(i, 1);
                })
              }
            >
              Remove item
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
          + Add image
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
          + Add video
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
      <label>Stages / blocks</label>
      {items.map((it, i) => (
        <details className="acc" key={i}>
          <summary>{it.heading || `Stage ${i + 1}`}</summary>
          <div className="accbody">
            <TextField label="Heading" path={`${basePath}.${i}.heading`} />
            <TextField label="Text" path={`${basePath}.${i}.body`} area />
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
              Remove stage
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
            ).push({ heading: "New stage", body: "" });
          })
        }
      >
        + Add stage
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
          <TextField label="Title" path={`${base}.title`} />
          <TextField label="Text" path={`${base}.body`} area />
          <ImageField label="Image (optional)" path={`${base}.image`} />
        </>
      );
    case "process":
      return (
        <>
          <TextField label="Title" path={`${base}.title`} />
          <StepsField
            label="Steps (one per line)"
            path={`${base}.steps`}
            hint="Numbered automatically."
          />
        </>
      );
    case "challenge":
      return (
        <>
          <TextField label="Title" path={`${base}.title`} />
          <TextField label="Intro" path={`${base}.intro`} area />
          <ListField
            label="The challenge (one per line)"
            path={`${base}.problems`}
          />
          <TextField label="Solution title" path={`${base}.approachTitle`} />
          <ListField
            label="Solution (one per line)"
            path={`${base}.approach`}
          />
          <ImageListEditor basePath={`${base}.images`} />
        </>
      );
    case "methodology":
      return (
        <>
          <TextField label="Title" path={`${base}.title`} />
          <MethodologyItemsEditor basePath={`${base}.items`} />
        </>
      );
    case "gallery":
      return (
        <>
          <TextField label="Title" path={`${base}.title`} />
          <SelectField
            label="Layout"
            path={`${base}.layout`}
            options={[
              ["grid", "Grid (3 col)"],
              ["masonry", "Masonry (4 col)"],
              ["wide", "Full width"],
            ]}
          />
          <GalleryItemsEditor basePath={`${base}.items`} />
        </>
      );
    case "conclusion":
      return (
        <>
          <TextField label="Title" path={`${base}.title`} />
          <TextField label="Text" path={`${base}.body`} area />
          <ImageField label="Image (optional)" path={`${base}.image`} />
        </>
      );
    case "cta":
      return (
        <>
          <TextField label="Text" path={`${base}.text`} />
          <TextField label="Button text" path={`${base}.buttonLabel`} />
        </>
      );
    default:
      return null;
  }
}
