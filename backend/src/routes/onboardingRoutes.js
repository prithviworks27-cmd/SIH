import express from "express";
import { getOnboardingStatus, submitOnboarding, getSkillSuggestions, getOnboardingResponse } from "../controllers/onboardingController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Student-only is enforced inside each controller (via resolveUserId + a
// fresh role lookup) rather than roleMiddleware, which trusts req.user.role
// — that field is only populated for the legacy JWT auth path and is absent
// for Supabase-session (Google sign-in) users, so it can't be relied on here.
router.use(authMiddleware);

router.get("/status", getOnboardingStatus);
router.get("/skills", getSkillSuggestions);
router.get("/", getOnboardingResponse);
router.post("/", submitOnboarding);

export default router;
