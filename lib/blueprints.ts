// lib/blueprints.ts
//
// Square legend: # = wall, . = floor, T = tool cupboard, D = door, (space) = empty
// Triangle legend: F = top-left, 7 = top-right, L = bottom-left, J = bottom-right

export interface Blueprint {
  id: string;
  name: string;
  layout: string[];
}

export const blueprints: Blueprint[] = [
  {
    id: "2x1",
    name: "2x1 Starter",
    layout: [
      "####",
      "#T.#",
      "##D#",
    ],
  },
  {
    id: "2x2",
    name: "2x2 Starter",
    layout: [
      "####",
      "#T.#",
      "#..#",
      "##D#",
    ],
  },
  {
    id: "triangle-demo",
    name: "Square + Triangle Corners",
    layout: [
      "F##7",
      "#T.#",
      "#..#",
      "L##J",
    ],
  },
];