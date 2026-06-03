import { Route, Routes, useLocation } from "react-router-dom";
import { useContent } from "@/content/ContentContext";
import { LayoutProvider } from "@/components/layout/LayoutContext";
import Header from "@/components/layout/Header";
import Menu from "@/components/layout/Menu";
import SiteBackground from "@/components/layout/SiteBackground";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Cases from "@/pages/Cases";
import CaseStudy from "@/pages/CaseStudy";
import Contact from "@/pages/Contact";
import AdminPanel from "@/admin/AdminPanel";

export default function App() {
  const { loading } = useContent();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const isHome = location.pathname === "/";

  if (loading) {
    return <div className="boot">CARGANDO…</div>;
  }

  return (
    <LayoutProvider>
      <SiteBackground active={isHome && !isAdmin} />
      {!isAdmin && (
        <>
          <Header />
          <Menu />
        </>
      )}
      <main id="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/case-studies" element={<Cases />} />
          <Route path="/case-studies/:id" element={<CaseStudy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </LayoutProvider>
  );
}
