import { useNavigate } from "react-router-dom";
import { useLayout } from "./LayoutContext";
import { useSite } from "@/content/ContentContext";

export default function Menu() {
  const { menuOpen, setMenuOpen } = useLayout();
  const navigate = useNavigate();
  const { nav } = useSite().ui;
  const LINKS: [string, string][] = [
    ["/", nav.home],
    ["/about", nav.about],
    ["/services", nav.services],
    ["/case-studies", nav.cases],
    ["/contact", nav.contact],
  ];

  const go = (to: string) => {
    setMenuOpen(false);
    navigate(to);
  };

  return (
    <nav className={`menu ${menuOpen ? "open" : ""}`}>
      {LINKS.map(([to, label]) => (
        <a key={to} onClick={() => go(to)}>
          {label}
        </a>
      ))}
    </nav>
  );
}
