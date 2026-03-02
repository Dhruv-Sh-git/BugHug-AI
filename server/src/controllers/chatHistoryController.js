import ChatSession from "../models/ChatSession.js";

export const getRecentChats = async (req, res) => {
  try {
    const chats = await ChatSession.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20)
      .select("_id createdAt messages");

    const formattedChats = chats.map(chat => ({
      _id: chat._id,
      title: chat.messages[0]?.content.substring(0, 50) || "New Chat",
      createdAt: chat.createdAt,
      messageCount: chat.messages.length
    }));

    res.json(formattedChats);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch chat history" });
  }
};

export const getChatSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await ChatSession.findOne({ 
      _id: sessionId, 
      userId: req.user.id 
    });

    if (!session) {
      return res.status(404).json({ message: "Chat session not found" });
    }

    res.json(session);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch chat session" });
  }
};
