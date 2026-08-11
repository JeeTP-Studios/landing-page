import { useEffect } from "react";
import { useSite } from "@/content/ContentContext";
import type { HomeSectionKey } from "@/types/content";
import Footer from "@/components/layout/Footer";
import ClientsBlock from "@/components/common/ClientsBlock";
import Hero from "./Hero";
import WorkRail from "./WorkRail";
import StatsBand from "./StatsBand";
import ServicesPreview from "./ServicesPreview";
import ProcessStrip from "./ProcessStrip";
import FaqBlock from "./FaqBlock";

/** Section order is CMS-controlled; the hero and footer are fixed anchors. */
const RENDERERS: Record<HomeSectionKey, () => JSX.Element | null> = {
  highlighted: () => <WorkRail />,
  stats: () => <StatsBand />,
  services: () => <ServicesPreview />,
  process: () => <ProcessStrip />,
  clients: () => <ClientsWrapper />,
  faq: () => <FaqBlock />,
};

function ClientsWrapper() {
  const c = useSite();
  if (!c.clients.enabled) return null;
  return <ClientsBlock title={c.clients.title} />;
}

export default function Home() {
  const c = useSite();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Hero />
      {c.order.map((k) => (
        <div key={k}>{RENDERERS[k]?.() ?? null}</div>
      ))}
      <Footer />
    </>
  );
}
