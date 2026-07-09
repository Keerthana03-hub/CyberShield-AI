/**
 * Learn.jsx — CyberShield AI
 * Interactive Financial Literacy Hub with accordion topics.
 */

import { useState } from "react";
import "../styles/Learn.css";

const TOPICS = [
  {
    id: "digital-banking",
    icon: "🏦",
    title: "Digital Banking Basics",
    desc: "Understand how online banking works, its benefits, and how to stay secure.",
    content: `Digital banking lets you manage your finances entirely online or through a mobile app.
You can check balances, transfer funds, pay bills, and even open accounts without visiting a branch.

Key benefits:
• 24/7 access to your account from anywhere
• Instant fund transfers via NEFT, RTGS, IMPS
• Paperless statements and e-receipts
• Real-time transaction alerts

Safety best practices:
1. Always use official bank apps downloaded from trusted stores
2. Never share OTP, passwords, or CVV — even with "bank staff"
3. Enable two-factor authentication (2FA) on all accounts
4. Regularly review transaction history for unauthorized charges
5. Log out completely after every session on shared devices`,
    learnMore: "https://www.rbi.org.in",
  },
  {
    id: "upi",
    icon: "📱",
    title: "UPI Payments",
    desc: "Learn how Unified Payments Interface works and how to transact safely.",
    content: `UPI (Unified Payments Interface) is a real-time payment system developed by NPCI that lets you transfer money instantly between bank accounts using a VPA (Virtual Payment Address).

How UPI works:
• You create a UPA like yourname@bankname
• Send or receive money 24/7, including weekends and holidays
• Supported apps: PhonePe, GPay, Paytm, BHIM, and more

🚨 Critical UPI safety rules:
1. RECEIVING money NEVER requires you to enter your PIN
2. Scammers will say "I'm sending you ₹500, please enter PIN to receive" — THIS IS FRAUD
3. Scan QR codes only from trusted merchants
4. Never share your UPI PIN with anyone, ever
5. Check the recipient UPI ID carefully before confirming`,
    learnMore: "https://www.npci.org.in/what-we-do/upi/product-overview",
  },
  {
    id: "debit-card",
    icon: "💳",
    title: "Debit Card Safety",
    desc: "How debit cards work and how to protect yourself from card fraud.",
    content: `A debit card lets you spend directly from your bank account. Unlike credit cards, there is no credit — the money is deducted immediately.

Types of transactions:
• Point-of-Sale (POS): Swipe at physical stores
• Online: Used for e-commerce purchases
• ATM withdrawals: Cash access anywhere

Safety tips:
1. Never share your 16-digit card number, CVV, or PIN
2. Cover the keypad when entering your PIN at ATMs
3. Check for skimming devices on ATM card slots
4. Enable SMS/email alerts for every transaction
5. Report lost or stolen cards immediately by calling your bank's helpline
6. Avoid using debit cards on unfamiliar or unsecured websites — prefer virtual cards or UPI`,
    learnMore: "#",
  },
  {
    id: "credit-card",
    icon: "🪙",
    title: "Credit Card Management",
    desc: "Responsible use of credit cards and avoiding debt traps.",
    content: `Credit cards allow you to borrow money from the bank up to a set credit limit. You repay it later, usually within a billing cycle of 30–45 days.

Smart credit card habits:
• Pay the FULL balance every month to avoid high interest (24–48% annually)
• Never pay just the "minimum due" — interest compounds very quickly
• Keep credit utilization below 30% of your limit
• Review all charges on your statement carefully each month

Fraud prevention:
1. Never share OTP for card transactions
2. Enable international transactions ONLY when traveling abroad
3. Use virtual card numbers for online shopping
4. Immediately dispute unauthorized transactions via your bank app
5. Freeze your card instantly from the app if you suspect fraud`,
    learnMore: "#",
  },
  {
    id: "net-banking",
    icon: "💻",
    title: "Net Banking",
    desc: "Internet banking features, risks, and how to bank safely online.",
    content: `Net banking (internet banking) gives you full access to your bank account through a web browser.

Key features:
• Fund transfers (NEFT/RTGS/IMPS)
• Bill payments (electricity, water, gas, credit card)
• Fixed and recurring deposit management
• Loan applications and EMI payments
• Account statement downloads

Security checklist:
1. Always type the bank URL manually — never click links from emails
2. Check for HTTPS and padlock in the browser address bar
3. Never use net banking on public WiFi
4. Set a strong, unique password (not your birth date or phone number)
5. Enable transaction limits for added protection
6. Log out after every session and clear browser cache`,
    learnMore: "#",
  },
  {
    id: "mobile-banking",
    icon: "📲",
    title: "Mobile Banking",
    desc: "Using bank apps safely and securing your mobile device.",
    content: `Mobile banking apps let you perform all banking operations from your smartphone. They are generally safer than web browsers because they use certificate pinning and biometric authentication.

Best practices:
• Download apps ONLY from official app stores (Google Play / Apple App Store)
• Verify the app developer name matches your bank
• Enable biometric login (fingerprint/face ID) if available
• Set up app lock with a strong PIN
• Keep the app updated to get security patches

If your phone is lost:
1. Call your bank immediately to block mobile banking access
2. Use another device to change your net banking password
3. File a police complaint if sensitive data may be compromised
4. Use the "remote wipe" feature on Android/iOS if enabled`,
    learnMore: "#",
  },
  {
    id: "qr-payments",
    icon: "📷",
    title: "QR Code Payments",
    desc: "How QR payments work and how fraudsters exploit them.",
    content: `QR (Quick Response) codes encode payment information. When you scan a merchant's QR code and enter an amount, money flows FROM your account TO the merchant.

How legitimate QR payments work:
• You scan → enter amount → confirm with PIN → done
• You NEVER need to enter your PIN to RECEIVE money

QR Code Scams to watch out for:
1. "Scan this QR to get your refund" — scanning lets them CHARGE you
2. Fraudsters overlay fake QR stickers on legitimate merchant QR codes
3. Always verify the merchant name shown after scanning
4. Never scan QR codes sent via WhatsApp, email, or unknown sources
5. Be extra careful at petrol pumps, street vendors, and new shops

Golden rule: You scan to PAY, never to receive.`,
    learnMore: "#",
  },
  {
    id: "otp-safety",
    icon: "🔑",
    title: "OTP Safety",
    desc: "Why OTPs are your last line of defense and how to protect them.",
    content: `OTP (One-Time Password) is a 4–8 digit code sent via SMS or email to verify your identity. It is valid for a very short time (usually 1–5 minutes).

Why OTPs matter:
• They are the final verification step for transactions
• Even if a fraudster has your card number + CVV, they cannot transact without your OTP
• This is why fraudsters use social engineering to trick you into sharing OTPs

Common OTP scams:
1. "I'm from your bank's fraud prevention team — share OTP to block unauthorized transaction"
2. "You've won ₹10,000 — share OTP to receive your prize"
3. Fake customer care calls asking for OTP to "verify your identity"

🚨 Absolute rules:
• NO bank, company, or government authority will EVER ask for your OTP
• Never share OTP on call, SMS, WhatsApp, or any other channel
• If you accidentally share an OTP, immediately call your bank to block the transaction`,
    learnMore: "#",
  },
];

function TopicCard({ topic }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`topic-card ${open ? "topic-card--open" : ""}`}>
      <button
        className="topic-card__header"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="topic-card__icon">{topic.icon}</span>
        <span className="topic-card__info">
          <span className="topic-card__title">{topic.title}</span>
          <span className="topic-card__desc">{topic.desc}</span>
        </span>
        <span className="topic-card__chevron">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="topic-card__body">
          <pre className="topic-card__content">{topic.content}</pre>
          {topic.learnMore && topic.learnMore !== "#" && (
            <a
              href={topic.learnMore}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline topic-card__learn-btn"
            >
              Learn More →
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default function Learn() {
  return (
    <main className="inner-page">
      <section className="inner-page__hero">
        <div className="container">
          <div className="inner-page__eyebrow">
            <span className="badge badge-accent">Education</span>
          </div>
          <h1 className="inner-page__title">Financial Literacy Hub</h1>
          <p className="inner-page__subtitle">
            Interactive lessons on digital banking, payment methods, and
            cybersecurity — expand any topic to learn more.
          </p>
        </div>
      </section>

      <section className="container learn-section">
        <div className="learn-grid">
          {TOPICS.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      </section>
    </main>
  );
}
