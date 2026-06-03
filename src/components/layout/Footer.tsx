import { Link } from "react-router-dom";
import { useSite } from "@/content/ContentContext";
import Logo from "./Logo";

export default function Footer() {
  const c = useSite();
  const ui = c.ui;
  const copyright = ui.footer.copyright
    .replace(/\{name\}/g, c.brand.name)
    .replace(/\{year\}/g, String(new Date().getFullYear()));
  return (
    <footer>
      <div className="wrap">
        <div className="fcols">
          <div className="fbrand">
            <Logo />
            <div className="fl">E-mail</div>
            <div className="fa">{c.contact.email}</div>
            <div className="fl">WhatsApp</div>
            <div className="fa">{c.contact.whatsapp}</div>
            <div className="fl">Ubicacion</div>
            <div className="fa">{c.contact.location}</div>
          </div>
          <div className="fcol">
            <h5>{ui.footer.navTitle}</h5>
            <Link to="/">{ui.nav.home}</Link>
            <Link to="/about">{ui.nav.about}</Link>
            <Link to="/services">{ui.nav.services}</Link>
            <Link to="/case-studies">{ui.nav.cases}</Link>
            <Link to="/contact">{ui.nav.contact}</Link>
          </div>
          <div className="fcol">
            <h5>{ui.footer.servicesTitle}</h5>
            {c.servicesPage.groups.map((g, i) => (
              <Link key={i} to="/services">
                {g.title}
              </Link>
            ))}
          </div>
          <div className="fcol">
            <h5>{ui.footer.socialTitle}</h5>
            {ui.footer.social.map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noreferrer">
                {s.label}
              </a>
            ))}
          </div>
        </div>
        <div className="hireus">
          <span>{ui.footer.ctaText}</span>
          <Link to="/contact">{ui.footer.ctaButton}</Link>
        </div>
        <div className="fbot">
          <span>{copyright}</span>
          <span>{ui.footer.madeIn}</span>
        </div>
      </div>
    </footer>
  );
}
