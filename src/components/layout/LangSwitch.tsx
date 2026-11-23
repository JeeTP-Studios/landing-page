import { useLanguage } from "@/content/LanguageContext";
import { LANGS } from "@/content/i18n";
import { useSite } from "@/content/ContentContext";

/** EN | ES. The choice is stored and survives reloads. */
export default function LangSwitch({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLanguage();
  const { ui } = useSite();
  return (
    <div className={`lang ${className}`.trim()} role="group" aria-label={ui.language.label}>
      {LANGS.map((l, i) => (
        <span key={l}>
          {i > 0 ? <span className="lang-sep" aria-hidden="true">|</span> : null}
          <button
            type="button"
            className={l === lang ? "is-on" : ""}
            aria-pressed={l === lang}
            aria-label={`${ui.language.switchTo}: ${l.toUpperCase()}`}
            lang={l}
            onClick={() => setLang(l)}
          >
            {l.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
