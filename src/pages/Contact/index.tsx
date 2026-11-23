import { useState } from "react";
import { WhatsappLogo } from "@phosphor-icons/react";
import { useSite } from "@/content/ContentContext";
import { fill } from "@/lib/text";
import PageHero from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import Pill from "@/components/ui/Pill";
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

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    c.contact.mapQuery || c.contact.location
  )}&output=embed`;

  const set = (k: Field) => (e: { target: { value: string } }) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((prev) => (prev[k] ? { ...prev, [k]: undefined } : prev));
  };

  const validate = (): boolean => {
    const next: Errors = {};
    if (!form.name.trim()) next.name = F.errorName;
    if (!form.email.trim()) {
      next.email = F.errorEmailMissing;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
      next.email = F.errorEmailInvalid;
    }
    if (form.message.trim().length < 12) {
      next.message = F.errorMessage;
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // The select holds the position of the group, so a language switch does not orphan it.
  const service =
    form.service === "" ? "" : c.servicesPage.groups[Number(form.service)]?.title ?? "";

  const body = () =>
    [
      `${F.bodyService}: ${service || F.notSpecified}`,
      `${F.bodyName}: ${form.name}`,
      `${F.bodyCompany}: ${form.company || "-"}`,
      `${F.bodyEmail}: ${form.email}`,
      `${F.bodyPhone}: ${form.phone || "-"}`,
      "",
      `${F.bodyProject}:`,
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
      form.company
        ? fill(F.mailSubjectFrom, { company: form.company })
        : F.mailSubject
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
      <main className="page">
        <PageHero
          eyebrow={cp.hero.eyebrow}
          title={cp.hero.title}
          accent={cp.hero.accent}
          sub={cp.hero.sub}
        >
          <div className="filters" role="group" aria-label={F.regionsLabel}>
            {cp.regions.map((r, i) => (
              <button
                type="button"
                key={i}
                className={`chip ${i === region ? "is-on" : ""}`}
                onClick={() => setRegion(i)}
              >
                {r.flag ? <span aria-hidden="true">{r.flag}</span> : null}
                {r.name}
              </button>
            ))}
          </div>
        </PageHero>

        <section className="sect g contact-info">
          <Reveal className="contact-details">
            <h3 className="h3">{c.brand.name}</h3>
            <small>{F.addressLabel}</small>
            <p>{c.contact.address}</p>
            <small>{F.emailLabel}</small>
            <a href={`mailto:${c.contact.email}`}>{c.contact.email}</a>
            <small>{F.phoneLabel}</small>
            <p>{c.contact.phone}</p>
          </Reveal>
          <Reveal delay={0.08} className="contact-map">
            <iframe
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={mapSrc}
              title={c.contact.location}
            />
          </Reveal>
        </section>

        <section className="sect g contact-grid">
          <Reveal>
            <h2 className="h3">{cp.interestedTitle}</h2>
            <p className="lede">{cp.getInTouch}</p>
          </Reveal>

          <Reveal delay={0.06} className="form">
            {sent ? (
              <div className="form-done" role="status">
                <h3>{F.doneTitle}</h3>
                <p>{sent === "whatsapp" ? F.doneWhatsapp : F.doneEmail}</p>
                <Pill
                  onClick={() => {
                    setSent(null);
                    setForm(EMPTY);
                  }}
                >
                  {F.writeAnother}
                </Pill>
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
                  <select id="f-service" value={form.service} onChange={set("service")}>
                    <option value="">{F.serviceNone}</option>
                    {c.servicesPage.groups.map((g, i) => (
                      <option key={i} value={String(i)}>
                        {g.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field-row">
                  {field("name", F.name)}
                  {field("company", F.company, "text", F.optional)}
                </div>
                <div className="field-row">
                  {field("email", F.email, "email")}
                  {field("phone", F.phone, "tel", F.optional)}
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
                      {F.messageHint}
                    </span>
                  )}
                </div>

                <div className="form-actions">
                  <button type="submit" className="pill">
                    <WhatsappLogo size={18} weight="fill" />
                    {F.sendWhatsapp}
                  </button>
                  <button type="button" className="pill pill-ghost" onClick={sendEmail}>
                    {F.send}
                    <i aria-hidden="true">→</i>
                  </button>
                </div>
              </form>
            )}
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
