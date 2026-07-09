/**
 * server.js — CyberShield AI Backend
 * ─────────────────────────────────────────────────────
 * Entry point for the Express application.
 * Responsibilities:
 *   • Load environment variables from .env
 *   • Configure Express middleware (JSON parsing, CORS)
 *   • Mount API route groups
 *   • Attach global error handler
 *   • Start the HTTP server
 * ─────────────────────────────────────────────────────
 */

// ── Core imports ──────────────────────────────────────
const express = require("express");
const cors    = require("cors");
require("dotenv").config(); // loads .env into process.env

// ── Route imports ─────────────────────────────────────
const chatRoutes  = require("./routes/chatRoutes");
const fraudRoutes = require("./routes/fraudRoutes");

// ── Middleware imports ────────────────────────────────
const errorHandler = require("./middleware/errorHandler");

// ── App initialisation ────────────────────────────────
const app  = express();
const PORT = process.env.PORT || 5000;

// ── Global Middleware ─────────────────────────────────

// Parse incoming JSON request bodies
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Enable Cross-Origin Resource Sharing so the React
// frontend (running on a different port) can call this API.
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ── Health check route ────────────────────────────────
// GET /api/health
// Quick ping to confirm the server is up and running.
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "CyberShield AI Backend is running 🚀"
  });
});

// ── API Route groups ──────────────────────────────────
// All chat endpoints live under /api/chat
app.use("/api/chat",  chatRoutes);

// All fraud-analysis endpoints live under /api/fraud
app.use("/api/fraud", fraudRoutes);

// ── 404 handler ───────────────────────────────────────
// Catches any request that didn't match a route above.
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ── Global error handler ──────────────────────────────
// Must be registered LAST — after all routes.
app.use(errorHandler);

// ── Start server ─────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🛡️  CyberShield AI Backend`);
  console.log(`   Environment : ${process.env.NODE_ENV || "development"}`);
  console.log(`   Listening on: http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
});
