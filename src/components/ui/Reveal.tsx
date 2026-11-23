import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { frame } from "@/lib/frame";

const EASE = "cubic-bezier(.19,1,.22,1)";

/**
 * Entrance on first sight. The element is fully visible from the start and the
 * animation only adds motion on top, so nothing can stay stuck at opacity 0
 * waiting for an observer. Skipped under prefers-reduced-motion.
 */
export function Reveal({
  as,
  className,
  delay = 0,
  children,
  ...rest
}: {
  as?: ElementType;
  className?: string;
  delay?: number;
  children?: ReactNode;
  [key: string]: unknown;
}) {
  const Tag: ElementType = as ?? "div";
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || frame.calm || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        el.animate(
          [
            { transform: "translateY(46px)", opacity: 0.2 },
            { transform: "none", opacity: 1 },
          ],
          { duration: 1100, delay, easing: EASE, fill: "backwards" }
        );
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
