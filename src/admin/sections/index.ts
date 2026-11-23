import type { SiteContent } from "@/types/content";
import { ABOUT_PAGE, CLIENTS_PAGE, CONTACT_PAGE, GLOBAL_PAGE, SERVICES_PAGE, WORK_PAGE } from "./pages";
import { HOME_PAGE } from "./home";
import { TEXTS_PAGE } from "./texts";
import type { IconName } from "../icons";
import type { PageDef } from "./types";

export type { PageDef, SectionDef } from "./types";

/** The pages built from sections, in the order of the rail. */
export const SECTION_PAGES: PageDef[] = [
  HOME_PAGE,
  ABOUT_PAGE,
  SERVICES_PAGE,
  WORK_PAGE,
  CONTACT_PAGE,
];
export const OTHER_PAGES: PageDef[] = [CLIENTS_PAGE, GLOBAL_PAGE, TEXTS_PAGE];

/** Pages that are not built from sections. */
export const PROJECTS_PAGE = {
  key: "projects",
  label: "Projects",
  icon: "projects" as IconName,
  route: "/case-studies",
};

export const ALL_PAGES: PageDef[] = [...SECTION_PAGES, ...OTHER_PAGES];

export const pageByKey = (key: string) => ALL_PAGES.find((p) => p.key === key);

/** Where an editor block lives. A pointer is never the home of a block. */
export function locate(
  key: string,
  doc: SiteContent
): { page: string; project?: string; open: string } | null {
  if (key.startsWith("project:")) return { page: "projects", project: key.slice(8), open: key };
  if (key.startsWith("section:")) {
    const id = key.slice(8);
    const p = doc.projects.find((x) => x.sections.some((s) => s.id === id));
    return p ? { page: "projects", project: p.id, open: key } : null;
  }
  for (const page of ALL_PAGES) {
    const s = page.sections.find((x) => !x.pointer && (x.key === key || x.aliases?.includes(key)));
    if (s) return { page: page.key, open: s.key };
  }
  return null;
}

/** The block of the public site that scrolls into view when this one opens. */
export function previewKeyFor(key: string): string {
  if (key.startsWith("project:") || key.startsWith("section:")) return key;
  for (const page of ALL_PAGES) {
    const s = page.sections.find((x) => !x.pointer && x.key === key);
    if (s) return s.previewKey ?? s.key;
  }
  return key;
}

/** Where the preview goes for a page of the editor. */
export const routeOfPage = (key: string): string =>
  key === PROJECTS_PAGE.key ? PROJECTS_PAGE.route : (pageByKey(key)?.route ?? "/");
