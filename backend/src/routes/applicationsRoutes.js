import express from "express";
import { getApplications, applyToOpportunity, updateApplicationStatus } from "../controllers/applicationsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getApplications);
router.post("/", authMiddleware, applyToOpportunity);
// Recruiter-side status update — ownership is enforced in the controller by
// checking the application's opportunity was posted by req.user, not by role,
// same pattern as /api/industry/opportunities/:id/status.
router.patch("/:id/status", authMiddleware, updateApplicationStatus);

export default router;
