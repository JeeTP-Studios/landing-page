import { useState } from "react";
import { Link } from "react-router-dom";
import { useSite } from "@/content/ContentContext";
import { fill } from "@/lib/text";
import { Reveal } from "@/components/ui/Reveal";
import { stageRef } from "@/components/stage/stageStore";
import { NAV_KEYS } from "./LayoutContext";

/** Giant closing statement. The 3D stack returns behind it on every page. */
export default function Footer() {
  const c = useSite();
  const { closing, contact, ui } = c;
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard blocked: leave the address selected so it can be copied by hand.
      const sel = window.getSelection();
      const node = document.getElementById("foot-email");
      if (sel && node) {
        const r = document.createRange();
        r.selectNodeContents(node);
        sel.removeAllRanges();
        sel.addRange(r);
      }
    }
  };

  return (
    <footer className="foot g" ref={stageRef("footer")} data-edit="closing">
      <p className="kick foot-kick">{closing.kicker}</p>
      <Reveal as={Link} to="/contact" className="talk">
        {closing.word}
      </Reveal>
      <div className="ft">
        <div>
          <small>{closing.emailLabel}</small>
          <button type="button" id="foot-email" onClick={copyEmail}>
            {copied ? closing.emailCopied : contact.email}
          </button>
        </div>
        <div>
          <small>{closing.whatsappLabel}</small>
          <p>{contact.whatsapp}</p>
        </div>
        <div>
          <small>{closing.locationLabel}</small>
          <p>{contact.location}</p>
        </div>
        <div>
          <small>{closing.remoteLabel}</small>
          <p>{closing.remoteValue}</p>
        </div>
      </div>
      <div className="fb">
        <span>
          {fill(ui.footer.copyright, {
            name: c.brand.name,
            year: String(new Date().getFullYear()),
          })}
        </span>
        <nav aria-label="Footer">
          {NAV_KEYS.map(([to, key]) => (
            <Link key={to} to={to}>
              {ui.nav[key]}
            </Link>
          ))}
          {ui.footer.social
            .filter((s) => s.url && s.url.trim() !== "" && s.url !== "#")
            .map((s) => (
            <a key={s.label} href={s.url} target="_blank" rel="noopener">
              {s.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
