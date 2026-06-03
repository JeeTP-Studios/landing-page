import { useRef, type ReactNode } from "react";

interface RowScrollerProps {
  className: string;
  children: ReactNode;
  /** muestra controles de flecha */
  arrows?: boolean;
  arrowsClassName?: string;
}

/** Fila con scroll horizontal y controles de flecha reutilizable. */
export default function RowScroller({
  className,
  children,
  arrows = true,
  arrowsClassName = "arrows",
}: RowScrollerProps) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    const row = ref.current;
    if (!row) return;
    const card = row.firstElementChild as HTMLElement | null;
    const step = card ? card.getBoundingClientRect().width + 22 : 300;
    row.scrollBy({ left: step * dir, behavior: "smooth" });
  };

  return (
    <>
      <div className={className} ref={ref}>
        {children}
      </div>
      {arrows && (
        <div className={arrowsClassName}>
          <button onClick={() => scroll(-1)} aria-label="Anterior">
            ←
          </button>
          <button onClick={() => scroll(1)} aria-label="Siguiente">
            →
          </button>
        </div>
      )}
    </>
  );
}
