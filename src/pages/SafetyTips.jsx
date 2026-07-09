/**
 * SafetyTips.jsx — CyberShield AI
 * Interactive cybersecurity safety checklist cards.
 */

import { useState } from "react";
import "../styles/SafetyTips.css";

const TIPS_DATA = [
  {
    id: "passwords",
    icon: "🔐",
    title: "Strong Passwords",
    color: "tip-blue",
    checks: [
      "Use at least 12 characters with a mix of upper/lowercase, numbers, and symbols",
      "Never use personal info (birthday, name, pet name)",
      "Use a unique password for every account",
      "Use a password manager (Bitwarden, 1Password)",
      "Change passwords immediately if you suspect a breach",
      "Never share passwords via SMS, email, or WhatsApp",
    ],
  },
  {
    id: "2fa",
    icon: "🛡️",
    title: "Two-Factor Authentication",
    color: "tip-purple",
    checks: [
      "Enable 2FA on all banking and financial apps",
      "Enable 2FA on email accounts (Gmail, Outlook)",
      "Enable 2FA on social media (Instagram, Facebook, Twitter)",
      "Prefer authenticator apps (Google Authenticator) over SMS 2FA",
      "Store backup codes in a safe offline location",
      "Revoke 2FA from old/lost devices immediately",
    ],
  },
  {
    id: "browsing",
    icon: "🌐",
    title: "Safe Browsing",
    color: "tip-teal",
    checks: [
      "Always check for HTTPS (padlock icon) before entering personal data",
      "Avoid clicking on pop-up ads or survey pop-ups",
      "Keep your browser updated to the latest version",
      "Use an ad-blocker extension (uBlock Origin)",
      "Don't download software from unknown websites",
      "Clear browser history and cookies regularly",
    ],
  },
  {
    id: "public-wifi",
    icon: "📡",
    title: "Public WiFi Safety",
    color: "tip-orange",
    checks: [
      "Avoid doing banking transactions on public WiFi",
      "Use a VPN when connecting to public networks",
      "Don't access sensitive accounts (bank, email) on public WiFi",
      "Forget public WiFi networks after use",
      "Disable auto-connect to open networks in settings",
      "Prefer mobile data over unknown public WiFi",
    ],
  },
  {
    id: "upi-safety",
    icon: "📱",
    title: "UPI Safety",
    color: "tip-green",
    checks: [
      "Never enter PIN to receive money — only to send",
      "Verify merchant name before confirming QR code payment",
      "Set daily transaction limits in your UPI app",
      "Don't scan QR codes received via WhatsApp or email",
      "Report suspicious requests immediately to bank",
      "Keep UPI PIN different from ATM PIN and net banking password",
    ],
  },
  {
    id: "atm-safety",
    icon: "🏧",
    title: "ATM Safety",
    color: "tip-red",
    checks: [
      "Cover the keypad with your hand when entering PIN",
      "Check for skimming devices on the card slot (wiggle it slightly)",
      "Avoid ATMs in isolated or poorly lit areas, especially at night",
      "Never accept help from strangers at ATM",
      "Collect your card and receipt before leaving",
      "If card gets stuck, call the bank helpline immediately (not numbers on posters near ATM)",
    ],
  },
  {
    id: "social-media",
    icon: "👥",
    title: "Social Media Safety",
    color: "tip-pink",
    checks: [
      "Set all personal accounts to private",
      "Don't post sensitive info (address, phone, ID, travel plans)",
      "Audit which apps have access to your social media accounts",
      "Use a strong password + 2FA on all social accounts",
      "Think before accepting friend requests from strangers",
      "Don't click on external links in DMs from unknown people",
    ],
  },
  {
    id: "online-shopping",
    icon: "🛒",
    title: "Online Shopping Safety",
    color: "tip-yellow",
    checks: [
      "Buy only from trusted, well-known platforms",
      "Verify seller ratings and reviews before purchase",
      "Use credit card instead of debit card for online purchases",
      "Never save card details on shopping websites",
      "Check return and refund policies before ordering",
      "Avoid deals that seem too good to be true",
    ],
  },
];

function TipCard({ tip }) {
  const [checked, setChecked] = useState(Array(tip.checks.length).fill(false));

  const completed = checked.filter(Boolean).length;
  const total = tip.checks.length;
  const percent = Math.round((completed / total) * 100);

  function toggle(i) {
    setChecked((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  }

  return (
    <div className={`tip-card card ${tip.color}`}>
      <div className="tip-card__header">
        <span className="tip-icon">{tip.icon}</span>
        <div>
          <h3 className="tip-title">{tip.title}</h3>
          <p className="tip-progress-label">
            {completed}/{total} completed
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="tip-progress-track">
        <div
          className="tip-progress-fill"
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      {/* Checklist */}
      <ul className="tip-checklist">
        {tip.checks.map((item, i) => (
          <li
            key={i}
            className={`tip-check-item ${checked[i] ? "checked" : ""}`}
            onClick={() => toggle(i)}
            role="checkbox"
            aria-checked={checked[i]}
            tabIndex={0}
            onKeyDown={(e) => e.key === " " || e.key === "Enter" ? toggle(i) : null}
          >
            <span className="tip-checkbox">{checked[i] ? "✅" : "⬜"}</span>
            <span className="tip-check-text">{item}</span>
          </li>
        ))}
      </ul>

      {completed === total && (
        <div className="tip-complete-badge">
          🎉 All done! Great job staying safe.
        </div>
      )}
    </div>
  );
}

export default function SafetyTips() {
  return (
    <main className="inner-page">
      <section className="inner-page__hero">
        <div className="container">
          <div className="inner-page__eyebrow">
            <span className="badge badge-accent">Best Practices</span>
          </div>
          <h1 className="inner-page__title">Digital Safety Tips</h1>
          <p className="inner-page__subtitle">
            Interactive checklists for cybersecurity best practices. Check off
            items as you implement them to track your digital safety score.
          </p>
        </div>
      </section>

      <section className="container tips-section">
        <div className="tips-grid">
          {TIPS_DATA.map((tip) => (
            <TipCard key={tip.id} tip={tip} />
          ))}
        </div>
      </section>
    </main>
  );
}
