import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "@phosphor-icons/react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useSite } from "@/content/ContentContext";
import { posterFit, projectPoster } from "@/lib/project";
import type { Project } from "@/types/content";
import { useMedia } from "@/hooks/useMedia";

/**
 * Featured work as a horizontal pan. Vertical scroll drives the track sideways
 * while the section is pinned, so the work reads as one continuous reel rather
 * than a stack of cards. Storytelling, not decoration.
 *
 * Narrow viewports and reduced-motion users get the same content as a
 * scroll-snapped rail they flick through directly. No hijack, same order.
 */
export default function WorkRail() {
  const c = useSite();
  const s = c.highlighted;
  const projects = c.projects;

  const wrapRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [vh, setVh] = useState(() =>
    typeof window === "undefined" ? 800 : window.innerHeight
  );

  const reduce = useReducedMotion();
  const narrow = useMedia("(max-width: 900px)");
  const pinned = !narrow && !reduce;

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setVh(window.innerHeight);
    setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
  }, []);

  useEffect(() => {
    if (!pinned) {
      setDistance(0);
      return;
    }
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [pinned, measure, projects.length]);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const progress = useTransform(scrollYProgress, [0, 1], [0.04, 1]);

  if (!s.enabled || !projects.length) return null;

  const head = (
    <div className="rail-head">
      <div>
        <p className="eyebrow">{s.label}</p>
        <h2>{s.title}</h2>
      </div>
      <Link to="/case-studies" className="link rail-head-link">
        {c.ui.buttons.work}
        <ArrowUpRight size={15} weight="bold" />
      </Link>
    </div>
  );

  if (!pinned) {
    return (
      <section className="sect rail-flat" id="work">
        <div className="wrap">{head}</div>
        <div className="rail-scroller">
          {projects.map((p, i) => (
            <Slide key={p.id} p={p} label={c.ui.buttons.viewCase} index={i} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      className="rail"
      id="work"
      ref={wrapRef}
      style={{ height: `${100 + (distance / vh) * 100}vh` }}
    >
      <div className="rail-sticky">
        <div className="wrap">{head}</div>
        <motion.div className="rail-track" ref={trackRef} style={{ x }}>
          {projects.map((p, i) => (
            <Slide key={p.id} p={p} label={c.ui.buttons.viewCase} index={i} />
          ))}
          <div className="rail-end">
            <Link to="/case-studies" className="btn">
              {c.ui.buttons.work}
              <ArrowUpRight size={16} weight="bold" />
            </Link>
          </div>
        </motion.div>
        <div className="rail-progress">
          <motion.span style={{ scaleX: progress }} />
        </div>
      </div>
    </section>
  );
}

function Slide({
  p,
  label,
  index,
}: {
  p: Project;
  label: string;
  index: number;
}) {
  const poster = projectPoster(p);
  return (
    <article className="slide">
      <Link
        className="slide-media notch"
        to={`/case-studies/${p.id}`}
        data-fit={posterFit(poster)}
      >
        <span
          className="slide-wash"
          style={{
            background: `linear-gradient(150deg, ${p.accent}2e, transparent 62%)`,
          }}
        />
        {poster ? (
          <img
            src={poster}
            alt={p.name}
            loading={index < 2 ? "eager" : "lazy"}
          />
        ) : null}
      </Link>
      <div className="slide-copy">
        <div className="slide-tags">
          {(p.tags || []).slice(0, 3).map((t) => (
            <span className="tag" key={t}>
              {t}
            </span>
          ))}
        </div>
        <h3 className="slide-name">{p.name}</h3>
        <p className="slide-desc">{p.desc}</p>
        <Link className="link" to={`/case-studies/${p.id}`}>
          {label}
          <ArrowUpRight size={15} weight="bold" />
        </Link>
      </div>
    </article>
  );
}
