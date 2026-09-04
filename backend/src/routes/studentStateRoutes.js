import express from "express";
import {
  getTargetRole,
  setTargetRole,
  getLearningProgress,
  setLearningProgress,
  getNotificationPreferences,
  saveNotificationPreferences,
  getReadNotificationIds,
  markNotificationsRead,
  getEnrolledCourseIds,
  enrollInCourse,
  getSavedOpportunityIds,
  saveOpportunity,
  unsaveOpportunity,
} from "../controllers/studentStateController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/target-role", authMiddleware, getTargetRole);
router.post("/target-role", authMiddleware, setTargetRole);

router.get("/learning-progress", authMiddleware, getLearningProgress);
router.post("/learning-progress", authMiddleware, setLearningProgress);

router.get("/notification-preferences", authMiddleware, getNotificationPreferences);
router.post("/notification-preferences", authMiddleware, saveNotificationPreferences);

router.get("/notification-read-state", authMiddleware, getReadNotificationIds);
router.post("/notification-read-state", authMiddleware, markNotificationsRead);

router.get("/enrollments", authMiddleware, getEnrolledCourseIds);
router.post("/enrollments", authMiddleware, enrollInCourse);

router.get("/saved-opportunities", authMiddleware, getSavedOpportunityIds);
router.post("/saved-opportunities", authMiddleware, saveOpportunity);
router.delete("/saved-opportunities/:opportunityId", authMiddleware, unsaveOpportunity);

export default router;
