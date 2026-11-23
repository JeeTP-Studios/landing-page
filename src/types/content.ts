/* ============================================================
   JeeTP Studios: content model (shared types).
   This is the shape of the JSON the admin edits and the site reads.
   English is the canonical document. Spanish lives in `i18n.es` as a
   sparse overlay of translated strings (see src/content/i18n.ts).
   ============================================================ */

export interface Brand {
  name: string;
  /** Header and footer mark. Empty means the name is set as text instead. */
  logoImg: string;
}

/** Opening block. The headline is `lines`, one per row; `accent` is the
 *  substring rendered in the serif italic blue. */
export interface Hero {
  lines: string[];
  accent: string;
  sub: string;
  scrollLabel: string;
}

/** Pinned statements that fade in word by word while the 3D pieces lock. */
export interface ManifestoBlock {
  enabled: boolean;
  statements: string[];
}

/** Names of the three glass layers shown beside the assembled 3D stack. */
export interface StackBlock {
  labels: [string, string, string];
}

/** Metric of the about block (numeric value plus suffix, e.g. 120 + "K+"). */
export interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

export interface StatsBlock {
  enabled: boolean;
  items: StatItem[];
}

export interface AboutBlock {
  enabled: boolean;
  kicker: string;
  statement: string;
}

export interface SolutionItem {
  title: string;
  body: string;
  chips: string[];
}

export interface SolutionsBlock {
  enabled: boolean;
  label: string;
  items: SolutionItem[];
}

export interface WorkBlock {
  enabled: boolean;
  /** Full heading; `accent` is the substring set in serif italic blue. */
  title: string;
  accent: string;
  kicker: string;
}

export interface LogoItem {
  name: string;
  img: string;
}

export interface ClientsBlock {
  enabled: boolean;
  /** Accessible name of the logo band. */
  title: string;
  logos: LogoItem[];
}

export interface ProductItem {
  name: string;
  /** SVG marks are shown with the name beside them; raster logos are
   *  flat-white wordmarks and carry the name themselves. */
  logo: string;
  title: string;
  body: string;
  url: string;
  linkLabel: string;
}

export interface ProductsBlock {
  enabled: boolean;
  title: string;
  accent: string;
  intro: string;
  items: ProductItem[];
}

export interface ProcessStep {
  num: string;
  title: string;
  body: string;
}

