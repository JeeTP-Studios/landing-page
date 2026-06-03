import type { CaseSection, CaseSectionType } from "@/types/content";

let _n = 0;
const uid = (t: string) => `${t}-${Date.now().toString(36)}-${(++_n).toString(36)}`;

/** Etiquetas legibles para el admin. */
export const SECTION_LABELS: Record<CaseSectionType, string> = {
  overview: "Overview",
  process: "Proceso",
  challenge: "Reto / Problema",
  methodology: "Metodología",
  gallery: "Galería de imágenes",
  conclusion: "Conclusión",
  cta: "Llamado a la acción",
};

/** Fábricas para crear secciones nuevas desde el admin. */
export const SECTION_FACTORIES: Record<CaseSectionType, () => CaseSection> = {
  overview: () => ({
    id: uid("overview"),
    type: "overview",
    enabled: true,
    label: "Overview",
    title: "All about el proyecto",
    body: "Describe de qué se trata el proyecto.",
    image: "",
  }),
  process: () => ({
    id: uid("process"),
    type: "process",
    enabled: true,
    title: "Project process",
    steps: [
      ["01", "Research"],
      ["02", "Diseño"],
      ["03", "Desarrollo"],
      ["04", "Lanzamiento"],
    ],
  }),
  challenge: () => ({
    id: uid("challenge"),
    type: "challenge",
    enabled: true,
    title: "Challenge / Problem statement",
    intro: "Cuál era el reto o problema a resolver.",
    problems: ["Problema 1", "Problema 2"],
    approachTitle: "Solución",
    approach: ["Cómo lo abordamos 1", "Cómo lo abordamos 2"],
    images: [],
  }),
  methodology: () => ({
    id: uid("methodology"),
    type: "methodology",
    enabled: true,
    title: "Metodología",
    items: [{ heading: "Etapa", body: "Descripción de la etapa." }],
  }),
  gallery: () => ({
    id: uid("gallery"),
    type: "gallery",
    enabled: true,
    title: "UI Design",
    layout: "grid",
    items: [],
  }),
  conclusion: () => ({
    id: uid("conclusion"),
    type: "conclusion",
    enabled: true,
    title: "Conclusion",
    body: "El resultado final y el impacto.",
    image: "",
  }),
  cta: () => ({
    id: uid("cta"),
    type: "cta",
    enabled: true,
    text: "Quieres algo asi para tu marca?",
    buttonLabel: "Trabaja con nosotros",
  }),
};

export function createSection(type: CaseSectionType): CaseSection {
  return SECTION_FACTORIES[type]();
}

export const SECTION_TYPES: CaseSectionType[] = [
  "overview",
  "process",
  "challenge",
  "methodology",
  "gallery",
  "conclusion",
  "cta",
];
