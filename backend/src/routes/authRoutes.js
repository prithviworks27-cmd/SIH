import express from "express";
import {
  register,
  login,
  getCurrentUser,
  syncSupabaseUser,
  logout,
  changePassword,
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  loginLimiter,
  registerLimiter,
  syncLimiter,
} from "../middleware/rateLimiters.js";

const router = express.Router();

// Public routes
router.post("/register", registerLimiter, register);
router.post("/login", loginLimiter, login);
router.post("/sync", syncLimiter, authMiddleware, syncSupabaseUser);
router.post("/logout", logout);

// Protected routes
router.get("/me", authMiddleware, getCurrentUser);
router.post("/change-password", authMiddleware, changePassword);

export default router;
