import type { ReactNode } from "react";
import { Link } from "react-router-dom";

/** The one button of the site: a white pill that turns blue and grows on hover.
 *  Internal destination with `to`, external with `href`, action with `onClick`. */
export default function Pill({
  to,
  href,
  onClick,
  type = "button",
  className = "",
  children,
}: {
  to?: string;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  children: ReactNode;
}) {
  const cls = `pill ${className}`.trim();
  const inner = (
    <>
      {children}
      <i aria-hidden="true">→</i>
    </>
  );
  if (to) {
    return (
      <Link to={to} className={cls}>
        {inner}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }
  return (
    <button type={type} className={cls} onClick={onClick}>
      {inner}
    </button>
  );
}
