"use client";
import { useEffect } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    api.get("/auth/me").catch(() => router.push("/login"));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl">Welcome to your mental debugger 🧠</h1>
      <p className="text-slate-400 mt-2">
        Your AI therapist is one click away.
      </p>
    </div>
  );
}
