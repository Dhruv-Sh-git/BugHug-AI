const express = require("express");
const router = express.Router();
const { sendMessage } = require("../controllers/chatController");
const authMiddleware = require("../middleware/auth");

router.post("/chat", authMiddleware, sendMessage);

module.exports = router;
