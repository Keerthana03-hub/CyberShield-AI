/**
 * About.jsx — CyberShield AI
 * Short, professional About page.
 * Sections: Introduction · Mission · Key Features · Technology Stack · Future Scope
 * All static labels use the LanguageContext for multilingual support.
 */

import { useLang } from "../context/LanguageContext";
import "../styles/About.css";
import "../styles/Pages.css";

/* ── Static data ─────────────────────────────────── */
const FEATURES = [
  { icon: "🤖", title: "AI Chat Assistant",       desc: "Conversational IBM Granite AI for answering cybersecurity and financial queries." },
  { icon: "🔍", title: "Fraud Analyzer",           desc: "Paste any suspicious message and get an instant AI-powered risk score." },
  { icon: "🎓", title: "Financial Literacy Hub",   desc: "Interactive lessons on UPI, net banking, debit cards, OTP safety, and more." },
  { icon: "🕵️", title: "Scam Awareness Portal",    desc: "Filterable library of 8 common scam types with examples and red flags." },
  { icon: "📝", title: "Cyber Safety Quiz",        desc: "15-question randomized quiz with difficulty levels and performance summary." },
  { icon: "✅", title: "Safety Checklists",        desc: "Interactive checklists to track and improve your cybersecurity hygiene." },
];

const TECH_STACK = [
  { icon: "⚛️", name: "React.js",         desc: "Frontend UI library for fast, interactive single-page applications." },
  { icon: "🟢", name: "Node.js",          desc: "JavaScript runtime powering the backend REST API server." },
  { icon: "🚀", name: "Express.js",       desc: "Minimalist web framework for building clean REST API endpoints." },
  { icon: "🧠", name: "IBM Granite AI",   desc: "Foundation model via IBM watsonx.ai for fraud detection and chat." },
  { icon: "☁️", name: "IBM watsonx.ai",   desc: "IBM's enterprise AI platform hosting the Granite model." },
  { icon: "🔗", name: "React Router",     desc: "Client-side routing for smooth single-page navigation." },
];

const FUTURE_SCOPE = [
  { num: "01", text: "WhatsApp bot integration for real-time fraud reporting." },
  { num: "02", text: "Browser extension for live phishing detection." },
  { num: "03", text: "Real-time SMS scanning via device APIs." },
  { num: "04", text: "Gamified learning badges and a leaderboard system." },
  { num: "05", text: "Community forum for reporting and discussing new scam patterns." },
  { num: "06", text: "Expanded language support including Bengali and Telugu." },
];

export default function About() {
  const { t } = useLang();

  return (
    <main className="inner-page">

      {/* ═══════════════════════
          Page Hero
      ═══════════════════════ */}
      <section className="inner-page__hero">
        <div className="container">
          <div className="inner-page__eyebrow">
            <span className="badge badge-accent">{t("about_badge")}</span>
          </div>
          <h1 className="inner-page__title">{t("about_title")}</h1>
          <p className="inner-page__subtitle">{t("about_subtitle")}</p>
        </div>
      </section>

      <div className="about-content">

        {/* ═══════════════════════
            1. Project Introduction
        ═══════════════════════ */}
        <section className="container about-section">
          <div className="about-section-header">
            <span className="badge badge-accent">{t("about_intro_badge")}</span>
            <h2 className="about-section-title">{t("about_intro_title")}</h2>
          </div>
          <div className="about-intro-body card">
            <p className="about-intro-text">
              <strong>CyberShield AI</strong> is an AI-powered digital financial
              literacy and fraud awareness platform built as part of the{" "}
              <strong>IBM SkillsBuild</strong> internship programme. It uses{" "}
              <strong>IBM Granite</strong> foundation models via{" "}
              <strong>IBM watsonx.ai</strong> to provide real-time fraud analysis
              and intelligent cybersecurity guidance to everyday users — with a
              focus on India's growing digital payment ecosystem.
            </p>
            <p className="about-intro-text">
              The platform bridges the knowledge gap between ordinary citizens
              and the fast-evolving world of cybercrime, offering practical tools
              and education in one accessible interface.
            </p>
          </div>
        </section>

        {/* ═══════════════════════
            2. Mission
        ═══════════════════════ */}
        <section className="container about-section">
          <div className="about-section-header">
            <span className="badge badge-accent">{t("about_mission_badge")}</span>
            <h2 className="about-section-title">{t("about_mission_title")}</h2>
          </div>
          <div className="about-mv-grid">
            <div className="about-mv-card card">
              <span className="about-mv-icon">🎯</span>
              <h3 className="about-mv-title">Mission</h3>
              <p className="about-mv-desc">
                To educate every digital citizen about cybersecurity threats,
                financial fraud, and safe online practices — making AI-powered
                protection accessible to all.
              </p>
            </div>
            <div className="about-mv-card card">
              <span className="about-mv-icon">🔭</span>
              <h3 className="about-mv-title">Vision</h3>
              <p className="about-mv-desc">
                A world where no one falls victim to digital fraud because they
                were empowered with the right knowledge, tools, and real-time AI
                assistance at their fingertips.
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════
            3. Key Features
        ═══════════════════════ */}
        <section className="container about-section">
          <div className="about-section-header">
            <span className="badge badge-accent">{t("about_features_badge")}</span>
            <h2 className="about-section-title">{t("about_features_title")}</h2>
          </div>
          <div className="about-features-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="about-feature-card card">
                <span className="about-feature-icon">{f.icon}</span>
                <h3 className="about-feature-title">{f.title}</h3>
                <p className="about-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════
            4. Technology Stack
        ═══════════════════════ */}
        <section className="container about-section">
          <div className="about-section-header">
            <span className="badge badge-accent">{t("about_tech_badge")}</span>
            <h2 className="about-section-title">{t("about_tech_title")}</h2>
          </div>
          <div className="tech-grid">
            {TECH_STACK.map((t_item) => (
              <div key={t_item.name} className="tech-card card">
                <span className="tech-icon">{t_item.icon}</span>
                <h3 className="tech-name">{t_item.name}</h3>
                <p className="tech-desc">{t_item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════
            5. Future Scope
        ═══════════════════════ */}
        <section className="container about-section">
          <div className="about-section-header">
            <span className="badge badge-accent">{t("about_future_badge")}</span>
            <h2 className="about-section-title">{t("about_future_title")}</h2>
          </div>
          <div className="future-grid">
            {FUTURE_SCOPE.map((item) => (
              <div key={item.num} className="future-item card">
                <span className="future-num">{item.num}</span>
                <p className="future-text">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════
            IBM Credit Banner
        ═══════════════════════ */}
        <section className="container about-section">
          <div className="ibm-credit card">
            <div className="ibm-credit__icon">🧠</div>
            <div>
              <h3 className="ibm-credit__title">Powered by IBM Granite via IBM watsonx.ai</h3>
              <p className="ibm-credit__desc">
                CyberShield AI uses <strong>IBM Granite</strong> foundation
                models hosted on <strong>IBM watsonx.ai</strong> to power its
                AI Chat Assistant and Fraud Analyzer — built as part of the{" "}
                <strong>IBM SkillsBuild</strong> internship initiative.
              </p>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
