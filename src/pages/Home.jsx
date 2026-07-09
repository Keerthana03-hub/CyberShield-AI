/**
 * Home.jsx — CyberShield AI
 * Premium landing page with hero, stats, features, how-it-works, testimonials, FAQ.
 */

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../context/LanguageContext";
import "../styles/Home.css";

/* ── Animated Counter ── */
function AnimatedCounter({ target, suffix = "", duration = 1800 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const isNum = typeof target === "number";
          if (!isNum) { setCount(target); return; }
          const start = Date.now();
          const tick = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(ease * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref}>
      {typeof target === "number" ? count : count}{suffix}
    </span>
  );
}

const FEATURES = [
  {
    icon: "🎓",
    color: "rgba(0, 212, 255, 0.1)",
    title: "Financial Literacy Hub",
    desc: "Interactive accordion lessons on UPI, debit/credit cards, OTP safety, and net banking.",
    link: "/learn",
  },
  {
    icon: "🕵️",
    color: "rgba(124, 92, 216, 0.1)",
    title: "Scam Awareness Centre",
    desc: "In-depth guides on 8+ scam types with real-world examples and safety tips.",
    link: "/scam-awareness",
  },
  {
    icon: "🤖",
    color: "rgba(16, 185, 129, 0.1)",
    title: "AI Fraud Analyzer",
    desc: "Paste any suspicious message for AI risk scoring powered by IBM Granite.",
    link: "/fraud-analyzer",
  },
  {
    icon: "💬",
    color: "rgba(0, 212, 255, 0.1)",
    title: "AI Chat Assistant",
    desc: "Ask anything about cybersecurity, digital payments, or financial safety.",
    link: "/chat",
  },
  {
    icon: "📝",
    color: "rgba(245, 158, 11, 0.1)",
    title: "Cyber Safety Quiz",
    desc: "15 randomized questions with difficulty levels, scoring, and full review.",
    link: "/quiz",
  },
  {
    icon: "🔒",
    color: "rgba(239, 68, 68, 0.1)",
    title: "Safety Checklists",
    desc: "Interactive security checklists for passwords, 2FA, UPI, ATM, and more.",
    link: "/safety-tips",
  },
];

const HOW_IT_WORKS = [
  { step: "1", icon: "📋", title: "Identify the Threat", desc: "Copy or paste a suspicious SMS, email, or message you've received." },
  { step: "2", icon: "🤖", title: "AI Analysis", desc: "IBM Granite AI analyzes content for phishing indicators, scam patterns, and risk signals." },
  { step: "3", icon: "📊", title: "Risk Score", desc: "Receive a risk score, threat category, explanation, and safety recommendation." },
  { step: "4", icon: "🛡️", title: "Stay Protected", desc: "Take action based on the AI recommendation to protect yourself." },
];

const TESTIMONIALS = [
  {
    name: "Priya S.",
    role: "College Student",
    text: "CyberShield AI helped me understand UPI fraud. I almost fell for a QR code scam — the platform taught me the difference between sending and receiving!",
    rating: 5,
  },
  {
    name: "Rajan M.",
    role: "Small Business Owner",
    text: "The Fraud Analyzer is incredible. I pasted a suspicious vendor email and it immediately flagged it as high-risk phishing. Saved me from a big loss.",
    rating: 5,
  },
  {
    name: "Anita K.",
    role: "Senior Citizen",
    text: "The learn page explained net banking in simple language. I finally feel confident doing online transactions. The safety tips checklist is very useful.",
    rating: 5,
  },
];

const FAQ_ITEMS = [
  {
    q: "Is CyberShield AI free to use?",
    a: "Yes, CyberShield AI is completely free. It's an IBM SkillsBuild educational project built to help everyone stay safe online.",
  },
  {
    q: "Does the AI store my messages?",
    a: "No. Messages sent to the Fraud Analyzer or AI Assistant are processed in real time and are not stored anywhere on our servers.",
  },
  {
    q: "What AI model powers CyberShield AI?",
    a: "CyberShield AI uses IBM Granite foundation models via IBM watsonx.ai — IBM's enterprise-grade AI platform.",
  },
  {
    q: "How accurate is the Fraud Analyzer?",
    a: "The Fraud Analyzer uses IBM Granite to analyze patterns, language, and context. It provides a risk assessment — always trust your judgment and contact your bank for confirmation.",
  },
  {
    q: "Can I use CyberShield AI on mobile?",
    a: "Yes! CyberShield AI is fully responsive and works on all devices — smartphones, tablets, and desktops.",
  },
];

function FAQItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item ${open ? "faq-open" : ""}`}>
      <button className="faq-question" onClick={() => setOpen((v) => !v)}>
        {item.q}
        <span className="faq-chevron">{open ? "▲" : "▼"}</span>
      </button>
      {open && <p className="faq-answer">{item.a}</p>}
    </div>
  );
}

export default function Home() {
  const { t } = useLang();

  return (
    <main>

      {/* ═══════════════════════════
          Hero
      ═══════════════════════════ */}
      <section className="hero section">
        <div className="container">
          <div className="hero__content">
            <div className="hero__eyebrow">
              <span className="badge badge-accent">{t("hero_badge")}</span>
            </div>

            <h1 className="hero__title">
              {t("hero_title_1")}{" "}
              <span className="hero__title-accent">{t("hero_title_2")}</span>{" "}
              {t("hero_title_3")}
            </h1>

            <p className="hero__description">{t("hero_desc")}</p>

            <div className="hero__actions">
              <Link to="/fraud-analyzer" className="btn btn-primary">
                {t("hero_cta_analyzer")}
              </Link>
              <Link to="/learn" className="btn btn-outline">
                {t("hero_cta_learn")}
              </Link>
            </div>

            {/* Animated Stats */}
            <div className="hero__stats">
              <div className="hero__stat">
                <span className="hero__stat-value">
                  <AnimatedCounter target={8} suffix="+" />
                </span>
                <span className="hero__stat-label">{t("stat_scam_types")}</span>
              </div>
              <div className="hero__stat">
                <span className="hero__stat-value">
                  <AnimatedCounter target={15} />
                </span>
                <span className="hero__stat-label">{t("stat_quiz_q")}</span>
              </div>
              <div className="hero__stat">
                <span className="hero__stat-value">
                  <AnimatedCounter target={100} suffix="%" />
                </span>
                <span className="hero__stat-label">{t("stat_free")}</span>
              </div>
              <div className="hero__stat">
                <span className="hero__stat-value">AI</span>
                <span className="hero__stat-label">{t("stat_ibm")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════
          Feature Cards
      ═══════════════════════════ */}
      <section className="features section">
        <div className="container">
          <div className="features__header">
            <span className="badge badge-accent">{t("features_badge")}</span>
            <h2 className="page-title" style={{ marginTop: "0.75rem" }}>
              {t("features_title")}
            </h2>
            <p className="features__subtitle">{t("features_subtitle")}</p>
          </div>

          <div className="features__grid">
            {FEATURES.map(({ icon, color, title, desc, link }) => (
              <Link to={link} className="feature-card" key={title}>
                <div className="feature-card__icon" style={{ background: color }}>
                  {icon}
                </div>
                <h3 className="feature-card__title">{title}</h3>
                <p className="feature-card__desc">{desc}</p>
                <span className="feature-card__cta">{t("features_cta")}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════
          Why CyberShield AI
      ═══════════════════════════ */}
      <section className="why-section section">
        <div className="container">
          <div className="why__header">
            <span className="badge badge-accent">Why Us</span>
            <h2 className="page-title" style={{ marginTop: "0.75rem" }}>
              Why CyberShield AI?
            </h2>
          </div>
          <div className="why__grid">
            <div className="why-card">
              <span className="why-icon">🧠</span>
              <h3>IBM Granite AI</h3>
              <p>Powered by IBM's enterprise-grade foundation models for accurate fraud detection and intelligent responses.</p>
            </div>
            <div className="why-card">
              <span className="why-icon">📚</span>
              <h3>Education First</h3>
              <p>We don't just detect fraud — we teach you why it happens and how to protect yourself permanently.</p>
            </div>
            <div className="why-card">
              <span className="why-icon">🇮🇳</span>
              <h3>India-Focused</h3>
              <p>Content tailored for Indian users covering UPI, NEFT, Aadhaar fraud, TRAI scams, and RBI guidelines.</p>
            </div>
            <div className="why-card">
              <span className="why-icon">📱</span>
              <h3>Mobile Friendly</h3>
              <p>Fully responsive design that works perfectly on all screen sizes, from mobile to desktop.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════
          How It Works
      ═══════════════════════════ */}
      <section className="how-section section">
        <div className="container">
          <div className="features__header">
            <span className="badge badge-accent">How It Works</span>
            <h2 className="page-title" style={{ marginTop: "0.75rem" }}>
              Analyze Any Suspicious Content in Seconds
            </h2>
          </div>
          <div className="how-steps">
            {HOW_IT_WORKS.map((h) => (
              <div key={h.step} className="how-step">
                <div className="how-step__num">{h.step}</div>
                <div className="how-step__icon">{h.icon}</div>
                <h3 className="how-step__title">{h.title}</h3>
                <p className="how-step__desc">{h.desc}</p>
              </div>
            ))}
          </div>
          <div className="how-cta">
            <Link to="/fraud-analyzer" className="btn btn-primary">
              🔍 Try Fraud Analyzer
            </Link>
            <Link to="/chat" className="btn btn-outline">
              💬 Chat with AI
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════
          Testimonials
      ═══════════════════════════ */}
      <section className="testimonials section">
        <div className="container">
          <div className="features__header">
            <span className="badge badge-accent">Testimonials</span>
            <h2 className="page-title" style={{ marginTop: "0.75rem" }}>
              What Users Say
            </h2>
          </div>
          <div className="testimonials__grid">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="testimonial-card card">
                <div className="testimonial-stars">
                  {"★".repeat(t.rating)}
                </div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <span className="testimonial-name">{t.name}</span>
                  <span className="testimonial-role">{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════
          FAQ
      ═══════════════════════════ */}
      <section className="faq-section section">
        <div className="container">
          <div className="faq__header">
            <span className="badge badge-accent">FAQ</span>
            <h2 className="page-title" style={{ marginTop: "0.75rem" }}>
              Frequently Asked Questions
            </h2>
          </div>
          <div className="faq-list">
            {FAQ_ITEMS.map((item, i) => (
              <FAQItem key={i} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════
          CTA Banner
      ═══════════════════════════ */}
      <section className="cta-banner section">
        <div className="container">
          <div className="cta-banner__inner">
            <div className="cta-banner__icon">🛡️</div>
            <h2 className="cta-banner__title">Ready to Protect Yourself?</h2>
            <p className="cta-banner__desc">
              Start by analyzing a suspicious message or take the quiz to test
              your cyber awareness.
            </p>
            <div className="cta-banner__actions">
              <Link to="/fraud-analyzer" className="btn btn-primary">
                🔍 Analyze Now
              </Link>
              <Link to="/quiz" className="btn btn-outline">
                📝 Take Quiz
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
