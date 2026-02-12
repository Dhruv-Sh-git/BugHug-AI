"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import ChatBox from "@/components/ChatBox";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="p-8 text-white">
        Checking emotional stability... 😌
      </div>
    );
  }

  return (
    <div className="p-8 text-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">
            Welcome to your mental debugger 🧠
          </h1>
          <p className="text-slate-400 mt-2">
            Your AI therapist is one click away.
          </p>
        </div>
        <button 
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
        >
          Logout
        </button>
      </div>

      {/* Chat Component */}
      <ChatBox />
    </div>
  );
}
