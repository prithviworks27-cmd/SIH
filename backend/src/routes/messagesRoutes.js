import express from "express";
import { getConversations, startConversation, sendMessage, markConversationRead } from "../controllers/messagesController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getConversations);
// Opens/returns a conversation without sending a message — used by the
// apply-triggered auto-create and the industry Contact button.
router.post("/start", authMiddleware, startConversation);
router.post("/send", authMiddleware, sendMessage);
router.post("/read", authMiddleware, markConversationRead);

export default router;
