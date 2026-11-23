import { mediaThumb } from "@/lib/project";
import type { CaseSection, GalleryMedia } from "@/types/content";
import { Group, ImageField, ListField, SelectField, StepsField, TextField } from "./fields";
import ObjectListEditor from "./ObjectListEditor";

/** Fields of one case-study section, by its type. `base` is its document path. */
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
          <TextField label="Small label" path={`${base}.label`} />
          <TextField label="Title" path={`${base}.title`} />
          <TextField label="Text" path={`${base}.body`} area hint="A line break starts a new paragraph." />
          <ImageField label="Image (optional)" path={`${base}.image`} />
        </>
      );
    case "process":
      return (
        <>
          <TextField label="Title" path={`${base}.title`} />
          <StepsField
            label="Steps, one per line"
            path={`${base}.steps`}
            hint="Numbered automatically."
          />
        </>
      );
    case "challenge":
      return (
        <>
          <TextField label="Title" path={`${base}.title`} />
          <TextField label="Introduction" path={`${base}.intro`} area />
          <ListField label="What was in the way, one per line" path={`${base}.problems`} />
          <TextField label="Title of the solution" path={`${base}.approachTitle`} />
          <ListField label="How we solved it, one per line" path={`${base}.approach`} />
          <Group title="Images" hint="Shown beside the challenge.">
            <ObjectListEditor
              path={`${base}.images`}
              noun="image"
              factory={() => ""}
              labeler={(_, i) => `Image ${i + 1}`}
              thumb={(u) => String(u)}
              renderItem={(i) => <ImageField label="Image" path={`${base}.images.${i}`} />}
            />
          </Group>
        </>
      );
    case "methodology":
      return (
        <>
          <TextField label="Title" path={`${base}.title`} />
          <Group title="Stages">
            <ObjectListEditor
              path={`${base}.items`}
              noun="stage"
              factory={() => ({ heading: "New stage", body: "" })}
              labeler={(it, i) => (it as { heading: string }).heading || `Stage ${i + 1}`}
              summary={(it) => (it as { body: string }).body}
              renderItem={(i) => (
                <>
                  <TextField label="Heading" path={`${base}.items.${i}.heading`} />
                  <TextField label="Text" path={`${base}.items.${i}.body`} area />
                </>
              )}
            />
          </Group>
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
              ["grid", "Grid (3 columns)"],
              ["masonry", "Masonry (4 columns)"],
              ["wide", "Full width"],
            ]}
          />
          <Group
            title="Images and videos"
            hint="Clicking one on the site opens it large. Videos take a file link (.mp4) or a YouTube link."
          >
            <ObjectListEditor
              path={`${base}.items`}
              noun="item"
              factory={() => ({ type: "image", url: "" })}
              labeler={(it, i) => {
                const m = it as GalleryMedia;
                return m.url ? m.url.replace(/^https?:\/\//, "").slice(0, 38) : `Item ${i + 1}`;
              }}
              summary={(it) => ((it as GalleryMedia).type === "video" ? "Video" : "Image")}
              thumb={(it) => mediaThumb(it as GalleryMedia)}
              renderItem={(i) => {
                const m = (section as { items: GalleryMedia[] }).items[i];
                return (
                  <>
                    <SelectField
                      label="Kind"
                      path={`${base}.items.${i}.type`}
                      options={[
                        ["image", "Image"],
                        ["video", "Video"],
                      ]}
                    />
                    {m?.type === "video" ? (
                      <>
                        <TextField label="Video link" path={`${base}.items.${i}.url`} shared />
                        <ImageField
                          label="Cover picture (optional)"
                          path={`${base}.items.${i}.poster`}
                          hint="For a YouTube link its own thumbnail is used when this is empty."
                        />
                      </>
                    ) : (
                      <ImageField label="Image" path={`${base}.items.${i}.url`} />
                    )}
                  </>
                );
              }}
            />
          </Group>
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
          <TextField label="Invitation" path={`${base}.text`} />
          <TextField label="Button text" path={`${base}.buttonLabel`} />
        </>
      );
    default:
      return null;
  }
}
