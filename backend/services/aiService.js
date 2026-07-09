const { generateChatResponse } = require("./ibmClient");
const { getKnowledgeBase } = require("./ragService");

/**
 * CyberShield AI - Digital Financial Literacy Assistant (RAG Enabled)
 */
async function getChatReply(message) {

  try {

    // Load knowledge from RBI/NPCI PDF documents
    const knowledge = await getKnowledgeBase();


    const messages = [

      {
        role: "system",
        content: `You are CyberShield AI, a professional Digital Financial Literacy Assistant.

You answer questions using the provided financial literacy knowledge base.

Your responsibilities:
- Educate users about digital payments.
- Explain UPI, IMPS, NEFT, RTGS, debit cards, credit cards and internet banking.
- Teach cybersecurity best practices.
- Explain phishing, smishing, vishing and online banking scams.
- Explain savings, budgeting, interest rates and personal finance.
- Give simple beginner-friendly explanations.

Important rules:
- Use only the provided context for financial information.
- Do not make unsupported claims.
- Do not provide illegal, unsafe or misleading financial advice.
- If the answer is not available in the context, clearly say:
"I could not find this information in the available financial literacy documents."

Financial Literacy Knowledge Base:

${knowledge}
`
      },

      {
        role: "user",
        content: message
      }

    ];


    const response = await generateChatResponse(messages);


    return response.choices[0].message.content;


  } catch (error) {

    console.error(error);


    return "Sorry, I couldn't process your request right now. Please try again later.";

  }

}


/**
 * Fraud Analyzer — Enhanced with comprehensive fraud detection
 * Uses IBM Granite via the existing generateChatResponse pipeline.
 * Returns a structured JSON risk report with extended fields.
 */
async function analyzeFraudRisk(content) {

  try {

    const messages = [

      {
        role: "system",
        content: `You are an expert Cybersecurity and Digital Financial Fraud Analyst with deep knowledge of Indian digital payment ecosystems (UPI, IMPS, NEFT), RBI guidelines, and global cyber-fraud patterns.

Analyze the provided content and detect all indicators of fraud, social engineering, or malicious intent.

Detection checklist — look for ALL of the following:
- Suspicious or spoofed URLs / fake domains (typosquatting, lookalike domains)
- Urgent or threatening language ("Your account will be blocked", "Act immediately")
- Requests for OTP, UPI PIN, CVV, Aadhaar, PAN, passwords, or bank credentials
- Suspicious QR payment requests or payment links
- Fake customer support numbers (unofficial toll-free or mobile numbers)
- Grammar and spelling mistakes typical of scam messages
- Impersonation of banks, RBI, NPCI, government bodies, or well-known brands
- Social engineering tactics (fear, urgency, reward, authority, scarcity)
- Phishing links, shortened URLs, or redirect chains
- Requests for remote access or app installation
- Unsolicited KYC update requests
- Unrealistic investment returns or lottery/prize claims

Threat categories (pick the single best match):
  Phishing | Smishing | Vishing | Fake Banking Website | Fake Loan Offer |
  Investment Scam | QR Code Scam | UPI Fraud | OTP Scam | KYC Scam |
  Identity Theft | Fake Customer Support | Safe / Legitimate | Unknown / Needs Manual Review

Risk scoring guide:
  0–20   → Very low risk — clearly legitimate content
  21–39  → Low risk — minor anomalies, likely safe
  40–59  → Medium risk — suspicious patterns detected, proceed with caution
  60–79  → High risk — strong fraud indicators present
  80–100 → Critical — confirmed scam/fraud patterns

IMPORTANT: Return ONLY valid JSON. No markdown, no explanation text outside JSON.

Required JSON structure:
{
  "riskScore": <integer 0-100>,
  "riskLevel": "<Low | Medium | High | Critical>",
  "threatCategory": "<one category from the list above>",
  "summary": "<2-3 sentence overview of what this content is and why it is or is not suspicious>",
  "redFlags": ["<specific red flag 1>", "<specific red flag 2>"],
  "recommendation": ["<actionable step 1>", "<actionable step 2>"],
  "financialLiteracyTip": "<one practical tip about staying safe in similar situations>",
  "confidence": "<Low | Medium | High>"
}

Rules:
- riskScore must be an integer between 0 and 100.
- riskLevel: Low (0-39), Medium (40-59), High (60-79), Critical (80-100).
- redFlags must be an array of strings; use an empty array [] if none found.
- recommendation must be an array of strings with at least one item.
- financialLiteracyTip must always be a non-empty string.
- confidence reflects how certain you are given the available text.
- Return ONLY valid JSON. Do NOT include any text before or after the JSON object.`
      },

      {
        role: "user",
        content: content
      }

    ];


    const response = await generateChatResponse(messages);


    const aiText = response.choices[0].message.content;


    // Strip markdown code fences if present
    const cleanedText = aiText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();


    const parsed = JSON.parse(cleanedText);

    // Normalise fields so the frontend always receives a consistent shape
    return {
      riskScore:            typeof parsed.riskScore === "number" ? parsed.riskScore : 50,
      riskLevel:            parsed.riskLevel            || "Medium",
      threatCategory:       parsed.threatCategory       || "Unknown / Needs Manual Review",
      summary:              parsed.summary              || parsed.explanation || "",
      redFlags:             Array.isArray(parsed.redFlags) ? parsed.redFlags : [],
      recommendation:       Array.isArray(parsed.recommendation) ? parsed.recommendation
                              : (parsed.recommendation ? [parsed.recommendation] : []),
      financialLiteracyTip: parsed.financialLiteracyTip || "",
      confidence:           parsed.confidence           || "Medium",
    };


  } catch (error) {

    console.error("analyzeFraudRisk error:", error);


    return {
      riskScore:            50,
      riskLevel:            "Medium",
      threatCategory:       "Unknown / Needs Manual Review",
      summary:              "Unable to analyze the content at this time. Please try again.",
      redFlags:             [],
      recommendation:       ["Please try again later. If the message seems suspicious, do not act on it."],
      financialLiteracyTip: "When in doubt, never share OTP, UPI PIN, CVV or Aadhaar with anyone.",
      confidence:           "Low",
    };

  }

}


module.exports = {

  getChatReply,
  analyzeFraudRisk

};