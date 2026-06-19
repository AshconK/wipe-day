// lib/baseLibrary.ts
//
// Each base is a folder of step videos + a cost image, under
// /public/bases/<tier>/baseN/. Add or remove step entries per base as needed —
// the player adjusts to however many steps exist. Match filenames EXACTLY.

export type Tier = "solo" | "duo-trio-squad" | "clan";

export interface BuildStep {
  caption?: string;   // optional — the clip carries the instruction
  media: string;      // 20–30s .mp4 per step
}

export interface LibraryBase {
  id: string;
  tier: Tier;
  name: string;
  steps: BuildStep[];
  costImage: string;
}

// Helper to scaffold a base with N video steps in the standard folder layout.
function makeBase(tier: Tier, n: number, stepCount = 4): LibraryBase {
  const folder = `/bases/${tier}/base${n}`;
  const steps: BuildStep[] = [];
  for (let s = 1; s <= stepCount; s++) {
    steps.push({ media: `${folder}/step${s}.mp4` });
  }
  return {
    id: `${tier}-${n}`,
    tier,
    name: `Base ${n}`,
    steps,
    costImage: `${folder}/cost.jpg`,
  };
}

// 9 bases per tier. Change the last arg to set a base's step count,
// e.g. makeBase("solo", 3, 6) for a 6-step base.
export const baseLibrary: LibraryBase[] = [
  ...Array.from({ length: 9 }, (_, i) => makeBase("solo", i + 1)),
  ...Array.from({ length: 9 }, (_, i) => makeBase("duo-trio-squad", i + 1)),
  ...Array.from({ length: 9 }, (_, i) => makeBase("clan", i + 1)),
];

export function tierForGroup(groupSize: string): Tier {
  if (groupSize === "Solo") return "solo";
  if (groupSize === "Zerg (10+)") return "clan";
  return "duo-trio-squad";
}

export function randomBaseForGroup(groupSize: string): LibraryBase | null {
  const tier = tierForGroup(groupSize);
  const pool = baseLibrary.filter((b) => b.tier === tier);
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function basesForGroup(groupSize: string): LibraryBase[] {
  const tier = tierForGroup(groupSize);
  return baseLibrary.filter((b) => b.tier === tier);
}