export interface ProcessBlock {
  enabled: boolean;
  title: string;
  accent: string;
  steps: ProcessStep[];
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqBlock {
  enabled: boolean;
  title: string;
  accent: string;
  items: FaqItem[];
}

/** Giant closing statement and the footer information columns. */
export interface Closing {
  kicker: string;
  word: string;
  emailLabel: string;
  emailCopied: string;
  whatsappLabel: string;
  locationLabel: string;
  remoteLabel: string;
  remoteValue: string;
}

export interface Contact {
  email: string;
  whatsapp: string;
  phone: string;
  location: string;
  address: string;
  mapQuery: string;
}

/* ---------- Case studies: modular sections ---------- */

export type CaseSectionType =
  | "overview"
  | "process"
  | "challenge"
  | "methodology"
  | "gallery"
  | "conclusion"
  | "cta";

interface BaseSection {
  /** Stable id: React key, drag-and-drop and Spanish overlay address. */
  id: string;
  type: CaseSectionType;
  enabled: boolean;
}

export interface OverviewSection extends BaseSection {
  type: "overview";
  label: string;
  title: string;
  body: string;
  image: string;
}

export interface ProcessSection extends BaseSection {
  type: "process";
  title: string;
  /** [number, text] */
  steps: [string, string][];
}

export interface ChallengeSection extends BaseSection {
  type: "challenge";
  title: string;
  intro: string;
  problems: string[];
  approachTitle: string;
  approach: string[];
  images: string[];
}

export interface MethodologySection extends BaseSection {
  type: "methodology";
  title: string;
  items: { heading: string; body: string }[];
}

/** Gallery item: image, direct video (mp4) or YouTube video, told apart by URL. */
export interface GalleryMedia {
  type: "image" | "video";
  url: string;
  poster?: string;
}

export interface GallerySection extends BaseSection {
  type: "gallery";
  title: string;
  layout: "grid" | "masonry" | "wide";
  items: GalleryMedia[];
}

export interface ConclusionSection extends BaseSection {
  type: "conclusion";
  title: string;
  body: string;
  image: string;
}

export interface CtaSection extends BaseSection {
  type: "cta";
  text: string;
  buttonLabel: string;
}

export type CaseSection =
  | OverviewSection
  | ProcessSection
  | ChallengeSection
  | MethodologySection
  | GallerySection
  | ConclusionSection
  | CtaSection;

export interface Project {
  /** Stable id: route, React key and Spanish overlay address. */
  id: string;
  name: string;
  /** One short line shown beside the name in the home work list. */
  tagline: string;
  /** Short type of project, e.g. "Mobile game". */
  category: string;
  duration: string;
  year: string;
  location: string;
  /** Filters of the case index. */
  tags: string[];
  desc: string;
  heroImage: string;
  sections: CaseSection[];
}

/* ---------- Pages ---------- */

export interface PageHeroText {
  eyebrow: string;
  title: string;
  accent: string;
}

export interface AboutPage {
  hero: PageHeroText;
  /** Studio photography shown as an uneven three-up band. */
  gallery?: string[];
  intro: { heading: string; body: string };
  overview: { heading: string; body: string };
  beliefs: { heading: string; body: string };
}

export interface ServiceGroup {
  num: string;
  title: string;
  links: string[];
}

export interface WhoCard {
  title: string;
  img: string;
}

export interface ServicesPage {
  hero: PageHeroText;
  groups: ServiceGroup[];
  who: { enabled: boolean; heading: string; body: string; cards: WhoCard[] };
}

export interface CasesPage {
  label: string;
  title: string;
  accent: string;
}

export interface ContactPage {
  hero: PageHeroText & { sub: string };
  regions: { name: string; flag: string }[];
  interestedTitle: string;
  getInTouch: string;
}

/* ---------- Interface strings ---------- */

export interface SocialLink {
  label: string;
  url: string;
}

export interface UiStrings {
  nav: {
    home: string;
    about: string;
    services: string;
    cases: string;
    contact: string;
  };
  /** One label per intent, reused everywhere that intent appears. */
  buttons: {
    contact: string;
    work: string;
    allWork: string;
  };
  language: { label: string; switchTo: string };
  menu: { open: string; close: string };
  footer: {
    social: SocialLink[];
    /** Accepts {year} and {name}. */
    copyright: string;
  };
  faqBox: { title: string; body: string; button: string };
  caseStudy: {
    back: string;
    specCategory: string;
    specDuration: string;
    specMeta: string;
    upNext: string;
    problemsTitle: string;
    openImage: string;
    playVideo: string;
    close: string;
    video: string;
  };
  casesIndex: {
    filterLabel: string;
    emptyTitle: string;
    emptyBody: string;
  };
  contactForm: {
    sendWhatsapp: string;
    service: string;
    serviceNone: string;
    name: string;
    phone: string;
    email: string;
    company: string;
    message: string;
    messageHint: string;
    optional: string;
    send: string;
    addressLabel: string;
    emailLabel: string;
    phoneLabel: string;
    regionsLabel: string;
    errorName: string;
    errorEmailMissing: string;
    errorEmailInvalid: string;
    errorMessage: string;
    doneTitle: string;
    doneWhatsapp: string;
    doneEmail: string;
    writeAnother: string;
    mailSubject: string;
    mailSubjectFrom: string;
    notSpecified: string;
    bodyService: string;
    bodyName: string;
    bodyCompany: string;
    bodyEmail: string;
    bodyPhone: string;
    bodyProject: string;
  };
  loading: string;
  error: { title: string; back: string };
}

/** Home sections that can be reordered. The hero and the footer are fixed. */
export type HomeSectionKey =
  | "manifesto"
  | "about"
  | "solutions"
  | "work"
  | "clients"
  | "products"
  | "process"
  | "faq";

/** Sparse Spanish overlay: a deep-partial of translated strings, addressed by
 *  the same paths as the document. Lists are index-addressed, except
 *  `projects` and case `sections`, which are keyed by their stable `id`. */
export type Overlay = Record<string, unknown>;

/** Complete content document (= the published JSON). */
export interface SiteContent {
  brand: Brand;
  hero: Hero;
  manifesto: ManifestoBlock;
  stack: StackBlock;
  aboutBlock: AboutBlock;
  stats: StatsBlock;
  solutions: SolutionsBlock;
  projects: Project[];
  work: WorkBlock;
  clients: ClientsBlock;
  products: ProductsBlock;
  process: ProcessBlock;
  faq: FaqBlock;
  closing: Closing;
  contact: Contact;
  about: AboutPage;
  servicesPage: ServicesPage;
  cases: CasesPage;
  contactPage: ContactPage;
  ui: UiStrings;
  order: HomeSectionKey[];
  i18n: { es: Overlay };
}
