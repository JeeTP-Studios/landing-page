import { Group, ImageField, ListField, Row, TextField } from "../fields";
import ObjectListEditor from "../ObjectListEditor";
import { clip, count, type PageDef } from "./types";

const ACCENT_HINT = "The word of the title set in blue italics. It must appear in the title.";

/* ============ ABOUT ============ */
export const ABOUT_PAGE: PageDef = {
  key: "about",
  label: "About",
  icon: "about",
  route: "/about",
  blurb: "The About page: who the studio is, in a few blocks.",
  sections: [
    {
      key: "about-hero",
      title: "Page header",
      about: "The small label, the big title and its accent word.",
      roots: ["about.hero"],
      summary: (c) => clip(c.about.hero.title),
      Fields: () => (
        <>
          <TextField label="Small label" path="about.hero.eyebrow" max={24} />
          <TextField label="Title" path="about.hero.title" area max={90} />
          <TextField label="Accent word" path="about.hero.accent" hint={ACCENT_HINT} max={40} />
        </>
      ),
    },
    {
      key: "about-intro",
      title: "Who we are",
      about: "A heading and the opening text.",
      roots: ["about.intro"],
      summary: (c) => clip(c.about.intro.heading),
      Fields: () => (
        <>
          <TextField label="Heading" path="about.intro.heading" max={80} />
          <TextField
            label="Text"
            path="about.intro.body"
            area
            hint="A line break starts a new paragraph."
          />
        </>
      ),
    },
    {
      key: "about-gallery",
      title: "Studio photos",
      about: "Up to three photos shown under the opening text.",
      roots: ["about.gallery"],
      summary: (c) => count((c.about.gallery || []).filter(Boolean).length, "photo"),
      Fields: () => (
        <ObjectListEditor
          path="about.gallery"
          noun="photo"
          factory={() => ""}
          labeler={(_, i) => `Photo ${i + 1}`}
          thumb={(u) => String(u)}
          renderItem={(i) => <ImageField label="Photo" path={`about.gallery.${i}`} />}
          emptyText="No photos yet. Add one: the page shows the first three."
        />
      ),
    },
    {
      key: "about-overview",
      title: "What we have built",
      about: "The left of the two text columns.",
      roots: ["about.overview"],
      summary: (c) => clip(c.about.overview.heading),
      Fields: () => (
        <>
          <TextField label="Heading" path="about.overview.heading" max={80} />
          <TextField label="Text" path="about.overview.body" area />
        </>
      ),
    },
    {
      key: "about-beliefs",
      title: "What we believe",
      about: "The right of the two text columns.",
      roots: ["about.beliefs"],
      summary: (c) => clip(c.about.beliefs.heading),
      Fields: () => (
        <>
          <TextField label="Heading" path="about.beliefs.heading" max={80} />
          <TextField label="Text" path="about.beliefs.body" area />
        </>
      ),
    },
  ],
};

