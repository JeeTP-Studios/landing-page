import { useEffect, useRef, useState } from "react";
import { useSite } from "@/content/ContentContext";
import { frame, subscribe } from "@/lib/frame";
import { clamp, lerp } from "@/lib/math";

/**
 * Who we are. The statement lights up word by word with the scroll, a white
 * lens following the cursor inverts what it covers, and the figures count up
 * the first time they are seen.
 */
export default function AboutBlock() {
  const { aboutBlock, stats } = useSite();
  const words = aboutBlock.statement.split(" ");
  const root = useRef<HTMLElement>(null);
  const text = useRef<HTMLParagraphElement>(null);
  const lens = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState(0);

  useEffect(() => {
    if (frame.calm) return;
    let lx = -400;
    let ly = -400;
    return subscribe((_, s) => {
      const t = text.current?.getBoundingClientRect();
      if (t) {
        const k = clamp((s.vh * 0.86 - t.top) / (t.height + s.vh * 0.36), 0, 1) * words.length;
        setLit(Math.ceil(k));
      }
      const b = root.current?.getBoundingClientRect();
      if (frame.fine && b && lens.current) {
        lx = lerp(lx, s.mx - b.left, 0.14);
        ly = lerp(ly, s.my - b.top, 0.14);
        lens.current.style.transform = `translate3d(${lx}px,${ly}px,0)`;
      }
    });
  }, [words.length]);

  // Figures count up once, when at least 60% of them is on screen.
  useEffect(() => {
    const el = grid.current;
    if (!el || frame.calm) return;
    const nums = Array.from(el.querySelectorAll<HTMLElement>("[data-n]"));
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          io.unobserve(en.target);
          const node = en.target as HTMLElement;
          const target = Number(node.dataset.n);
          const suffix = node.dataset.s || "";
          const text0 = node.firstChild as Text | null;
          const t0 = performance.now();
          const step = (t: number) => {
            const k = clamp((t - t0) / 1300, 0, 1);
            if (text0) text0.nodeValue = `${Math.round(target * (1 - Math.pow(1 - k, 4)))}${suffix}`;
            if (k < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }),
      { threshold: 0.6 }
    );
    nums.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [stats.items]);

  return (
    <section className="about g" ref={root}>
      <div className="lens" ref={lens} aria-hidden="true" />
      <p className="kick about-kick">{aboutBlock.kicker}</p>
      <p className="about-t" ref={text}>
        {words.map((w, i) => (
          <span key={i} className={frame.calm || i < lit ? "on" : ""}>
            {w}{" "}
          </span>
        ))}
      </p>
      {stats.enabled && stats.items.length > 0 ? (
        <div className="nums" ref={grid}>
          {stats.items.map((it, i) => (
            <div key={i}>
              <strong data-n={it.value} data-s={it.suffix}>
                {`${it.value}${it.suffix}`}
              </strong>
              <span>{it.label}</span>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
