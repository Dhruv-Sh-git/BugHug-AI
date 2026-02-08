"use client";
import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [form, setForm] = useState({});
  const router = useRouter();

  const submit = async () => {
    await api.post("/auth/signup", form);
    router.push("/login");
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="bg-slate-800 p-6 rounded w-80">
        <h2 className="text-xl mb-4">Signup</h2>
        <input placeholder="Name" className="input" onChange={e => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Email" className="input mt-2" onChange={e => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Password" className="input mt-2" onChange={e => setForm({ ...form, password: e.target.value })} />
        <button onClick={submit} className="mt-4 w-full bg-blue-600 py-2 rounded">Create account</button>
      </div>
    </div>
  );
}
