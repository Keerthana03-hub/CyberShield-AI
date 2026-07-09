/**
 * App.jsx — CyberShield AI
 * Root component: wires up React Router, Navbar, Footer, and all page routes.
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/* ── Language context ── */
import { LanguageProvider } from "./context/LanguageContext";

/* ── Layout components ── */
import Navbar  from "./components/Navbar";
import Footer  from "./components/Footer";

/* ── Pages ── */
import Home          from "./pages/Home";
import Learn         from "./pages/Learn";
import ScamAwareness from "./pages/ScamAwareness";
import FraudAnalyzer from "./pages/FraudAnalyzer";
import Chat          from "./pages/Chat";
import Quiz          from "./pages/Quiz";
import SafetyTips    from "./pages/SafetyTips";
import About         from "./pages/About";

/* ── Global styles ── */
import "./styles/global.css";

/* ─────────────────────────────────────────────────
   404 — Not Found
───────────────────────────────────────────────── */
function NotFound() {
  return (
    <main className="inner-page">
      <div className="container" style={{ textAlign: "center", paddingTop: "4rem" }}>
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🔍</div>
        <h1 className="page-title">404 — Page Not Found</h1>
        <p className="page-subtitle" style={{ margin: "1rem auto" }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <a href="/" className="btn btn-primary" style={{ marginTop: "1.5rem" }}>
          Back to Home
        </a>
      </div>
    </main>
  );
}

/* ─────────────────────────────────────────────────
   App — Shell layout wrapping all routes
───────────────────────────────────────────────── */
export default function App() {
  return (
    <LanguageProvider>
    <Router>
      {/* Persistent top navigation */}
      <Navbar />

      {/* Page content — swaps out per route */}
      <Routes>
        <Route path="/"               element={<Home />} />
        <Route path="/learn"          element={<Learn />} />
        <Route path="/scam-awareness" element={<ScamAwareness />} />
        <Route path="/fraud-analyzer" element={<FraudAnalyzer />} />
        <Route path="/chat"           element={<Chat />} />
        <Route path="/quiz"           element={<Quiz />} />
        <Route path="/safety-tips"    element={<SafetyTips />} />
        <Route path="/about"          element={<About />} />
        {/* Catch-all 404 */}
        <Route path="*"               element={<NotFound />} />
      </Routes>

      {/* Persistent footer */}
      <Footer />
    </Router>
    </LanguageProvider>
  );
}
