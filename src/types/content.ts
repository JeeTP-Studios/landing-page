/* ============================================================
   JeeTP Studios — Modelo de contenido (tipos compartidos)
   Este es el shape del JSON que vive en S3 y que edita el admin.
   ============================================================ */

export interface Brand {
  name: string;
  tagline: string;
  logoType: "text" | "image";
  logoImg: string;
}

export interface BgMedia {
  type: "none" | "image" | "video";
  url: string;
}

/** Capa de degradado reutilizable en heros y bloques. */
export interface GradientLayer {
  gradA: string;
  gradB: string;
  angle: number;
  opacity: number;
}

export interface Hero extends GradientLayer {
  eyebrow: string;
  /** Fixed opening words of the headline, before the rotating phrase. */
  lead?: string;
  /** Supporting line under the headline. Keep it under 20 words. */
  sub?: string;
  /** Título base (compatibilidad / fallback). */
  title: string;
  /** Títulos que el hero escribe en bucle (efecto máquina de escribir).
   *  Si está vacío, se usa `title`. */
  titles?: string[];
  /** Chips decorativos del hero (etiquetas en diagonal/overlap). */
  chips?: string[];
  href: string;
}

/* ---------- Case studies: secciones modulares ---------- */

export type CaseSectionType =
  | "overview"
  | "process"
  | "challenge"
  | "methodology"
  | "gallery"
  | "conclusion"
  | "cta";

