/**
 * Footer.jsx — CyberShield AI (Redesigned)
 * Professional footer with links, resources, social icons, contact, copyright.
 */

import { Link } from "react-router-dom";
import { useLang } from "../context/LanguageContext";
import "../styles/Footer.css";

const QUICK_LINKS = [
  { label: "Home",           path: "/" },
  { label: "Learn",          path: "/learn" },
  { label: "Scam Awareness", path: "/scam-awareness" },
  { label: "Fraud Analyzer", path: "/fraud-analyzer" },
  { label: "AI Assistant",   path: "/chat" },
];

const RESOURCES = [
  { label: "Cyber Safety Quiz",  path: "/quiz" },
  { label: "Safety Tips",        path: "/safety-tips" },
  { label: "About",              path: "/about" },
  { label: "CERT-In", href: "https://www.cert-in.org.in" },
  { label: "Cybercrime Portal",  href: "https://cybercrime.gov.in" },
];

const SOCIAL = [
  { icon: "🌐", label: "Website", href: "#" },
  { icon: "💻", label: "GitHub",  href: "https://github.com" },
  { icon: "🔗", label: "LinkedIn", href: "https://linkedin.com" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const { t } = useLang();

  return (
    <footer className="footer">
      <div className="container footer__top">

        {/* ── Brand Column ── */}
        <div className="footer__brand-col">
          <div className="footer__logo">
            <span className="footer__logo-icon">🛡️</span>
            <span className="footer__brand-name">
              CyberShield <span>AI</span>
            </span>
          </div>
          <p className="footer__brand-desc">{t("footer_desc")}</p>
          <span className="footer__ibm-tag">
            🧠 Powered by IBM Granite · IBM SkillsBuild Project
          </span>

          {/* Social Icons */}
          <div className="footer__social">
            {SOCIAL.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                aria-label={s.label}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* ── Quick Links ── */}
        <div className="footer__col">
          <h3 className="footer__col-title">{t("footer_quick")}</h3>
          <ul className="footer__nav-list">
            {QUICK_LINKS.map(({ label, path }) => (
              <li key={path}>
                <Link to={path}>{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Resources ── */}
        <div className="footer__col">
          <h3 className="footer__col-title">{t("footer_resources")}</h3>
          <ul className="footer__nav-list">
            {RESOURCES.map(({ label, path, href }) => (
              <li key={label}>
                {href ? (
                  <a href={href} target="_blank" rel="noopener noreferrer">{label} ↗</a>
                ) : (
                  <Link to={path}>{label}</Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* ── Contact ── */}
        <div className="footer__col">
          <h3 className="footer__col-title">{t("footer_emergency")}</h3>
          <ul className="footer__contact-list">
            <li>
              <span className="contact-label">🚔 Cybercrime Helpline</span>
              <strong className="contact-value">1930</strong>
            </li>
            <li>
              <span className="contact-label">📧 CERT-In</span>
              <span className="contact-value">cert-in.org.in</span>
            </li>
            <li>
              <span className="contact-label">🌐 Report Cybercrime</span>
              <span className="contact-value">cybercrime.gov.in</span>
            </li>
          </ul>
        </div>

      </div>

      {/* ── Bottom Bar ── */}
      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p className="footer__copy">
            &copy; {year} CyberShield AI. {t("footer_copy")}
          </p>
          <p className="footer__disclaimer">{t("footer_disclaimer")}</p>
        </div>
      </div>
    </footer>
  );
}
