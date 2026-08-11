import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { GradientLayer } from "@/types/content";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Inner-page opener. Half a viewport, never a full one: on a sub-page the
 * reader already chose where they are going.
 *
 * The CMS gradient is kept, but as a low-opacity light field rather than a
 * flat colour panel, so an editor can tint a page without breaking the one
 * dark theme the site runs on.
 */
export default function PageHero({
  eyebrow,
  title,
  sub,
  tint,
  children,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  tint?: GradientLayer;
  children?: ReactNode;
}) {
  const reduce = useReducedMotion();
  const enter = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: EASE },
        };

  return (
    <section className="page-hero">
      {tint ? (
        <span
          className="page-hero-tint"
          style={{
            background: `radial-gradient(80% 120% at 12% 0%, ${tint.gradA}, transparent 70%)`,
          }}
        />
      ) : null}
      <div className="wrap">
        {eyebrow ? (
          <motion.p className="eyebrow" {...enter(0.04)}>
            {eyebrow}
          </motion.p>
        ) : null}
        <motion.h1 {...enter(0.1)}>{title}</motion.h1>
        {sub ? (
          <motion.p className="lede page-hero-sub" {...enter(0.18)}>
            {sub}
          </motion.p>
        ) : null}
        {children ? <motion.div {...enter(0.26)}>{children}</motion.div> : null}
      </div>
    </section>
  );
}
