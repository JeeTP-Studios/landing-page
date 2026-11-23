import type { ReactNode } from "react";
import { Reveal } from "./Reveal";
import { renderAccent } from "./Accent";

/** Section opener: a big heading with its accent word, and an optional aside
 *  (kicker or short paragraph) on the right. */
export default function SectionHeading({
  title,
  accent,
  aside,
  asideClass = "kick",
}: {
  title: string;
  accent?: string;
  aside?: ReactNode;
  asideClass?: "kick" | "lede";
}) {
  return (
    <div className="sec-h">
      <Reveal as="h2" className="h2">
        {renderAccent(title, accent ?? "")}
      </Reveal>
      {aside ? <p className={asideClass}>{aside}</p> : null}
    </div>
  );
}
