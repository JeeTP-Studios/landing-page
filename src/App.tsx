import { Suspense, lazy } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useContent } from "@/content/ContentContext";
import { LayoutProvider } from "@/components/layout/LayoutContext";
import Header from "@/components/layout/Header";
import Menu from "@/components/layout/Menu";
import Home from "@/pages/Home";
import ErrorBoundary from "@/components/common/ErrorBoundary";

/* Home ships in the first chunk because it is the landing surface. Everything
   else, including the whole editor, is fetched only when it is asked for. */
const About = lazy(() => import("@/pages/About"));
const Services = lazy(() => import("@/pages/Services"));
const Cases = lazy(() => import("@/pages/Cases"));
const CaseStudy = lazy(() => import("@/pages/CaseStudy"));
const Contact = lazy(() => import("@/pages/Contact"));
const AdminPanel = lazy(() => import("@/admin/AdminPanel"));

/** Host where the admin lives (Basic Auth in front of it). */
const ADMIN_HOST =
  (import.meta.env.VITE_ADMIN_HOST as string | undefined) ||
  "admin.jeetpstudio.com";

/**
 * The editor is only served from the admin host (or locally). Anywhere else,
 * /admin forwards to the protected subdomain instead of rendering.
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

  if (loading) {
    return (
      <div className="boot">
        <div className="boot-word">Loading</div>
        <div className="boot-bar" />
      </div>
    );
  }

  return (
    <LayoutProvider>
      {!isAdmin && (
        <>
          <Header />
          <Menu />
        </>
      )}
      <main id="app">
        <div className="route-fade" key={location.pathname}>
          <ErrorBoundary>
            <Suspense fallback={<div className="route-pending" />}>
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
            </Suspense>
          </ErrorBoundary>
        </div>
      </main>
    </LayoutProvider>
  );
}
