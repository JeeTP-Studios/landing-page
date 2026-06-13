import { useEffect, useState } from "react";
import { useLayout } from "./LayoutContext";
import Logo from "./Logo";

export default function Header() {
  const { crumb, menuOpen, setMenuOpen } = useLayout();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={scrolled ? "scrolled" : ""}>
      <div className="hleft">
        <Logo />
        {crumb ? <div className="crumb">{crumb}</div> : null}
      </div>
      <div className="hgroup">
        <button
          className={`hbtn ${menuOpen ? "x" : ""}`}
          aria-label="Menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
        </button>
      </div>
    </header>
  );
}
