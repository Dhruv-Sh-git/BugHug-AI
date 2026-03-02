"use client";
import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [form, setForm] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async () => {
    try {
      setError("");
      setLoading(true);
      await api.post("/auth/login", form);
      router.push("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      submit();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Wordmark */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center gap-2 mb-5">
            <div className="w-9 h-9 bg-white border border-[var(--line)] rounded-2xl flex items-center justify-center">
              <span className="text-[10px] font-semibold">BH</span>
            </div>
            <span className="text-[var(--ink)] font-semibold text-base tracking-tight">BugHug AI</span>
          </div>
          <h1 className="text-2xl font-semibold text-[var(--ink)]">Welcome back</h1>
          <p className="text-sm text-muted mt-1">Sign in to keep chatting</p>
        </div>

        {/* Card */}
        <div className="bg-white/90 border border-[var(--line)] rounded-2xl p-6 shadow-xl">

          {error && (
            <div className="bg-[#fff1f1] border border-[#ffd6d6] text-[#c64545] px-3.5 py-2.5 rounded-lg mb-5 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted mb-1.5">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-white border border-[var(--line)] text-[var(--ink)] placeholder:text-[#9aa3b8] rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#8db0ff] focus:ring-2 focus:ring-[#e3ecff] transition-all"
                onChange={e => setForm({ ...form, email: e.target.value })}
                onKeyPress={handleKeyPress}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-muted">Password</label>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-white border border-[var(--line)] text-[var(--ink)] placeholder:text-[#9aa3b8] rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#8db0ff] focus:ring-2 focus:ring-[#e3ecff] transition-all"
                onChange={e => setForm({ ...form, password: e.target.value })}
                onKeyPress={handleKeyPress}
              />
            </div>

            <button
              onClick={submit}
              disabled={loading}
              className="w-full bg-[var(--accent)] hover:brightness-105 disabled:bg-[#d6dbea] disabled:text-[#9aa3b8] disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition-colors mt-1"
            >
              {loading ? (
                "Signing in..."
              ) : (
                "Sign in"
              )}
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-muted mt-5">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-[var(--accent)] hover:brightness-105 font-semibold transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
