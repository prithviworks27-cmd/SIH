import express from "express";
import { getPortfolio, savePortfolioBasics, seedPortfolio } from "../controllers/portfolioController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getPortfolio);
router.post("/basics", authMiddleware, savePortfolioBasics);
router.post("/seed", authMiddleware, seedPortfolio);

export default router;
