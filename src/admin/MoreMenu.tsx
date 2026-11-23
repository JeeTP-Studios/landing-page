import { useEffect, useRef, useState } from "react";
import { useContent } from "@/content/ContentContext";
import { Icon } from "./icons";

/** Rarely used actions, each with a plain explanation and an in-place confirmation. */
function Action({
  title,
  description,
  confirmLabel,
  onConfirm,
}: {
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
}) {
  const [armed, setArmed] = useState(false);
  return (
    <div className="ad-menu-action">
      <button type="button" className="ad-menu-item" aria-expanded={armed} onClick={() => setArmed(!armed)}>
        {title}
      </button>
      {armed ? (
        <div className="ad-menu-confirm">
          <p>{description}</p>
          <div>
            <button
              type="button"
              className="btn danger small"
              onClick={() => {
                setArmed(false);
                onConfirm();
              }}
            >
              {confirmLabel}
            </button>
            <button type="button" className="btn ghost small" onClick={() => setArmed(false)}>
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function MoreMenu({ notify }: { notify: (msg: string) => void }) {
  const { importJson, resetToRemote, resetToDefaults } = useContent();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const file = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  const onImport = (f: File | undefined) => {
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        importJson(String(r.result));
        notify("Imported. Undo brings back what you had.");
      } catch {
        notify("That file is not a valid content.json.");
      }
    };
    r.readAsText(f);
    setOpen(false);
  };

  return (
    <div className="more" ref={root}>
      <button
        type="button"
        className="btn ghost"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <Icon name="more" size={16} /> More
      </button>
      {open ? (
        <div className="ad-menu" role="group" aria-label="More actions">
          <input
            ref={file}
            type="file"
            accept="application/json"
            hidden
            onChange={(e) => {
              onImport(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
          <button type="button" className="ad-menu-item" onClick={() => file.current?.click()}>
            Import a content.json…
            <small>Loads a file you downloaded before, replacing the draft.</small>
          </button>
          <Action
            title="Discard my changes"
            description="Throws away what you changed in this browser and goes back to the published file. Undo can still bring it back."
            confirmLabel="Discard changes"
            onConfirm={() => {
              void resetToRemote();
              notify("Back to the published file.");
              setOpen(false);
            }}
          />
          <Action
            title="Factory reset"
            description="Replaces everything with the texts the site was first built with, ignoring the published file. Undo can still bring it back."
            confirmLabel="Reset everything"
            onConfirm={() => {
              resetToDefaults();
              notify("Reset to the original content.");
              setOpen(false);
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
