/**
 * ScamAwareness.jsx — CyberShield AI
 * Interactive scam awareness portal with category filter.
 */

import { useState } from "react";
import "../styles/ScamAwareness.css";

const SCAM_CATEGORIES = ["All", "Digital", "Voice", "Social", "Financial"];

const SCAMS = [
  {
    id: "email-phishing",
    icon: "📧",
    title: "Email Phishing",
    category: "Digital",
    warningSigns: [
      "Sender email doesn't match the claimed organization",
      "Urgent language like 'Act Now' or 'Account will be suspended'",
      "Generic greeting: 'Dear Customer' instead of your name",
      "Suspicious links that don't match the official domain",
      "Attachments you didn't request",
    ],
    realExample:
      "You receive an email claiming to be from 'SBI Security Team' saying your account will be blocked in 24 hours. It asks you to click a link and verify your credentials. The link leads to a fake site that steals your login.",
    safetyTips: [
      "Always check the sender's actual email address (not display name)",
      "Hover over links before clicking to see the real URL",
      "Go directly to the official website instead of clicking email links",
      "Never download unexpected attachments",
      "Report phishing emails to your bank or CERT-In",
    ],
  },
  {
    id: "sms-scam",
    icon: "💬",
    title: "SMS Scam",
    category: "Digital",
    warningSigns: [
      "Unexpected prize or lottery win notifications",
      "Fake KYC update requests with deadlines",
      "Links in SMS from unknown numbers",
      "Requests to call a number to claim rewards",
      "Messages mimicking official sources (TRAI, bank, NPCI)",
    ],
    realExample:
      "You receive an SMS: 'Your SIM will be deactivated today. Call 98XXXXXX to update KYC immediately.' Calling the number connects you to a scammer who asks for your bank OTP to 'verify identity.'",
    safetyTips: [
      "Never click links in SMS from unknown numbers",
      "Your telecom provider NEVER asks for bank OTP via SMS",
      "Verify by calling the official customer care number",
      "Report suspicious SMS to DND (1909) or Sanchar Saathi portal",
      "Block and report spam numbers",
    ],
  },
  {
    id: "voice-scam",
    icon: "📞",
    title: "Voice Scam (Vishing)",
    category: "Voice",
    warningSigns: [
      "Caller claims to be from your bank, TRAI, CBI, or police",
      "Creates panic about account fraud, drug case, or Aadhaar misuse",
      "Asks for OTP, CVV, or PIN to 'secure' your account",
      "Demands you stay on call while making transactions",
      "Threatens arrest or legal action",
    ],
    realExample:
      "You receive a call: 'This is TRAI. Your mobile number is being used for illegal activities. To avoid arrest, transfer ₹50,000 to a safe account immediately.' The caller creates extreme panic and keeps you on the line.",
    safetyTips: [
      "Banks NEVER ask for OTP or PIN on phone calls",
      "CBI/Police do NOT conduct 'digital arrests' via WhatsApp video calls",
      "Hang up and call the official number to verify",
      "Do not transfer money under pressure or panic",
      "Report to Cybercrime helpline: 1930",
    ],
  },
  {
    id: "fake-job",
    icon: "💼",
    title: "Fake Job Scam",
    category: "Social",
    warningSigns: [
      "Job offers on WhatsApp, Telegram, or Instagram without formal process",
      "Work-from-home with unrealistically high pay (₹50K/day for basic tasks)",
      "Requires you to pay registration, training, or equipment fees upfront",
      "Vague job description with no formal company details",
      "Asks for bank account to 'receive salary' immediately",
    ],
    realExample:
      "You see an Instagram ad for 'product rating jobs — earn ₹2000 per hour from home.' You join a Telegram group, complete a few tasks, earn small amounts, then are asked to invest ₹5,000 to unlock higher earnings. You never see the money again.",
    safetyTips: [
      "Legitimate employers never ask for upfront payments",
      "Verify companies on LinkedIn and official websites",
      "Never share bank details before signing an official offer letter",
      "Be skeptical of unusually high pay for simple tasks",
      "Report fake job ads to cybercrime.gov.in",
    ],
  },
  {
    id: "investment-scam",
    icon: "📈",
    title: "Investment Scam",
    category: "Financial",
    warningSigns: [
      "Guaranteed returns of 20–50% per month",
      "Urgency: 'Limited time offer, invest now'",
      "Recruitment-based income (pyramid/Ponzi structure)",
      "No registration with SEBI or RBI",
      "Pressure from friends/family who are also 'invested'",
    ],
    realExample:
      "A friend adds you to a WhatsApp group where 'market experts' share stock tips. They show screenshots of huge profits. You invest ₹1 lakh and initially see returns. When you try to withdraw, you're asked to pay 'tax' or 'processing fee' first. The group disappears.",
    safetyTips: [
      "Verify investment platforms on SEBI's registered intermediaries list",
      "No legitimate investment guarantees fixed high returns",
      "Never invest in platforms recommended only via social media",
      "Be wary of Ponzi/MLM schemes requiring recruitment",
      "Consult a SEBI-registered financial advisor",
    ],
  },
  {
    id: "lottery-scam",
    icon: "🎰",
    title: "Lottery Scam",
    category: "Financial",
    warningSigns: [
      "You've 'won' a lottery you never entered",
      "Must pay processing fee, tax, or customs to claim prize",
      "Prize claims via unofficial channels (WhatsApp, email)",
      "Requests for bank details to 'deposit winnings'",
      "Deadline pressure to claim prize immediately",
    ],
    realExample:
      "Email: 'Congratulations! You've won ₹25 lakh in the KBC Lottery. Send ₹15,000 processing fee to release your prize.' After paying, they ask for more fees for 'customs clearance.' The prize never exists.",
    safetyTips: [
      "You cannot win a lottery you didn't enter",
      "No legitimate lottery charges fees to release winnings",
      "KBC, government lotteries never contact via WhatsApp",
      "Never share your bank account to receive 'winnings'",
      "Report to National Consumer Helpline: 1800-11-4000",
    ],
  },
  {
    id: "romance-scam",
    icon: "💔",
    title: "Romance Scam",
    category: "Social",
    warningSigns: [
      "Met on dating app or social media, relationship escalates very fast",
      "Profile photos look professional or model-like (often stolen)",
      "Claims to work abroad (military, oil rig, doctor)",
      "Emotional bond built over weeks, then money request",
      "Always has an excuse to not video call or meet in person",
    ],
    realExample:
      "You connect with someone on Facebook who claims to be a US Army doctor. After weeks of deep conversations, they need urgent money for a medical emergency or flight ticket. After you send money, they disappear.",
    safetyTips: [
      "Reverse image search profile pictures to check if they're stolen",
      "Video call early to verify identity",
      "Never send money to someone you haven't met in person",
      "Be cautious of anyone who avoids video calls",
      "Tell a trusted friend or family member if you're in an online relationship",
    ],
  },
  {
    id: "fake-shopping",
    icon: "🛒",
    title: "Fake Shopping Scam",
    category: "Digital",
    warningSigns: [
      "Website offering products at 70–90% discount",
      "No verifiable physical address or customer service",
      "Only accepts bank transfer or crypto (no secure payment)",
      "Domain registered recently (check WHOIS)",
      "Poor grammar, stock photos, copied content",
    ],
    realExample:
      "You find a website selling branded shoes at 80% off. You place an order and pay ₹3,000. You receive a cheap counterfeit product or nothing at all. The website disappears within days.",
    safetyTips: [
      "Buy only from established platforms (Amazon, Flipkart, official brand sites)",
      "Verify website HTTPS and domain age before purchasing",
      "Use credit card for online purchases (easier fraud reversal)",
      "Be extremely suspicious of social media ad shops",
      "Check reviews on Trustpilot or Google before ordering",
    ],
  },
];

