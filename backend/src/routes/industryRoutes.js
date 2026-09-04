import express from "express";
import {
  getCompanyProfile,
  saveCompanyProfile,
  getPostedOpportunities,
  getMyOpportunities,
  createOpportunity,
  updateOpportunityStatus,
  getApplicationsForMyOpportunities,
  getPipelineOverrides,
  setPipelineStage,
  getAllSkillPrograms,
  createSkillProgram,
} from "../controllers/industryController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/company-profile", authMiddleware, getCompanyProfile);
router.post("/company-profile", authMiddleware, saveCompanyProfile);

// Opportunities are readable by any authenticated user (students need the
// full posted list) — only creating/updating is restricted to the posting
// company via posted_by in the controller.
router.get("/opportunities", authMiddleware, getPostedOpportunities);
// Scoped to the logged-in recruiter's own postings — what Manage
// Opportunities, the dashboard, and the Candidates pages actually want.
router.get("/my-opportunities", authMiddleware, getMyOpportunities);
router.post("/opportunities", authMiddleware, createOpportunity);
router.patch("/opportunities/:id/status", authMiddleware, updateOpportunityStatus);

// Real applications against opportunities this recruiter posted — the
// counterpart to /api/applications (the student's own view of the same rows).
router.get("/applications", authMiddleware, getApplicationsForMyOpportunities);

router.get("/pipeline-overrides", authMiddleware, getPipelineOverrides);
router.post("/pipeline-overrides", authMiddleware, setPipelineStage);

// Skill programs are readable by any authenticated user (students' Learning
// page needs the full list) — only creating is restricted to the company.
router.get("/skill-programs", authMiddleware, getAllSkillPrograms);
router.post("/skill-programs", authMiddleware, createSkillProgram);

export default router;
