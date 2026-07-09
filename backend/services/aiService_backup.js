/**
 * services/aiService.js — CyberShield AI
 * ─────────────────────────────────────────────────────
 * The service layer acts as a clean boundary between
 * controllers and external integrations (AI models,
 * databases, third-party APIs).
 *
 * Controllers call these functions without knowing HOW
 * the data is obtained — making it easy to swap in a
 * real AI model later (e.g. IBM Granite) by only
 * changing this file.
 *
 * Current state: PLACEHOLDER — returns hardcoded mock
 * data so the API is immediately testable end-to-end.
 * ─────────────────────────────────────────────────────
 */

// ── Placeholder threat categories ────────────────────
// In a real implementation, the AI model would classify
// the content into one of these categories.
const THREAT_CATEGORIES = [
  "Phishing",
  "Smishing (SMS Phishing)",
  "Vishing (Voice Phishing)",
  "Investment Fraud",
  "Romance Scam",
  "Identity Theft",
  "Lottery / Prize Scam",
  "Tech Support Scam",
  "Advance Fee Fraud",
  "Legitimate Content",
];

/**
 * getChatReply
 * ──────────────────────────────────────────────────────
 * Simulates a conversational AI assistant reply.
 *
 * TODO: Replace the body of this function with a real
 *       call to IBM Granite or another LLM API.
 *
 * @param  {string} message - The user's chat message
 * @returns {Promise<string>} - The assistant's reply
 */
const getChatReply = async (message) => {
  // Simulate a small processing delay (as a real AI would have)
  await simulateDelay(300);

  // Placeholder reply — acknowledges the message and gives
  // generic financial literacy guidance.
  return (
    `Thank you for your message: "${message}". ` +
    `CyberShield AI is here to help you stay safe online. ` +
    `Our AI assistant will be fully integrated soon. In the ` +
    `meantime, explore our Safety Tips and Scam Awareness sections ` +
    `for expert guidance on protecting your finances.`
  );
};

/**
 * analyzeFraudRisk
 * ──────────────────────────────────────────────────────
 * Simulates AI-driven fraud analysis of a text input.
 *
 * Returns a structured risk report with:
 *   - riskScore       : 0 (safe) – 100 (high risk)
 *   - threatCategory  : classified scam type
 *   - explanation     : why this risk score was assigned
 *   - recommendation  : what the user should do next
 *
 * TODO: Replace the body of this function with a real
 *       call to IBM Granite or a fraud-detection model.
 *
 * @param  {string} content - The suspicious text to analyse
 * @returns {Promise<object>} - Structured fraud risk report
 */
const analyzeFraudRisk = async (content) => {
  // Simulate AI processing time
  await simulateDelay(500);

  // ── Placeholder analysis ──────────────────────────
  // A real implementation would pass `content` to an AI
  // model and parse its structured output.
  return {
    riskScore: 72,
    threatCategory: "Phishing",
    explanation:
      "The provided content contains characteristics commonly associated " +
      "with phishing attempts, including urgency language, requests for " +
      "personal information, and suspicious link patterns. The risk score " +
      "of 72/100 indicates a HIGH likelihood of fraudulent intent.",
    recommendation:
      "Do NOT click any links or provide personal information. " +
      "Report this message to your bank or relevant authority immediately. " +
      "Block the sender and delete the message.",
  };
};

// ── Helper ────────────────────────────────────────────
/**
 * simulateDelay
 * Mimics the async latency of a real AI API call.
 * Remove this in production when real calls are in place.
 *
 * @param {number} ms - milliseconds to wait
 */
const simulateDelay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = { getChatReply, analyzeFraudRisk };