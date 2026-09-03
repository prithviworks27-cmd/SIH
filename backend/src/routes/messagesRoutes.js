import express from "express";
import { getConversationState, sendMessage, markConversationRead } from "../controllers/messagesController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getConversationState);
router.post("/send", authMiddleware, sendMessage);
router.post("/read", authMiddleware, markConversationRead);

export default router;
