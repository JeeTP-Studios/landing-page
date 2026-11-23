import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSite } from "@/content/ContentContext";
import { frame, subscribe } from "@/lib/frame";
import { clamp, lerp } from "@/lib/math";
import { projectPoster } from "@/lib/project";
import { Reveal } from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import Pill from "@/components/ui/Pill";

/**
 * The work as a list of rows. A row fills white on hover and a floating image
 * follows the cursor; a click opens the case study. On touch screens each row
 * shows its image inline instead.
 */
export default function WorkList() {
  const { work, projects, ui } = useSite();
  const float = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(-1);
  const pos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (active < 0) return;
    return subscribe((_, s) => {
      const el = float.current;
      if (!el) return;
      const p = pos.current;
      p.x = lerp(p.x, s.mx + 26, 0.16);
      p.y = lerp(p.y, s.my - el.offsetHeight / 2, 0.16);
      const x = Math.min(p.x, s.vw - el.offsetWidth - 12);
      el.style.transform = `translate3d(${x}px,${p.y}px,0) rotate(${clamp(s.vel * 0.25 + (s.mx + 26 - p.x) * 0.03, -9, 9)}deg)`;
    });
  }, [active]);

  if (!projects.length) return null;
  const hoverable = frame.fine;
  return (
    <section className="work g">
      <SectionHeading title={work.title} accent={work.accent} aside={work.kicker} />
      <div className="work-rows">
        {projects.map((p, i) => {
          const img = projectPoster(p);
          return (
            <Reveal
              as={Link}
              to={`/case-studies/${p.id}`}
              className="work-row"
              key={p.id}
              onPointerEnter={(e: React.PointerEvent) => {
                if (e.pointerType === "mouse" && hoverable) setActive(i);
              }}
              onPointerLeave={() => setActive(-1)}
            >
              {img ? <img src={img} alt="" loading="lazy" /> : null}
              <b>{p.name}</b>
              <span>{p.tagline}</span>
              <span>{p.category}</span>
              <i aria-hidden="true">→</i>
            </Reveal>
          );
        })}
      </div>
      <div className="work-all">
        <Pill to="/case-studies">{ui.buttons.work}</Pill>
      </div>
      <div className={`float ${active >= 0 ? "on" : ""}`} ref={float} aria-hidden="true">
        {projects.map((p, i) => (
          <img
            key={p.id}
            src={projectPoster(p)}
            alt=""
            loading="lazy"
            className={i === active ? "on" : ""}
          />
        ))}
      </div>
    </section>
  );
}
