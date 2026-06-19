// app/bases/page.tsx
"use client";

import { useState } from "react";
import Hero from "../Hero";
import StepThrough from "../StepThrough";
import { basesForGroup } from "@/lib/baseLibrary";

const tiers = [
  { id: "Solo", label: "Solo" },
  { id: "Trio", label: "Duo / Trio / Squad" },   // "Trio" maps to the duo-trio-squad tier
  { id: "Zerg (10+)", label: "Clan" },
];

export default function BasesPage() {
  const [groupSize, setGroupSize] = useState("Solo");
  const bases = basesForGroup(groupSize);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = bases.find((b) => b.id === selectedId) ?? bases[0] ?? null;

  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto">
      <Hero
        title="Base Designs"
        subtitle="Step-by-step build guides, organized by group size. Pick your size and follow along."
        image="/scenes/base.jpg"
      />

      {/* group size picker */}
      <div className="mb-6">
        <span className="field-label">Group size</span>
        <div className="flex flex-wrap gap-2">
          {tiers.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setGroupSize(t.id);
                setSelectedId(null);
              }}
              className={
                "px-3 py-2 text-sm rounded border " +
                (t.id === groupSize
                  ? "bg-[#c9472b] border-[#7c2d1a] text-white"
                  : "bg-[#1d1a14] border-[#3a342a] text-stone-300 hover:border-[#c9472b]")
              }
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {bases.length === 0 ? (
        <div className="panel p-6 text-stone-400">
          No base designs added for this group size yet.
        </div>
      ) : (
        <div className="grid md:grid-cols-[200px_1fr] gap-5">
          {/* base list */}
          <div className="flex md:flex-col gap-2 flex-wrap">
            {bases.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelectedId(b.id)}
                className={
                  "text-left px-3 py-2 rounded border text-sm transition-colors " +
                  (selected && b.id === selected.id
                    ? "bg-[#c9472b] border-[#7c2d1a] text-white"
                    : "bg-[#1d1a14] border-[#3a342a] text-stone-300 hover:border-[#c9472b]")
                }
              >
                {b.name}
              </button>
            ))}
          </div>

          {/* selected base */}
          {selected && (
            <div className="panel p-4">
              <h2 className="section-title" style={{ marginBottom: "0.8rem" }}>
                {selected.name}
              </h2>
              <p className="field-label">Build guide</p>
              <StepThrough steps={selected.steps} />

              <p className="field-label" style={{ marginTop: "1.2rem" }}>
                Build cost
              </p>
              <img
                src={selected.costImage}
                alt={`${selected.name} cost`}
                className="w-full rounded"
                style={{ maxWidth: "32rem", background: "#1c1917" }}
              />
            </div>
          )}
        </div>
      )}
    </main>
  );
}