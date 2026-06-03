import { useSite } from "@/content/ContentContext";

/** Fondo global del sitio (sólo se muestra en el home). */
export default function SiteBackground({ active }: { active: boolean }) {
  const { bg } = useSite();
  return (
    <div id="siteBg">
      {active && bg.type === "image" && bg.url ? (
        <img src={bg.url} alt="" />
      ) : active && bg.type === "video" && bg.url ? (
        <video autoPlay muted loop playsInline src={bg.url} />
      ) : null}
    </div>
  );
}
