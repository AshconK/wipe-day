// app/assistant/page.tsx
"use client";

import { useState, useEffect } from "react";
import BaseBlueprint from "../BaseBlueprint";
import { blueprints } from "@/lib/blueprints";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Hero from "../Hero";

const defaultProfile = {
  groupSize: "Solo",
  platform: "PC",
  serverType: "Vanilla",
  experience: "Beginner",
  goal: "",
};

// Status lines that cycle while waiting for an answer.
const LOADING_MESSAGES = [
  "Surveying the build site…",
  "Counting sulfur…",
  "Laying the foundations…",
  "Checking turret arcs…",
  "Forging your answer…",
];

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <label>
      <span className="field-label">{label}</span>
      <select
        className="field"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function AssistantPage() {
  const [profile, setProfile] = useState(defaultProfile);
  type ChatMessage = { role: "user" | "assistant"; content: string };
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(0);

  // Cycle the loading messages while a request is in flight.
  useEffect(() => {
    if (!loading) {
      setLoadingMsg(0);
      return;
    }
    const id = setInterval(() => {
      setLoadingMsg((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 1400);
    return () => clearInterval(id);
  }, [loading]);

  function update(field: keyof typeof profile, value: string) {
    setProfile((p) => ({ ...p, [field]: value }));
  }

  async function ask() {
    if (!question.trim() || loading) return;

    const userMessage: ChatMessage = { role: "user", content: question };
    const updated = [...messages, userMessage];
    setMessages(updated);
    setQuestion("");

    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, messages: updated }),
      });
      const data = await res.json();
      const reply = data.answer ?? data.error ?? "No response.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Request failed — check the terminal." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto">
      <Hero
        title="Rust Base Assistant"
        subtitle="Set your group's profile, describe your goal, then get tailored base, expansion, and electricity advice."
        image="/scenes/hero.jpg"
      />

      <section className="panel p-5 grid sm:grid-cols-3 gap-4 mb-4">
        <Select
          label="Group size"
          value={profile.groupSize}
          options={["Solo", "Duo", "Trio", "Squad (4+)", "Zerg (10+)"]}
          onChange={(v) => update("groupSize", v)}
        />
        <Select
          label="Platform"
          value={profile.platform}
          options={["PC", "Console"]}
          onChange={(v) => update("platform", v)}
        />
        <Select
          label="Server type"
          value={profile.serverType}
          options={["Vanilla", "Modded", "2x", "5x/10x", "Official"]}
          onChange={(v) => update("serverType", v)}
        />
        <Select
          label="Experience"
          value={profile.experience}
          options={["Beginner", "Intermediate", "Veteran"]}
          onChange={(v) => update("experience", v)}
        />
      </section>

      <div className="mb-3">
        <span className="field-label">Your goal</span>
        <input
          className="field"
          type="text"
          placeholder="e.g. survive the first wipe, defend against a 10-man clan, set up auto turrets…"
          value={profile.goal}
          onChange={(e) => update("goal", e.target.value)}
        />
      </div>

      <div className="mb-3">
        <span className="field-label">Your question</span>
        <textarea
          className="field h-24"
          placeholder="e.g. What's a good starter base for us, and how do I expand it?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
      </div>

      <div className="flex items-center">
        <button
          className="btn-ember px-4 py-2 disabled:opacity-50"
          onClick={ask}
          disabled={loading}
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
        <button
          className="btn-steel ml-2 px-4 py-2"
          onClick={() => setMessages([])}
        >
          Clear chat
        </button>
      </div>

      {messages.length > 0 && (
        <div className="mt-6 flex flex-col gap-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={
                m.role === "user"
                  ? "self-end max-w-[85%] rounded chat-user p-3 whitespace-pre-wrap fade-in"
                  : "self-start max-w-[90%] panel p-4 fade-in"
              }
            >
              {m.role === "assistant" ? (
                <div className="prose-rust">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {m.content}
                  </ReactMarkdown>
                </div>
              ) : (
                m.content
              )}
            </div>
          ))}

          {loading && (
            <div className="self-start panel p-4 fade-in">
              <div className="flex items-center gap-3 text-stone-300 text-sm">
                <span className="loader-bars">
                  <span></span><span></span><span></span><span></span>
                </span>
                {LOADING_MESSAGES[loadingMsg]}
              </div>
            </div>
          )}
        </div>
      )}

      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-1">Base blueprints</h2>
        <p className="text-xs text-stone-400 mb-3">
          Legend: dark = walls, light = floor, orange box = tool cupboard,
          orange arc = door, angled = triangle floor.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {blueprints.map((bp) => (
            <div key={bp.id} className="panel p-3 card-hover">
              <h3 className="font-semibold mb-2">{bp.name}</h3>
              <BaseBlueprint layout={bp.layout} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}