function ScamCard({ scam }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="scam-card">
      <div className="scam-card__top">
        <span className="scam-icon">{scam.icon}</span>
        <div className="scam-card__meta">
          <h3 className="scam-card__title">{scam.title}</h3>
          <span className="scam-category-badge">{scam.category}</span>
        </div>
      </div>

      <div className="scam-section">
        <h4 className="scam-section-title">⚠️ Warning Signs</h4>
        <ul className="scam-list">
          {scam.warningSigns.map((w, i) => (
            <li key={i}>{w}</li>
          ))}
        </ul>
      </div>

      {expanded && (
        <>
          <div className="scam-section">
            <h4 className="scam-section-title">📖 Real-Life Example</h4>
            <p className="scam-example">{scam.realExample}</p>
          </div>
          <div className="scam-section">
            <h4 className="scam-section-title">✅ Safety Tips</h4>
            <ul className="scam-list scam-tips">
              {scam.safetyTips.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
        </>
      )}

      <button
        className="scam-expand-btn"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        {expanded ? "Show Less ▲" : "Read More & Safety Tips ▼"}
      </button>
    </div>
  );
}

export default function ScamAwareness() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? SCAMS
      : SCAMS.filter((s) => s.category === activeCategory);

  return (
    <main className="inner-page">
      <section className="inner-page__hero">
        <div className="container">
          <div className="inner-page__eyebrow">
            <span className="badge badge-accent">Awareness</span>
          </div>
          <h1 className="inner-page__title">Scam Awareness Centre</h1>
          <p className="inner-page__subtitle">
            Deep-dives into the most common scams with warning signs, real
            examples, and safety tips.
          </p>
        </div>
      </section>

      <section className="container scam-section-main">
        {/* Category Filter */}
        <div className="scam-filter">
          {SCAM_CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`scam-filter-btn ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="scam-grid">
          {filtered.map((scam) => (
            <ScamCard key={scam.id} scam={scam} />
          ))}
        </div>
      </section>
    </main>
  );
}
