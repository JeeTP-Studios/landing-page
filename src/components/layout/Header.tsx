import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useScroll, useMotionValueEvent } from "motion/react";
import { useSite } from "@/content/ContentContext";
import { useLayout, NAV_KEYS } from "./LayoutContext";
import Logo from "./Logo";

/**
 * Fixed header. One line at every desktop width, 68px tall, frosted only
 * once the page has moved so the hero reads clean on load.
 */
export default function Header() {
  const { menuOpen, setMenuOpen } = useLayout();
  const { ui } = useSite();
  const [stuck, setStuck] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > 24;
    setStuck((prev) => (prev === next ? prev : next));
  });

  // Lock the page behind the mobile menu.
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  return (
    <header className={`site-header ${stuck || menuOpen ? "is-stuck" : ""}`}>
      <div className="wrap">
        <Logo />

        <nav className="nav-desk">
          {NAV_KEYS.map(([to, key]) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) => (isActive ? "is-active" : "")}
            >
              {ui.nav[key]}
            </NavLink>
          ))}
        </nav>

        <Link to="/contact" className="btn header-cta">
          {ui.buttons.contact}
        </Link>

        <button
          type="button"
          className={`nav-toggle ${menuOpen ? "is-open" : ""}`}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
        </button>
      </div>
    </header>
  );
}
