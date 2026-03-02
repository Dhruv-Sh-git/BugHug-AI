"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/login");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">🐛 BugHug AI</h1>
        <p className="text-slate-400">Your AI therapist for developers</p>
        <p className="text-sm text-slate-500 mt-2">Redirecting to login...</p>
      </div>
    </div>
  );
}
