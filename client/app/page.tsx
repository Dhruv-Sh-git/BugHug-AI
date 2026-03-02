"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const stored = window.localStorage.getItem("bughug-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const nextTheme = stored || (prefersDark ? "dark" : "light");
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    window.localStorage.setItem("bughug-theme", nextTheme);
  };

  return (
    <div className="app-shell flex flex-col">
      {/* Nav */}
      <header className="w-full px-6 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-white border border-[var(--line)] flex items-center justify-center shadow-sm">
              <span className="text-xs font-semibold">BH</span>
            </div>
            <div>
              <div className="text-base font-semibold">BugHug AI</div>
              <div className="text-xs text-muted">Friendly helper for fixing bugs</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="px-3 py-2 text-xs font-semibold text-[var(--ink)] bg-[var(--card)] border border-[var(--line)] rounded-full hover:brightness-105 transition"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </button>
            <Link
              href="/login"
              className="px-4 py-2 text-sm text-[var(--ink)] bg-[var(--card)] border border-[var(--line)] rounded-full hover:brightness-105 transition"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 text-sm text-white bg-[var(--accent)] rounded-full hover:brightness-105 transition"
            >
              Start free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 px-6 pb-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <div className="pt-8">
            <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-[var(--card)] border border-[var(--line)]">
              <span>Simple, calm, and helpful</span>
            </div>
            <h1 className="mt-5 text-4xl md:text-5xl font-semibold leading-tight max-w-2xl">
              Fix bugs with a friendly guide that explains everything
              <span className="gradient-text"> in plain words</span>.
            </h1>
            <p className="mt-4 text-base md:text-lg text-muted max-w-2xl">
              BugHug AI is a gentle chat helper. It explains errors step by step, gives you
              quick fixes, and keeps the tone kind and easy to follow.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                href="/signup"
                className="px-6 py-3 text-sm text-white bg-[var(--accent)] rounded-xl hover:brightness-105 transition text-center"
              >
                Try it free
              </Link>
              <Link
                href="/login"
                className="px-6 py-3 text-sm text-[var(--ink)] bg-[var(--card)] border border-[var(--line)] rounded-xl hover:brightness-105 transition text-center"
              >
                I already have an account
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  label: "Clear steps",
                  text: "Get a tiny checklist you can follow.",
                },
                {
                  label: "Friendly tone",
                  text: "No scary jargon or blame.",
                },
                {
                  label: "Always here",
                  text: "Help is ready any time.",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-[var(--card)] border border-[var(--line)] rounded-2xl px-4 py-3"
                >
                  <div className="text-xs font-semibold text-[var(--accent)]">{item.label}</div>
                  <div className="text-sm text-muted mt-1">{item.text}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="card-soft rounded-[28px] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted">Your helper</div>
                  <div className="text-lg font-semibold">BugHug AI</div>
                </div>
                <div className="px-3 py-1 text-xs font-semibold rounded-full bg-[var(--soft)] text-[var(--accent)]">
                  Online
                </div>
              </div>
              <div className="mt-5 space-y-3">
                <div className="bg-[var(--soft)] rounded-2xl px-4 py-3 text-sm">
                  Hi! Tell me what went wrong and I will explain it simply.
                </div>
                <div className="bg-[var(--soft)] rounded-2xl px-4 py-3 text-sm ml-auto">
                  My app says “undefined is not a function.”
                </div>
                <div className="bg-[var(--soft)] rounded-2xl px-4 py-3 text-sm">
                  No problem. Let us check the line number together and fix it step by step.
                </div>
              </div>
              <div className="mt-5 flex items-center gap-2">
                <div className="flex-1 bg-[var(--soft)] rounded-full px-4 py-2 text-xs text-muted">
                  Type your question...
                </div>
                <button className="px-4 py-2 text-xs text-white bg-[var(--accent)] rounded-full">
                  Send
                </button>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-[#fff0db] blur-2xl" />
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-[#d8ecff] blur-2xl" />
          </div>
        </div>

        <section className="max-w-6xl mx-auto mt-16">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-2xl font-semibold">How it works (super simple)</h2>
            <div className="text-sm text-muted">Three small steps</div>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                step: "1",
                title: "Tell us your problem",
                text: "Paste the error or describe what you see.",
              },
              {
                step: "2",
                title: "Get a calm explanation",
                text: "We explain what it means in plain words.",
              },
              {
                step: "3",
                title: "Fix it with a checklist",
                text: "Follow the small steps and you are done.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-[var(--card)] border border-[var(--line)] rounded-3xl p-5">
                <div className="w-8 h-8 rounded-full bg-[var(--soft)] text-[var(--accent)] text-sm font-bold flex items-center justify-center">
                  {item.step}
                </div>
                <div className="mt-3 text-lg font-semibold">{item.title}</div>
                <div className="mt-1 text-sm text-muted">{item.text}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-muted">
        © 2026 BugHug AI. Built with care for busy brains.
      </footer>
    </div>
  );
}
