import { useEffect, useRef, useState } from "react";
import { useSite } from "@/content/ContentContext";
import { frame, subscribe } from "@/lib/frame";
import { clamp, ease, lerp } from "@/lib/math";

/**
 * Horizontal solutions. The section is pinned while vertical scroll moves a
 * track of panes sideways; each pane comes to rest on the page gutter, so
 * nothing is ever cut at the edge. Under reduced motion the panes stack.
 */
export default function Solutions() {
  const { solutions } = useSite();
  const items = solutions.items;
  const n = items.length;
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLElement>(null);
  const panes = useRef<(HTMLElement | null)[]>([]);
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    const section = root.current;
    const tr = track.current;
    if (!section || !tr || frame.calm || !n) return;
    let offs: number[] = [0];
    let tx = 0;
    const els = () => panes.current.filter(Boolean) as HTMLElement[];
    // Each pane rests on the gutter: its distance from the first pane.
    const size = () => {
      const p = els();
      if (!p.length) return;
      offs = p.map((e) => e.offsetLeft - p[0].offsetLeft);
      section.style.height = `${window.innerHeight + (p.length - 1) * window.innerHeight * 0.85}px`;
    };
    size();
    window.addEventListener("resize", size);
    document.fonts?.ready.then(size);
    window.addEventListener("load", size);

    const unsub = subscribe((_, s) => {
      const p = els();
      if (p.length < 2) return;
      const sr = section.getBoundingClientRect();
      const sp = clamp(-sr.top / Math.max(1, sr.height - s.vh), 0, 1);
      const q = sp * (p.length - 1);
      const qi = Math.min(p.length - 2, Math.floor(q));
      const qf = ease(clamp((q - qi - 0.18) / 0.64, 0, 1));
      const gutter = p[0].offsetLeft;
      tx = lerp(tx, lerp(offs[qi], offs[qi + 1], qf), 0.14);
      tr.style.transform = `translate3d(${-tx}px,0,0)`;
      if (bar.current) bar.current.style.transform = `scaleX(${sp})`;
      if (sr.top < s.vh && sr.bottom > 0) {
        let best = 0;
        let bd = 1e9;
        p.forEach((pane, i) => {
          const d = pane.getBoundingClientRect().left - gutter;
          if (Math.abs(d) < bd) {
            bd = Math.abs(d);
            best = i;
          }
          // Titles lean and thin out as they leave the gutter.
          const f = clamp(d / s.vw, -1, 1);
          const h = pane.firstElementChild as HTMLElement;
          h.style.transform = `skewX(${(f * -10).toFixed(2)}deg) scaleX(${(1 + Math.max(0, f) * 0.22).toFixed(3)})`;
          h.style.opacity = (1 - Math.min(0.62, Math.max(0, Math.abs(f) - 0.12) * 1.1)).toFixed(2);
        });
        setCurrent(best + 1);
      }
    });
    return () => {
      unsub();
      window.removeEventListener("resize", size);
      window.removeEventListener("load", size);
      section.style.height = "";
    };
  }, [n]);

  if (!n) return null;
  return (
    <section className="sol" ref={root}>
      <div className="sol-p">
        <div className="sol-h g">
          <span>{solutions.label}</span>
          <b>
            {current} / {n}
          </b>
        </div>
        <div className="track" ref={track}>
          {items.map((it, i) => (
            <article className="pane" key={i} ref={(el) => (panes.current[i] = el)}>
              <h3>{it.title}</h3>
              <p>{it.body}</p>
              {it.chips.length ? (
                <ul>
                  {it.chips.map((c, k) => (
                    <li key={k}>{c}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
        <div className="g">
          <div className="bar">
            <i ref={bar} />
          </div>
        </div>
      </div>
    </section>
  );
}
