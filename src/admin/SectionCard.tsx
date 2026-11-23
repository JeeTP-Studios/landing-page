import type { ReactNode } from "react";
import { DragHandle, type HandleProps } from "./SortableList";
import { Icon } from "./icons";
import { TranslationBadge } from "./ui";

/**
 * One block as a card: grip, name, a line of what it says now, translation
 * badge, eye. Clicking it opens its fields below. The same card serves the
 * sections of a page and the sections of a case study.
 */
export default function SectionCard({
  id,
  title,
  summary,
  open,
  onToggle,
  forceOpen,
  handle,
  locked,
  enabled,
  onEnabled,
  eyeLocked,
  missing,
  total,
  actions,
  children,
}: {
  id: string;
  title: string;
  summary: string;
  open: boolean;
  onToggle: () => void;
  /** The card cannot close (a page with a single block). */
  forceOpen?: boolean;
  handle?: HandleProps | null;
  /** A fixed anchor: shows a lock instead of a grip. */
  locked?: boolean;
  /** Visible on the site? Undefined: no eye. */
  enabled?: boolean;
  onEnabled?: (v: boolean) => void;
  /** The eye is shown but cannot change (Spanish mode). */
  eyeLocked?: boolean;
  missing: number;
  total: number;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const hidden = enabled === false;
  const isOpen = open || !!forceOpen;
  return (
    <section
      className={`ad-card${isOpen ? " open" : ""}${hidden ? " hidden" : ""}`}
      id={`sec-${id}`}
      aria-label={title}
    >
      <div className="ad-card-head">
        {handle ? (
          <DragHandle handle={handle} label={title} />
        ) : locked ? (
          <span className="lock" title="Fixed: always first or last" aria-label="Fixed position">
            <Icon name="lock" size={15} />
          </span>
        ) : (
          <span className="grip-space" />
        )}
        <button
          type="button"
          className="ad-card-main"
          aria-expanded={isOpen}
          disabled={forceOpen}
          onClick={onToggle}
        >
          <span className="ad-card-title">{title}</span>
          <span className="ad-card-sum">{summary || "Empty"}</span>
        </button>
        <TranslationBadge missing={missing} total={total} />
        {actions}
        {enabled !== undefined && onEnabled ? (
          <button
            type="button"
            className={`eye${hidden ? " off" : ""}`}
            role="switch"
            aria-checked={!hidden}
            aria-label={`${title}: ${hidden ? "hidden" : "visible"} on the site`}
            title={
              eyeLocked
                ? "Showing and hiding is shared by both languages: change it in English"
                : hidden
                  ? "Hidden on the site. Click to show"
                  : "Visible on the site. Click to hide"
            }
            disabled={eyeLocked}
            onClick={() => onEnabled(hidden)}
          >
            <Icon name={hidden ? "eyeOff" : "eye"} size={17} />
          </button>
        ) : null}
        {forceOpen ? null : (
          <span className="ad-card-chev" aria-hidden="true">
            <Icon name="chevron" size={16} />
          </span>
        )}
      </div>
      {isOpen ? <div className="ad-card-body">{children}</div> : null}
    </section>
  );
}
