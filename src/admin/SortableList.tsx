import { useRef, useState, type DragEvent, type KeyboardEvent, type ReactNode } from "react";
import { Icon } from "./icons";

/** Props to spread on the element that starts a drag (the grip). */
export interface HandleProps {
  draggable: boolean;
  onDragStart: (e: DragEvent) => void;
  onDragEnd: () => void;
  onKeyDown: (e: KeyboardEvent) => void;
}

interface SortableListProps {
  count: number;
  /** Stable key of the item at an index. */
  keyOf: (i: number) => string;
  /** Item `from` was dragged over position `to`. The caller applies the move. */
  onMove: (from: number, to: number) => void;
  /** `handle` is null when reordering is locked. */
  renderItem: (i: number, handle: HandleProps | null, dragging: boolean) => ReactNode;
  disabled?: boolean;
  /** "grid" reorders on both axes (cards), "list" on the vertical one. */
  layout?: "list" | "grid";
  className?: string;
}

/**
 * Reorderable list on native drag and drop (no dependency). Only the grip
 * drags, so text inside an open item stays selectable. The grip also moves an
 * item with the arrow keys.
 */
export default function SortableList({
  count,
  keyOf,
  onMove,
  renderItem,
  disabled,
  layout = "list",
  className,
}: SortableListProps) {
  const from = useRef<number | null>(null);
  const [dragging, setDragging] = useState<number | null>(null);

  const over = (e: DragEvent, j: number) => {
    const i = from.current;
    if (i === null) return;
    e.preventDefault();
    if (i === j) return;
    // Swap only once the pointer passes the middle of the item it covers, so
    // items of different heights do not flicker back and forth.
    const r = e.currentTarget.getBoundingClientRect();
    const midY = r.top + r.height / 2;
    const midX = r.left + r.width / 2;
    const after = layout === "grid" ? e.clientY > midY || e.clientX > midX : e.clientY > midY;
    const before = layout === "grid" ? e.clientY < midY || e.clientX < midX : e.clientY < midY;
    if ((i < j && !after) || (i > j && !before)) return;
    onMove(i, j);
    from.current = j;
    setDragging(j);
  };

  const handleFor = (i: number): HandleProps => ({
    draggable: true,
    onDragStart: (e) => {
      from.current = i;
      setDragging(i);
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", String(i));
      const item = (e.currentTarget as HTMLElement).closest("[data-sortable]");
      if (item) e.dataTransfer.setDragImage(item, 16, 16);
    },
    onDragEnd: () => {
      from.current = null;
      setDragging(null);
    },
    onKeyDown: (e) => {
      if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
      const to = e.key === "ArrowUp" ? i - 1 : i + 1;
      if (to < 0 || to >= count) return;
      e.preventDefault();
      onMove(i, to);
      // The item moved: keep the keyboard on its grip.
      const item = (e.currentTarget as HTMLElement).closest("[data-sortable]");
      const sibling = to < i ? item?.previousElementSibling : item?.nextElementSibling;
      window.setTimeout(() => sibling?.querySelector<HTMLElement>("[data-grip]")?.focus(), 0);
    },
  });

  return (
    <div className={className ?? (layout === "grid" ? "sortable grid" : "sortable")}>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={keyOf(i)}
          data-sortable
          className={`sortable-item${dragging === i ? " is-dragging" : ""}`}
          onDragOver={disabled ? undefined : (e) => over(e, i)}
          onDrop={(e) => e.preventDefault()}
        >
          {renderItem(i, disabled ? null : handleFor(i), dragging === i)}
        </div>
      ))}
    </div>
  );
}

/** The grip that starts a drag. */
export function DragHandle({ handle, label }: { handle: HandleProps; label: string }) {
  return (
    <button
      type="button"
      className="grip"
      data-grip
      aria-label={`Reorder ${label}. Drag, or use the arrow keys.`}
      title="Drag to reorder"
      {...handle}
    >
      <Icon name="grip" size={16} />
    </button>
  );
}
