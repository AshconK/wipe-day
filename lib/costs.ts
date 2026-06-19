// lib/costs.ts
//
// Building costs for Rust. These are APPROXIMATE PLACEHOLDERS so the app runs.
// Replace every number with current, verified values from rustlabs.com —
// Facepunch patches monthly and costs change. Treat this file as your
// "source of truth" and keep it updated.

export interface BuildItem {
  id: string;
  label: string;
  materials: Record<string, number>; // material name -> amount for ONE piece
}

export const buildItems: BuildItem[] = [
  { id: "stone-foundation", label: "Stone Foundation",  materials: { stone: 300 } },
  { id: "stone-wall",       label: "Stone Wall",         materials: { stone: 300 } },
  { id: "stone-floor",      label: "Stone Floor/Ceiling",materials: { stone: 300 } },
  { id: "stone-doorway",    label: "Stone Doorway",      materials: { stone: 300 } },
  { id: "wooden-door",      label: "Wooden Door",        materials: { wood: 300 } },
  { id: "sheet-metal-door", label: "Sheet Metal Door",   materials: { metalFragments: 150 } },
  { id: "garage-door",      label: "Garage Door",        materials: { metalFragments: 300 } },
  { id: "tool-cupboard",    label: "Tool Cupboard",      materials: { wood: 1000 } },
];

// Sums up a list of items into total materials. Pure code, no AI — always exact.
export function totalCost(selection: { id: string; quantity: number }[]) {
  const totals: Record<string, number> = {};
  for (const { id, quantity } of selection) {
    const item = buildItems.find((b) => b.id === id);
    if (!item) continue;
    for (const [material, amount] of Object.entries(item.materials)) {
      totals[material] = (totals[material] ?? 0) + amount * quantity;
    }
  }
  return totals;
}

// Turns the cost table into plain text we can hand to Claude so it uses
// these numbers instead of inventing them.
export function costReference(): string {
  return buildItems
    .map((i) => {
      const mats = Object.entries(i.materials)
        .map(([m, a]) => `${a} ${m}`)
        .join(", ");
      return `- ${i.label}: ${mats}`;
    })
    .join("\n");
}