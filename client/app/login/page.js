"use client";
import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function Login() {
  const [form, setForm] = useState({});
  const [error, setError] = useState("");
  const router = useRouter();

  const submit = async () => {
    try {
      setError("");
      await api.post("/auth/login", form);
      router.push("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      submit();
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="bg-slate-800 p-6 rounded w-80">
        <h2 className="text-xl mb-4">Login</h2>
        {error && <div className="bg-red-500/20 text-red-400 p-2 rounded mb-3 text-sm">{error}</div>}
        <input placeholder="Email" className="input" onChange={e => setForm({ ...form, email: e.target.value })} onKeyPress={handleKeyPress} />
        <input type="password" placeholder="Password" className="input mt-2" onChange={e => setForm({ ...form, password: e.target.value })} onKeyPress={handleKeyPress} />
        <button onClick={submit} className="mt-4 w-full bg-green-600 py-2 rounded">Login</button>
        <p className="text-center text-sm text-slate-400 mt-4">
          Don't have an account?{" "}
          <a href="/signup" className="text-green-500 hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
}
