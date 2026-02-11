const ChatSession = require("../models/ChatSession");

exports.getRecentChats = async (req, res) => {
  const chats = await ChatSession.find({ userId: req.user.id })
    .sort({ createdAt: -1 })
    .limit(5)
    .select("_id createdAt");

  res.json(chats);
};
