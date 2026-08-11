import type { CSSProperties } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSite } from "@/content/ContentContext";
import { useLayout, NAV_KEYS } from "./LayoutContext";

/** Full-screen menu for touch and narrow viewports. */
export default function Menu() {
  const { menuOpen, setMenuOpen } = useLayout();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { ui, contact } = useSite();

  const go = (to: string) => {
    setMenuOpen(false);
    if (to !== pathname) navigate(to);
  };

  return (
    <nav className={`menu ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen}>
      <div>
        {NAV_KEYS.map(([to, key], i) => (
          <a
            key={to}
            href={to}
            style={{ ["--i" as string]: i } as CSSProperties}
            onClick={(e) => {
              e.preventDefault();
              go(to);
            }}
            tabIndex={menuOpen ? 0 : -1}
          >
            {ui.nav[key]}
          </a>
        ))}
      </div>
      <div className="menu-foot">
        <a href={`mailto:${contact.email}`} tabIndex={menuOpen ? 0 : -1}>
          {contact.email}
        </a>
        {ui.footer.social.map((s) => (
          <a
            key={s.label}
            href={s.url}
            target="_blank"
            rel="noreferrer"
            tabIndex={menuOpen ? 0 : -1}
          >
            {s.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
