import express from "express";
import { askCareerAdvisor } from "../controllers/aiAdvisorController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { aiAdvisorLimiter } from "../middleware/rateLimiters.js";

const router = express.Router();

router.post("/ask", aiAdvisorLimiter, authMiddleware, askCareerAdvisor);

export default router;
