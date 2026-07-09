/**
 * controllers/fraudController.js — CyberShield AI
 * ─────────────────────────────────────────────────────
 * Handles fraud analysis request/response logic.
 *
 * Accepts a piece of text (e.g. a suspicious SMS, email,
 * or transaction description) and returns a structured
 * fraud risk assessment from the AI service layer.
 * ─────────────────────────────────────────────────────
 */

// Import the AI service layer (placeholder logic for now)
const { analyzeFraudRisk } = require("../services/aiService");

/**
 * analyzeContent
 * ──────────────────────────────────────────────────────
 * Handles: POST /api/fraud/analyze
 *
 * Reads the suspicious content from req.body.content,
 * forwards it to the fraud analysis service, and returns
 * a structured risk report.
 *
 * Response shape:
 * {
 *   success: true,
 *   data: {
 *     riskScore:       number (0–100),
 *     threatCategory:  string,
 *     explanation:     string,
 *     recommendation:  string,
 *     analyzedAt:      ISO timestamp
 *   }
 * }
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const analyzeContent = async (req, res, next) => {
  try {
    const { content } = req.body;

    // ── Input validation ────────────────────────────
    if (!content || typeof content !== "string" || content.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Request body must include a non-empty 'content' field.",
      });
    }

    // ── Character limit guard ───────────────────────
    // 10 000 chars allows for OCR/PDF extracted text without truncation.
    if (content.trim().length > 10000) {
      return res.status(400).json({
        success: false,
        error: "Content exceeds the maximum allowed length of 10 000 characters.",
      });
    }

    // ── Call service layer ──────────────────────────
    // In a real implementation this would call an AI model.
    // For now the service returns hardcoded placeholder data.
    const analysis = await analyzeFraudRisk(content.trim());

    // ── Send response ───────────────────────────────
    return res.status(200).json({
      success: true,
      data: {
        ...analysis,
        analyzedAt: new Date().toISOString(),
      },
    });

  } catch (error) {
    next(error);
  }
};

module.exports = { analyzeContent };
