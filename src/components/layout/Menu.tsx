import type { CSSProperties } from "react";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSite } from "@/content/ContentContext";
import { NAV_KEYS, useLayout } from "./LayoutContext";
import LangSwitch from "./LangSwitch";

/** Full-screen menu for narrow viewports. */
export default function Menu() {
  const { menuOpen, setMenuOpen } = useLayout();
  const { pathname } = useLocation();
  const { ui, contact } = useSite();

  // Following a link closes the menu.
  useEffect(() => setMenuOpen(false), [pathname, setMenuOpen]);

  return (
    <div className={`menu ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen}>
      <nav aria-label="Menu">
        {NAV_KEYS.map(([to, key], i) => (
          <Link
            key={to}
            to={to}
            style={{ ["--i" as string]: i } as CSSProperties}
            tabIndex={menuOpen ? 0 : -1}
          >
            {ui.nav[key]}
          </Link>
        ))}
      </nav>
      <div className="menu-foot">
        <LangSwitch />
        <a href={`mailto:${contact.email}`} tabIndex={menuOpen ? 0 : -1}>
          {contact.email}
        </a>
      </div>
    </div>
  );
}
