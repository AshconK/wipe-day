// app/assistant/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import StepThrough from "../StepThrough";
import { randomBaseForGroup, type LibraryBase } from "@/lib/baseLibrary";
import SaveBaseButton from "../SaveBaseButton";

const defaultProfile = {
  groupSize: "Solo",
  platform: "PC",
  serverType: "Vanilla",
  experience: "Beginner",
};

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
      <select className="field" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

export default function AssistantPage() {
  const [profile, setProfile] = useState(defaultProfile);
  type ChatMessage = {
    role: "user" | "assistant";
    content: string;
    base?: LibraryBase | null;   // attached when the AI shows a base
  };
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(0);
  const endRef = useRef<HTMLDivElement>(null);

  // cycle loading messages
  useEffect(() => {
    if (!loading) { setLoadingMsg(0); return; }
    const id = setInterval(() => setLoadingMsg((i) => (i + 1) % LOADING_MESSAGES.length), 1400);
    return () => clearInterval(id);
  }, [loading]);

// auto-scroll to newest message (but not on first load)
  useEffect(() => {
    if (messages.length === 0) return;
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

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
        body: JSON.stringify({
          profile,
          messages: updated.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      let reply = data.answer ?? data.error ?? "No response.";
      let base: LibraryBase | null = null;
      if (reply.includes("[SHOW_BASE]")) {
        reply = reply.replace("[SHOW_BASE]", "").trim();
        base = randomBaseForGroup(profile.groupSize);
      }
      setMessages((prev) => [...prev, { role: "assistant", content: reply, base }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Request failed — check the terminal." }]);
    } finally {
      setLoading(false);
    }
  }

  function onKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      ask();
    }
  }

  return (
    <div className="chat-page">
      {/* profile side panel */}
      <aside className="chat-aside">
        <div className="panel p-4">
          <h2 className="section-title" style={{ fontSize: "1rem", marginBottom: "0.6rem" }}>
            Your Setup
          </h2>
          <Select label="Group size" value={profile.groupSize}
            options={["Solo", "Duo", "Trio", "Squad (4+)", "Zerg (10+)"]}
            onChange={(v) => update("groupSize", v)} />
          <Select label="Platform" value={profile.platform}
            options={["PC", "Console"]}
            onChange={(v) => update("platform", v)} />
          <Select label="Server type" value={profile.serverType}
            options={["Vanilla", "Modded", "2x", "5x/10x", "Official"]}
            onChange={(v) => update("serverType", v)} />
          <Select label="Experience" value={profile.experience}
            options={["Beginner", "Intermediate", "Veteran"]}
            onChange={(v) => update("experience", v)} />
        </div>
      </aside>

      {/* chat column */}
      <section className="chat-main">
        <div className="chat-scroll">
          {messages.length === 0 && !loading ? (
            <div className="chat-empty">
              <p style={{ fontSize: "1rem", color: "#b8ae9f" }}>
                Set your profile on the left, then ask anything about bases,
                expansion, electricity, or raids.
              </p>
            </div>
          ) : (
            messages.map((m, i) => (
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
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                    {m.base && (
                      <div style={{ marginTop: "0.9rem" }}>
                        <div className="flex items-center justify-between gap-2" style={{ marginBottom: "0.3rem" }}>
                          <p className="field-label" style={{ margin: 0 }}>{m.base.name}</p>
                          <SaveBaseButton base={m.base} />
                        </div>
                        <StepThrough steps={m.base.steps} />
                        <p className="field-label" style={{ marginTop: "1rem" }}>Build cost</p>
                        <img
                          src={m.base.costImage}
                          alt={`${m.base.name} cost`}
                          className="w-full rounded"
                          style={{ maxWidth: "30rem", background: "#1c1917" }}
                        />
                      </div>
                    )}
                    {m.base === null && m.content.length < 4 && (
                      <p className="text-stone-400 text-sm">
                        No base designs available for this group size yet.
                      </p>
                    )}
                  </div>
                ) : (
                  m.content
                )}
              </div>
            ))
          )}

          {loading && (
            <div className="self-start panel p-4 fade-in">
              <div className="flex items-center gap-3 text-stone-300 text-sm">
                <span className="loader-bars"><span></span><span></span><span></span><span></span></span>
                {LOADING_MESSAGES[loadingMsg]}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* pinned input bar */}
        <div className="chat-inputbar">
          <textarea
            className="field"
            placeholder="Ask anything…  (Enter to send, Shift+Enter for a new line)"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={onKey}
          />
          <div className="btns">
            <button className="btn-ember px-4 py-2 disabled:opacity-50" onClick={ask} disabled={loading}>
              {loading ? "…" : "Ask"}
            </button>
            <button className="btn-steel px-4 py-2" onClick={() => setMessages([])}>
              Clear
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}