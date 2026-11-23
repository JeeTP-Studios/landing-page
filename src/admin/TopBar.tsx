import { useContent } from "@/content/ContentContext";
import type { Lang } from "@/content/i18n";
import { Icon } from "./icons";
import MoreMenu from "./MoreMenu";

/** Title, language, state of the draft, undo and redo, and the publish button. */
export default function TopBar({
  editLang,
  onLang,
  previewVisible,
  onTogglePreview,
  onPublish,
  notify,
}: {
  editLang: Lang;
  onLang: (l: Lang) => void;
  previewVisible: boolean;
  onTogglePreview: () => void;
  onPublish: () => void;
  notify: (msg: string) => void;
}) {
  const { unsaved, differsFromPublished, canUndo, canRedo, undo, redo, saveLocal } = useContent();
  const mod = /Mac|iPhone|iPad/.test(navigator.platform) ? "⌘" : "Ctrl+";

  return (
    <header className="topbar">
      <div className="tb-brand">
        <b>JeeTP</b>
        <span>Content editor</span>
      </div>

      <div className="tb-lang">
        <div className="seg big" role="group" aria-label="Language you are editing">
          {(["en", "es"] as Lang[]).map((l) => (
            <button
              key={l}
              type="button"
              className={editLang === l ? "on" : ""}
              aria-pressed={editLang === l}
              onClick={() => onLang(l)}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <span className="tb-lang-note">
          {editLang === "en"
            ? "Editing English, the base site. Structure is changed here."
            : "Editing Spanish: text only. Empty fields show English. Structure is locked."}
        </span>
      </div>

      <div className="tb-state">
        {unsaved ? (
          <span className="status unsaved" role="status">
            <i /> Unsaved changes
          </span>
        ) : (
          <span className="status saved" role="status">
            <i /> All changes saved in this browser
          </span>
        )}
        {differsFromPublished ? (
          <button type="button" className="status differs" onClick={onPublish}>
            Differs from the published file
          </button>
        ) : (
          <span className="status same">Same as the published file</span>
        )}
      </div>

      <div className="tb-actions">
        <button
          type="button"
          className="btn icon ghost"
          disabled={!canUndo}
          aria-label="Undo"
          title={`Undo (${mod}Z)`}
          onClick={undo}
        >
          <Icon name="undo" size={17} />
        </button>
        <button
          type="button"
          className="btn icon ghost"
          disabled={!canRedo}
          aria-label="Redo"
          title={`Redo (${mod}⇧Z)`}
          onClick={redo}
        >
          <Icon name="redo" size={17} />
        </button>
        <button
          type="button"
          className="btn ghost"
          disabled={!unsaved}
          title={`Save in this browser now (${mod}S). It also happens by itself.`}
          onClick={() => {
            saveLocal();
            notify("Saved in this browser.");
          }}
        >
          Save
        </button>
        <MoreMenu notify={notify} />
        <button
          type="button"
          className={`btn ghost pv-toggle${previewVisible ? " on" : ""}`}
          aria-pressed={previewVisible}
          onClick={onTogglePreview}
        >
          <Icon name="panel" size={16} /> Preview
        </button>
        <button type="button" className="btn primary" onClick={onPublish}>
          Publish
        </button>
      </div>
    </header>
  );
}
