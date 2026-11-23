import { Group, Row, TextField } from "../fields";
import ObjectListEditor from "../ObjectListEditor";
import { clip, type PageDef } from "./types";

export const TEXTS_PAGE: PageDef = {
  key: "texts",
  label: "Texts",
  icon: "texts",
  route: "/",
  blurb:
    "Labels, buttons and repeated texts across the site: the menu, footer, forms and case-study labels.",
  sections: [
    {
      key: "nav",
      title: "Menu",
      about: "The navigation links and the language switch.",
      roots: ["ui.nav", "ui.language", "ui.menu"],
      summary: (c) => Object.values(c.ui.nav).join(" · "),
      Fields: () => (
        <>
          <Row>
            <TextField label="Home" path="ui.nav.home" />
            <TextField label="About" path="ui.nav.about" />
          </Row>
          <Row>
            <TextField label="Services" path="ui.nav.services" />
            <TextField label="Work" path="ui.nav.cases" />
          </Row>
          <TextField label="Contact" path="ui.nav.contact" />
          <Row>
            <TextField label="Language switch: label" path="ui.language.label" />
            <TextField label="Language switch: action" path="ui.language.switchTo" />
          </Row>
          <Row>
            <TextField label="Open menu (screen readers)" path="ui.menu.open" />
            <TextField label="Close menu (screen readers)" path="ui.menu.close" />
          </Row>
        </>
      ),
    },
    {
      key: "texts-buttons",
      title: "Repeated buttons",
      about: "Buttons that appear in several places.",
      roots: ["ui.buttons"],
      summary: (c) => Object.values(c.ui.buttons).join(" · "),
      Fields: () => (
        <>
          <TextField label="Contact (header, FAQ, case studies)" path="ui.buttons.contact" />
          <TextField label="See the work" path="ui.buttons.work" />
          <TextField label="All work (filter on the Work page)" path="ui.buttons.allWork" />
        </>
      ),
    },
    {
      key: "texts-footer",
      title: "Footer",
      about: "Copyright line and social links at the bottom of every page.",
      roots: ["ui.footer"],
      summary: (c) => clip(c.ui.footer.copyright),
      Fields: () => (
        <>
          <TextField
            label="Copyright"
            path="ui.footer.copyright"
            hint="Use {name} for the brand name and {year} for the year."
          />
          <Group title="Social links" hint="A link with no address, or “#”, is not shown.">
            <ObjectListEditor
              path="ui.footer.social"
              noun="link"
              factory={() => ({ label: "Network", url: "#" })}
              labeler={(s) => (s as { label: string }).label || "Network"}
              summary={(s) => (s as { url: string }).url}
              renderItem={(i) => (
                <Row>
                  <TextField label="Name" path={`ui.footer.social.${i}.label`} />
                  <TextField label="Address" path={`ui.footer.social.${i}.url`} shared />
                </Row>
              )}
            />
          </Group>
          <div className="hint">The giant closing words are in Home, Closing and footer.</div>
        </>
      ),
    },
    {
      key: "texts-faqbox",
      title: "“More questions” box",
      about: "The box under the FAQ.",
      roots: ["ui.faqBox"],
      summary: (c) => clip(c.ui.faqBox.title),
      Fields: () => (
        <>
          <TextField label="Title" path="ui.faqBox.title" />
          <TextField label="Text" path="ui.faqBox.body" area />
          <TextField label="Button" path="ui.faqBox.button" />
        </>
      ),
    },
    {
      key: "texts-casestudy",
      title: "Case-study labels",
      about: "Small labels on every case-study page.",
      roots: ["ui.caseStudy"],
      summary: (c) => clip(c.ui.caseStudy.back),
      Fields: () => (
        <>
          <TextField label="Back link" path="ui.caseStudy.back" />
          <Row>
            <TextField label="Fact: type" path="ui.caseStudy.specCategory" />
            <TextField label="Fact: duration" path="ui.caseStudy.specDuration" />
          </Row>
          <Row>
            <TextField label="Fact: year and place" path="ui.caseStudy.specMeta" />
            <TextField label="Next case" path="ui.caseStudy.upNext" />
          </Row>
          <TextField label="Challenge: “what was in the way”" path="ui.caseStudy.problemsTitle" />
          <Row>
            <TextField label="Open image (screen readers)" path="ui.caseStudy.openImage" />
            <TextField label="Play video (screen readers)" path="ui.caseStudy.playVideo" />
          </Row>
          <Row>
            <TextField label="Close (screen readers)" path="ui.caseStudy.close" />
            <TextField label="Video placeholder" path="ui.caseStudy.video" />
          </Row>
        </>
      ),
    },
    {
      key: "texts-casesindex",
      title: "Work page filters",
      about: "Texts of the filter row and the empty state on the Work page.",
      roots: ["ui.casesIndex"],
      summary: (c) => clip(c.ui.casesIndex.emptyTitle),
      Fields: () => (
        <>
          <TextField label="Filter group (screen readers)" path="ui.casesIndex.filterLabel" />
          <TextField label="Empty state: title" path="ui.casesIndex.emptyTitle" />
          <TextField label="Empty state: text" path="ui.casesIndex.emptyBody" area />
        </>
      ),
    },
    {
      key: "texts-form",
      title: "Contact form",
      about: "Every label, error and message of the contact form.",
      roots: ["ui.contactForm"],
      summary: (c) => clip(`${c.ui.contactForm.name}, ${c.ui.contactForm.email}, ${c.ui.contactForm.message}`),
      Fields: () => (
        <>
          <Group title="Fields">
            <TextField label="Service" path="ui.contactForm.service" />
            <TextField label="Service: no choice" path="ui.contactForm.serviceNone" />
            <Row>
              <TextField label="Name" path="ui.contactForm.name" />
              <TextField label="Company" path="ui.contactForm.company" />
            </Row>
            <Row>
              <TextField label="Email" path="ui.contactForm.email" />
              <TextField label="Phone" path="ui.contactForm.phone" />
            </Row>
            <TextField label="Message" path="ui.contactForm.message" />
            <TextField label="Message hint" path="ui.contactForm.messageHint" />
            <TextField label="“Optional”" path="ui.contactForm.optional" />
            <Row>
              <TextField label="WhatsApp button" path="ui.contactForm.sendWhatsapp" />
              <TextField label="Email button" path="ui.contactForm.send" />
            </Row>
          </Group>
          <Group title="Errors">
            <TextField label="Missing name" path="ui.contactForm.errorName" />
            <TextField label="Missing email" path="ui.contactForm.errorEmailMissing" />
            <TextField label="Invalid email" path="ui.contactForm.errorEmailInvalid" />
            <TextField label="Message too short" path="ui.contactForm.errorMessage" />
          </Group>
          <Group title="After sending">
            <TextField label="Title" path="ui.contactForm.doneTitle" />
            <TextField label="WhatsApp text" path="ui.contactForm.doneWhatsapp" area />
            <TextField label="Email text" path="ui.contactForm.doneEmail" area />
            <TextField label="Write another" path="ui.contactForm.writeAnother" />
          </Group>
          <Group title="The message we receive">
            <TextField label="Subject" path="ui.contactForm.mailSubject" />
            <TextField
              label="Subject with company"
              path="ui.contactForm.mailSubjectFrom"
              hint="Use {company} for the company name."
            />
            <TextField label="Not specified" path="ui.contactForm.notSpecified" />
            <Row>
              <TextField label="Service" path="ui.contactForm.bodyService" />
              <TextField label="Name" path="ui.contactForm.bodyName" />
            </Row>
            <Row>
              <TextField label="Company" path="ui.contactForm.bodyCompany" />
              <TextField label="Email" path="ui.contactForm.bodyEmail" />
            </Row>
            <Row>
              <TextField label="Phone" path="ui.contactForm.bodyPhone" />
              <TextField label="Project" path="ui.contactForm.bodyProject" />
            </Row>
          </Group>
          <Group title="Contact details labels">
            <Row>
              <TextField label="Address label" path="ui.contactForm.addressLabel" />
              <TextField label="Email label" path="ui.contactForm.emailLabel" />
            </Row>
            <TextField label="Phone label" path="ui.contactForm.phoneLabel" />
            <TextField label="Regions (screen readers)" path="ui.contactForm.regionsLabel" />
          </Group>
        </>
      ),
    },
    {
      key: "texts-system",
      title: "Loading and error screens",
      about: "What visitors see while the site loads or when something breaks.",
      roots: ["ui.loading", "ui.error"],
      summary: (c) => clip(`${c.ui.loading} · ${c.ui.error.title}`),
      Fields: () => (
        <>
          <TextField label="Loading" path="ui.loading" />
          <TextField label="Error: title" path="ui.error.title" />
          <TextField label="Error: back link" path="ui.error.back" />
        </>
      ),
    },
  ],
};