/* ============ SERVICES ============ */
export const SERVICES_PAGE: PageDef = {
  key: "services",
  label: "Services",
  icon: "services",
  route: "/services",
  blurb: "The Services page: the solutions, what each is made of, and who the studio helps.",
  sections: [
    {
      key: "services-hero",
      title: "Page header",
      about: "The small label, the big title and its accent word.",
      roots: ["servicesPage.hero"],
      summary: (c) => clip(c.servicesPage.hero.title),
      Fields: () => (
        <>
          <TextField label="Small label" path="servicesPage.hero.eyebrow" max={24} />
          <TextField label="Title" path="servicesPage.hero.title" area max={90} />
          <TextField label="Accent word" path="servicesPage.hero.accent" hint={ACCENT_HINT} max={40} />
        </>
      ),
    },
    {
      key: "services-solutions",
      title: "Solutions list",
      about: "The same solutions as the home page, listed.",
      roots: [],
      summary: (c) => count(c.solutions.items.length, "solution"),
      pointer: { page: "home", section: "solutions", label: "Open Home · Solutions" },
    },
    {
      key: "services-groups",
      title: "Service groups",
      about: "What each solution is made of. Numbered automatically.",
      roots: ["servicesPage.groups"],
      summary: (c) => clip(c.servicesPage.groups.map((g) => g.title).join(" · ")),
      Fields: () => (
        <ObjectListEditor
          path="servicesPage.groups"
          noun="group"
          factory={() => ({ num: "00", title: "New group", links: ["Service"] })}
          renumber
          labeler={(g) => {
            const x = g as { num: string; title: string };
            return `${x.num} · ${x.title || ""}`;
          }}
          summary={(g) => clip(((g as { links: string[] }).links || []).join(", "), 70)}
          renderItem={(i) => (
            <>
              <TextField label="Title" path={`servicesPage.groups.${i}.title`} />
              <ListField label="Services, one per line" path={`servicesPage.groups.${i}.links`} />
            </>
          )}
        />
      ),
    },
    {
      key: "services-who",
      title: "Who we help",
      about: "A heading and picture cards for the kinds of clients.",
      roots: ["servicesPage.who"],
      enabledPath: "servicesPage.who.enabled",
      summary: (c) => count(c.servicesPage.who.cards.length, "card"),
      Fields: () => (
        <>
          <TextField label="Heading" path="servicesPage.who.heading" max={80} />
          <TextField label="Text" path="servicesPage.who.body" area />
          <Group title="Cards">
            <ObjectListEditor
              path="servicesPage.who.cards"
              noun="card"
              factory={() => ({ title: "New", img: "" })}
              labeler={(w) => (w as { title: string }).title || "Card"}
              thumb={(w) => (w as { img: string }).img}
              renderItem={(i) => (
                <>
                  <TextField label="Title" path={`servicesPage.who.cards.${i}.title`} />
                  <ImageField label="Picture" path={`servicesPage.who.cards.${i}.img`} />
                </>
              )}
            />
          </Group>
        </>
      ),
    },
  ],
};

/* ============ WORK (index page) ============ */
export const WORK_PAGE: PageDef = {
  key: "work",
  label: "Work",
  icon: "work",
  route: "/case-studies",
  blurb: "The Work page lists every project as a card. Its header is here; the projects are in Projects.",
  sections: [
    {
      key: "cases-hero",
      title: "Page header",
      about: "The small label, the big title and its accent word.",
      roots: ["cases"],
      summary: (c) => clip(c.cases.title),
      Fields: () => (
        <>
          <TextField label="Small label" path="cases.label" max={24} />
          <TextField label="Title" path="cases.title" max={70} />
          <TextField label="Accent word" path="cases.accent" hint={ACCENT_HINT} max={40} />
        </>
      ),
    },
    {
      key: "cases-projects",
      title: "Projects",
      about: "The cards below the header.",
      roots: [],
      summary: (c) => count(c.projects.length, "project"),
      pointer: { page: "projects", label: "Open Projects" },
    },
  ],
};

