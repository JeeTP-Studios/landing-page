import { useState, type ReactNode } from "react";
import { useContent } from "@/content/ContentContext";
import { getByPath } from "@/lib/path";
import { useEditLang } from "./editLang";
import { Icon } from "./icons";
import { duplicateAt, moveAt, push, removeAt } from "./listOps";
import SortableList, { DragHandle } from "./SortableList";
import { ConfirmButton, Note } from "./ui";

interface ObjectListEditorProps<T> {
  path: string;
  factory: () => T;
  labeler: (item: T, i: number) => string;
  renderItem: (i: number) => ReactNode;
  /** Singular name, used in buttons and questions ("figure", "FAQ question"). */
  noun?: string;
  /** Second line of a row: a short summary of its content. */
  summary?: (item: T, i: number) => string;
  /** Image shown at the left of a row. */
  thumb?: (item: T) => string;
  /** Renumbers the "num" field after add, remove or move (service groups). */
  renumber?: boolean;
  emptyText?: string;
}

/**
 * Editor for a list of objects as compact rows: drag to reorder, duplicate,
 * delete (asks in place), click to open one row at a time. Every structural
 * change is mirrored in the Spanish overlay in the same step. In Spanish the
 * structure is locked: it is shared, and changed from English.
 */
export default function ObjectListEditor<T>({
  path,
  factory,
  labeler,
  renderItem,
  noun = "item",
  summary,
  thumb,
  renumber,
  emptyText,
}: ObjectListEditorProps<T>) {
  const { content, update } = useContent();
  const es = useEditLang() === "es";
  const [open, setOpen] = useState<number | null>(null);
  const arr = (getByPath(content, path) as T[]) || [];

  const renum = renumber
    ? (list: unknown[]) =>
        list.forEach((g, i) => {
          (g as { num: string }).num = String(i + 1).padStart(2, "0");
        })
    : undefined;

  // The open row follows its item when the order changes.
  const follow = (from: number, to: number) =>
    setOpen((o) => {
      if (o === null) return o;
      if (o === from) return to;
      if (from < to && o > from && o <= to) return o - 1;
      if (from > to && o >= to && o < from) return o + 1;
      return o;
    });

  return (
    <div className="lst">
      {arr.length === 0 ? (
        <div className="ad-empty">
          {emptyText ?? `No ${noun}s yet. ${es ? "They are added in English." : `Use “Add ${noun}” below.`}`}
        </div>
      ) : (
        <SortableList
          count={arr.length}
          keyOf={(i) => String(i)}
          disabled={es}
          onMove={(from, to) => {
            update((d) => moveAt(d, path, from, to, renum));
            follow(from, to);
          }}
          renderItem={(i, handle) => {
            const it = arr[i];
            const isOpen = open === i;
            const sum = summary?.(it, i);
            const img = thumb?.(it);
            return (
              <div className={`lrow${isOpen ? " open" : ""}`}>
                <div className="lrow-head">
                  {handle ? (
                    <DragHandle handle={handle} label={labeler(it, i)} />
                  ) : (
                    <span className="lrow-n">{i + 1}</span>
                  )}
                  {thumb ? (
                    <span className="lrow-thumb">{img ? <img src={img} alt="" /> : null}</span>
                  ) : null}
                  <button
                    type="button"
                    className="lrow-main"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span className="lrow-title">{labeler(it, i) || `Untitled ${noun}`}</span>
                    {sum ? <small>{sum}</small> : null}
                  </button>
                  {!es && (
                    <span className="lrow-actions">
                      <button
                        type="button"
                        className="btn icon ghost"
                        aria-label={`Duplicate ${noun}`}
                        title="Duplicate"
                        onClick={() => update((d) => duplicateAt(d, path, i, undefined, renum))}
                      >
                        <Icon name="copy" size={16} />
                      </button>
                      <ConfirmButton
                        iconOnly
                        icon="trash"
                        label={`Delete ${noun}`}
                        question={`Delete this ${noun}?`}
                        confirmLabel="Delete"
                        onConfirm={() => {
                          update((d) => removeAt(d, path, i, renum));
                          setOpen(null);
                        }}
                      />
                    </span>
                  )}
                  <span className="lrow-chev" aria-hidden="true">
                    <Icon name="chevron" size={16} />
                  </span>
                </div>
                {isOpen ? <div className="lrow-body">{renderItem(i)}</div> : null}
              </div>
            );
          }}
        />
      )}
      {es ? (
        <Note>
          Adding, deleting and reordering is locked in Spanish, because the structure is shared by
          both languages. Change it in English; here you translate each {noun}.
        </Note>
      ) : (
        <button
          type="button"
          className="btn ghost add"
          onClick={() => {
            update((d) => push(d, path, factory(), renum));
            setOpen(arr.length);
          }}
        >
          <Icon name="plus" size={15} /> Add {noun}
        </button>
      )}
    </div>
  );
}
