"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import ChatBox from "@/components/ChatBox";
import Sidebar from "@/components/Sidebar";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    api
      .get("/auth/me")
      .then(() => setLoading(false))
      .catch(() => router.push("/login"));
  }, [router]);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      router.push("/login");
    }
  };

  const handleNewChat = () => {
    setCurrentSessionId(null);
  };

  const handleSelectChat = (sessionId) => {
    setCurrentSessionId(sessionId);
  };

  const handleSessionCreated = (sessionId) => {
    setCurrentSessionId(sessionId);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted text-lg">Getting your chat ready...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        currentSessionId={currentSessionId}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation Bar */}
        <div className="bg-white/80 border-b border-[var(--line)] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-white border border-[var(--line)] rounded-xl flex items-center justify-center">
              <span className="text-[10px] font-semibold">BH</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-[var(--ink)]">BugHug AI</div>
              <div className="text-[11px] text-muted">Ask anything about your bug</div>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#f1f4ff] transition-colors"
            >
              <div className="w-7 h-7 bg-[#eaf1ff] rounded-full flex items-center justify-center">
                <span className="text-[10px] font-semibold text-[var(--accent)]">ME</span>
              </div>
              <span className="text-xs text-muted">Menu</span>
            </button>

            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white border border-[var(--line)] rounded-lg shadow-xl z-20 overflow-hidden">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-red-500 hover:bg-[#fff1f1] transition-colors flex items-center gap-2.5"
                  >
                    <span className="text-sm">Log out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <ChatBox
          sessionId={currentSessionId}
          onSessionCreated={handleSessionCreated}
        />
      </div>
    </div>
  );
}
