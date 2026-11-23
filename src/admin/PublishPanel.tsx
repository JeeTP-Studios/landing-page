import { useEffect, useMemo, useRef, useState } from "react";
import { useContent } from "@/content/ContentContext";
import { summarizeChanges } from "./diff";
import { Icon } from "./icons";

/** How a draft goes live, and what it changes. A dialog over the editor. */
export default function PublishPanel({ onClose }: { onClose: () => void }) {
  const { content, published, exportJson, differsFromPublished } = useContent();
  const [downloaded, setDownloaded] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const summary = useMemo(() => summarizeChanges(published, content), [published, content]);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    box.current?.querySelector<HTMLElement>("[data-first]")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !box.current) return;
      const f = box.current.querySelectorAll<HTMLElement>("button, a[href], input, [tabindex='0']");
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      prev?.focus();
    };
  }, [onClose]);

  return (
    <div className="modal-back" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="pub-title" ref={box}>
        <header className="modal-head">
          <h2 id="pub-title">Publish your changes</h2>
          <button type="button" className="btn icon ghost" aria-label="Close" onClick={onClose}>
            <Icon name="close" size={18} />
          </button>
        </header>

        <ol className="pub-steps">
          <li>
            <div>
              <b>Download the new content file</b>
              <p>It holds everything you edited, in both languages.</p>
            </div>
            <button
              type="button"
              className="btn primary"
              data-first
              onClick={() => {
                exportJson();
                setDownloaded(true);
              }}
            >
              <Icon name={downloaded ? "check" : "upload"} size={16} />
              {downloaded ? "Downloaded content.json" : "Download content.json"}
            </button>
          </li>
          <li>
            <div>
              <b>Put it in the repository</b>
              <p>
                Replace <code>public/content.json</code> with the downloaded file and commit it.
              </p>
            </div>
          </li>
          <li>
            <div>
              <b>Deploy the site</b>
              <p>Push to the main branch. The changes are live when the deploy finishes.</p>
            </div>
          </li>
        </ol>

        <section className="pub-changes" aria-labelledby="pub-changes-t">
          <h3 id="pub-changes-t">
            {differsFromPublished
              ? `What changes against the published file`
              : "Nothing differs from the published file"}
          </h3>
          {differsFromPublished ? (
            <>
              <p className="pub-total">
                {summary.fieldCount} {summary.fieldCount === 1 ? "change" : "changes"} in{" "}
                {summary.blockCount} {summary.blockCount === 1 ? "block" : "blocks"}.
              </p>
              <ul className="pub-list">
                {summary.changes.map((c) => (
                  <li key={`${c.lang}|${c.where}`}>
                    <span className={`langtag ${c.lang === "ES" ? "es" : ""}`}>
                      {c.lang === "ES" ? "Spanish" : "English"}
                    </span>
                    <b>{c.where}</b>
                    <span>{c.what}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="pub-total">The site already shows exactly what you see here.</p>
          )}
        </section>
      </div>
    </div>
  );
}
