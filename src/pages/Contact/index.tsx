import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSite } from "@/content/ContentContext";
import { grad } from "@/lib/style";
import { useReveal } from "@/hooks/useReveal";
import { useCrumb } from "@/components/layout/LayoutContext";
import ScrollCue from "@/components/common/ScrollCue";
import Footer from "@/components/layout/Footer";

export default function Contact() {
  const c = useSite();
  const cp = c.contactPage;
  const [region, setRegion] = useState(0);
  const [form, setForm] = useState({
    service: "",
    name: "",
    phone: "",
    email: "",
    company: "",
    msg: "",
  });

  useCrumb(
    <>
      <Link to="/">HOME</Link> › <span className="on">CONTACT</span>
    </>
  );
  useReveal([cp]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    c.contact.mapQuery || c.contact.location
  )}&output=embed`;

  const formText = () =>
    `Service: ${form.service}\nName: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\nCompany: ${form.company}\n\nProject:\n${form.msg}`;

  const validate = () => {
    if (!form.email && !form.name) {
      alert("Please enter at least your name or email.");
      return false;
    }
    return true;
  };

  const send = () => {
    if (!validate()) return;
    const subj = encodeURIComponent(
      "New contact from the website" +
        (form.company ? " — " + form.company : "")
    );
    window.location.href = `mailto:${c.contact.email}?subject=${subj}&body=${encodeURIComponent(formText())}`;
  };

  // WhatsApp: más confiable que mailto (no depende de un cliente de correo
  // configurado). Usa el número del contacto global.
  const sendWhatsApp = () => {
    if (!validate()) return;
    const num = (c.contact.whatsapp || c.contact.phone).replace(/[^\d]/g, "");
    if (!num) return send();
    window.open(
      `https://wa.me/${num}?text=${encodeURIComponent(formText())}`,
      "_blank",
      "noopener"
    );
  };

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <>
      <section className="phero">
        <div
          className="ov"
          style={{ background: grad(cp.hero), opacity: cp.hero.opacity }}
        />
        <div className="pin-content">
          <div className="eye">{cp.hero.eyebrow}</div>
          <h1>{cp.hero.title}</h1>
          <p className="sub">{cp.hero.sub}</p>
          <div className="cregion" style={{ marginTop: 40 }}>
            {cp.regions.map((r, i) => (
              <button
                key={i}
                className={i === region ? "on" : ""}
                onClick={() => setRegion(i)}
              >
                {r.flag ? <span>{r.flag}</span> : null}
                {r.name}
              </button>
            ))}
          </div>
        </div>
        <ScrollCue id="ccir" />
      </section>

      <section className="sect">
        <div className="wrap">
          <div className="cinfo reveal">
            <div>
              <h3>{c.brand.name}</h3>
              <div className="ci-lbl">Address</div>
              <div className="ci-v">{c.contact.address}</div>
              <div className="ci-lbl">E-mail</div>
              <div className="ci-v">{c.contact.email}</div>
              <div className="ci-lbl">Phone · WhatsApp</div>
              <div className="ci-v">{c.contact.phone}</div>
            </div>
            <div className="cmap">
              <iframe
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={mapSrc}
                title="map"
              />
            </div>
          </div>

          <div className="cgrid reveal">
            <div>
              <h2>{cp.interestedTitle}</h2>
            </div>
            <div className="cform">
              <span
                className="br tl"
                style={{
                  position: "absolute",
                  top: 14,
                  left: 14,
                  width: 22,
                  height: 22,
                  border: "2px solid var(--line-2)",
                  borderRight: 0,
                  borderBottom: 0,
                }}
              />
              <span
                className="br brr"
                style={{
                  position: "absolute",
                  bottom: 14,
                  right: 14,
                  width: 22,
                  height: 22,
                  border: "2px solid var(--line-2)",
                  borderLeft: 0,
                  borderTop: 0,
                }}
              />
              <div className="git">{c.ui.contactForm.getInTouch}</div>
              <div className="gsub">{cp.getInTouch}</div>
              <select value={form.service} onChange={set("service")}>
                <option value="">{c.ui.contactForm.service}</option>
                {c.servicesPage.groups.map((g, i) => (
                  <option key={i}>{g.title}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder={c.ui.contactForm.name}
                value={form.name}
                onChange={set("name")}
              />
              <input
                type="text"
                placeholder={c.ui.contactForm.phone}
                value={form.phone}
                onChange={set("phone")}
              />
              <input
                type="email"
                placeholder={c.ui.contactForm.email}
                value={form.email}
                onChange={set("email")}
              />
              <input
                type="text"
                placeholder={c.ui.contactForm.company}
                value={form.company}
                onChange={set("company")}
              />
              <textarea
                placeholder={c.ui.contactForm.message}
                value={form.msg}
                onChange={set("msg")}
              />
              <div className="send-row">
                <button className="send" onClick={sendWhatsApp}>
                  Send via WhatsApp <span>→</span>
                </button>
                <button className="send send-alt" onClick={send}>
                  {c.ui.contactForm.send} <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
