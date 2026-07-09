/**
 * controllers/chatController.js — CyberShield AI
 * ─────────────────────────────────────────────────────
 * Handles chat-related request/response logic.
 *
 * A controller function:
 *   1. Reads and validates the incoming request body.
 *   2. Calls the relevant service (AI, DB, etc.).
 *   3. Sends a structured JSON response.
 *   4. Passes unexpected errors to Express error handler.
 * ─────────────────────────────────────────────────────
 */

// Import the AI service layer (placeholder logic for now)
const { getChatReply } = require("../services/aiService");

/**
 * sendMessage
 * ──────────────────────────────────────────────────────
 * Handles: POST /api/chat
 *
 * Reads the user's message from req.body.message,
 * forwards it to the AI service, and returns the reply.
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const sendMessage = async (req, res, next) => {
  try {
    const { message } = req.body;

    // ── Input validation ────────────────────────────
    // Ensure the client actually sent a non-empty message.
    if (!message || typeof message !== "string" || message.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Request body must include a non-empty 'message' field.",
      });
    }

    // ── Call service layer ──────────────────────────
    // In a real implementation this would call IBM Granite or
    // another AI API. For now it returns a placeholder reply.
    const reply = await getChatReply(message.trim());

    // ── Send response ───────────────────────────────
    return res.status(200).json({
      success: true,
      data: {
        userMessage: message.trim(),
        reply,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    // Pass any unexpected error to the global error handler
    // in middleware/errorHandler.js
    next(error);
  }
};

module.exports = { sendMessage };
