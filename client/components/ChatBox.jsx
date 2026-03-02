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

  const starterPrompts = [
    "Help me debug this error",
    "Explain this concept simply",
    "Optimize this code snippet",
    "Give me best practices"
  ];

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
            <div className="flex flex-col items-center justify-center h-full text-center py-16 md:py-24">
              <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-md">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
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
                    <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg
                        className="w-3.5 h-3.5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                      message.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-gray-100 border border-gray-700"
                    }`}
                  >
                    <div className="whitespace-pre-wrap break-words leading-relaxed text-[15px]">
                      {message.content}
                    </div>
                  </div>
                  {message.role === "user" && (
                    <div className="w-7 h-7 bg-gray-700 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg
                        className="w-3.5 h-3.5 text-gray-100"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex gap-4">
                  <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-3.5 h-3.5 text-white animate-pulse"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
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
      <div className="border-t border-gray-800/90 bg-gray-950/95 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="relative bg-gray-900 border border-gray-700 rounded-2xl shadow-lg focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/30 transition-colors">
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
              className="absolute right-2.5 bottom-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white p-2 rounded-md transition-colors"
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
          <p className="text-[11px] text-gray-500 text-center mt-2.5">
            BugHug AI can make mistakes. Please verify important information.
          </p>
        </div>
      </div>
    </div>
  );
}
