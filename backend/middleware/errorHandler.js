/**
 * middleware/errorHandler.js — CyberShield AI
 * ─────────────────────────────────────────────────────
 * Global error-handling middleware for Express.
 *
 * Express identifies error-handling middleware by its
 * four-parameter signature: (err, req, res, next).
 * It must be registered AFTER all routes in server.js.
 *
 * Responsibilities:
 *   • Log the full error in development for debugging.
 *   • Hide internal stack traces in production.
 *   • Return a consistent JSON error shape to the client.
 * ─────────────────────────────────────────────────────
 */

/**
 * errorHandler
 *
 * @param {Error}                         err  - The thrown error object
 * @param {import('express').Request}     req
 * @param {import('express').Response}    res
 * @param {import('express').NextFunction} next - Required by Express (even if unused)
 */
const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars

  // ── Determine HTTP status code ──────────────────
  // Use the status code already attached to the error
  // (e.g. err.status = 404), otherwise default to 500.
  const statusCode = err.status || err.statusCode || 500;

  // ── Build error message ─────────────────────────
  // In development, expose the real message.
  // In production, send a generic message for 500 errors
  // to avoid leaking implementation details.
  const isDev    = process.env.NODE_ENV !== "production";
  const message  = statusCode === 500 && !isDev
    ? "An unexpected internal server error occurred."
    : err.message || "Something went wrong.";

  // ── Log the error ───────────────────────────────
  // Always log on the server side so developers can debug.
  console.error(`\n[Error] ${statusCode} — ${err.message}`);
  if (isDev && err.stack) {
    console.error(err.stack);
  }

  // ── Send JSON response ──────────────────────────
  res.status(statusCode).json({
    success: false,
    error: message,
    // Only include stack trace in development
    ...(isDev && { stack: err.stack }),
  });
};

module.exports = errorHandler;
