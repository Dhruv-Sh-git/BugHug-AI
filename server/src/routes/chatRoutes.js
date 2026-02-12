import express from "express";
import { sendMessage } from "../controllers/chatController.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/chat", protect, sendMessage);

export default router;
