"use client";
import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [form, setForm] = useState({});
  const [error, setError] = useState("");
  const router = useRouter();

  const submit = async () => {
    try {
      setError("");
      await api.post("/auth/signup", form);
      router.push("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
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
        <h2 className="text-xl mb-4">Signup</h2>
        {error && <div className="bg-red-500/20 text-red-400 p-2 rounded mb-3 text-sm">{error}</div>}
        <input placeholder="Name" className="input" onChange={e => setForm({ ...form, name: e.target.value })} onKeyPress={handleKeyPress} />
        <input placeholder="Email" className="input mt-2" onChange={e => setForm({ ...form, email: e.target.value })} onKeyPress={handleKeyPress} />
        <input type="password" placeholder="Password" className="input mt-2" onChange={e => setForm({ ...form, password: e.target.value })} onKeyPress={handleKeyPress} />
        <button onClick={submit} className="mt-4 w-full bg-blue-600 py-2 rounded">Create account</button>
        <p className="text-center text-sm text-slate-400 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
}
