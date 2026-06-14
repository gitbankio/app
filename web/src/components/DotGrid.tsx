import { useState } from "react";

export type PatternFn = (c: number, r: number, cols: number, rows: number) => 0 | 1 | 2 | 3;

interface DotGridProps {
  cols: number;
  rows: number;
  dotRadius?: number;
  gap?: number;
  patternFn: PatternFn;
  stretch?: boolean;
}

export default function DotGrid({ cols, rows, dotRadius = 2.5, gap = 2, patternFn, stretch }: DotGridProps) {
  const [hov, setHov] = useState<{ r: number; c: number } | null>(null);
  const pitch = dotRadius * 2 + gap;
  const W = cols * pitch - gap;
  const H = rows * pitch - gap;

  const getFill = (val: 0 | 1 | 2 | 3, r: number, c: number): string => {
    if (!val) return "none";
    const d = hov ? Math.sqrt((hov.r - r) ** 2 + (hov.c - c) ** 2) : Infinity;
    if (d === 0) return "hsl(38 92% 62%)";
    if (d <= 1.5) return "hsl(231 70% 74%)";
    if (d <= 2.8) return "hsl(231 62% 60%)";
    if (d <= 4.2) return "hsl(231 54% 53%)";
    if (val === 1) return "hsl(231 35% 60% / 0.17)";
    if (val === 2) return "hsl(231 48% 48% / 0.52)";
    return "hsl(231 48% 52% / 0.88)";
  };

  const els: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const val = patternFn(c, r, cols, rows) as 0 | 1 | 2 | 3;
      if (!val) continue;
      els.push(
        <circle
          key={`${r}-${c}`}
          cx={c * pitch + dotRadius}
          cy={r * pitch + dotRadius}
          r={dotRadius}
          fill={getFill(val, r, c)}
          onMouseEnter={() => setHov({ r, c })}
          onMouseLeave={() => setHov(null)}
          style={{ cursor: "crosshair" }}
        />
      );
    }
  }

  return (
    <svg
      width={stretch ? "100%" : W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio={stretch ? "none" : "xMidYMid meet"}
      style={{ display: "block", userSelect: "none" }}
      onMouseLeave={() => setHov(null)}
    >
      {els}
    </svg>
  );
}