interface BaseSection {
  /** id estable para drag-and-drop y React keys */
  id: string;
  type: CaseSectionType;
  /** mostrar/ocultar desde el admin */
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
  /** [numero, texto] */
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

/** Item de galería: imagen, video directo (mp4) o video de YouTube.
 *  El tipo de video se autodetecta por la URL (YouTube vs archivo). */
export interface GalleryMedia {
  type: "image" | "video";
  url: string;
  /** miniatura/cartel opcional para videos */
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

/* ---------- Proyecto / case study ---------- */

/** Media de fondo de un proyecto en el hero del home (debajo de la capa de
 *  color). Permite imagen o video por proyecto. */
export interface ProjectBg {
  type: "none" | "image" | "video";
  url: string;
  /** cartel/poster opcional para el video */
  poster?: string;
}

/** Patrones decorativos disponibles para la capa de patrón de las cards. */
export type CardPattern =
  | "none"
  | "dots"
  | "grid"
  | "lines"
  | "cross"
  | "rings"
  | "waves";

export interface Project extends GradientLayer {
  id: string;
  name: string;
  ghost: string;
  mono: string;
  img: string;
  /** Fondo propio del panel del home (imagen/video bajo la capa de color). */
  bg?: ProjectBg;
  /** Patrón decorativo de la card (entre el color y la imagen). */
  pattern?: CardPattern;
  /** Opacidad de la capa de patrón (0–1). */
  patternOpacity?: number;
  /** Variante visual de la landing de detalle (distribución/estilo). */
  detailVariant?: "standard" | "editorial" | "bold";
  tags: string[];
  desc: string;
  accent: string;
  /** Meta de la landing (cabecera) */
  category: string;
  duration: string;
  year: string;
  location: string;
  /** Banner principal de la landing:
   *  "auto"   = degradado + monograma/imagen del proyecto (como el preview)
   *  "custom" = imagen subida a medida (heroImage) */
  heroMode: "auto" | "custom";
  heroImage: string;
  /** Secciones modulares editables y reordenables del case study */
  sections: CaseSection[];
}

/* ---------- Bloques del home / páginas ---------- */

export interface Highlighted extends GradientLayer {
  enabled: boolean;
  label: string;
  title: string;
}

export interface ServiceCard {
  h: string;
  a: string;
  b: string;
  color: string;
  /** Imagen/icono opcional (se muestra en el preview de servicios del home). */
  img?: string;
}

export interface ServicesBlock extends GradientLayer {
  enabled: boolean;
  label: string;
  title: string;
  items: ServiceCard[];
}

export interface ClientsBlock extends GradientLayer {
  enabled: boolean;
  title: string;
  /** Fuente única de clientes (nombre + logo). Se muestra como carrusel
   *  en el home, en la página de servicios y en Nosotros. */
  logos: LogoItem[];
  /** Pinta los logos en blanco/gris uniforme (para mezclar logos a color,
   *  blancos y negros). */
  whiteLogos?: boolean;
  /** Si está activo (con whiteLogos), al hacer hover el logo recupera su
   *  color original (interacción de color invertida). */
  colorOnHover?: boolean;
}

/** Métrica del stats band del home (valor numérico + sufijo, ej. 25 + "+"). */
export interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

export interface StatsBlock extends GradientLayer {
  enabled: boolean;
  label: string;
  title: string;
  items: StatItem[];
}

/** Paso del bloque de proceso ("how we work") del home. */
export interface ProcessStep {
  num: string;
  title: string;
  body: string;
}

export interface ProcessBlock extends GradientLayer {
  enabled: boolean;
  label: string;
  title: string;
  steps: ProcessStep[];
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqBlock extends GradientLayer {
  enabled: boolean;
  label: string;
  title: string;
  items: FaqItem[];
}

export interface Contact {
  email: string;
  whatsapp: string;
  phone: string;
  location: string;
  address: string;
  mapQuery: string;
}

export interface LogoItem {
  name: string;
  img: string;
}

export interface AboutPage {
  hero: GradientLayer & { eyebrow: string; title: string };
  /** Studio photography shown as an uneven three-up band. */
  gallery?: string[];
  intro: { heading: string; body: string };
  overview: { heading: string; body: string };
  beliefs: { heading: string; body: string };
  news: { enabled: boolean; title: string; logos: LogoItem[] };
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
  hero: GradientLayer & { eyebrow: string; title: string };
  groups: ServiceGroup[];
  who: { enabled: boolean; heading: string; body: string; cards: WhoCard[] };
  clientsTitle: string;
  news: { enabled: boolean };
}

export interface CasesPage {
  label: string;
  title: string;
}

export interface ContactPage {
  hero: GradientLayer & { eyebrow: string; title: string; sub: string };
  regions: { name: string; flag: string }[];
  interestedTitle: string;
  getInTouch: string;
}

/* ---------- Textos de interfaz (labels/botones editables) ---------- */

export interface SocialLink {
  label: string;
  url: string;
}

export interface UiStrings {
  /** Etiquetas del menú de navegación */
  nav: {
    home: string;
    about: string;
    services: string;
    cases: string;
    contact: string;
  };
  /**
   * One label per intent, reused everywhere that intent appears. Two different
   * words for the same action on one page is the fastest way to make a site
   * feel assembled rather than designed.
   */
  buttons: {
    /** Contact intent: header, hero, FAQ card, footer, case study CTA. */
    contact: string;
    /** Portfolio intent: hero, work rail, about. */
    work: string;
    /** Services intent. */
    services: string;
    /** Opens a single case study. */
    viewCase: string;
    /** Clears the case-index filter. */
    allWork: string;
  };
  /** Pie de página */
  footer: {
    navTitle: string;
    servicesTitle: string;
    socialTitle: string;
    social: SocialLink[];
    ctaText: string;
    ctaButton: string;
    copyright: string; // admite {year} y {name}
    madeIn: string;
  };
  /** Título lateral de la página de servicios */
  servicesPageTitle: string;
  /** Caja de "más preguntas" del FAQ */
  faqBox: {
    title: string;
    body: string;
    button: string;
  };
  /** Labels de la landing de case study */
  caseStudy: {
    back: string;
    specCategory: string;
    specDuration: string;
    specMeta: string;
    upNext: string;
  };
  /** Formulario de contacto */
  contactForm: {
    getInTouch: string;
    sendWhatsapp: string;
    service: string;
    name: string;
    phone: string;
    email: string;
    company: string;
    message: string;
    send: string;
  };
}

/** Llaves de las secciones reordenables del home. */
export type HomeSectionKey =
  | "highlighted"
  | "stats"
  | "services"
  | "process"
  | "clients"
  | "faq";

/** Documento de contenido completo (= JSON de S3). */
export interface SiteContent {
  brand: Brand;
  bg: BgMedia;
  hero: Hero;
  projects: Project[];
  highlighted: Highlighted;
  stats: StatsBlock;
  services: ServicesBlock;
  process: ProcessBlock;
  clients: ClientsBlock;
  faq: FaqBlock;
  contact: Contact;
  about: AboutPage;
  servicesPage: ServicesPage;
  cases: CasesPage;
  contactPage: ContactPage;
  ui: UiStrings;
  /** Ajustes globales de carruseles (p. ej. el de logos de clientes en About) */
  carousel: { speedSec: number };
  order: HomeSectionKey[];
}
