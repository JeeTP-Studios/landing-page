import { useEffect, useRef, useState, type ReactNode } from "react";
import { Icon, type IconName } from "./icons";

/** A button that asks "are you sure?" in place, instead of a browser dialog. */
export function ConfirmButton({
  label,
  confirmLabel,
  question,
  onConfirm,
  icon,
  iconOnly,
  disabled,
}: {
  label: string;
  confirmLabel: string;
  /** What will happen, in plain words. Shown while the button is armed. */
  question: string;
  onConfirm: () => void;
  icon?: IconName;
  /** Compact: show only the icon (the label stays as its accessible name). */
  iconOnly?: boolean;
  disabled?: boolean;
}) {
  const [armed, setArmed] = useState(false);
  const yes = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (armed) yes.current?.focus();
  }, [armed]);

  if (!armed) {
    return (
      <button
        type="button"
        className={`btn danger-ghost${iconOnly ? " icon" : ""}`}
        aria-label={iconOnly ? label : undefined}
        title={iconOnly ? label : undefined}
        disabled={disabled}
        onClick={() => setArmed(true)}
      >
        {icon ? <Icon name={icon} size={16} /> : null}
        {iconOnly ? null : label}
      </button>
    );
  }
  return (
    <span className="confirm" role="group" aria-label={question}>
      <span className="confirm-q">{question}</span>
      <button
        type="button"
        ref={yes}
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
    </span>
  );
}

/** "3 to translate" on a card, a page or a list row. Nothing when no text. */
export function TranslationBadge({ missing, total }: { missing: number; total?: number }) {
  if (missing > 0) {
    return (
      <span className="tbadge warn" title="Text fields that still show English in the Spanish site">
        {missing} to translate
      </span>
    );
  }
  if (total === undefined || total > 0) {
    return (
      <span className="tbadge ok" title="Every text field has a Spanish version">
        <Icon name="check" size={12} /> Translated
      </span>
    );
  }
  return null;
}

/** A line of plain guidance with an optional title. */
export function Note({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="note">
      {title ? <b>{title}</b> : null}
      <span>{children}</span>
    </div>
  );
}
