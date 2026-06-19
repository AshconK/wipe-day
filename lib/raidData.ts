// lib/raidData.ts
//
// APPROXIMATE PLACEHOLDER DATA — verify every number against rustlabs.com
// before trusting it, and re-check after Rust patches.

export const RAID_LAST_VERIFIED = "verify me"; // set to e.g. "June 2026" once checked

// Raw resource cost to craft ONE of each explosive.
export interface Explosive {
  id: string;
  name: string;
  cost: Record<string, number>;
}


export const explosives: Explosive[] = [
  { id: "c4",         name: "C4 (Timed Charge)",   cost: { sulfur: 2200, charcoal: 3000, metalFragments: 200, lowGradeFuel: 60, techTrash: 2, cloth: 5 } },
  { id: "rocket",     name: "Rocket",              cost: { sulfur: 1400, charcoal: 1950, metalFragments: 100, lowGradeFuel: 30, metalPipes: 2 } },
  { id: "satchel",    name: "Satchel Charge",      cost: { sulfur: 480, charcoal: 720, metalFragments: 80, rope: 1 } },
  { id: "beancan",    name: "Beancan Grenade",     cost: { sulfur: 120, charcoal: 180, metalFragments: 20 } },
  { id: "explo-ammo", name: "Explosive 5.56 Ammo", cost: { sulfur: 25, charcoal: 35, metalFragments: 5 } },
];

// How many of each explosive to destroy each construction.
// Omit an explosive when it isn't a practical raid method for that piece.
export interface Construction {
  id: string;
  name: string;
  destroy: Record<string, number>;
}

export const constructions: Construction[] = [
  { id: "wood-wall",   name: "Wooden Wall",      destroy: { c4: 1, rocket: 2, satchel: 3, beancan: 12, "explo-ammo": 56 } },
  { id: "stone-wall",  name: "Stone Wall",       destroy: { c4: 2, rocket: 4, satchel: 10, beancan: 46, "explo-ammo": 182 } },
  { id: "sheet-wall",  name: "Sheet Metal Wall", destroy: { c4: 4, rocket: 8, satchel: 23 } },
  { id: "armor-wall",  name: "Armored Wall",     destroy: { c4: 8, rocket: 15 } },
  { id: "wood-door",   name: "Wooden Door",      destroy: { c4: 1, rocket: 1, satchel: 2, beancan: 8, "explo-ammo": 34 } },
  { id: "sheet-door",  name: "Sheet Metal Door", destroy: { c4: 1, rocket: 2, satchel: 4, beancan: 15, "explo-ammo": 63 } },
  { id: "garage-door", name: "Garage Door",      destroy: { c4: 2, rocket: 3, satchel: 9 } },
  { id: "armor-door",  name: "Armored Door",     destroy: { c4: 3, rocket: 5 } },
];

export const RES_LABELS: Record<string, string> = {
  sulfur: "Sulfur",
  charcoal: "Charcoal",
  metalFragments: "Metal Fragments",
  lowGradeFuel: "Low Grade Fuel",
  metalPipes: "Metal Pipes",
  cloth: "Cloth",
  rope: "Rope",
  techTrash: "Tech Trash",
};