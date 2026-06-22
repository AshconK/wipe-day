// lib/savedBases.ts
"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import type { LibraryBase } from "./baseLibrary";

export function useIsPro(): boolean {
  const { isSignedIn } = useAuth();
  const [isPro, setIsPro] = useState(false);
  useEffect(() => {
    if (!isSignedIn) { setIsPro(false); return; }
    fetch("/api/me")
      .then((r) => r.json())
      .then((d) => setIsPro(!!d.isPro))
      .catch(() => setIsPro(false));
  }, [isSignedIn]);
  return isPro;
}

// Returns the user's plan: "free" | "pro" | "clan"
export function usePlan(): string {
  const { isSignedIn } = useAuth();
  const [plan, setPlan] = useState("free");
  useEffect(() => {
    if (!isSignedIn) { setPlan("free"); return; }
    fetch("/api/me")
      .then((r) => r.json())
      .then((d) => setPlan(d.plan ?? "free"))
      .catch(() => setPlan("free"));
  }, [isSignedIn]);
  return plan;
}

// What the database returns per saved row.
type SavedRow = { baseId: string; baseName: string };

// Hook: load + manage the signed-in user's saved bases from the database.
export function useSavedBases() {
  const { isSignedIn } = useAuth();
  const [saved, setSaved] = useState<SavedRow[]>([]);

  const refresh = useCallback(async () => {
    if (!isSignedIn) { setSaved([]); return; }
    try {
      const res = await fetch("/api/saved");
      const data = await res.json();
      setSaved(data.bases ?? []);
    } catch {
      setSaved([]);
    }
  }, [isSignedIn]);

  useEffect(() => { refresh(); }, [refresh]);

  const save = useCallback(async (base: LibraryBase): Promise<string | null> => {
    const res = await fetch("/api/saved", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ baseId: base.id, baseName: base.name }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return data.message ?? "Couldn't save that base.";
    }
    refresh();
    return null; // success
  }, [refresh]);

  const remove = useCallback(async (baseId: string) => {
    await fetch(`/api/saved?baseId=${encodeURIComponent(baseId)}`, { method: "DELETE" });
    refresh();
  }, [refresh]);

  const isSaved = useCallback((baseId: string) => saved.some((b) => b.baseId === baseId), [saved]);

  return { saved, save, remove, isSaved, refresh };
}