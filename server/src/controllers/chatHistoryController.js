import ChatSession from "../models/ChatSession.js";

export const getRecentChats = async (req, res) => {
  const chats = await ChatSession.find({ userId: req.user.id })
    .sort({ createdAt: -1 })
    .limit(5)
    .select("_id createdAt");

  res.json(chats);
};
