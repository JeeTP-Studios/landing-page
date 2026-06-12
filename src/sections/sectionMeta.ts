import type { CaseSection, CaseSectionType } from "@/types/content";

let _n = 0;
const uid = (t: string) => `${t}-${Date.now().toString(36)}-${(++_n).toString(36)}`;

/** Etiquetas legibles para el admin. */
export const SECTION_LABELS: Record<CaseSectionType, string> = {
  overview: "Overview",
  process: "Process",
  challenge: "Challenge / Problem",
  methodology: "Methodology",
  gallery: "Image gallery",
  conclusion: "Conclusion",
  cta: "Call to action",
};

/** Fábricas para crear secciones nuevas desde el admin. */
export const SECTION_FACTORIES: Record<CaseSectionType, () => CaseSection> = {
  overview: () => ({
    id: uid("overview"),
    type: "overview",
    enabled: true,
    label: "Overview",
    title: "All about the project",
    body: "Describe what the project is about.",
    image: "",
  }),
  process: () => ({
    id: uid("process"),
    type: "process",
    enabled: true,
    title: "Project process",
    steps: [
      ["01", "Research"],
      ["02", "Design"],
      ["03", "Development"],
      ["04", "Launch"],
    ],
  }),
  challenge: () => ({
    id: uid("challenge"),
    type: "challenge",
    enabled: true,
    title: "Challenge / Problem statement",
    intro: "What was the challenge or problem to solve.",
    problems: ["Problem 1", "Problem 2"],
    approachTitle: "Solution",
    approach: ["How we approached it 1", "How we approached it 2"],
    images: [],
  }),
  methodology: () => ({
    id: uid("methodology"),
    type: "methodology",
    enabled: true,
    title: "Methodology",
    items: [{ heading: "Stage", body: "Stage description." }],
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
    body: "The final result and impact.",
    image: "",
  }),
  cta: () => ({
    id: uid("cta"),
    type: "cta",
    enabled: true,
    text: "Want something like this for your brand?",
    buttonLabel: "Work with us",
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
