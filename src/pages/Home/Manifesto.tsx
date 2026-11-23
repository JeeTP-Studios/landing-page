import { Fragment, useEffect, useRef, useState, type CSSProperties } from "react";
import { useSite } from "@/content/ContentContext";
import { frame, subscribe } from "@/lib/frame";
import { clamp } from "@/lib/math";
import { stageRef } from "@/components/stage/stageStore";

/**
 * Pinned statements. As the section scrolls, one statement at a time lights up
 * word by word out of a blur while the 3D pieces lock together behind it.
 * Under reduced motion the section is a plain stack of readable statements.
 */
export default function Manifesto() {
  const { manifesto } = useSite();
  const n = manifesto.statements.length;
  const root = useRef<HTMLElement | null>(null);
  const [idx, setIdx] = useState(-2);

  useEffect(() => {
    if (frame.calm || !n) return;
    return subscribe((_, s) => {
      const r = root.current?.getBoundingClientRect();
      if (!r) return;
      const p = clamp(-r.top / Math.max(1, r.height - s.vh), 0, 1);
      setIdx(r.top > s.vh * 0.35 ? -1 : Math.min(n - 1, Math.floor(p * n)));
    });
  }, [n]);

  if (!n) return null;
  return (
    <section
      className="mani"
      style={{ ["--n" as string]: n } as CSSProperties}
      ref={(el) => {
        root.current = el;
        stageRef("mani")(el);
      }}
    >
      <div className="mani-p g">
        <div className="says">
          {manifesto.statements.map((text, k) => (
            <p
              className={`say ${k === idx ? "on" : ""} ${k < idx ? "out" : ""}`}
              aria-label={text}
              key={k}
            >
              <span className="sw" aria-hidden="true">
                {text.split(" ").map((w, i) => (
                  <Fragment key={i}>
                    <span style={{ ["--i" as string]: i } as CSSProperties}>{w}</span>{" "}
                  </Fragment>
                ))}
              </span>
            </p>
          ))}
        </div>
        <div className="dots" aria-hidden="true">
          {manifesto.statements.map((_, k) => (
            <i key={k} className={k === idx ? "on" : ""} />
          ))}
        </div>
      </div>
    </section>
  );
}
