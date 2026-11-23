import { Group, ImageField, ListField, Row, SwitchField, TextField } from "../fields";
import ObjectListEditor from "../ObjectListEditor";
import { clip, count, type PageDef, type SectionDef } from "./types";

const ACCENT_HINT = "The word of the title set in blue italics. It must appear in the title.";

const hero: SectionDef = {
  key: "hero",
  title: "Hero",
  about: "The first screen: a big headline over the floating 3D pieces.",
  roots: ["hero"],
  locked: true,
  summary: (c) => clip(c.hero.lines.join(" ")),
  Fields: () => (
    <>
      <ListField
        label="Headline, one line per row"
        path="hero.lines"
        maxLine={20}
        hint="Each line rises in turn. Keep lines short: the type is huge."
      />
      <TextField label="Accent word" path="hero.accent" hint={ACCENT_HINT} max={24} />
      <TextField label="Supporting sentence" path="hero.sub" area max={160} />
      <TextField label="“Scroll” label" path="hero.scrollLabel" max={16} />
    </>
  ),
};

const stack: SectionDef = {
  key: "stack",
  title: "3D layer names",
  about: "Three words shown beside the 3D pieces once they lock together.",
  roots: ["stack"],
  locked: true,
  previewKey: "manifesto",
  summary: (c) => c.stack.labels.join(" · "),
  Fields: () => (
    <>
      <TextField label="Top layer" path="stack.labels.0" max={20} />
      <TextField label="Middle layer" path="stack.labels.1" max={20} />
      <TextField label="Bottom layer" path="stack.labels.2" max={20} />
    </>
  ),
};

const manifesto: SectionDef = {
  key: "manifesto",
  title: "Manifesto",
  about: "Statements that appear one at a time while the page is pinned.",
  roots: ["manifesto"],
  enabledPath: "manifesto.enabled",
  summary: (c) => `${count(c.manifesto.statements.length, "statement")}: ${clip(c.manifesto.statements[0] ?? "", 60)}`,
  Fields: () => (
    <ListField
      label="Statements, one per line"
      path="manifesto.statements"
      hint="The 3D pieces lock together while these play. Keep this section right after the hero in the order."
    />
  ),
};

const about: SectionDef = {
  key: "about",
  title: "About and figures",
  about: "A statement that lights up word by word, with a row of figures.",
  roots: ["aboutBlock", "stats"],
  enabledPath: "aboutBlock.enabled",
  summary: (c) => clip(c.aboutBlock.statement),
  Fields: () => (
    <>
      <TextField label="Small heading" path="aboutBlock.kicker" max={30} />
      <TextField
        label="Statement"
        path="aboutBlock.statement"
        area
        max={260}
        hint="Lights up word by word while scrolling."
      />
      <Group title="Figures">
        <SwitchField label="Show the figures" path="stats.enabled" />
        <ObjectListEditor
          path="stats.items"
          noun="figure"
          factory={() => ({ value: 10, suffix: "+", label: "New figure" })}
          labeler={(it) => (it as { label: string }).label}
          summary={(it) => {
            const s = it as { value: number; suffix: string };
            return `${s.value}${s.suffix}`;
          }}
          renderItem={(i) => (
            <>
              <Row>
                <TextField label="Number" path={`stats.items.${i}.value`} number />
                <TextField
                  label="After the number"
                  path={`stats.items.${i}.suffix`}
                  shared
                  hint="For example +, % or K+"
                />
              </Row>
              <TextField label="What it counts" path={`stats.items.${i}.label`} />
            </>
          )}
        />
      </Group>
    </>
  ),
};

const solutions: SectionDef = {
  key: "solutions",
  title: "Solutions",
  about: "What the studio builds, scrolled sideways. Also listed on the Services page.",
  roots: ["solutions"],
  enabledPath: "solutions.enabled",
  aliases: ["services-solutions"],
  summary: (c) => clip(c.solutions.items.map((s) => s.title).join(" · ")),
  Fields: () => (
    <>
      <TextField label="Counter label" path="solutions.label" max={24} />
      <Group title="Solutions">
        <ObjectListEditor
          path="solutions.items"
          noun="solution"
          factory={() => ({ title: "New solution.", body: "Describe it.", chips: ["Tag"] })}
          labeler={(it) => (it as { title: string }).title}
          summary={(it) => clip((it as { body: string }).body, 70)}
          renderItem={(i) => (
            <>
              <TextField label="Title" path={`solutions.items.${i}.title`} max={40} />
              <TextField label="Text" path={`solutions.items.${i}.body`} area max={220} />
              <ListField label="Tags, one per line" path={`solutions.items.${i}.chips`} />
            </>
          )}
        />
      </Group>
    </>
  ),
};

const work: SectionDef = {
  key: "work",
  title: "Work list",
  about: "The projects, as rows. They come from Projects, in the same order.",
  roots: ["work"],
  enabledPath: "work.enabled",
  summary: (c) => `${count(c.projects.length, "project")} shown`,
  Fields: () => (
    <>
      <TextField label="Title" path="work.title" max={40} />
      <TextField label="Accent word" path="work.accent" hint={ACCENT_HINT} max={24} />
      <TextField label="Small text beside the title" path="work.kicker" max={40} />
    </>
  ),
};

