// lib/savedBases.ts
import { useEffect, useState } from "react";
import type { LibraryBase } from "./baseLibrary";

// ----- Pro gate (placeholder until real auth exists) -----
// Saving is a Pro feature. No accounts yet, so this is false and the Save
// button shows a locked state. Flip to true to TEST the save flow locally.
// Later, replace this with a real check against the signed-in user's plan.
const PRO_ENABLED = false;
export function useIsPro(): boolean {
  return PRO_ENABLED;
}

// ----- Swappable storage layer -----
// In-memory for now (clears on refresh, not tied to an account). When the
// database is added, reimplement getSaved/saveBase/removeBase to read & write
// the DB for the signed-in user — nothing else in the app needs to change.
let saved: LibraryBase[] = [];
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function isSaved(id: string): boolean {
  return saved.some((b) => b.id === id);
}
export function saveBase(base: LibraryBase) {
  if (!saved.some((b) => b.id === base.id)) {
    saved = [...saved, base];
    emit();
  }
}
export function removeBase(id: string) {
  saved = saved.filter((b) => b.id !== id);
  emit();
}

// React hook — re-renders subscribers whenever the saved list changes.
export function useSavedBases(): LibraryBase[] {
  const [list, setList] = useState<LibraryBase[]>(saved);
  useEffect(() => {
    const update = () => setList([...saved]);
    listeners.add(update);
    update();
    return () => { listeners.delete(update); };
  }, []);
  return list;
}