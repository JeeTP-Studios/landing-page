import { useRef, type ReactNode } from "react";

interface SortableListProps {
  /** ids en el orden actual */
  ids: string[];
  /** se llama con el nuevo orden de ids al soltar */
  onReorder: (ids: string[]) => void;
  /** render de cada item por id */
  renderItem: (id: string) => ReactNode;
  className?: string;
}

/**
 * Lista reordenable con drag-and-drop nativo (sin dependencias).
 * El handle es toda la fila; usa el ::grip para indicar arrastre.
 */
export default function SortableList({
  ids,
  onReorder,
  renderItem,
  className = "drag-list",
}: SortableListProps) {
  const dragId = useRef<string | null>(null);

  const handleDragOver = (e: React.DragEvent, overId: string) => {
    e.preventDefault();
    const from = dragId.current;
    if (!from || from === overId) return;
    const next = [...ids];
    const fromIdx = next.indexOf(from);
    const overIdx = next.indexOf(overId);
    if (fromIdx === -1 || overIdx === -1) return;
    next.splice(fromIdx, 1);
    next.splice(overIdx, 0, from);
    onReorder(next);
  };

  return (
    <div className={className}>
      {ids.map((id) => (
        <div
          key={id}
          className="drag-item"
          draggable
          onDragStart={(e) => {
            dragId.current = id;
            e.currentTarget.classList.add("dragging");
          }}
          onDragEnd={(e) => {
            dragId.current = null;
            e.currentTarget.classList.remove("dragging");
          }}
          onDragOver={(e) => handleDragOver(e, id)}
        >
          {renderItem(id)}
        </div>
      ))}
    </div>
  );
}
