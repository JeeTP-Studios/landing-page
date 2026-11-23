import type { ReactNode } from "react";
import { Reveal } from "./Reveal";
import { renderAccent } from "./Accent";

/** Opener of an inner page: kicker, big headline with its accent word, and an
 *  optional lede and extra controls. Sits on the black stage like the home. */
export default function PageHero({
  eyebrow,
  title,
  accent,
  sub,
  children,
}: {
  eyebrow?: string;
  title: string;
  accent?: string;
  sub?: string;
  children?: ReactNode;
}) {
  return (
    <header className="ph g">
      {eyebrow ? <p className="kick">{eyebrow}</p> : null}
      <Reveal as="h1">{renderAccent(title, accent ?? "")}</Reveal>
      {sub ? <p className="lede">{sub}</p> : null}
      {children}
    </header>
  );
}
