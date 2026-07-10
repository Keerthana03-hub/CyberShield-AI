/**
 * server.js — CyberShield AI Backend
 * -----------------------------------
 * Entry point for the Express application.
 */

const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Routes
const chatRoutes = require("./routes/chatRoutes");
const fraudRoutes = require("./routes/fraudRoutes");

// Error Handler
const errorHandler = require("./middleware/errorHandler");

// App Initialization
const app = express();
const PORT = process.env.PORT || 5000;

// ---------------- Middleware ----------------

// Parse JSON
app.use(express.json());

// Parse URL Encoded Data
app.use(express.urlencoded({ extended: true }));

// ---------------- CORS ----------------

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CORS_ORIGIN,
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow Postman, curl, server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ---------------- Health Check ----------------

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CyberShield AI Backend is running 🚀",
  });
});

// ---------------- Routes ----------------

app.use("/api/chat", chatRoutes);
app.use("/api/fraud", fraudRoutes);

// ---------------- 404 ----------------

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ---------------- Error Handler ----------------

app.use(errorHandler);

// ---------------- Start Server ----------------

app.listen(PORT, () => {
  console.log("\n🛡️ CyberShield AI Backend");
  console.log(`Environment : ${process.env.NODE_ENV || "development"}`);
  console.log(`Listening on : http://localhost:${PORT}`);
  console.log(`Health Check : http://localhost:${PORT}/api/health\n`);
});