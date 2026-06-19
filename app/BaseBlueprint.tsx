// app/BaseBlueprint.tsx
import { ReactElement } from "react";

type Props = { layout: string[]; cell?: number };

// Triangle floor pieces. Each character = a triangle filling the cell,
// named by which corner holds the right angle:
//   F = top-left     7 = top-right
//   L = bottom-left  J = bottom-right
// Points are in unit coords (0..1), scaled to the cell size.
const TRIANGLES: Record<string, [number, number][]> = {
  F: [[0, 0], [1, 0], [0, 1]],
  "7": [[0, 0], [1, 0], [1, 1]],
  L: [[0, 0], [0, 1], [1, 1]],
  J: [[1, 0], [1, 1], [0, 1]],
};

export default function BaseBlueprint({ layout, cell = 44 }: Props) {
  const rows = layout.length;
  const cols = Math.max(...layout.map((r) => r.length));
  const width = cols * cell;
  const height = rows * cell;
  const tiles: ReactElement[] = [];

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < layout[y].length; x++) {
      const c = layout[y][x];
      if (c === " ") continue; // empty = draw nothing

      const px = x * cell;
      const py = y * cell;

      // Triangle floor piece.
      if (TRIANGLES[c]) {
        const pts = TRIANGLES[c]
          .map(([ux, uy]) => `${px + ux * cell},${py + uy * cell}`)
          .join(" ");
        tiles.push(
          <polygon
            key={`tri-${x}-${y}`}
            points={pts}
            fill="#292524"
            stroke="#57534e"
            strokeWidth={1}
          />
        );
        continue;
      }

      // Square cells: wall is darker, floor is lighter.
      const fill = c === "#" ? "#44403c" : "#292524";
      tiles.push(
        <rect
          key={`cell-${x}-${y}`}
          x={px}
          y={py}
          width={cell}
          height={cell}
          fill={fill}
          stroke="#57534e"
          strokeWidth={1}
        />
      );

      // Tool cupboard marker.
      if (c === "T") {
        tiles.push(
          <g key={`tc-${x}-${y}`}>
            <rect
              x={px + cell * 0.28}
              y={py + cell * 0.28}
              width={cell * 0.44}
              height={cell * 0.44}
              rx={3}
              fill="#ea580c"
            />
            <text
              x={px + cell / 2}
              y={py + cell / 2 + 4}
              textAnchor="middle"
              fontSize={11}
              fill="#ffffff"
            >
              TC
            </text>
          </g>
        );
      }

      // Door swing arc.
      if (c === "D") {
        tiles.push(
          <path
            key={`door-${x}-${y}`}
            d={`M ${px} ${py} A ${cell} ${cell} 0 0 1 ${px + cell} ${py + cell}`}
            fill="none"
            stroke="#ea580c"
            strokeWidth={2}
          />
        );
      }
    }
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      style={{ maxWidth: width, background: "#1c1917", borderRadius: 6 }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {tiles}
    </svg>
  );
}