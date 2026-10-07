const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ── MIDDLEWARE ──────────────────────────────────────────────
// CORS — allow requests from the React dev server
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies (form data)
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically at /uploads/<filename>
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── ROUTES ──────────────────────────────────────────────────
app.use("/api/auth",     require("./routes/authRoutes"));
app.use("/api/events",   require("./routes/eventRoutes"));
app.use("/api/register", require("./routes/registerRoutes"));

// Health check
app.get("/", (req, res) => {
  res.json({ message: "College Event Tracker API is running ✅" });
});

// ── 404 HANDLER ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ── GLOBAL ERROR HANDLER ────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// ── START SERVER ────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
