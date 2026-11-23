import type { ReactNode } from "react";
import { useContent } from "@/content/ContentContext";
import { overlayMove, overlayRemoveAt } from "@/content/i18n";
import { getByPath } from "@/lib/path";
import { useEditLang } from "./editLang";

interface ObjectListEditorProps<T> {
  path: string;
  factory: () => T;
  labeler: (item: T, i: number) => string;
  renderItem: (i: number) => ReactNode;
  addLabel?: string;
  /** Renumbers the "num" field after add, remove or move (service groups). */
  renumber?: boolean;
}

/**
 * Generic editor for lists of objects: add, remove and reorder. Every
 * structural change is mirrored in the Spanish overlay in the same step, so a
 * translation never ends up on the wrong item. In Spanish the structure is
 * read-only: it is shared, and changed from English.
 */
export default function ObjectListEditor<T>({
  path,
  factory,
  labeler,
  renderItem,
  addLabel = "+ Add",
  renumber,
}: ObjectListEditorProps<T>) {
  const { content, update } = useContent();
  const es = useEditLang() === "es";
  const arr = (getByPath(content, path) as T[]) || [];

  const renum = (list: unknown[]) => {
    if (renumber)
      list.forEach((g, i) => {
        (g as { num: string }).num = String(i + 1).padStart(2, "0");
      });
  };

  const move = (i: number, to: number) =>
    update((d) => {
      const list = getByPath(d, path) as unknown[];
      if (to < 0 || to >= list.length) return;
      overlayMove(d, path, i, to);
      const [it] = list.splice(i, 1);
      list.splice(to, 0, it);
      renum(list);
    });

  return (
    <>
      {arr.map((it, i) => (
        <details className="acc" key={i}>
          <summary>{labeler(it, i)}</summary>
          <div className="accbody">
            {renderItem(i)}
            {!es && (
              <div className="row">
                <button
                  className="ad-btn ghost"
                  disabled={i === 0}
                  onClick={() => move(i, i - 1)}
                >
                  Move up
                </button>
                <button
                  className="ad-btn ghost"
                  disabled={i === arr.length - 1}
                  onClick={() => move(i, i + 1)}
                >
                  Move down
                </button>
                <button
                  className="ad-btn warn"
                  onClick={() =>
                    update((d) => {
                      overlayRemoveAt(d, path, i);
                      const list = getByPath(d, path) as unknown[];
                      list.splice(i, 1);
                      renum(list);
                    })
                  }
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </details>
      ))}
      {es ? (
        <div className="hint">
          Items are added, removed and reordered in English. Here you translate each one.
        </div>
      ) : (
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
      )}
    </>
  );
}
