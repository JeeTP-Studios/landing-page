import { useContent } from "@/content/ContentContext";
import type { HomeSectionKey } from "@/types/content";
import {
  Accordion,
  ColorField,
  GradientField,
  ImageField,
  ListField,
  OpacityField,
  SelectField,
  SwitchField,
  TextField,
} from "./fields";
import ObjectListEditor from "./ObjectListEditor";
import SortableList from "./SortableList";

/* ============ GLOBAL ============ */
export function GlobalTab() {
  return (
    <>
      <h2>Global</h2>
      <div className="desc">
        Brand, logo, global background and contact info. Applied across the site.
      </div>
      <Accordion summary="Brand & logo" open>
        <TextField label="Name" path="brand.name" />
        <TextField label="Tagline" path="brand.tagline" />
        <SelectField
          label="Logo type"
          path="brand.logoType"
          options={[
            ["text", "Text"],
            ["image", "Image"],
          ]}
        />
        <ImageField
          label="Logo image (PNG)"
          path="brand.logoImg"
          hint="If you choose 'Image', it's used in header and footer."
        />
      </Accordion>
      <Accordion summary="Global background (home only)">
        <SelectField
          label="Background type"
          path="bg.type"
          options={[
            ["none", "None"],
            ["image", "Image"],
            ["video", "Video"],
          ]}
        />
        <ImageField
          label="Image / poster"
          path="bg.url"
          hint="Image or URL. For video, paste the .mp4 URL."
        />
      </Accordion>
      <Accordion summary="Contact info">
        <TextField label="Email" path="contact.email" />
        <TextField label="WhatsApp" path="contact.whatsapp" />
        <TextField label="Phone" path="contact.phone" />
        <TextField label="Location (footer)" path="contact.location" />
        <TextField label="Address (contact page)" path="contact.address" />
        <TextField
          label="Map location"
          path="contact.mapQuery"
          hint="e.g. Mexico City or an address."
        />
      </Accordion>
    </>
  );
}

/* ============ HOME ============ */
const ORDER_NAMES: Record<HomeSectionKey, string> = {
  highlighted: "Featured projects",
  services: "Service cards",
  clients: "Clients",
  faq: "FAQ",
};

