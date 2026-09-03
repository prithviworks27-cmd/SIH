import express from "express";
import { getApplications, applyToOpportunity } from "../controllers/applicationsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getApplications);
router.post("/", authMiddleware, applyToOpportunity);

export default router;
