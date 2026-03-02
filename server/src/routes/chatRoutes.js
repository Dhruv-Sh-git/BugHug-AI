import express from "express";
import { sendMessage } from "../controllers/chatController.js";
import { getRecentChats, getChatSession } from "../controllers/chatHistoryController.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/chat", protect, sendMessage);
router.get("/chat/history", protect, getRecentChats);
router.get("/chat/:sessionId", protect, getChatSession);

export default router;
