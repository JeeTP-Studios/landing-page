import { createContext, useContext } from "react";

/** The editor's search box, as seen by the fields of an open section. A field
 *  hides when a search is active, its section did not match by name, and the
 *  field matches neither by label nor by content. */
export interface FieldSearch {
  query: string;
  sectionHit: boolean;
}

export const FieldSearchContext = createContext<FieldSearch>({ query: "", sectionHit: true });

export const useFieldSearch = () => useContext(FieldSearchContext);

/** Every string inside a value, lowercased, for matching content. */
export function textOf(v: unknown): string {
  if (typeof v === "string") return v.toLowerCase();
  if (Array.isArray(v)) return v.map(textOf).join(" ");
  if (v && typeof v === "object") return Object.values(v).map(textOf).join(" ");
  return "";
}
