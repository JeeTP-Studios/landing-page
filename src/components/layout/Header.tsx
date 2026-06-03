import { useNavigate } from "react-router-dom";
import { useLayout } from "./LayoutContext";
import Logo from "./Logo";

export default function Header() {
  const { crumb, menuOpen, setMenuOpen } = useLayout();
  const navigate = useNavigate();

  return (
    <header>
      <div className="hleft">
        <Logo />
        {crumb ? <div className="crumb">{crumb}</div> : null}
      </div>
      <div className="hgroup">
        <button
          className="hbtn gear"
          aria-label="Admin"
          onClick={() => navigate("/admin")}
        >
          ⚙
        </button>
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