/* ============ CONTACT ============ */
export const CONTACT_PAGE: PageDef = {
  key: "contact",
  label: "Contact",
  icon: "contact",
  route: "/contact",
  blurb: "The Contact page: header, contact details and the form's introduction.",
  sections: [
    {
      key: "contact-hero",
      title: "Page header",
      about: "Header text and the regions the visitor can switch between.",
      roots: ["contactPage.hero", "contactPage.regions"],
      summary: (c) => clip(c.contactPage.hero.title),
      Fields: () => (
        <>
          <TextField label="Small label" path="contactPage.hero.eyebrow" max={24} />
          <TextField label="Title" path="contactPage.hero.title" max={70} />
          <TextField label="Accent word" path="contactPage.hero.accent" hint={ACCENT_HINT} max={40} />
          <TextField label="Subtitle" path="contactPage.hero.sub" area max={200} />
          <Group title="Regions" hint="Little buttons under the header.">
            <ObjectListEditor
              path="contactPage.regions"
              noun="region"
              factory={() => ({ name: "New region", flag: "" })}
              labeler={(r) => (r as { name: string }).name || "Region"}
              renderItem={(i) => (
                <Row>
                  <TextField label="Name" path={`contactPage.regions.${i}.name`} />
                  <TextField label="Flag or symbol" path={`contactPage.regions.${i}.flag`} shared />
                </Row>
              )}
            />
          </Group>
        </>
      ),
    },
    {
      key: "contact-info",
      title: "Contact details",
      about: "Email, phone, address and map. Also used in the footer.",
      roots: ["contact"],
      summary: (c) => clip(`${c.contact.email} · ${c.contact.phone}`),
      Fields: () => (
        <>
          <TextField label="Email" path="contact.email" shared />
          <TextField label="WhatsApp number" path="contact.whatsapp" shared />
          <TextField label="Phone" path="contact.phone" shared />
          <TextField label="Location (footer)" path="contact.location" />
          <TextField label="Address (contact page)" path="contact.address" />
          <TextField
            label="Map search"
            path="contact.mapQuery"
            shared
            hint="A city or an address, for example Mexico City."
          />
        </>
      ),
    },
    {
      key: "contact-form",
      title: "Form introduction",
      about: "The text beside the contact form. The form's own labels are in Texts.",
      roots: ["contactPage.interestedTitle", "contactPage.getInTouch"],
      summary: (c) => clip(c.contactPage.interestedTitle),
      Fields: () => (
        <>
          <TextField label="Title" path="contactPage.interestedTitle" max={70} />
          <TextField label="Text under the title" path="contactPage.getInTouch" max={160} />
        </>
      ),
    },
  ],
};

/* ============ CLIENTS ============ */
export const CLIENTS_PAGE: PageDef = {
  key: "clients",
  label: "Clients",
  icon: "clients",
  route: "/about",
  blurb:
    "One list of client logos, shown as the moving band on Home, About and Services. Logos are painted white automatically.",
  sections: [
    {
      key: "clients",
      title: "Client logos",
      about: "Add a client with its logo; without a logo its name is shown instead.",
      roots: ["clients"],
      summary: (c) => count(c.clients.logos.length, "logo"),
      Fields: () => (
        <>
          <TextField
            label="Name of the band for screen readers"
            path="clients.title"
            hint="Read aloud by screen readers; not shown on screen."
          />
          <Group title="Logos">
            <ObjectListEditor
              path="clients.logos"
              noun="client"
              factory={() => ({ name: "New client", img: "" })}
              labeler={(l) => (l as { name: string }).name || "Client"}
              thumb={(l) => (l as { img: string }).img}
              renderItem={(i) => (
                <>
                  <TextField label="Name" path={`clients.logos.${i}.name`} shared />
                  <ImageField
                    label="Logo"
                    path={`clients.logos.${i}.img`}
                    hint="A transparent PNG or an SVG."
                  />
                </>
              )}
            />
          </Group>
        </>
      ),
    },
  ],
};

/* ============ GLOBAL ============ */
export const GLOBAL_PAGE: PageDef = {
  key: "global",
  label: "Global",
  icon: "global",
  route: "/",
  blurb: "What applies to the whole site. Contact details are in the Contact page.",
  sections: [
    {
      key: "brand",
      title: "Brand and logo",
      about: "The name and the logo shown in the header.",
      roots: ["brand"],
      previewKey: "brand",
      summary: (c) => c.brand.name,
      Fields: () => (
        <>
          <TextField label="Name" path="brand.name" shared />
          <ImageField
            label="Logo (PNG, white on transparent)"
            path="brand.logoImg"
            hint="Shown in the header. Leave empty to show the name as text."
          />
        </>
      ),
    },
  ],
};
