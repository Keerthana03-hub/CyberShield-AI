/**
 * Navbar.jsx — CyberShield AI
 * Sticky navigation with logo, nav links, language selector, and mobile hamburger.
 * The "Try Analyzer" CTA button has been removed — links only.
 */

import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useLang } from "../context/LanguageContext";
import "../styles/Navbar.css";

/* Nav items — labels resolved from the active language dictionary */
const NAV_KEYS = [
  { key: "nav_home",  icon: "🏠", path: "/" },
  { key: "nav_learn", icon: "🎓", path: "/learn" },
  { key: "nav_scam",  icon: "🕵️", path: "/scam-awareness" },
  { key: "nav_analyzer", icon: "🔍", path: "/fraud-analyzer" },
  { key: "nav_chat",  icon: "🤖", path: "/chat" },
  { key: "nav_quiz",  icon: "📝", path: "/quiz" },
  { key: "nav_tips",  icon: "🔒", path: "/safety-tips" },
  { key: "nav_about", icon: "ℹ️",  path: "/about" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t, lang, setLang, LANGUAGES } = useLang();

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu  = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="container navbar__inner">

        {/* ── Logo ── */}
        <Link to="/" className="navbar__logo" onClick={closeMenu}>
          <div className="navbar__logo-icon" aria-hidden="true">🛡️</div>
          <span className="navbar__logo-text">
            CyberShield <span>AI</span>
          </span>
        </Link>

        {/* ── Navigation Links ── */}
        <nav aria-label="Main navigation">
          <ul className={`navbar__links${menuOpen ? " open" : ""}`}>
            {NAV_KEYS.map(({ key, icon, path }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  end={path === "/"}
                  className={({ isActive }) => isActive ? "active" : undefined}
                  onClick={closeMenu}
                >
                  <span className="nav-icon" aria-hidden="true">{icon}</span>
                  <span>{t(key)}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── Language Selector ── */}
        <div className="navbar__lang">
          <select
            className="lang-select"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            aria-label="Select language"
          >
            {LANGUAGES.map(({ code, label }) => (
              <option key={code} value={code}>{label}</option>
            ))}
          </select>
        </div>

        {/* ── Hamburger ── */}
        <button
          className={`navbar__toggle${menuOpen ? " toggle--open" : ""}`}
          onClick={toggleMenu}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>

      </div>
    </header>
  );
}
