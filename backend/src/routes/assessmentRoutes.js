import express from "express";
import {
  getSkillTestResults,
  submitSkillTestResult,
  getSkillProfile,
  upsertSkillProfileEntry,
  getDynamicTest,
  submitDynamicTest,
} from "../controllers/assessmentController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// All assessment routes require a logged-in user — results and skill
// profile are always scoped to req.user, never passed in as a param.
router.get("/skill-tests/results", authMiddleware, getSkillTestResults);
router.post("/skill-tests/:testId/submit", authMiddleware, submitSkillTestResult);
router.get("/skill-profile", authMiddleware, getSkillProfile);
router.post("/skill-profile/upsert", authMiddleware, upsertSkillProfileEntry);

// Dynamic tests: 20-question objective tests per skill, sourced from the
// assessment_questions bank instead of the hardcoded SKILL_TESTS array.
// :skillName may contain "/" (e.g. "SQL / Databases") — Express decodes
// req.params automatically, callers must encodeURIComponent it when building the URL.
router.get("/dynamic-tests/:skillName", authMiddleware, getDynamicTest);
router.post("/dynamic-tests/:skillName/submit", authMiddleware, submitDynamicTest);

export default router;
