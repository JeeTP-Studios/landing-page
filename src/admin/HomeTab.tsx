import { useContent } from "@/content/ContentContext";
import { HOME_BLOCK } from "@/lib/home";
import type { HomeSectionKey } from "@/types/content";
import { Accordion, ImageField, ListField, SwitchField, TextField } from "./fields";
import ObjectListEditor from "./ObjectListEditor";
import SortableList from "./SortableList";
import { useEditLang } from "./editLang";

const ORDER_NAMES: Record<HomeSectionKey, string> = {
  manifesto: "Manifesto (pinned statements)",
  about: "About and figures",
  solutions: "Solutions (horizontal)",
  work: "Work list",
  clients: "Client logos",
  products: "Own products",
  process: "Method steps",
  faq: "FAQ",
};

const ACCENT_HINT =
  "The part of the title set in blue serif italic. It must appear in the title.";

export default function HomeTab() {
  const { content, update } = useContent();
  const es = useEditLang() === "es";
  return (
    <>
      <h2>Home</h2>
      <div className="desc">
        The home page, top to bottom. The hero and the closing are fixed; the sections in between
        can be hidden and reordered.
      </div>

      <Accordion summary="Hero" open>
        <ListField
          label="Headline (one line per row)"
          path="hero.lines"
          hint="Each line rises in turn."
        />
        <TextField label="Accent word" path="hero.accent" hint={ACCENT_HINT} />
        <TextField label="Supporting line" path="hero.sub" area />
        <TextField label="Scroll label" path="hero.scrollLabel" />
      </Accordion>

      <Accordion summary="Manifesto">
        <SwitchField label="Show section" path="manifesto.enabled" />
        <ListField
          label="Statements (one per line)"
          path="manifesto.statements"
          hint="Shown one at a time while the section is pinned, and the 3D pieces lock together. Keep it right after the hero in Section order."
        />
      </Accordion>

      <Accordion summary="3D layer names">
        <div className="hint">Shown beside the assembled 3D stack, top to bottom.</div>
        <TextField label="Top layer" path="stack.labels.0" />
        <TextField label="Middle layer" path="stack.labels.1" />
        <TextField label="Bottom layer" path="stack.labels.2" />
      </Accordion>

      <Accordion summary="About and figures">
        <SwitchField label="Show section" path="aboutBlock.enabled" />
        <TextField label="Kicker" path="aboutBlock.kicker" />
        <TextField
          label="Statement"
          path="aboutBlock.statement"
          area
          hint="Lights up word by word while scrolling."
        />
        <SwitchField label="Show figures" path="stats.enabled" />
        <ObjectListEditor
          path="stats.items"
          factory={() => ({ value: 10, suffix: "+", label: "New figure" })}
          labeler={(it) => (it as { label: string }).label}
          addLabel="+ Add figure"
          renderItem={(i) => (
            <>
              <div className="row">
                <TextField label="Value (number)" path={`stats.items.${i}.value`} number />
                <TextField
                  label="Suffix"
                  path={`stats.items.${i}.suffix`}
                  shared
                  hint="e.g. +, %, K+"
                />
              </div>
              <TextField label="Label" path={`stats.items.${i}.label`} />
            </>
          )}
        />
      </Accordion>

      <Accordion summary="Solutions">
        <div className="hint" style={{ marginBottom: 12 }}>
          Also listed on the Services page.
        </div>
        <SwitchField label="Show section" path="solutions.enabled" />
        <TextField label="Counter label" path="solutions.label" />
        <ObjectListEditor
          path="solutions.items"
          factory={() => ({ title: "New solution.", body: "Describe it.", chips: ["Tag"] })}
          labeler={(it) => (it as { title: string }).title}
          addLabel="+ Add solution"
          renderItem={(i) => (
            <>
              <TextField label="Title" path={`solutions.items.${i}.title`} />
              <TextField label="Text" path={`solutions.items.${i}.body`} area />
              <ListField label="Tags (one per line)" path={`solutions.items.${i}.chips`} />
            </>
          )}
        />
      </Accordion>

      <Accordion summary="Work list">
        <SwitchField label="Show section" path="work.enabled" />
        <TextField label="Title" path="work.title" />
        <TextField label="Accent" path="work.accent" hint={ACCENT_HINT} />
        <TextField label="Kicker" path="work.kicker" />
        <div className="hint">
          The rows are the projects of the Projects tab, in the same order. Each row shows its name,
          tagline and type.
        </div>
      </Accordion>

      <Accordion summary="Own products">
        <SwitchField label="Show section" path="products.enabled" />
        <TextField label="Title" path="products.title" />
        <TextField label="Accent" path="products.accent" hint={ACCENT_HINT} />
        <TextField label="Intro" path="products.intro" area />
        <ObjectListEditor
          path="products.items"
          factory={() => ({
            name: "New product",
            logo: "",
            title: "Headline.",
            body: "What it does.",
            url: "https://",
            linkLabel: "Discover ↗",
          })}
          labeler={(it) => (it as { name: string }).name}
          addLabel="+ Add product"
          renderItem={(i) => (
            <>
              <TextField label="Name" path={`products.items.${i}.name`} shared />
              <ImageField
                label="Logo"
                path={`products.items.${i}.logo`}
                hint="An SVG mark is shown in colour beside the name. A PNG or WebP wordmark is shown flat white and carries the name itself."
              />
              <TextField label="Headline" path={`products.items.${i}.title`} />
              <TextField label="Text" path={`products.items.${i}.body`} area />
              <TextField label="Link" path={`products.items.${i}.url`} shared />
              <TextField label="Link label" path={`products.items.${i}.linkLabel`} />
            </>
          )}
        />
      </Accordion>

      <Accordion summary="Method steps">
        <SwitchField label="Show section" path="process.enabled" />
        <TextField label="Title" path="process.title" />
        <TextField label="Accent" path="process.accent" hint={ACCENT_HINT} />
        <ObjectListEditor
          path="process.steps"
          factory={() => ({ num: "05", title: "New step", body: "Describe this step." })}
          labeler={(it) => (it as { title: string }).title}
          addLabel="+ Add step"
          renderItem={(i) => (
            <>
              <div className="row">
                <TextField label="Number" path={`process.steps.${i}.num`} shared />
                <TextField label="Title" path={`process.steps.${i}.title`} />
              </div>
              <TextField label="Text" path={`process.steps.${i}.body`} area />
            </>
          )}
        />
      </Accordion>

      <div className="hint" style={{ margin: "0 0 12px" }}>
        Client logos are edited in the <b>Clients</b> section of the menu.
      </div>

      <Accordion summary="FAQ">
        <SwitchField label="Show section" path="faq.enabled" />
        <TextField label="Title" path="faq.title" />
        <TextField label="Accent" path="faq.accent" hint={ACCENT_HINT} />
        <ObjectListEditor
          path="faq.items"
          factory={() => ({ q: "New question", a: "Answer" })}
          labeler={(it, i) => (it as { q: string }).q || `Question ${i + 1}`}
          addLabel="+ Add question"
          renderItem={(i) => (
            <>
              <TextField label="Question" path={`faq.items.${i}.q`} />
              <TextField label="Answer" path={`faq.items.${i}.a`} area />
            </>
          )}
        />
      </Accordion>

      <Accordion summary="Closing (giant text and footer columns)">
        <TextField label="Kicker" path="closing.kicker" />
        <TextField label="Giant text" path="closing.word" />
        <div className="row">
          <TextField label="Email column label" path="closing.emailLabel" />
          <TextField label="After copying the email" path="closing.emailCopied" />
        </div>
        <div className="row">
          <TextField label="WhatsApp column label" path="closing.whatsappLabel" />
          <TextField label="Location column label" path="closing.locationLabel" />
        </div>
        <div className="row">
          <TextField label="Last column label" path="closing.remoteLabel" />
          <TextField label="Last column text" path="closing.remoteValue" />
        </div>
        <div className="hint">
          Email, WhatsApp and location values come from Global. Footer links come from Site texts.
        </div>
      </Accordion>

      <Accordion summary="Section order">
        <div className="desc">
          Drag to reorder; the switch shows or hides a section. Order is shared by both languages.
          {es ? " Reorder from English to avoid slips." : ""}
        </div>
        <SortableList
          ids={content.order}
          onReorder={(ids) =>
            update((d) => {
              d.order = ids as HomeSectionKey[];
            })
          }
          renderItem={(id) => {
            const k = id as HomeSectionKey;
            const block = HOME_BLOCK[k];
            return (
              <>
                <span className="grip">⠿</span>
                <span className="nm">{ORDER_NAMES[k]}</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={content[block].enabled}
                    onChange={(e) =>
                      update((d) => {
                        d[block].enabled = e.target.checked;
                      })
                    }
                  />
                  <span className="sl" />
                </label>
              </>
            );
          }}
        />
      </Accordion>
    </>
  );
}
