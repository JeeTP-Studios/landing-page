import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useSite } from "@/content/ContentContext";
import { posterFit, projectPoster } from "@/lib/project";
import Typewriter from "@/components/common/Typewriter";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Asymmetric split hero. Copy on the left, a stack of real project stills on
 * the right. The stack drifts at three different speeds as the page scrolls,
 * which reads as depth without an animation that plays on its own forever.
 */
export default function Hero() {
  const c = useSite();
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yA = useTransform(scrollYProgress, [0, 1], ["0%", "-16%"]);
  const yB = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const yC = useTransform(scrollYProgress, [0, 1], ["0%", "-6%"]);
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0.25]);

  const titles =
    c.hero.titles && c.hero.titles.length ? c.hero.titles : [c.hero.title];
  const stills = c.projects.slice(0, 3).map((p) => ({
    id: p.id,
    name: p.name,
    src: projectPoster(p),
  }));

  const enter = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 26 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.75, delay, ease: EASE },
        };

  return (
    <section className="hero" ref={ref}>
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <motion.p className="eyebrow" {...enter(0.05)}>
            {c.hero.eyebrow}
          </motion.p>

          <motion.h1 className="hero-title" {...enter(0.12)}>
            {c.hero.lead || "We build"}{" "}
            <Typewriter texts={titles} className="hero-rotate" />
          </motion.h1>

          <motion.p className="lede hero-sub" {...enter(0.2)}>
            {c.hero.sub}
          </motion.p>

          <motion.div className="hero-actions" {...enter(0.28)}>
            <Link to="/case-studies" className="btn">
              {c.ui.buttons.work}
              <ArrowRight size={16} weight="bold" />
            </Link>
            <Link to="/contact" className="btn btn-ghost">
              {c.ui.buttons.contact}
            </Link>
          </motion.div>
        </div>

        <motion.div className="hero-stack" style={reduce ? undefined : { opacity: fade }}>
          {stills.map((s, i) => (
            <motion.div
              key={s.id}
              className={`hero-tile hero-tile-${i} notch`}
              style={reduce ? undefined : { y: [yA, yB, yC][i] }}
              initial={reduce ? false : { opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.85, delay: 0.18 + i * 0.1, ease: EASE }}
            >
              <Link
                to={`/case-studies/${s.id}`}
                aria-label={s.name}
                data-fit={posterFit(s.src)}
              >
                {s.src ? <img src={s.src} alt={s.name} loading="eager" /> : null}
                <span className="hero-tile-name">
                  {s.name}
                  <ArrowUpRight size={14} weight="bold" />
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
