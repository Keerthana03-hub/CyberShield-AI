/**
 * routes/chatRoutes.js — CyberShield AI
 * ─────────────────────────────────────────────────────
 * Defines HTTP routes for the chat assistant feature.
 * Each route is linked to its corresponding controller
 * function, which contains the actual request logic.
 *
 * Base path (mounted in server.js): /api/chat
 * ─────────────────────────────────────────────────────
 */

const express = require("express");

// express.Router() creates a mini-app that handles routes
const router = express.Router();

// Import the controller that handles chat logic
const { sendMessage } = require("../controllers/chatController");

// ── Routes ────────────────────────────────────────────

/**
 * POST /api/chat
 * Accepts a user message and returns an AI assistant reply.
 * Body: { message: string }
 */
router.post("/", sendMessage);

// Export the router so server.js can mount it
module.exports = router;
