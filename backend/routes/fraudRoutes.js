/**
 * routes/fraudRoutes.js — CyberShield AI
 * ─────────────────────────────────────────────────────
 * Defines HTTP routes for the fraud analysis feature.
 * Each route delegates work to a controller function.
 *
 * Base path (mounted in server.js): /api/fraud
 * ─────────────────────────────────────────────────────
 */

const express = require("express");

const router = express.Router();

// Import the controller that handles fraud analysis logic
const { analyzeContent } = require("../controllers/fraudController");

// ── Routes ────────────────────────────────────────────

/**
 * POST /api/fraud/analyze
 * Accepts text content (e.g. a suspicious message or email)
 * and returns a fraud risk assessment.
 * Body: { content: string }
 */
router.post("/analyze", analyzeContent);

// Export the router so server.js can mount it
module.exports = router;
