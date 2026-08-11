import { Link } from "react-router-dom";
import { ArrowRight } from "@phosphor-icons/react";
import { useSite } from "@/content/ContentContext";
import { useReveal } from "@/hooks/useReveal";
import { NAV_KEYS } from "./LayoutContext";
import Logo from "./Logo";

export default function Footer() {
  const c = useSite();
  const ui = c.ui;
  useReveal([]);
  const copyright = ui.footer.copyright
    .replace(/\{name\}/g, c.brand.name)
    .replace(/\{year\}/g, String(new Date().getFullYear()));

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-cta reveal">
          <h2>{ui.footer.ctaText}</h2>
          <Link to="/contact" className="btn">
            {ui.buttons.contact}
            <ArrowRight size={16} weight="bold" />
          </Link>
        </div>

        <div className="foot-grid">
          <div className="foot-brand">
            <Logo />
            <span className="foot-line">Email</span>
            <a className="foot-val" href={`mailto:${c.contact.email}`}>
              {c.contact.email}
            </a>
            <span className="foot-line">WhatsApp</span>
            <a
              className="foot-val"
              href={`https://wa.me/${(c.contact.whatsapp || "").replace(
                /\D/g,
                ""
              )}`}
              target="_blank"
              rel="noreferrer"
            >
              {c.contact.whatsapp}
            </a>
            <span className="foot-line">Based in</span>
            <span className="foot-val">{c.contact.location}</span>
          </div>

          <div className="foot-col">
            <h5>{ui.footer.navTitle}</h5>
            {NAV_KEYS.map(([to, key]) => (
              <Link key={to} to={to}>
                {ui.nav[key]}
              </Link>
            ))}
          </div>

          <div className="foot-col">
            <h5>{ui.footer.servicesTitle}</h5>
            {c.servicesPage.groups.map((g) => (
              <Link key={g.title} to="/services">
                {g.title}
              </Link>
            ))}
          </div>

          <div className="foot-col">
            <h5>{ui.footer.socialTitle}</h5>
            {ui.footer.social.map((s) => (
              <a key={s.label} href={s.url} target="_blank" rel="noreferrer">
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div className="foot-bot">
          <span>{copyright}</span>
          <span>{ui.footer.madeIn}</span>
        </div>
      </div>
    </footer>
  );
}
