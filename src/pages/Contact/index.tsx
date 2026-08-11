import { useEffect, useState } from "react";
import { ArrowRight, WhatsappLogo } from "@phosphor-icons/react";
import { useSite } from "@/content/ContentContext";
import PageHero from "@/components/common/PageHero";
import { Reveal } from "@/components/common/Reveal";
import Footer from "@/components/layout/Footer";

type Field = "service" | "name" | "phone" | "email" | "company" | "message";
type Errors = Partial<Record<Field, string>>;

const EMPTY = {
  service: "",
  name: "",
  phone: "",
  email: "",
  company: "",
  message: "",
};

export default function Contact() {
  const c = useSite();
  const cp = c.contactPage;
  const F = c.ui.contactForm;
  const [region, setRegion] = useState(0);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState<"whatsapp" | "email" | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    c.contact.mapQuery || c.contact.location
  )}&output=embed`;

  const set = (k: Field) => (e: { target: { value: string } }) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((prev) => (prev[k] ? { ...prev, [k]: undefined } : prev));
  };

  const validate = (): boolean => {
    const next: Errors = {};
    if (!form.name.trim()) next.name = "We need a name to reply to.";
    if (!form.email.trim()) {
      next.email = "Add an email so we can get back to you.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
      next.email = "That email address does not look complete.";
    }
    if (form.message.trim().length < 12) {
      next.message = "A sentence or two about the project is enough.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const body = () =>
    [
      `Service: ${form.service || "Not specified"}`,
      `Name: ${form.name}`,
      `Company: ${form.company || "-"}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone || "-"}`,
      "",
      "Project:",
      form.message,
    ].join("\n");

  const sendWhatsApp = () => {
    if (!validate()) return;
    const num = (c.contact.whatsapp || c.contact.phone).replace(/\D/g, "");
    if (!num) return sendEmail();
    window.open(
      `https://wa.me/${num}?text=${encodeURIComponent(body())}`,
      "_blank",
      "noopener"
    );
    setSent("whatsapp");
  };

  const sendEmail = () => {
    if (!validate()) return;
    const subject = encodeURIComponent(
      `New project enquiry${form.company ? ` from ${form.company}` : ""}`
    );
    window.location.href = `mailto:${c.contact.email}?subject=${subject}&body=${encodeURIComponent(
      body()
    )}`;
    setSent("email");
  };

  const field = (
    k: Field,
    label: string,
    type: "text" | "email" | "tel" = "text",
    hint?: string
  ) => (
    <div className="field">
      <label htmlFor={`f-${k}`}>{label}</label>
      <input
        id={`f-${k}`}
        type={type}
        value={form[k]}
        onChange={set(k)}
        aria-invalid={!!errors[k]}
        aria-describedby={errors[k] ? `e-${k}` : hint ? `h-${k}` : undefined}
      />
      {errors[k] ? (
        <span className="field-error" id={`e-${k}`} role="alert">
          {errors[k]}
        </span>
      ) : hint ? (
        <span className="field-hint" id={`h-${k}`}>
          {hint}
        </span>
      ) : null}
    </div>
  );

  return (
    <>
      <PageHero
        eyebrow={cp.hero.eyebrow}
        title={cp.hero.title}
        sub={cp.hero.sub}
        tint={cp.hero}
      >
        <div className="regions" role="group" aria-label="Where you are">
          {cp.regions.map((r, i) => (
            <button
              type="button"
              key={r.name}
              className={`filter ${i === region ? "is-on" : ""}`}
              onClick={() => setRegion(i)}
            >
              {r.flag ? <span aria-hidden>{r.flag}</span> : null}
              {r.name}
            </button>
          ))}
        </div>
      </PageHero>

      <section className="sect-tight">
        <div className="wrap contact-info">
          <Reveal className="contact-details">
            <h3>{c.brand.name}</h3>
            <span className="foot-line">Address</span>
            <span className="foot-val">{c.contact.address}</span>
            <span className="foot-line">Email</span>
            <a className="foot-val" href={`mailto:${c.contact.email}`}>
              {c.contact.email}
            </a>
            <span className="foot-line">Phone and WhatsApp</span>
            <span className="foot-val">{c.contact.phone}</span>
          </Reveal>
          <Reveal delay={0.08} className="contact-map notch">
            <iframe
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={mapSrc}
              title={`Map of ${c.contact.location}`}
            />
          </Reveal>
        </div>
      </section>

      <section className="sect">
        <div className="wrap contact-grid">
          <Reveal>
            <h2 className="contact-title">{cp.interestedTitle}</h2>
            <p className="lede">{cp.getInTouch}</p>
          </Reveal>

          <Reveal delay={0.06} className="form notch">
            {sent ? (
              <div className="form-done" role="status">
                <h3>Your message is on its way.</h3>
                <p>
                  {sent === "whatsapp"
                    ? "We opened WhatsApp with everything filled in. Hit send there and we will reply within one business day."
                    : "We opened your mail client with everything filled in. Send it and we will reply within one business day."}
                </p>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    setSent(null);
                    setForm(EMPTY);
                  }}
                >
                  Write another
                </button>
              </div>
            ) : (
              <form
                noValidate
                onSubmit={(e) => {
                  e.preventDefault();
                  sendWhatsApp();
                }}
              >
                <div className="field">
                  <label htmlFor="f-service">{F.service}</label>
                  <select
                    id="f-service"
                    value={form.service}
                    onChange={set("service")}
                  >
                    <option value="">Choose one</option>
                    {c.servicesPage.groups.map((g) => (
                      <option key={g.title}>{g.title}</option>
                    ))}
                  </select>
                </div>

                <div className="field-row">
                  {field("name", F.name)}
                  {field("company", F.company, "text", "Optional")}
                </div>
                <div className="field-row">
                  {field("email", F.email, "email")}
                  {field("phone", F.phone, "tel", "Optional")}
                </div>

                <div className="field">
                  <label htmlFor="f-message">{F.message}</label>
                  <textarea
                    id="f-message"
                    rows={5}
                    value={form.message}
                    onChange={set("message")}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "e-message" : "h-message"}
                  />
                  {errors.message ? (
                    <span className="field-error" id="e-message" role="alert">
                      {errors.message}
                    </span>
                  ) : (
                    <span className="field-hint" id="h-message">
                      What you want to build, and roughly when.
                    </span>
                  )}
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn">
                    <WhatsappLogo size={17} weight="fill" />
                    {F.sendWhatsapp}
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={sendEmail}
                  >
                    {F.send}
                    <ArrowRight size={16} weight="bold" />
                  </button>
                </div>
              </form>
            )}
          </Reveal>
        </div>
      </section>
      <Footer />
    </>
  );
}
