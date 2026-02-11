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

  if (loading) {
    return (
      <div className="p-8 text-white">
        Checking emotional stability... 😌
      </div>
    );
  }

  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl font-semibold">
        Welcome to your mental debugger 🧠
      </h1>

      <p className="text-slate-400 mt-2 mb-6">
        Your AI therapist is one click away.
      </p>

      {/* Chat Component */}
      <ChatBox />
    </div>
  );
}