export function HomeTab() {
  const { content, update } = useContent();
  return (
    <>
      <h2>Home</h2>
      <div className="desc">Hero and home page sections.</div>

      <Accordion summary="Hero" open>
        <TextField label="Eyebrow" path="hero.eyebrow" />
        <ListField
          label="Titles (one per line)"
          path="hero.titles"
          mode="lines"
          hint="Typed in a loop with a typewriter effect. With just one, it stays fixed. The order is the typing order."
        />
        <ListField
          label="Decorative chips (one per line)"
          path="hero.chips"
          mode="lines"
          hint="Tags that float diagonally/overlapping in the hero. Leave empty to hide them."
        />
        <GradientField prefix="hero" />
        <OpacityField prefix="hero" />
        <TextField
          label="Learn more links to"
          path="hero.href"
          hint="e.g. /case-studies or https://..."
        />
      </Accordion>

      <Accordion summary="Featured projects">
        <SwitchField label="Show section" path="highlighted.enabled" />
        <TextField label="Label" path="highlighted.label" />
        <TextField label="Title" path="highlighted.title" />
        <GradientField prefix="highlighted" />
        <OpacityField prefix="highlighted" />
        <div className="hint">
          The cards use the projects from the Case Studies menu.
        </div>
      </Accordion>

      <Accordion summary="Service cards">
        <SwitchField label="Show section" path="services.enabled" />
        <TextField label="Label" path="services.label" />
        <TextField label="Title" path="services.title" />
        <GradientField prefix="services" />
        <OpacityField prefix="services" />
        <ObjectListEditor
          path="services.items"
          factory={() => ({
            h: "New service",
            a: "Line 1",
            b: "Line 2",
            color: "#7c5cff",
          })}
          labeler={(it) => (it as { h: string }).h}
          addLabel="+ Add card"
          renderItem={(i) => (
            <>
              <TextField label="Title" path={`services.items.${i}.h`} />
              <div className="row">
                <TextField label="Line 1" path={`services.items.${i}.a`} />
                <TextField label="Line 2" path={`services.items.${i}.b`} />
              </div>
              <ColorField label="Color" path={`services.items.${i}.color`} />
              <ImageField
                label="Image / icon (home preview)"
                path={`services.items.${i}.img`}
                hint="Shown on the left in the services preview. Without an image, the number is shown."
              />
            </>
          )}
        />
      </Accordion>

      <div className="hint" style={{ margin: "0 0 12px" }}>
        Clients content is edited in the <b>Clients</b> section of the menu.
      </div>

      <Accordion summary="FAQ">
        <SwitchField label="Show section" path="faq.enabled" />
        <TextField label="Label" path="faq.label" />
        <TextField label="Title" path="faq.title" />
        <GradientField prefix="faq" />
        <OpacityField prefix="faq" />
        <ObjectListEditor
          path="faq.items"
          factory={() => ({ q: "New question", a: "Answer" })}
          labeler={(_, i) => `Question ${i + 1}`}
          addLabel="+ Add question"
          renderItem={(i) => (
            <>
              <TextField label="Question" path={`faq.items.${i}.q`} />
              <TextField label="Answer" path={`faq.items.${i}.a`} area />
            </>
          )}
        />
      </Accordion>

      <Accordion summary="Section order">
        <div className="desc">Drag to reorder. The switch shows/hides.</div>
        <SortableList
          ids={content.order}
          onReorder={(ids) =>
            update((d) => {
              d.order = ids as HomeSectionKey[];
            })
          }
          renderItem={(id) => {
            const k = id as HomeSectionKey;
            const enabled = content[k].enabled;
            return (
              <>
                <span className="grip">⠿</span>
                <span className="nm">{ORDER_NAMES[k]}</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) =>
                      update((d) => {
                        d[k].enabled = e.target.checked;
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

/* ============ ABOUT ============ */
export function AboutTab() {
  return (
    <>
      <h2>About Us</h2>
      <div className="desc">About Us page.</div>
      <Accordion summary="Hero" open>
        <TextField label="Eyebrow" path="about.hero.eyebrow" />
        <TextField label="Title" path="about.hero.title" area />
        <GradientField prefix="about.hero" />
        <OpacityField prefix="about.hero" />
      </Accordion>
      <Accordion summary="Who we are">
        <TextField label="Heading" path="about.intro.heading" />
        <TextField
          label="Text (double line break = new paragraph)"
          path="about.intro.body"
          area
        />
        <div className="hint" style={{ marginTop: 8 }}>
          The client logo carousel below is edited in the
          sección <b>Clients</b> section of the menu.
        </div>
      </Accordion>
      <Accordion summary="Overview">
        <TextField label="Heading" path="about.overview.heading" />
        <TextField label="Text" path="about.overview.body" area />
      </Accordion>
      <Accordion summary="What we believe">
        <TextField label="Heading" path="about.beliefs.heading" />
        <TextField label="Text" path="about.beliefs.body" area />
      </Accordion>
      <Accordion summary="In the media">
        <SwitchField label="Show section" path="about.news.enabled" />
        <TextField label="Title" path="about.news.title" />
        <ObjectListEditor
          path="about.news.logos"
          factory={() => ({ name: "New", img: "" })}
          labeler={(l) => (l as { name: string }).name || "Outlet"}
          renderItem={(i) => (
            <>
              <TextField label="Name" path={`about.news.logos.${i}.name`} />
              <ImageField label="Image" path={`about.news.logos.${i}.img`} />
            </>
          )}
        />
      </Accordion>
    </>
  );
}

/* ============ SERVICES ============ */
export function ServicesTab() {
  return (
    <>
      <h2>Services</h2>
      <div className="desc">Services page.</div>
      <Accordion summary="Hero" open>
        <TextField label="Eyebrow" path="servicesPage.hero.eyebrow" />
        <TextField label="Title" path="servicesPage.hero.title" area />
        <GradientField prefix="servicesPage.hero" />
        <OpacityField prefix="servicesPage.hero" />
      </Accordion>
      <Accordion summary="Service groups">
        <ObjectListEditor
          path="servicesPage.groups"
          factory={() => ({ num: "00", title: "New group", links: ["Service"] })}
          labeler={(g) => {
            const x = g as { num: string; title: string };
            return `${x.num} · ${x.title || ""}`;
          }}
          renumber
          renderItem={(i) => (
            <>
              <TextField label="Title" path={`servicesPage.groups.${i}.title`} />
              <ListField
                label="Services (one per line)"
                path={`servicesPage.groups.${i}.links`}
                mode="lines"
              />
            </>
          )}
        />
      </Accordion>
      <Accordion summary="Who we help">
        <SwitchField label="Show section" path="servicesPage.who.enabled" />
        <TextField label="Heading" path="servicesPage.who.heading" />
        <TextField label="Text" path="servicesPage.who.body" area />
        <ObjectListEditor
          path="servicesPage.who.cards"
          factory={() => ({ title: "New", img: "" })}
          labeler={(w) => (w as { title: string }).title || "Card"}
          renderItem={(i) => (
            <>
              <TextField label="Title" path={`servicesPage.who.cards.${i}.title`} />
              <ImageField
                label="Image (optional)"
                path={`servicesPage.who.cards.${i}.img`}
              />
            </>
          )}
        />
      </Accordion>
      <Accordion summary="Clients & media">
        <TextField label="Clients title" path="servicesPage.clientsTitle" />
        <div className="hint" style={{ marginBottom: 14 }}>
          The clients list is edited in Home; media in About Us.
        </div>
        <SwitchField
          label="Show 'In the media'"
          path="servicesPage.news.enabled"
        />
      </Accordion>
    </>
  );
}

/* ============ CASE STUDIES (página de listado) ============ */
export function CasesPageTab() {
  return (
    <>
      <h2>Case Studies · Page</h2>
      <div className="desc">
        Settings for the case listing page. Adding and editing projects
        is in the Case Studies section of the menu.
      </div>
      <Accordion summary="Page header" open>
        <TextField label="Label" path="cases.label" />
        <TextField label="Title" path="cases.title" />
      </Accordion>
    </>
  );
}

/* ============ CLIENTES ============ */
export function ClientsTab() {
  return (
    <>
      <h2>Clients</h2>
      <div className="desc">
        A single place to manage your clients: the home grid and the logo
        carousel on the About page.
      </div>

      <Accordion summary="Clients list (logo carousel)" open>
        <div className="hint" style={{ marginBottom: 14 }}>
          This single list is shown as a logo carousel on the home, the
          Services page and About.
        </div>
        <div className="fld">
          <label>Carousel speed</label>
          <div className="rangewrap">
            <CarouselSpeedInput />
          </div>
          <div className="hint">
            Seconds per full loop. Lower = faster. (Pauses on hover.) All
            logos are shown at a uniform size.
          </div>
        </div>
        <SwitchField
          label="Paint logos white (uniform)"
          path="clients.whiteLogos"
        />
        <SwitchField
          label="Restore color on hover"
          path="clients.colorOnHover"
        />
        <div className="hint" style={{ marginBottom: 14 }}>
          "Paint white" unifies color, white or black logos to a white
          leaning gray. With "hover" on, the logo restores its color on
          hover. The light zoom on hover is always on.
        </div>
        <div className="ad-grouplabel">Clients</div>
        <ObjectListEditor
          path="clients.logos"
          factory={() => ({ name: "New client", img: "" })}
          labeler={(l) => (l as { name: string }).name || "Client"}
          addLabel="+ Add client"
          renderItem={(i) => (
            <>
              <TextField label="Name" path={`clients.logos.${i}.name`} />
              <ImageField
                label="Logo"
                path={`clients.logos.${i}.img`}
                hint="Transparent PNG/SVG recommended. If there's no logo, the name is shown."
              />
            </>
          )}
        />
      </Accordion>

      <Accordion summary="Clients block on the site (style)">
        <SwitchField label="Show section on the home" path="clients.enabled" />
        <div className="hint" style={{ marginBottom: 14 }}>
          Order and visibility within the home are set in Pages →
          Home → Section order.
        </div>
        <TextField label="Section title" path="clients.title" />
        <GradientField prefix="clients" />
        <OpacityField prefix="clients" />
      </Accordion>
    </>
  );
}

/** Slider numérico para la velocidad del carrusel. */
function CarouselSpeedInput() {
  const { content, update } = useContent();
  const v = content.carousel.speedSec;
  return (
    <>
      <input
        type="range"
        min={6}
        max={80}
        step={1}
        value={v}
        onChange={(e) =>
          update((d) => {
            d.carousel.speedSec = Number(e.target.value);
          })
        }
      />
      <span className="val">{v}s</span>
    </>
  );
}

/* ============ TEXTOS UI ============ */
export function TextsTab() {
  return (
    <>
      <h2>Site texts</h2>
      <div className="desc">
        Labels, buttons and repeated texts across the site (navigation,
        footer, forms and case study labels).
      </div>

      <Accordion summary="Navigation menu" open>
        <div className="row">
          <TextField label="Home" path="ui.nav.home" />
          <TextField label="About" path="ui.nav.about" />
        </div>
        <div className="row">
          <TextField label="Services" path="ui.nav.services" />
          <TextField label="Case Studies" path="ui.nav.cases" />
        </div>
        <TextField label="Contact" path="ui.nav.contact" />
      </Accordion>

      <Accordion summary="Repeated buttons">
        <TextField
          label="'All cases' (home featured)"
          path="ui.buttons.allCases"
        />
        <TextField
          label="'View services' (home services)"
          path="ui.buttons.viewServices"
        />
        <TextField
          label="'View cases' (clients block)"
          path="ui.buttons.viewCases"
        />
        <TextField
          label="Hero hover ('VIEW CASE')"
          path="ui.buttons.floatLearn"
        />
        <TextField
          label="'See our cases' (About page)"
          path="ui.buttons.aboutCases"
        />
      </Accordion>

      <Accordion summary="Footer">
        <div className="row">
          <TextField label="'Navigation' title" path="ui.footer.navTitle" />
          <TextField label="'Services' title" path="ui.footer.servicesTitle" />
        </div>
        <TextField label="Social title" path="ui.footer.socialTitle" />
        <div className="ad-grouplabel">Social networks (label + URL)</div>
        <ObjectListEditor
          path="ui.footer.social"
          factory={() => ({ label: "Red", url: "#" })}
          labeler={(s) => (s as { label: string }).label || "Red"}
          renderItem={(i) => (
            <div className="row">
              <TextField label="Name" path={`ui.footer.social.${i}.label`} />
              <TextField label="URL" path={`ui.footer.social.${i}.url`} />
            </div>
          )}
        />
        <div className="ad-grouplabel">CTA band & legal</div>
        <TextField label="CTA text" path="ui.footer.ctaText" />
        <TextField label="CTA button" path="ui.footer.ctaButton" />
        <TextField
          label="Copyright"
          path="ui.footer.copyright"
          hint="Use {name} for the brand name and {year} for the year."
        />
        <TextField label="Final note (right)" path="ui.footer.madeIn" />
      </Accordion>

      <Accordion summary="Other blocks">
        <TextField
          label="Side title (Services page)"
          path="ui.servicesPageTitle"
        />
        <div className="ad-grouplabel">'More questions' box (FAQ)</div>
        <TextField label="Title" path="ui.faqBox.title" />
        <TextField label="Text" path="ui.faqBox.body" area />
        <TextField label="Button" path="ui.faqBox.button" />
      </Accordion>

      <Accordion summary="Case Study labels">
        <TextField label="Back button" path="ui.caseStudy.back" />
        <div className="row">
          <TextField label="Spec category" path="ui.caseStudy.specCategory" />
          <TextField label="Spec duration" path="ui.caseStudy.specDuration" />
        </div>
        <div className="row">
          <TextField label="Spec year · place" path="ui.caseStudy.specMeta" />
          <TextField label="'Up next'" path="ui.caseStudy.upNext" />
        </div>
      </Accordion>

      <Accordion summary="Contact form">
        <TextField label="'Get in touch' title" path="ui.contactForm.getInTouch" />
        <TextField label="Service placeholder" path="ui.contactForm.service" />
        <div className="row">
          <TextField label="Name placeholder" path="ui.contactForm.name" />
          <TextField label="Phone placeholder" path="ui.contactForm.phone" />
        </div>
        <div className="row">
          <TextField label="Email placeholder" path="ui.contactForm.email" />
          <TextField label="Company placeholder" path="ui.contactForm.company" />
        </div>
        <TextField label="Message placeholder" path="ui.contactForm.message" />
        <TextField label="Send button" path="ui.contactForm.send" />
      </Accordion>
    </>
  );
}

/* ============ CONTACT ============ */
export function ContactTab() {
  return (
    <>
      <h2>Contact</h2>
      <div className="desc">
        Contact page. Email, phone, address and map are edited in Global.
      </div>
      <Accordion summary="Hero" open>
        <TextField label="Eyebrow" path="contactPage.hero.eyebrow" />
        <TextField label="Title" path="contactPage.hero.title" />
        <TextField label="Subtitle" path="contactPage.hero.sub" area />
        <GradientField prefix="contactPage.hero" />
        <OpacityField prefix="contactPage.hero" />
      </Accordion>
      <Accordion summary="Regions (toggle)">
        <ObjectListEditor
          path="contactPage.regions"
          factory={() => ({ name: "New region", flag: "" })}
          labeler={(r) => (r as { name: string }).name || "Region"}
          renderItem={(i) => (
            <div className="row">
              <TextField label="Name" path={`contactPage.regions.${i}.name`} />
              <TextField
                label="Flag / emoji"
                path={`contactPage.regions.${i}.flag`}
              />
            </div>
          )}
        />
      </Accordion>
      <Accordion summary="Form texts">
        <TextField label="Title (left)" path="contactPage.interestedTitle" />
        <TextField label="'Get in touch' subtext" path="contactPage.getInTouch" />
      </Accordion>
    </>
  );
}
