import express from "express";
import { askCareerAdvisor, getConversationHistory } from "../controllers/aiAdvisorController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { aiAdvisorLimiter } from "../middleware/rateLimiters.js";

const router = express.Router();

// Not rate-limited — a read of already-persisted history, not a Gemini call.
router.get("/history", authMiddleware, getConversationHistory);
router.post("/ask", aiAdvisorLimiter, authMiddleware, askCareerAdvisor);

export default router;
