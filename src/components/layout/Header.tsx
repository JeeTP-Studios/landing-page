import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useSite } from "@/content/ContentContext";
import { subscribe } from "@/lib/frame";
import Pill from "@/components/ui/Pill";
import { HEADER_KEYS, useLayout } from "./LayoutContext";
import LangSwitch from "./LangSwitch";
import Logo from "./Logo";

/**
 * Fixed header over the stage. It slides away while the page is read downward
 * and returns on the first scroll up; it stays put while the menu is open.
 */
export default function Header() {
  const { menuOpen, setMenuOpen } = useLayout();
  const { ui } = useSite();
  const ref = useRef<HTMLElement>(null);
  const open = useRef(menuOpen);
  open.current = menuOpen;

  useEffect(() => {
    let last = window.scrollY;
    return subscribe((_, s) => {
      if (Math.abs(s.y - last) <= 8) return;
      const away = s.y > last && s.y > s.vh * 0.6 && !open.current;
      ref.current?.classList.toggle("away", away);
      last = s.y;
    });
  }, []);

  // The page behind the mobile menu does not scroll.
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  return (
    <header className="nav" ref={ref} data-edit="nav">
      <div className="nav-in g">
        <Logo />
        <nav className="nav-links" aria-label="Main">
          {HEADER_KEYS.map(([to, key]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => (isActive ? "is-active" : "")}
            >
              {ui.nav[key]}
            </NavLink>
          ))}
        </nav>
        <div className="nav-end">
          <LangSwitch className="lang-desk" />
          <Pill to="/contact">{ui.buttons.contact}</Pill>
          <button
            type="button"
            className={`burger ${menuOpen ? "is-open" : ""}`}
            aria-label={menuOpen ? ui.menu.close : ui.menu.open}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
