import express from "express";
import cors from "cors";
import compression from "compression";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import assessmentRoutes from "./routes/assessmentRoutes.js";
import aiAdvisorRoutes from "./routes/aiAdvisorRoutes.js";
import studentStateRoutes from "./routes/studentStateRoutes.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";
import applicationsRoutes from "./routes/applicationsRoutes.js";
import messagesRoutes from "./routes/messagesRoutes.js";
import industryRoutes from "./routes/industryRoutes.js";

dotenv.config();

const app = express();
app.set("trust proxy", 1);
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  ...(process.env.FRONTEND_URL || "")
    .split(",")
    .map((origin) => origin.trim().replace(/\/+$/, ""))
    .filter(Boolean),
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(compression());
// Company logos are sent as base64 data URLs during onboarding; a 2MB image
// expands beyond 2MB in JSON, so keep enough headroom for the encoded payload.
app.use(express.json({ limit: "4mb", strict: true }));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Auth routes
app.use("/api/auth", authRoutes);

// Assessment routes (skill tests + skill profile)
app.use("/api/assessments", assessmentRoutes);

// AI Career Advisor (Gemini-backed)
app.use("/api/ai-advisor", aiAdvisorRoutes);

// Full migration: remaining student/industry state (Steps 3-9's localStorage
// pieces, moved to Supabase)
app.use("/api/student", studentStateRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/applications", applicationsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/industry", industryRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
