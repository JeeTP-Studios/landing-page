import { useContent } from "@/content/ContentContext";
import { getByPath } from "./path";
import type { ReactNode } from "react";

interface ObjectListEditorProps<T> {
  path: string;
  factory: () => T;
  labeler: (item: T, i: number) => string;
  renderItem: (i: number) => ReactNode;
  addLabel?: string;
  /** renumera campo "num" tras add/remove (grupos de servicios) */
  renumber?: boolean;
}

/** Editor genérico de arrays de objetos con agregar/eliminar. */
export default function ObjectListEditor<T>({
  path,
  factory,
  labeler,
  renderItem,
  addLabel = "+ Add",
  renumber,
}: ObjectListEditorProps<T>) {
  const { content, update } = useContent();
  const arr = (getByPath(content, path) as T[]) || [];

  const renum = (list: unknown[]) => {
    if (renumber)
      list.forEach((g, i) => {
        (g as { num: string }).num = String(i + 1).padStart(2, "0");
      });
  };

  return (
    <>
      {arr.map((it, i) => (
        <details className="acc" key={i}>
          <summary>{labeler(it, i)}</summary>
          <div className="accbody">
            {renderItem(i)}
            <button
              className="ad-btn warn"
              onClick={() =>
                update((d) => {
                  const list = getByPath(d, path) as unknown[];
                  list.splice(i, 1);
                  renum(list);
                })
              }
            >
              Remove
            </button>
          </div>
        </details>
      ))}
      <button
        className="miniadd"
        onClick={() =>
          update((d) => {
            const list = getByPath(d, path) as T[];
            list.push(factory());
            renum(list as unknown[]);
          })
        }
      >
        {addLabel}
      </button>
    </>
  );
}
