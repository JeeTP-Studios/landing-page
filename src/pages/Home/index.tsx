import type { ReactNode } from "react";
import { useSite } from "@/content/ContentContext";
import { isHomeSectionEnabled } from "@/lib/home";
import type { HomeSectionKey } from "@/types/content";
import Footer from "@/components/layout/Footer";
import Hero from "./Hero";
import Manifesto from "./Manifesto";
import AboutBlock from "./AboutBlock";
import Solutions from "./Solutions";
import WorkList from "./WorkList";
import Clients from "@/components/ui/Clients";
import Products from "./Products";
import Process from "./Process";
import FaqBlock from "./FaqBlock";

const SECTIONS: Record<HomeSectionKey, () => ReactNode> = {
  manifesto: () => <Manifesto />,
  about: () => <AboutBlock />,
  solutions: () => <Solutions />,
  work: () => <WorkList />,
  clients: () => <Clients />,
  products: () => <Products />,
  process: () => <Process />,
  faq: () => <FaqBlock />,
};

/** Section order is CMS-controlled; the hero and the footer are fixed anchors. */
export default function Home() {
  const c = useSite();
  return (
    <>
      <main className="home">
        <Hero />
        {c.order
          .filter((k) => isHomeSectionEnabled(c, k))
          .map((k) => (
            <div key={k} className={`home-${k}`}>
              {SECTIONS[k]()}
            </div>
          ))}
      </main>
      <Footer />
    </>
  );
}
