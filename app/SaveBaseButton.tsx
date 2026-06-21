"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useSavedBases } from "@/lib/savedBases";
import type { LibraryBase } from "@/lib/baseLibrary";

export default function SaveBaseButton({ base }: { base: LibraryBase }) {
  const { isSignedIn } = useAuth();
  const { isSaved, save, remove } = useSavedBases();
  const [msg, setMsg] = useState<string | null>(null);

  if (!isSignedIn) {
    return (
      <button className="save-btn locked" disabled title="Sign in to save bases">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a5 5 0 00-5 5v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V7a5 5 0 00-5-5zm-3 8V7a3 3 0 016 0v3z" />
        </svg>
        Save Base
      </button>
    );
  }

  const alreadySaved = isSaved(base.id);

  async function onClick() {
    if (alreadySaved) { remove(base.id); return; }
    const error = await save(base);
    if (error) setMsg(error);
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        className={"save-btn" + (alreadySaved ? " is-saved" : "")}
        onClick={onClick}
      >
        {alreadySaved ? "✓ Saved" : "+ Save Base"}
      </button>
      {msg && <span style={{ color: "var(--hazard)", fontSize: "0.72rem", maxWidth: "16rem", textAlign: "right" }}>{msg}</span>}
    </div>
  );
}