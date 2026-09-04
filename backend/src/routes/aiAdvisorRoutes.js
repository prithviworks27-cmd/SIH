import express from "express";
import { askCareerAdvisor, generateSkillRoadmap } from "../controllers/aiAdvisorController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { aiAdvisorLimiter } from "../middleware/rateLimiters.js";

const router = express.Router();

router.post("/ask", aiAdvisorLimiter, authMiddleware, askCareerAdvisor);
router.post("/roadmap", aiAdvisorLimiter, authMiddleware, generateSkillRoadmap);

export default router;
