import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ElementType, ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Scroll reveal. Motivated by hierarchy: content arrives in reading order as
 * the section enters, so the eye lands on the headline before the detail.
 * Collapses to a plain static render under prefers-reduced-motion.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  as = "div",
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  as?: ElementType;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const M = motion.create(as as ElementType);
  return (
    <M
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.62, delay, ease: EASE }}
    >
      {children}
    </M>
  );
}

const listVariants: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.055 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/** Staggered container. Children must be <RevealItem> to inherit the cascade. */
export function RevealList({
  children,
  className,
  as = "div",
  amount = 0.2,
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  amount?: number;
}) {
  const reduce = useReducedMotion();
  const M = motion.create(as as ElementType);
  return (
    <M
      className={className}
      variants={reduce ? undefined : listVariants}
      initial={reduce ? false : "hidden"}
      whileInView="shown"
      viewport={{ once: true, amount }}
    >
      {children}
    </M>
  );
}

export function RevealItem({
  children,
  className,
  as = "div",
  ...rest
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  [key: string]: unknown;
}) {
  const reduce = useReducedMotion();
  const M = motion.create(as as ElementType);
  return (
    <M className={className} variants={reduce ? undefined : itemVariants} {...rest}>
      {children}
    </M>
  );
}
