import type { HomeSectionKey, SiteContent } from "@/types/content";

/** Document block that holds the `enabled` switch of each home section. */
export const HOME_BLOCK: Record<
  HomeSectionKey,
  "manifesto" | "aboutBlock" | "solutions" | "work" | "clients" | "products" | "process" | "faq"
> = {
  manifesto: "manifesto",
  about: "aboutBlock",
  solutions: "solutions",
  work: "work",
  clients: "clients",
  products: "products",
  process: "process",
  faq: "faq",
};

export const isHomeSectionEnabled = (c: SiteContent, k: HomeSectionKey) =>
  c[HOME_BLOCK[k]].enabled;
