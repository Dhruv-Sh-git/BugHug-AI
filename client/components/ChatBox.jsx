"use client";

import { useState, useEffect, useRef } from "react";
import { sendMessage, getChatSession } from "@/lib/api";

export default function ChatBox({ sessionId, onSessionCreated }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingSession, setLoadingSession] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load messages when sessionId changes
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
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await sendMessage({
        message: input,
        sessionId
      });

      if (onSessionCreated && !sessionId) {
        onSessionCreated(res.sessionId);
      }

      setMessages(prev => [
        ...prev,
        { role: "assistant", content: res.reply }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { 
          role: "assistant", 
          content: "Sorry, I'm having trouble connecting right now. Please try again." 
        }
      ]);
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const showEmptyState = !loadingSession && messages.length === 0;

  const starterPrompts = [
    "Help me debug this error",
    "Explain this concept simply",
    "Optimize this code snippet",
    "Give me best practices"
  ];

  const Composer = ({ compact = false }) => (
    <div className={`w-full ${compact ? "" : "max-w-3xl mx-auto"}`}>
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl shadow-sm focus-within:border-gray-500 focus-within:ring-1 focus-within:ring-gray-500/30 transition-colors">
        <textarea
          ref={textareaRef}
          className="w-full bg-transparent text-gray-100 placeholder:text-gray-500 caret-white px-4 py-3 pr-12 outline-none resize-none max-h-40 overflow-y-auto text-[15px] leading-6"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Message BugHug AI..."
          rows={1}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="absolute right-2.5 bottom-2.5 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed text-white p-2 rounded-md transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </div>
      {!compact && (
        <p className="text-[11px] text-gray-500 text-center mt-2.5">
          BugHug AI can make mistakes. Please verify important information.
        </p>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-full min-h-0 bg-gray-950">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="max-w-3xl mx-auto px-4 py-6 md:py-8">
          {loadingSession ? (
            <div className="flex flex-col items-center justify-center h-full py-20">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-gray-400">Loading conversation...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-14 md:py-20">
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2">
                Welcome to BugHug AI
              </h2>
              <p className="text-gray-400 text-sm md:text-base max-w-md">
                Your personal AI therapist for debugging code and life. 
                Start a conversation below.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mt-8 w-full max-w-2xl">
                {starterPrompts.map((promptText, promptIndex) => (
                  <button
                    key={promptIndex}
                    onClick={() => setInput(promptText)}
                    className="p-3 bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 rounded-lg text-left transition-colors"
                  >
                    <span className="text-sm text-gray-300">{promptText}</span>
                  </button>
                ))}
              </div>
              <div className="mt-7 w-full max-w-2xl">
                <Composer compact />
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {messages.map((message, messageIndex) => (
                <div
                  key={messageIndex}
                  className={`flex gap-4 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="w-7 h-7 bg-gray-800 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 text-[11px] text-gray-300">
                      AI
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                      message.role === "user"
                        ? "bg-gray-700 text-white"
                        : "bg-gray-900 text-gray-100 border border-gray-800"
                    }`}
                  >
                    <div className="whitespace-pre-wrap break-words leading-relaxed text-[15px]">
                      {message.content}
                    </div>
                  </div>
                  {message.role === "user" && (
                    <div className="w-7 h-7 bg-gray-700 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 text-[11px] text-gray-200">
                      You
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex gap-4">
                  <div className="w-7 h-7 bg-gray-800 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 text-[11px] text-gray-300">
                    AI
                  </div>
                  <div className="bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area - Fixed at Bottom */}
      {!showEmptyState && (
        <div className="border-t border-gray-800/90 bg-gray-950/95 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto px-4 py-4">
            <Composer />
          </div>
        </div>
      )}
    </div>
  );
}
