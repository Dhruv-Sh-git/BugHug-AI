"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function Sidebar({ onNewChat, onSelectChat, currentSessionId }) {
  const [chatHistory, setChatHistory] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const fetchHistory = async () => {
    try {
      const res = await api.get("/chat/history");
      setChatHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch chat history:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [currentSessionId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      className={`bg-white/85 border-r border-[var(--line)] flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-14" : "w-64"
      }`}
    >
      {/* Header */}
      <div className={`p-3 border-b border-[var(--line)] flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-white border border-[var(--line)] rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-semibold">BH</span>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[var(--ink)]">BugHug AI</h2>
              <p className="text-[11px] text-muted">Your calm helper</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-[#6b7385] hover:text-[var(--ink)] p-1.5 rounded-lg hover:bg-[#f1f4ff] transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <span className="text-xs font-semibold">
            {isCollapsed ? "Expand" : "Collapse"}
          </span>
        </button>
      </div>

      {/* New Chat Button */}
      <div className="p-2">
        <button
          onClick={onNewChat}
          className={`w-full bg-[var(--accent)] hover:brightness-105 text-white py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm font-semibold ${isCollapsed ? "h-10 px-0" : ""}`}
          title={isCollapsed ? "New Chat" : undefined}
        >
          {!isCollapsed ? "New chat" : "New"}
        </button>
      </div>

      {/* Chat History */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto px-2 pb-2">
          <div className="text-xs text-muted px-2 py-2 font-semibold uppercase tracking-wider">
            Recent chats
          </div>
          <div className="space-y-0.5">
            {chatHistory.length === 0 && (
              <p className="text-xs text-muted px-2 py-1">No conversations yet</p>
            )}
            {chatHistory.map((chat) => (
              <button
                key={chat._id}
                onClick={() => onSelectChat(chat._id)}
                className={`w-full text-left px-2 py-2 rounded-xl transition-colors ${
                  currentSessionId === chat._id
                    ? "bg-[#eef2ff] text-[var(--ink)]"
                    : "text-muted hover:bg-[#f5f7ff] hover:text-[var(--ink)]"
                }`}
              >
                <div className="flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate">{chat.title}</div>
                    <div className="text-xs text-muted mt-0.5">{formatDate(chat.createdAt)}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Collapsed — brand icon */}
      {isCollapsed && (
        <div className="flex-1 flex flex-col items-center pt-3 gap-2">
          <div className="w-7 h-7 bg-white border border-[var(--line)] rounded-xl flex items-center justify-center opacity-80">
            <span className="text-[10px] font-semibold">BH</span>
          </div>
        </div>
      )}
    </div>
  );
}
