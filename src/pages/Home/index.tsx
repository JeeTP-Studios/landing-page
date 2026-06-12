import { useEffect } from "react";
import { useSite } from "@/content/ContentContext";
import { useReveal } from "@/hooks/useReveal";
import { useCrumb } from "@/components/layout/LayoutContext";
import type { HomeSectionKey } from "@/types/content";
import Footer from "@/components/layout/Footer";
import PinnedHero from "./PinnedHero";
import HighlightedBlock from "./HighlightedBlock";
import ServicesPreview from "./ServicesPreview";
import FaqBlock from "./FaqBlock";
import ClientsBlock from "@/components/common/ClientsBlock";

const RENDERERS: Record<HomeSectionKey, () => JSX.Element | null> = {
  highlighted: () => <HighlightedBlock />,
  services: () => <ServicesPreview />,
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
  useCrumb(null, []);
  useReveal([c.order, c.projects]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <PinnedHero />
      {c.order.map((k) => (
        <div key={k}>{RENDERERS[k]()}</div>
      ))}
      <Footer />
    </>
  );
}
