/**
 * context/LanguageContext.jsx — CyberShield AI
 * ─────────────────────────────────────────────────────
 * Provides multilingual support for static UI labels.
 *
 * Supported languages:
 *   en  — English (default)
 *   ta  — Tamil
 *   hi  — Hindi
 *
 * Usage:
 *   const { t, lang, setLang } = useLang();
 *   t("nav_home")   // → "Home" / "முகப்பு" / "होम"
 *
 * Only static UI labels are translated here.
 * Backend APIs, routes, and business logic are NOT affected.
 * ─────────────────────────────────────────────────────
 */

import { createContext, useContext, useState } from "react";

// ── Supported language list ───────────────────────────
export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "ta", label: "தமிழ்" },
  { code: "hi", label: "हिन्दी" },
];

// ── Translation dictionary ────────────────────────────
// Keys are stable identifiers. Each key maps to a
// translated string per language code.
const DICT = {
  // ── Navbar ──────────────────────────────────────────
  nav_home:     { en: "Home",          ta: "முகப்பு",       hi: "होम" },
  nav_learn:    { en: "Learn",         ta: "கற்றல்",        hi: "सीखें" },
  nav_scam:     { en: "Scam Awareness",ta: "மோசடி விழிப்புணர்வு", hi: "स्कैम जागरूकता" },
  nav_analyzer: { en: "Analyzer",      ta: "பகுப்பாய்வு",   hi: "विश्लेषक" },
  nav_chat:     { en: "AI Assistant",  ta: "AI உதவியாளர்",  hi: "AI सहायक" },
  nav_quiz:     { en: "Quiz",          ta: "வினாடி வினா",   hi: "प्रश्नोत्तरी" },
  nav_tips:     { en: "Tips",          ta: "குறிப்புகள்",   hi: "सुझाव" },
  nav_about:    { en: "About",         ta: "பற்றி",         hi: "परिचय" },

  // ── Home Hero ───────────────────────────────────────
  hero_badge:      { en: "AI-Powered Protection",          ta: "AI-இயக்கப்படும் பாதுகாப்பு", hi: "AI-संचालित सुरक्षा" },
  hero_title_1:    { en: "Your Intelligent",               ta: "உங்கள் புத்திசாலித்தனமான",   hi: "आपकी बुद्धिमान" },
  hero_title_2:    { en: "Digital Financial",              ta: "டிஜிட்டல் நிதி",              hi: "डिजिटल वित्तीय" },
  hero_title_3:    { en: "Security Shield",                ta: "பாதுகாப்பு கேடயம்",            hi: "सुरक्षा ढाल" },
  hero_desc:       { en: "CyberShield AI combines IBM Granite AI with real-world financial literacy to help you detect fraud, avoid scams, and stay safe in an increasingly digital world.",
                     ta: "CyberShield AI, IBM Granite AI-ஐ உண்மையான நிதி கல்வியுடன் இணைத்து மோசடிகளை கண்டறிந்து பாதுகாப்பாக இருக்க உதவுகிறது.",
                     hi: "CyberShield AI, IBM Granite AI को वित्तीय साक्षरता के साथ जोड़कर धोखाधड़ी पहचानने और ऑनलाइन सुरक्षित रहने में मदद करता है।" },
  hero_cta_analyzer: { en: "🚀 Try Fraud Analyzer", ta: "🚀 மோசடி பகுப்பாய்வு",      hi: "🚀 फ्रॉड एनालाइज़र" },
  hero_cta_learn:    { en: "Explore Lessons",        ta: "பாடங்களை ஆராயுங்கள்",       hi: "पाठ्यक्रम देखें" },
  stat_scam_types:   { en: "Scam Types Covered",     ta: "மோசடி வகைகள்",              hi: "घोटाले के प्रकार" },
  stat_quiz_q:       { en: "Quiz Questions",          ta: "வினா கேள்விகள்",            hi: "प्रश्न" },
  stat_free:         { en: "Free to Use",             ta: "இலவசமாக பயன்படுத்தலாம்",   hi: "उपयोग करने के लिए निःशुल्क" },
  stat_ibm:          { en: "IBM Granite Powered",     ta: "IBM Granite இயக்கப்படுகிறது", hi: "IBM Granite संचालित" },

  // ── Features Section ────────────────────────────────
  features_badge:    { en: "What We Offer",         ta: "நாங்கள் வழங்குவது",         hi: "हम क्या प्रदान करते हैं" },
  features_title:    { en: "Everything You Need to Stay Safe", ta: "பாதுகாப்பாக இருக்க தேவையான அனைத்தும்", hi: "सुरक्षित रहने के लिए सब कुछ" },
  features_subtitle: { en: "Six powerful modules designed to educate, protect, and empower you against modern digital threats.",
                        ta: "நவீன டிஜிட்டல் அச்சுறுத்தல்களுக்கு எதிராக உங்களை கல்வி கற்பிக்கவும் பாதுகாக்கவும் வடிவமைக்கப்பட்ட ஆறு சக்திவாய்ந்த தொகுதிகள்.",
                        hi: "आधुनिक डिजिटल खतरों से बचाने के लिए छह शक्तिशाली मॉड्यूल।" },
  features_cta:      { en: "Explore →",             ta: "ஆராயுங்கள் →",               hi: "देखें →" },

  // ── About Page ──────────────────────────────────────
  about_badge:         { en: "Our Mission",                   ta: "எங்கள் நோக்கம்",              hi: "हमारा मिशन" },
  about_title:         { en: "About CyberShield AI",          ta: "CyberShield AI பற்றி",        hi: "CyberShield AI के बारे में" },
  about_subtitle:      { en: "An IBM SkillsBuild internship project using IBM Granite AI to democratise digital financial literacy and fraud prevention.",
                          ta: "IBM Granite AI-ஐ பயன்படுத்தி டிஜிட்டல் நிதி கல்வியை ஜனநாயகமாக்கும் IBM SkillsBuild பயிற்சி திட்டம்.",
                          hi: "IBM Granite AI का उपयोग करके डिजिटल वित्तीय साक्षरता को लोकतांत्रिक बनाने वाला IBM SkillsBuild इंटर्नशिप प्रोजेक्ट।" },
  about_intro_badge:   { en: "Project Introduction",          ta: "திட்ட அறிமுகம்",              hi: "परियोजना परिचय" },
  about_intro_title:   { en: "What is CyberShield AI?",       ta: "CyberShield AI என்றால் என்ன?", hi: "CyberShield AI क्या है?" },
  about_mission_badge: { en: "Mission",                       ta: "நோக்கம்",                     hi: "मिशन" },
  about_mission_title: { en: "Our Mission",                   ta: "எங்கள் நோக்கம்",              hi: "हमारा मिशन" },
  about_features_badge: { en: "Key Features",                 ta: "முக்கிய அம்சங்கள்",           hi: "मुख्य विशेषताएं" },
  about_features_title: { en: "What We Built",                ta: "நாங்கள் கட்டியது",             hi: "हमने क्या बनाया" },
  about_tech_badge:    { en: "Technology",                    ta: "தொழில்நுட்பம்",               hi: "तकनीक" },
  about_tech_title:    { en: "Technology Stack",              ta: "தொழில்நுட்ப தொகுப்பு",        hi: "तकनीकी स्टैक" },
  about_future_badge:  { en: "Roadmap",                       ta: "வழிகாட்டி",                   hi: "रोडमैप" },
  about_future_title:  { en: "Future Scope",                  ta: "எதிர்கால திட்டங்கள்",         hi: "भविष्य की योजनाएं" },

  // ── Footer ──────────────────────────────────────────
  footer_desc:     { en: "AI-powered cybersecurity education platform. Detect fraud, learn digital safety, and stay protected online.",
                     ta: "AI இயக்கப்படும் இணைய பாதுகாப்பு கல்வி தளம். மோசடியை கண்டறிந்து ஆன்லைனில் பாதுகாப்பாக இருங்கள்.",
                     hi: "AI-संचालित साइबर सुरक्षा शिक्षा मंच। धोखाधड़ी पहचानें और ऑनलाइन सुरक्षित रहें।" },
  footer_quick:    { en: "Quick Links",       ta: "விரைவு இணைப்புகள்",    hi: "त्वरित लिंक" },
  footer_resources:{ en: "Resources",         ta: "வளங்கள்",              hi: "संसाधन" },
  footer_emergency:{ en: "Emergency Contacts",ta: "அவசர தொடர்புகள்",      hi: "आपातकालीन संपर्क" },
  footer_copy:     { en: "All rights reserved.", ta: "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டுள்ளன.", hi: "सर्वाधिकार सुरक्षित।" },
  footer_disclaimer: { en: "For educational purposes. Always verify with official sources.",
                        ta: "கல்வி நோக்கங்களுக்காக மட்டுமே. எப்போதும் அதிகாரப்பூர்வ ஆதாரங்களுடன் சரிபார்க்கவும்.",
                        hi: "केवल शैक्षिक उद्देश्यों के लिए। हमेशा आधिकारिक स्रोतों से सत्यापित करें।" },
};

// ── Context ───────────────────────────────────────────
const LanguageContext = createContext(null);

/**
 * LanguageProvider
 * Wrap your entire app (in App.jsx) with this provider.
 * It exposes { t, lang, setLang, LANGUAGES } to all children.
 */
export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");

  /**
   * t(key) — translate a key into the active language.
   * Falls back to English if a translation is missing.
   */
  const t = (key) => {
    const entry = DICT[key];
    if (!entry) return key; // show key itself if unknown
    return entry[lang] ?? entry["en"] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ t, lang, setLang, LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * useLang — convenience hook for consuming the context.
 * Throws if used outside a LanguageProvider.
 */
export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within a LanguageProvider");
  return ctx;
}