const clients: SectionDef = {
  key: "clients",
  title: "Client logos",
  about: "The moving band of client logos.",
  roots: [],
  enabledPath: "clients.enabled",
  summary: (c) => `${count(c.clients.logos.length, "logo")}, also shown on About and Services`,
  pointer: { page: "clients", section: "clients", label: "Open Clients" },
};

const products: SectionDef = {
  key: "products",
  title: "Own products",
  about: "The studio's own products, as cards.",
  roots: ["products"],
  enabledPath: "products.enabled",
  summary: (c) => clip(c.products.items.map((p) => p.name).join(" · ")),
  Fields: () => (
    <>
      <TextField label="Title" path="products.title" max={40} />
      <TextField label="Accent word" path="products.accent" hint={ACCENT_HINT} max={24} />
      <TextField label="Introduction" path="products.intro" area max={200} />
      <Group title="Products">
        <ObjectListEditor
          path="products.items"
          noun="product"
          factory={() => ({
            name: "New product",
            logo: "",
            title: "Headline.",
            body: "What it does.",
            url: "https://",
            linkLabel: "Discover ↗",
          })}
          labeler={(it) => (it as { name: string }).name}
          summary={(it) => clip((it as { title: string }).title, 60)}
          thumb={(it) => (it as { logo: string }).logo}
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
              <TextField label="Link text" path={`products.items.${i}.linkLabel`} />
            </>
          )}
        />
      </Group>
    </>
  ),
};

const process: SectionDef = {
  key: "process",
  title: "Method steps",
  about: "How the studio works, in numbered steps.",
  roots: ["process"],
  enabledPath: "process.enabled",
  summary: (c) => clip(c.process.steps.map((s) => s.title).join(" · ")),
  Fields: () => (
    <>
      <TextField label="Title" path="process.title" max={40} />
      <TextField label="Accent word" path="process.accent" hint={ACCENT_HINT} max={24} />
      <Group title="Steps">
        <ObjectListEditor
          path="process.steps"
          noun="step"
          factory={() => ({ num: "05", title: "New step", body: "Describe this step." })}
          labeler={(it) => (it as { title: string }).title}
          summary={(it) => clip((it as { body: string }).body, 70)}
          renderItem={(i) => (
            <>
              <Row>
                <TextField label="Number" path={`process.steps.${i}.num`} shared />
                <TextField label="Title" path={`process.steps.${i}.title`} />
              </Row>
              <TextField label="Text" path={`process.steps.${i}.body`} area />
            </>
          )}
        />
      </Group>
    </>
  ),
};

const faq: SectionDef = {
  key: "faq",
  title: "FAQ",
  about: "Questions people ask, as an accordion.",
  roots: ["faq"],
  enabledPath: "faq.enabled",
  summary: (c) => count(c.faq.items.length, "question"),
  Fields: () => (
    <>
      <TextField label="Title" path="faq.title" max={40} />
      <TextField label="Accent word" path="faq.accent" hint={ACCENT_HINT} max={24} />
      <Group title="Questions">
        <ObjectListEditor
          path="faq.items"
          noun="question"
          factory={() => ({ q: "New question", a: "Answer" })}
          labeler={(it, i) => (it as { q: string }).q || `Question ${i + 1}`}
          summary={(it) => clip((it as { a: string }).a, 70)}
          renderItem={(i) => (
            <>
              <TextField label="Question" path={`faq.items.${i}.q`} />
              <TextField label="Answer" path={`faq.items.${i}.a`} area />
            </>
          )}
        />
      </Group>
    </>
  ),
};

const closing: SectionDef = {
  key: "closing",
  title: "Closing and footer",
  about: "The giant closing words and the contact columns. Repeated at the end of every page.",
  roots: ["closing"],
  locked: true,
  summary: (c) => clip(`${c.closing.word}: ${c.closing.kicker}`),
  Fields: () => (
    <>
      <TextField label="Small heading" path="closing.kicker" max={40} />
      <TextField label="Giant words" path="closing.word" max={24} />
      <Group
        title="Column labels"
        hint="The values come from Global and Contact. Footer links are in Texts."
      >
        <Row>
          <TextField label="Email column" path="closing.emailLabel" />
          <TextField label="After copying the email" path="closing.emailCopied" />
        </Row>
        <Row>
          <TextField label="WhatsApp column" path="closing.whatsappLabel" />
          <TextField label="Location column" path="closing.locationLabel" />
        </Row>
        <Row>
          <TextField label="Last column label" path="closing.remoteLabel" />
          <TextField label="Last column text" path="closing.remoteValue" />
        </Row>
      </Group>
    </>
  ),
};

export const HOME_PAGE: PageDef = {
  key: "home",
  label: "Home",
  icon: "home",
  route: "/",
  blurb:
    "The home page, top to bottom. The hero and the closing are fixed; drag the sections in between to reorder them, and use the eye to hide one.",
  fixed: { head: ["hero", "stack"], tail: ["closing"] },
  sections: [hero, stack, manifesto, about, solutions, work, clients, products, process, faq, closing],
};
