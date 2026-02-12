import { useState } from "react";
import { sendMessage } from "@/lib/api";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await sendMessage({
        message: input,
        sessionId
      });

      setSessionId(res.sessionId);
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: res.reply }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Sorry, I'm having trouble connecting right now. Please try again." }
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="bg-neutral-900 p-4 rounded-xl h-[500px] flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg max-w-[80%] ${
              m.role === "user"
                ? "bg-blue-600 ml-auto"
                : "bg-neutral-700"
            }`}
          >
            {m.content}
          </div>
        ))}
        {loading && (
          <div className="text-sm text-gray-400">
            Therapist is typing…
          </div>
        )}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          className="flex-1 p-2 rounded bg-neutral-800 outline-none"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="I hate my code…"
        />
        <button
          onClick={handleSend}
          className="bg-green-600 px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
