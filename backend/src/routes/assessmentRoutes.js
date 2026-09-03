import express from "express";
import {
  getSkillTestResults,
  submitSkillTestResult,
  getSkillProfile,
  upsertSkillProfileEntry,
} from "../controllers/assessmentController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// All assessment routes require a logged-in user — results and skill
// profile are always scoped to req.user, never passed in as a param.
router.get("/skill-tests/results", authMiddleware, getSkillTestResults);
router.post("/skill-tests/:testId/submit", authMiddleware, submitSkillTestResult);
router.get("/skill-profile", authMiddleware, getSkillProfile);
router.post("/skill-profile/upsert", authMiddleware, upsertSkillProfileEntry);

export default router;
