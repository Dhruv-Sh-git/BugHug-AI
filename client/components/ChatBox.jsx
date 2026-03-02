"use client";

import { useState, useEffect, useRef } from "react";
import { sendMessage, getChatSession } from "@/lib/api";

// Extracted outside to avoid re-mounting on every parent render
function Composer({ input, onChange, onKeyPress, onSend, loading, textareaRef }) {
  return (
    <div className="w-full">
      <div className="relative bg-white border border-[var(--line)] rounded-2xl shadow-sm focus-within:border-[#b8c4e8] focus-within:ring-2 focus-within:ring-[#dfe6ff] transition-all duration-200">
        <textarea
          ref={textareaRef}
          className="w-full bg-transparent text-[var(--ink)] placeholder:text-[#97a0b6] caret-[#2a6df6] px-4 py-3.5 pr-14 outline-none resize-none max-h-44 overflow-y-auto text-[15px] leading-6 rounded-2xl"
          value={input}
          onChange={onChange}
          onKeyDown={onKeyPress}
          placeholder="Type your bug or question here..."
          rows={1}
        />
        <button
          onClick={onSend}
          disabled={!input.trim() || loading}
          className="absolute right-2.5 bottom-2.5 bg-[var(--accent)] hover:brightness-105 disabled:bg-[#d6dbea] disabled:text-[#9aa3b8] disabled:cursor-not-allowed text-white px-3 py-2 rounded-xl transition-all duration-150 text-xs font-semibold"
          title="Send message"
        >
          Send
        </button>
      </div>
      <p className="text-xs text-muted text-center mt-2">
        Double-check important details, just to be safe.
      </p>
    </div>
  );
}

const BotAvatar = () => (
  <div className="w-8 h-8 rounded-full bg-[#eaf1ff] border border-[#d6e2ff] flex items-center justify-center flex-shrink-0 mt-0.5">
    <span className="text-[10px] font-semibold text-[var(--accent)]">BH</span>
  </div>
);

const starterPrompts = [
  "Explain this error like I'm 10",
  "Tell me the next step to fix it",
  "Summarize what went wrong",
  "Give me a short checklist",
];

export default function ChatBox({ sessionId, onSessionCreated }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingSession, setLoadingSession] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const loadSession = async () => {
      if (!sessionId) {
        setMessages([]);
        return;
      }
      setLoadingSession(true);
      try {
        const session = await getChatSession(sessionId);
        setMessages(session.messages || []);
      } catch (err) {
        console.error("Failed to load chat session:", err);
        setMessages([]);
      } finally {
        setLoadingSession(false);
      }
    };
    loadSession();
  }, [sessionId]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 176) + "px";
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await sendMessage({ message: input, sessionId });
      if (onSessionCreated && !sessionId) onSessionCreated(res.sessionId);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I'm having trouble connecting right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isEmpty = !loadingSession && messages.length === 0;

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="max-w-3xl mx-auto px-4 py-6 md:py-8">
          {loadingSession ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-muted text-sm">Loading your chat...</p>
            </div>
          ) : isEmpty ? (
            /* ── Empty / Welcome state ── */
            <div className="flex flex-col items-center text-center pt-12 pb-6">
              <div className="w-14 h-14 bg-white border border-[var(--line)] rounded-2xl flex items-center justify-center mb-5 shadow-sm">
                <span className="text-xs font-semibold text-[var(--accent)]">BH</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold text-[var(--ink)] mb-2">
                What do you want help with?
              </h2>
              <p className="text-muted text-sm md:text-base max-w-sm">
                I can explain errors clearly and guide you step by step.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-8 w-full max-w-xl">
                {starterPrompts.map((text) => (
                  <button
                    key={text}
                    onClick={() => {
                      setInput(text);
                      textareaRef.current?.focus();
                    }}
                    className="p-3.5 bg-white/80 hover:bg-white border border-[var(--line)] rounded-xl text-left transition-all duration-150 group"
                  >
                    <span className="text-sm text-[var(--ink)] group-hover:text-black transition-colors">{text}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* ── Messages ── */
            <div className="space-y-5">
              {messages.map((message, idx) =>
                message.role === "user" ? (
                  <div key={idx} className="flex justify-end">
                    <div className="max-w-[78%] md:max-w-[70%] bg-[#e8f9f2] text-[var(--ink)] rounded-2xl rounded-br-sm px-4 py-3 text-[15px] leading-relaxed whitespace-pre-wrap break-words border border-[#ccefe3]">
                      {message.content}
                    </div>
                  </div>
                ) : (
                  <div key={idx} className="flex gap-3 justify-start items-start">
                    <BotAvatar />
                    <div className="max-w-[82%] md:max-w-[78%] text-[var(--ink)] text-[15px] leading-relaxed whitespace-pre-wrap break-words pt-0.5">
                      {message.content}
                    </div>
                  </div>
                )
              )}

              {loading && (
                <div className="flex gap-3 items-start">
                  <BotAvatar />
                  <div className="bg-white border border-[var(--line)] rounded-2xl rounded-bl-sm px-4 py-3.5">
                    <div className="flex gap-1.5 items-center">
                      <span className="w-2 h-2 bg-[#9fb1da] rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-2 h-2 bg-[#9fb1da] rounded-full animate-bounce [animation-delay:160ms]" />
                      <span className="w-2 h-2 bg-[#9fb1da] rounded-full animate-bounce [animation-delay:320ms]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Bar — always visible */}
      <div className="border-t border-[var(--line)] bg-white/80">
        <div className="max-w-3xl mx-auto px-4 py-3.5">
          <Composer
            input={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            onSend={handleSend}
            loading={loading}
            textareaRef={textareaRef}
          />
        </div>
      </div>
    </div>
  );
}
