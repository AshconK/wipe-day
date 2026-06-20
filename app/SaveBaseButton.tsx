// app/SaveBaseButton.tsx
"use client";

import { useIsPro, saveBase, removeBase, useSavedBases } from "@/lib/savedBases";
import type { LibraryBase } from "@/lib/baseLibrary";

export default function SaveBaseButton({ base }: { base: LibraryBase }) {
  const isPro = useIsPro();
  const saved = useSavedBases();
  const alreadySaved = saved.some((b) => b.id === base.id);

  if (!isPro) {
    return (
      <button className="save-btn locked" disabled title="Saving is a Pro feature — coming soon">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a5 5 0 00-5 5v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V7a5 5 0 00-5-5zm-3 8V7a3 3 0 016 0v3z" />
        </svg>
        Save Base (Pro)
      </button>
    );
  }

  return (
    <button
      className={"save-btn" + (alreadySaved ? " is-saved" : "")}
      onClick={() => (alreadySaved ? removeBase(base.id) : saveBase(base))}
    >
      {alreadySaved ? "✓ Saved" : "+ Save Base"}
    </button>
  );
}