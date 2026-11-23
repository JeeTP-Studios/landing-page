import { Accordion, ImageField, ListField, SwitchField, TextField } from "./fields";
import ObjectListEditor from "./ObjectListEditor";

/* ============ GLOBAL ============ */
export function GlobalTab() {
  return (
    <>
      <h2>Global</h2>
      <div className="desc">Brand and contact info. Applied across the site.</div>
      <Accordion summary="Brand & logo" open>
        <TextField label="Name" path="brand.name" shared />
        <ImageField
          label="Logo image (PNG, white on transparent)"
          path="brand.logoImg"
          hint="Shown in the header. Leave empty to set the name as text."
        />
      </Accordion>
      <Accordion summary="Contact info">
        <TextField label="Email" path="contact.email" shared />
        <TextField label="WhatsApp" path="contact.whatsapp" shared />
        <TextField label="Phone" path="contact.phone" shared />
        <TextField label="Location (footer)" path="contact.location" />
        <TextField label="Address (contact page)" path="contact.address" />
        <TextField
          label="Map location"
          path="contact.mapQuery"
          shared
          hint="e.g. Mexico City or an address."
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
        <TextField
          label="Accent"
          path="about.hero.accent"
          hint="The part of the title set in blue serif italic. It must appear in the title."
        />
      </Accordion>
      <Accordion summary="Who we are">
        <TextField label="Heading" path="about.intro.heading" />
        <TextField label="Text (one line break = new paragraph)" path="about.intro.body" area />
      </Accordion>
      <Accordion summary="What we have built">
        <TextField label="Heading" path="about.overview.heading" />
        <TextField label="Text" path="about.overview.body" area />
      </Accordion>
      <Accordion summary="What we believe">
        <TextField label="Heading" path="about.beliefs.heading" />
        <TextField label="Text" path="about.beliefs.body" area />
      </Accordion>
      <Accordion summary="Studio photos">
        <ObjectListEditor
          path="about.gallery"
          factory={() => ""}
          labeler={(_, i) => `Photo ${i + 1}`}
          addLabel="+ Add photo"
          renderItem={(i) => <ImageField label="Image" path={`about.gallery.${i}`} />}
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
      <div className="desc">
        Services page. The solutions listed at the top are edited in Home, Solutions.
      </div>
      <Accordion summary="Hero" open>
        <TextField label="Eyebrow" path="servicesPage.hero.eyebrow" />
        <TextField label="Title" path="servicesPage.hero.title" area />
        <TextField label="Accent" path="servicesPage.hero.accent" />
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
              <ImageField label="Image" path={`servicesPage.who.cards.${i}.img`} />
            </>
          )}
        />
      </Accordion>
    </>
  );
}

/* ============ CASE STUDIES (index page) ============ */
export function CasesPageTab() {
  return (
    <>
      <h2>Case Studies · Page</h2>
      <div className="desc">
        Header of the case index page. Adding and editing projects is in the Projects tab.
      </div>
      <Accordion summary="Page header" open>
        <TextField label="Label" path="cases.label" />
        <TextField label="Title" path="cases.title" />
        <TextField label="Accent" path="cases.accent" />
      </Accordion>
    </>
  );
}

/* ============ CLIENTS ============ */
export function ClientsTab() {
  return (
    <>
      <h2>Clients</h2>
      <div className="desc">
        One list of client logos, shown as the moving band on the home, About and Services pages.
        Logos are painted white automatically.
      </div>
      <Accordion summary="Clients list" open>
        <SwitchField label="Show band on the home" path="clients.enabled" />
        <TextField
          label="Accessible name of the band"
          path="clients.title"
          hint="Read by screen readers; not shown on screen."
        />
        <ObjectListEditor
          path="clients.logos"
          factory={() => ({ name: "New client", img: "" })}
          labeler={(l) => (l as { name: string }).name || "Client"}
          addLabel="+ Add client"
          renderItem={(i) => (
            <>
              <TextField label="Name" path={`clients.logos.${i}.name`} shared />
              <ImageField
                label="Logo"
                path={`clients.logos.${i}.img`}
                hint="Transparent PNG or SVG. Without a logo the name is shown."
              />
            </>
          )}
        />
      </Accordion>
    </>
  );
}

