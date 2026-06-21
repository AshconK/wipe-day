// app/bases/page.tsx
"use client";

import { useState } from "react";
import Hero from "../Hero";
import StepThrough from "../StepThrough";
import { useSavedBases } from "@/lib/savedBases";
import { useAuth } from "@clerk/nextjs";
import { baseLibrary } from "@/lib/baseLibrary";

export default function BasesPage() {
  const { saved, remove } = useSavedBases();
  const { isSignedIn } = useAuth();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto">
      <Hero
        title="My Bases"
        subtitle="Your saved base designs, all in one place — revisit any build whenever you need it."
      />

      {/* ===== Saved bases hub ===== */}
      {!isSignedIn ? (
        <div className="panel p-6 text-stone-400">
          Saving bases is for members. <span style={{ color: "var(--ember)" }}>Log in</span> from
          the top right, then every base you save from the Assistant will live here.
        </div>
      ) : saved.length === 0 ? (
        <div className="panel p-6 text-stone-400">
          You haven&apos;t saved any bases yet. When the Assistant shows you a base, hit{" "}
          <span style={{ color: "var(--ember)" }}>Save Base</span> and it&apos;ll appear here.
        </div>
      ) : (
        <>
          <p className="field-label">{saved.length} saved</p>
          <div className="grid gap-3 sm:grid-cols-2 mb-8">
            {saved.map((row) => {
              const full = baseLibrary.find((b) => b.id === row.baseId);
              const isOpen = openId === row.baseId;
              return (
                <div key={row.baseId} className="panel p-4 card-hover">
                  {full?.thumbnail && (
                    <img
                      src={full.thumbnail}
                      alt={row.baseName}
                      className="w-full rounded mb-3"
                      style={{ height: "150px", objectFit: "cover", background: "#1c1917" }}
                    />
                  )}
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold">{row.baseName}</h3>
                    <div className="flex gap-2">
                      {full && (
                        <button
                          className="btn-steel px-3 py-1 text-xs"
                          onClick={() => setOpenId(isOpen ? null : row.baseId)}
                        >
                          {isOpen ? "Hide" : "View"}
                        </button>
                      )}
                      <button
                        className="btn-steel px-3 py-1 text-xs"
                        onClick={() => {
                          remove(row.baseId);
                          if (isOpen) setOpenId(null);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {isOpen && full && (
                    <div className="mt-3">
                      <p className="field-label">Build guide</p>
                      <StepThrough steps={full.steps} />
                      <p className="field-label" style={{ marginTop: "1rem" }}>Build cost</p>
                      <img
                        src={full.costImage}
                        alt={`${full.name} cost`}
                        className="w-full rounded"
                        style={{ background: "#1c1917" }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ===== Upload your own (scaffolded, locked for later) ===== */}
      <section className="mt-6">
        <h2 className="section-title">Upload Your Own</h2>
        <div className="panel p-6 text-stone-400" style={{ opacity: 0.8 }}>
          <p style={{ margin: 0 }}>
            <span style={{ color: "var(--ember)" }}>Coming soon. </span>
            Share your own base designs — upload your build clips and cost sheet, and keep
            them in your personal library.
          </p>
          <button className="save-btn locked mt-3" disabled title="Coming soon">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a5 5 0 00-5 5v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V7a5 5 0 00-5-5zm-3 8V7a3 3 0 016 0v3z" />
            </svg>
            Upload a Base (Coming soon)
          </button>
        </div>
      </section>
    </main>
  );
}