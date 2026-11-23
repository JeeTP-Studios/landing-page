import type { ReactNode } from "react";

/** Sets the `accent` substring of `text` in the serif italic blue. When the
 *  accent is empty or not found, the text renders plain. */
export function renderAccent(text: string, accent: string): ReactNode {
  if (!accent || !text.includes(accent)) return text;
  const i = text.indexOf(accent);
  return (
    <>
      {text.slice(0, i)}
      <em>{accent}</em>
      {text.slice(i + accent.length)}
    </>
  );
}
