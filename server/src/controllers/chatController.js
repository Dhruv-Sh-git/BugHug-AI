const ChatSession = require("../models/ChatSession");
const openai = require("../config/openai");
const therapistPrompt = require("../prompts/therapistPrompt");

exports.sendMessage = async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    const userId = req.user.id;

    let session;

    if (sessionId) {
      session = await ChatSession.findById(sessionId);
    }

    if (!session) {
      session = await ChatSession.create({
        userId,
        messages: []
      });
    }

    session.messages.push({
      role: "user",
      content: message
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: therapistPrompt },
        ...session.messages.map(m => ({
          role: m.role,
          content: m.content
        }))
      ],
      temperature: 0.8
    });

    const aiReply = completion.choices[0].message.content;

    session.messages.push({
      role: "assistant",
      content: aiReply
    });

    await session.save();

    res.json({
      sessionId: session._id,
      reply: aiReply
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Therapist is emotionally unavailable right now 🥲" });
  }
};