/* ============ SITE TEXTS ============ */
export function TextsTab() {
  return (
    <>
      <h2>Site texts</h2>
      <div className="desc">
        Labels, buttons and repeated texts across the site: navigation, footer, forms and case
        study labels.
      </div>

      <Accordion summary="Navigation menu" open>
        <div className="row">
          <TextField label="Home" path="ui.nav.home" />
          <TextField label="About" path="ui.nav.about" />
        </div>
        <div className="row">
          <TextField label="Services" path="ui.nav.services" />
          <TextField label="Work" path="ui.nav.cases" />
        </div>
        <TextField label="Contact" path="ui.nav.contact" />
        <div className="row">
          <TextField label="Language switch label" path="ui.language.label" />
          <TextField label="Language switch action" path="ui.language.switchTo" />
        </div>
        <div className="row">
          <TextField label="Open menu (accessible)" path="ui.menu.open" />
          <TextField label="Close menu (accessible)" path="ui.menu.close" />
        </div>
      </Accordion>

      <Accordion summary="Repeated buttons">
        <TextField label="Contact (header, FAQ, case)" path="ui.buttons.contact" />
        <TextField label="See the work" path="ui.buttons.work" />
        <TextField label="All work (case filter)" path="ui.buttons.allWork" />
      </Accordion>

      <Accordion summary="Footer">
        <TextField
          label="Copyright"
          path="ui.footer.copyright"
          hint="Use {name} for the brand name and {year} for the year."
        />
        <div className="ad-grouplabel">Social networks (label + URL)</div>
        <ObjectListEditor
          path="ui.footer.social"
          factory={() => ({ label: "Network", url: "#" })}
          labeler={(s) => (s as { label: string }).label || "Network"}
          renderItem={(i) => (
            <div className="row">
              <TextField label="Name" path={`ui.footer.social.${i}.label`} />
              <TextField label="URL" path={`ui.footer.social.${i}.url`} shared />
            </div>
          )}
        />
        <div className="hint">The giant closing text and the columns are edited in Home, Closing.</div>
      </Accordion>

      <Accordion summary="FAQ 'more questions' box">
        <TextField label="Title" path="ui.faqBox.title" />
        <TextField label="Text" path="ui.faqBox.body" area />
        <TextField label="Button" path="ui.faqBox.button" />
      </Accordion>

      <Accordion summary="Case study labels">
        <TextField label="Back link" path="ui.caseStudy.back" />
        <div className="row">
          <TextField label="Spec: type" path="ui.caseStudy.specCategory" />
          <TextField label="Spec: duration" path="ui.caseStudy.specDuration" />
        </div>
        <div className="row">
          <TextField label="Spec: year and place" path="ui.caseStudy.specMeta" />
          <TextField label="Next case" path="ui.caseStudy.upNext" />
        </div>
        <TextField label="Challenge: 'what was in the way'" path="ui.caseStudy.problemsTitle" />
        <div className="row">
          <TextField label="Open image (accessible)" path="ui.caseStudy.openImage" />
          <TextField label="Play video (accessible)" path="ui.caseStudy.playVideo" />
        </div>
        <div className="row">
          <TextField label="Close (accessible)" path="ui.caseStudy.close" />
          <TextField label="Video placeholder" path="ui.caseStudy.video" />
        </div>
      </Accordion>

      <Accordion summary="Case index">
        <TextField label="Filter group (accessible)" path="ui.casesIndex.filterLabel" />
        <TextField label="Empty state title" path="ui.casesIndex.emptyTitle" />
        <TextField label="Empty state text" path="ui.casesIndex.emptyBody" area />
      </Accordion>

      <Accordion summary="Contact form">
        <TextField label="Service label" path="ui.contactForm.service" />
        <TextField label="Service: no choice" path="ui.contactForm.serviceNone" />
        <div className="row">
          <TextField label="Name" path="ui.contactForm.name" />
          <TextField label="Company" path="ui.contactForm.company" />
        </div>
        <div className="row">
          <TextField label="Email" path="ui.contactForm.email" />
          <TextField label="Phone" path="ui.contactForm.phone" />
        </div>
        <TextField label="Message" path="ui.contactForm.message" />
        <TextField label="Message hint" path="ui.contactForm.messageHint" />
        <TextField label="'Optional'" path="ui.contactForm.optional" />
        <div className="row">
          <TextField label="WhatsApp button" path="ui.contactForm.sendWhatsapp" />
          <TextField label="Email button" path="ui.contactForm.send" />
        </div>
        <div className="ad-grouplabel">Errors</div>
        <TextField label="Missing name" path="ui.contactForm.errorName" />
        <TextField label="Missing email" path="ui.contactForm.errorEmailMissing" />
        <TextField label="Invalid email" path="ui.contactForm.errorEmailInvalid" />
        <TextField label="Short message" path="ui.contactForm.errorMessage" />
        <div className="ad-grouplabel">After sending</div>
        <TextField label="Title" path="ui.contactForm.doneTitle" />
        <TextField label="WhatsApp text" path="ui.contactForm.doneWhatsapp" area />
        <TextField label="Email text" path="ui.contactForm.doneEmail" area />
        <TextField label="Write another" path="ui.contactForm.writeAnother" />
        <div className="ad-grouplabel">Message we receive</div>
        <TextField label="Subject" path="ui.contactForm.mailSubject" />
        <TextField
          label="Subject with company"
          path="ui.contactForm.mailSubjectFrom"
          hint="Use {company} for the company name."
        />
        <TextField label="Not specified" path="ui.contactForm.notSpecified" />
        <div className="row">
          <TextField label="Service" path="ui.contactForm.bodyService" />
          <TextField label="Name" path="ui.contactForm.bodyName" />
        </div>
        <div className="row">
          <TextField label="Company" path="ui.contactForm.bodyCompany" />
          <TextField label="Email" path="ui.contactForm.bodyEmail" />
        </div>
        <div className="row">
          <TextField label="Phone" path="ui.contactForm.bodyPhone" />
          <TextField label="Project" path="ui.contactForm.bodyProject" />
        </div>
      </Accordion>

      <Accordion summary="Loading and error screens">
        <TextField label="Loading" path="ui.loading" />
        <TextField label="Error title" path="ui.error.title" />
        <TextField label="Error: back link" path="ui.error.back" />
      </Accordion>

      <Accordion summary="Contact addresses">
        <div className="row">
          <TextField label="Address label" path="ui.contactForm.addressLabel" />
          <TextField label="Email label" path="ui.contactForm.emailLabel" />
        </div>
        <TextField label="Phone label" path="ui.contactForm.phoneLabel" />
        <TextField label="Regions (accessible)" path="ui.contactForm.regionsLabel" />
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
        <TextField label="Accent" path="contactPage.hero.accent" />
        <TextField label="Subtitle" path="contactPage.hero.sub" area />
      </Accordion>
      <Accordion summary="Regions (toggle)">
        <ObjectListEditor
          path="contactPage.regions"
          factory={() => ({ name: "New region", flag: "" })}
          labeler={(r) => (r as { name: string }).name || "Region"}
          renderItem={(i) => (
            <div className="row">
              <TextField label="Name" path={`contactPage.regions.${i}.name`} />
              <TextField label="Flag / emoji" path={`contactPage.regions.${i}.flag`} shared />
            </div>
          )}
        />
      </Accordion>
      <Accordion summary="Form texts">
        <TextField label="Title (left)" path="contactPage.interestedTitle" />
        <TextField label="Subtext" path="contactPage.getInTouch" />
      </Accordion>
    </>
  );
}

