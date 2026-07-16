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
import ErrorBoundary from "@/components/common/ErrorBoundary";

/** Dominio donde vive el admin (cerrado con Basic Auth en Dokploy). */
const ADMIN_HOST =
  (import.meta.env.VITE_ADMIN_HOST as string | undefined) ||
  "admin.jeetpstudio.com";

/**
 * Solo sirve el panel cuando estás en el dominio de admin (o en local para
 * desarrollo). Desde cualquier otro dominio, /admin reenvía al subdominio
 * protegido en vez de mostrar el editor.
 */
function AdminGate() {
  const host = window.location.hostname;
  const isLocal =
    host === "localhost" || host === "127.0.0.1" || host.endsWith(".local");
  const onAdminHost = host === ADMIN_HOST || host.startsWith("admin.");
  if (!isLocal && !onAdminHost) {
    window.location.replace(`https://${ADMIN_HOST}/admin`);
    return null;
  }
  return <AdminPanel />;
}

export default function App() {
  const { loading } = useContent();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const isHome = location.pathname === "/";

  if (loading) {
    return (
      <div className="boot">
        <div className="boot-word">
          {"LOADING".split("").map((ch, i) => (
            <span key={i}>{ch}</span>
          ))}
        </div>
        <div className="boot-bar" />
      </div>
    );
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
        <div className="route-fade" key={location.pathname}>
          <ErrorBoundary>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/case-studies" element={<Cases />} />
            <Route path="/case-studies/:id" element={<CaseStudy />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<AdminGate />} />
            <Route path="*" element={<Home />} />
          </Routes>
          </ErrorBoundary>
        </div>
      </main>
    </LayoutProvider>
  );
}
