import { useEffect, useRef } from "react";
import { useSite } from "@/content/ContentContext";
import { frame, subscribe } from "@/lib/frame";
import { clamp } from "@/lib/math";
import { Reveal } from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

/** Method steps. A blue line draws across each step as the list scrolls in. */
export default function Process() {
  const { process } = useSite();
  const list = useRef<HTMLOListElement>(null);
  const n = process.steps.length;

  useEffect(() => {
    const ol = list.current;
    if (!ol) return;
    const items = Array.from(ol.children) as HTMLElement[];
    const set = (f: number) =>
      items.forEach((li, i) => li.style.setProperty("--f", clamp(f - i, 0, 1).toFixed(3)));
    if (frame.calm) {
      set(n);
      return;
    }
    return subscribe((_, s) => {
      const r = ol.getBoundingClientRect();
      set(clamp((s.vh * 0.82 - r.top) / (s.vh * 0.5), 0, 1) * n);
    });
  }, [n]);

  if (!n) return null;
  return (
    <section className="how g">
      <SectionHeading title={process.title} accent={process.accent} />
      <ol className="steps" ref={list}>
        {process.steps.map((st, i) => (
          <Reveal as="li" key={i}>
            <b>{st.num}</b>
            <h3>{st.title}</h3>
            <p>{st.body}</p>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
