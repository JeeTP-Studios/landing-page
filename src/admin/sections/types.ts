import type { ComponentType } from "react";
import type { SiteContent } from "@/types/content";
import type { IconName } from "../icons";

/** One editable block of a page. `key` is the `data-edit` key of the block on
 *  the public site, which is how the preview and the editor find each other. */
export interface SectionDef {
  key: string;
  title: string;
  /** One line on what the block is, shown above its fields. */
  about: string;
  /** Document paths this block owns: they feed its translation count. */
  roots: string[];
  /** One line of what it currently says, from the document in the editing language. */
  summary: (c: SiteContent) => string;
  /** Boolean document path behind the eye toggle. */
  enabledPath?: string;
  /** A fixed anchor: shown, never reordered or hidden. */
  locked?: boolean;
  /** The block this scrolls to in the preview, when it is not its own key. */
  previewKey?: string;
  /** Other `data-edit` keys that open this section. */
  aliases?: string[];
  /** The fields. Omitted for a pointer. */
  Fields?: ComponentType;
  /** Edited elsewhere: the card says where and offers a way there. */
  pointer?: { page: string; section?: string; label: string };
}

export interface PageDef {
  key: string;
  label: string;
  icon: IconName;
  /** Where the preview goes for this page. */
  route: string;
  blurb: string;
  sections: SectionDef[];
  /** Home only: sections listed here stay fixed at the top / bottom. The rest
   *  follow the document's `order`, which can be changed. */
  fixed?: { head: string[]; tail: string[] };
}

/** Cuts a text to a one-line summary. */
export const clip = (s: string, n = 90) => {
  const t = (s || "").replace(/\s+/g, " ").trim();
  return t.length > n ? `${t.slice(0, n - 1)}…` : t;
};

export const count = (n: number, one: string, many = `${one}s`) =>
  `${n} ${n === 1 ? one : many}`;
