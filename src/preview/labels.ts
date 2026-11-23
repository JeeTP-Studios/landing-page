/** Names of the editable blocks of the public site (the `data-edit` keys).
 *  Shown on the hover outline in the preview and in the editor. */
const LABELS: Record<string, string> = {
  nav: "Menu",
  brand: "Logo and name",
  hero: "Hero",
  manifesto: "Manifesto",
  about: "About and figures",
  solutions: "Solutions",
  work: "Work list",
  clients: "Client logos",
  products: "Own products",
  process: "Method steps",
  faq: "FAQ",
  closing: "Closing and footer",
  "about-hero": "About: header",
  "about-intro": "Who we are",
  "about-gallery": "Studio photos",
  "about-overview": "What we have built",
  "about-beliefs": "What we believe",
  "services-hero": "Services: header",
  "services-solutions": "Solutions list",
  "services-groups": "Service groups",
  "services-who": "Who we help",
  "cases-hero": "Work: header",
  "contact-hero": "Contact: header",
  "contact-info": "Contact details",
  "contact-form": "Contact form texts",
};

export function editLabel(key: string): string {
  if (key.startsWith("project:")) return "Project";
  if (key.startsWith("section:")) return "Case study section";
  return LABELS[key] ?? key;
}
