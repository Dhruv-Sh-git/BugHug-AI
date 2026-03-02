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
      className={`bg-gray-900/90 border-r border-gray-800 flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-0 md:w-16" : "w-64 md:w-72"
      }`}
    >
      {/* Header */}
      <div className="p-3.5 border-b border-gray-800 flex items-center justify-between">
        {!isCollapsed && (
          <h2 className="text-sm font-semibold tracking-wide text-gray-200">BugHug AI</h2>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-400 hover:text-white p-1.5 rounded hover:bg-gray-800"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isCollapsed ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            )}
          </svg>
        </button>
      </div>

      {!isCollapsed && (
        <>
          {/* New Chat Button */}
          <div className="p-3">
            <button
              onClick={onNewChat}
              className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-100 py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="font-medium text-sm">New Chat</span>
            </button>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto px-2 pb-2">
            <div className="text-xs text-gray-500 px-3 py-2 font-semibold uppercase tracking-wider">
              Recent Chats
            </div>
            <div className="space-y-1">
              {chatHistory.map((chat) => (
                <button
                  key={chat._id}
                  onClick={() => onSelectChat(chat._id)}
                  className={`w-full text-left p-2.5 rounded-lg transition-colors ${
                    currentSessionId === chat._id
                      ? "bg-gray-800 text-gray-100 border border-gray-700"
                      : "text-gray-400 hover:bg-gray-800/70 hover:text-gray-200"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <svg
                      className="w-4 h-4 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium truncate">
                        {chat.title}
                      </div>
                      <div className="text-[11px] text-gray-500 mt-1">
                        {formatDate(chat.createdAt)} • {chat.messageCount} msgs
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {isCollapsed && (
        <div className="flex flex-col items-center py-4 gap-4">
          <button
            onClick={onNewChat}
            className="p-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-100 rounded-lg transition-colors"
            title="New Chat"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
