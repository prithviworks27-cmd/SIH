import express from "express";
import multer from "multer";
import {
  getPortfolio,
  getPublicPortfolio,
  savePortfolioBasics,
  initPortfolio,
  createProject,
  updateProject,
  deleteProject,
  createCertification,
  updateCertification,
  deleteCertification,
  uploadCertificateFile,
  uploadAvatar,
  removeAvatar,
  getPendingCertifications,
  reviewCertification,
  createInternship,
  updateInternship,
  deleteInternship,
  createAchievement,
  updateAchievement,
  deleteAchievement,
} from "../controllers/portfolioController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Certificate files only — kept small (5MB) since these are PDFs/images of a
// single document, not general file storage. Buffered in memory (not disk)
// since uploadCertificateFile streams straight to Supabase Storage.
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// Profile pictures — smaller cap (2MB) than certificate files, image-only.
const uploadAvatarFile = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => cb(null, file.mimetype.startsWith("image/")),
});

// Public — no authMiddleware. Registered before "/" only for readability;
// "/public/:userId" doesn't collide with "/" regardless of order.
router.get("/public/:userId", getPublicPortfolio);

router.get("/", authMiddleware, getPortfolio);
router.post("/basics", authMiddleware, savePortfolioBasics);
router.post("/avatar", authMiddleware, uploadAvatarFile.single("file"), uploadAvatar);
router.delete("/avatar", authMiddleware, removeAvatar);
// Replaces the old /seed endpoint — creates an empty portfolio_basics row
// for a first-time user instead of writing fake demo projects/certifications/
// internships/achievements into the child tables.
router.post("/init", authMiddleware, initPortfolio);

router.post("/projects", authMiddleware, createProject);
router.patch("/projects/:id", authMiddleware, updateProject);
router.delete("/projects/:id", authMiddleware, deleteProject);

router.post("/certifications", authMiddleware, createCertification);
router.patch("/certifications/:id", authMiddleware, updateCertification);
router.delete("/certifications/:id", authMiddleware, deleteCertification);
router.post("/certifications/:id/file", authMiddleware, upload.single("file"), uploadCertificateFile);

// Admin-only review queue — admin-ness is checked inside the controller
// (requireAdmin, resolving role from the users table) since req.user.role
// isn't reliably populated for Supabase-session logins; see that helper's
// comment in portfolioController.js.
router.get("/certifications/pending-review", authMiddleware, getPendingCertifications);
router.patch("/certifications/:id/review", authMiddleware, reviewCertification);

router.post("/internships", authMiddleware, createInternship);
router.patch("/internships/:id", authMiddleware, updateInternship);
router.delete("/internships/:id", authMiddleware, deleteInternship);

router.post("/achievements", authMiddleware, createAchievement);
router.patch("/achievements/:id", authMiddleware, updateAchievement);
router.delete("/achievements/:id", authMiddleware, deleteAchievement);

export default router;
