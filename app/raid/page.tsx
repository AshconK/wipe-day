// app/raid/page.tsx
"use client";

import { useState, type ReactNode } from "react";
import {
  constructions,
  explosives,
  RES_LABELS,
  RAID_LAST_VERIFIED,
} from "@/lib/raidData";
import Hero from "../Hero";

const EXPLOSIVE_ICONS: Record<string, ReactNode> = {
  c4: (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
      <rect x="4" y="8" width="16" height="10" rx="1" />
      <rect x="9" y="4" width="6" height="4" rx="1" />
      <circle cx="12" cy="13" r="2" fill="#1d1a14" />
    </svg>
  ),
  rocket: (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2c2.5 2 4 5 4 8v5H8v-5c0-3 1.5-6 4-8z" />
      <path d="M8 16l-2 5 6-2 6 2-2-5z" />
    </svg>
  ),
  satchel: (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 9a4 4 0 018 0" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="4" y="9" width="16" height="11" rx="2" />
    </svg>
  ),
  beancan: (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
      <rect x="7" y="6" width="10" height="14" rx="1" />
      <ellipse cx="12" cy="6" rx="5" ry="1.8" />
    </svg>
  ),
  "explo-ammo": (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3c2 1.5 3 4 3 6v11H9V9c0-2 1-4.5 3-6z" />
    </svg>
  ),
};

export default function RaidCalculator() {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [explosiveId, setExplosiveId] = useState("rocket");

  const explosive = explosives.find((e) => e.id === explosiveId)!;

  function setQty(id: string, value: number) {
    setQuantities((q) => ({ ...q, [id]: Math.max(0, value || 0) }));
  }

  // --- the actual math: pure lookup + multiply ---
  let totalExplosives = 0;
  const unsupported: string[] = [];
  for (const c of constructions) {
    const qty = quantities[c.id] || 0;
    if (qty <= 0) continue;
    const per = c.destroy[explosiveId];
    if (per === undefined) {
      unsupported.push(c.name); // this piece can't be broken with the chosen explosive
      continue;
    }
    totalExplosives += qty * per;
  }
  const resources: Record<string, number> = {};
  for (const [res, amt] of Object.entries(explosive.cost)) {
    resources[res] = amt * totalExplosives;
  }
  const hasSelection = Object.values(quantities).some((q) => q > 0);

  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto">
      <Hero
        title="Raid Calculator"
        subtitle="Pick what you're breaking and your explosive — it totals the explosives and raw resources you need."
        image="/scenes/raid.gif"
      />
      {RAID_LAST_VERIFIED !== "verify me" && (
        <p className="text-xs text-stone-500 mb-6 data">
          Costs verified: {RAID_LAST_VERIFIED}
        </p>
      )}

      {/* explosive method */}
      <div className="mb-5">
        <span className="field-label">Explosive</span>
        <div className="explosive-grid mt-1">
          {explosives.map((e) => (
            <button
              key={e.id}
              onClick={() => setExplosiveId(e.id)}
              className={
                "explosive-card" + (e.id === explosiveId ? " selected" : "")
              }
            >
              <span className="icon">{EXPLOSIVE_ICONS[e.id]}</span>
              <span className="name">{e.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* constructions + quantities */}
      <div className="panel p-5 mb-5">
        <span className="field-label">What are you raiding?</span>
        <div className="grid sm:grid-cols-2 gap-3 mt-1">
          {constructions.map((c) => {
            const viable = c.destroy[explosiveId] !== undefined;
            const qty = quantities[c.id] || 0;
            return (
              <div key={c.id} className={"raid-row" + (viable ? "" : " disabled")}>
                <span className="rname">{c.name}</span>
                <div className="qty-stepper">
                  <button
                    type="button"
                    className="qty-btn minus"
                    onClick={() => setQty(c.id, qty - 1)}
                    aria-label={`Decrease ${c.name}`}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min={0}
                    className="field data"
                    value={qty}
                    onChange={(e) => setQty(c.id, parseInt(e.target.value, 10))}
                  />
                  <button
                    type="button"
                    className="qty-btn plus"
                    onClick={() => setQty(c.id, qty + 1)}
                    aria-label={`Increase ${c.name}`}
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
            </div>
        </div>

      {/* results */}
      {/* results */}
      <div className="panel p-5">
        <span className="raid-label">Total cost</span>
        {!hasSelection ? (
          <p className="text-stone-400 text-sm">
            Add some quantities above to see what the raid costs.
          </p>
        ) : (
          <>
            <div className="raid-result-head">
              <span className="raid-result-count">{totalExplosives}</span>
              <span className="raid-result-count-label">{explosive.name}</span>
            </div>
            <div className="raid-res-grid">
              {Object.entries(resources).map(([res, amt]) => (
                <div key={res} className="raid-res-row">
                  <span className="raid-res-name">{RES_LABELS[res] ?? res}</span>
                  <span className="raid-res-val">{amt.toLocaleString()}</span>
                </div>
              ))}
            </div>
            {unsupported.length > 0 && (
              <p className="text-xs mt-4" style={{ color: "var(--hazard)" }}>
                Not countable with {explosive.name}: {unsupported.join(", ")} —
                pick a different explosive for those.
              </p>
            )}
          </>
        )}
      </div>

      <button
        className="btn-steel mt-4 px-4 py-2"
        onClick={() => setQuantities({})}
      >
        Reset
      </button>
    </main>
  );
}