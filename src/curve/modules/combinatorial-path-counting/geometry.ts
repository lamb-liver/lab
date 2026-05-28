import type { CurvePoint, ParamValues, ThumbnailSpec } from '../../types';

export const COMBINATORIAL_VIEW = {
  width: 900,
  height: 900,
};

export const MODE_SINGLE = 0;
export const MODE_OVERLAY = 1;
export const MODE_COUNT = 2;

export type PathMode = 'single' | 'overlay' | 'count';

export type GridLayout = {
  originX: number;
  originY: number;
  step: number;
};

export function normalizeSize(value: number | undefined): number {
  const rounded = Math.round(value ?? 5);
  return Math.max(2, Math.min(9, rounded));
}

export function modeFromValue(value: number | undefined): PathMode {
  const mode = Math.round(value ?? MODE_SINGLE);
  if (mode === MODE_OVERLAY) return 'overlay';
  if (mode === MODE_COUNT) return 'count';
  return 'single';
}

export function choose(n: number, k: number): number {
  const safeK = Math.min(k, n - k);
  let result = 1;
  for (let i = 1; i <= safeK; i += 1) {
    result = (result * (n - safeK + i)) / i;
  }
  return Math.round(result);
}

export function buildPathCounts(m: number, n: number): number[][] {
  const counts: number[][] = [];
  for (let i = 0; i <= m; i += 1) {
    const row: number[] = [];
    for (let j = 0; j <= n; j += 1) {
      if (i === 0 && j === 0) row.push(1);
      else {
        const left = i > 0 ? counts[i - 1]![j]! : 0;
        const below = j > 0 ? row[j - 1]! : 0;
        row.push(left + below);
      }
    }
    counts.push(row);
  }
  return counts;
}

export function generateAllPaths(m: number, n: number): string[][] {
  const total = m + n;
  if (choose(total, m) > 5000) return generateSamplePaths(m, n, 900);
  const paths: string[][] = [];

  function walk(i: number, j: number, steps: string[]) {
    if (i === m && j === n) {
      paths.push(steps.slice());
      return;
    }
    if (i < m) {
      steps.push('R');
      walk(i + 1, j, steps);
      steps.pop();
    }
    if (j < n) {
      steps.push('U');
      walk(i, j + 1, steps);
      steps.pop();
    }
  }

  walk(0, 0, []);
  return paths;
}

export function generateSamplePaths(m: number, n: number, count: number): string[][] {
  const rng = mulberry32(m * 1000 + n * 37 + 17);
  const paths: string[][] = [];
  for (let a = 0; a < count; a += 1) {
    const steps: string[] = [];
    let r = m;
    let u = n;
    while (r > 0 || u > 0) {
      if (r === 0) {
        steps.push('U');
        u -= 1;
      } else if (u === 0) {
        steps.push('R');
        r -= 1;
      } else if (rng() < r / (r + u)) {
        steps.push('R');
        r -= 1;
      } else {
        steps.push('U');
        u -= 1;
      }
    }
    paths.push(steps);
  }
  return paths;
}

export function getGridLayout(m: number, n: number): GridLayout {
  const marginX = 120;
  const topY = 130;
  const bottomY = COMBINATORIAL_VIEW.height - 110;
  const gridW = COMBINATORIAL_VIEW.width - marginX * 2;
  const gridH = bottomY - topY;
  const step = Math.min(gridW / m, gridH / n);
  const actualW = step * m;
  const actualH = step * n;
  return {
    originX: COMBINATORIAL_VIEW.width / 2 - actualW / 2,
    originY: topY + actualH,
    step,
  };
}

export function gridToScreen(layout: GridLayout, i: number, j: number): { x: number; y: number } {
  return {
    x: layout.originX + i * layout.step,
    y: layout.originY - j * layout.step,
  };
}

export function pathToPoints(layout: GridLayout, steps: string[]): Array<{ x: number; y: number }> {
  const points: Array<{ x: number; y: number }> = [];
  let i = 0;
  let j = 0;
  points.push(gridToScreen(layout, i, j));
  for (const step of steps) {
    if (step === 'R') i += 1;
    if (step === 'U') j += 1;
    points.push(gridToScreen(layout, i, j));
  }
  return points;
}

export function buildCombinatorialThumbnail(params: ParamValues): ThumbnailSpec {
  const m = Math.max(4, normalizeSize(params.m));
  const n = Math.max(4, normalizeSize(params.n));
  const layout = getGridLayout(m, n);
  const samplePaths: string[][] = [
    Array(m).fill('R').concat(Array(n).fill('U')),
    ['R', 'U', ...Array(Math.max(0, m - 1)).fill('R'), ...Array(Math.max(0, n - 1)).fill('U')],
    [...Array(Math.floor(m / 2)).fill('R'), ...Array(n).fill('U'), ...Array(m - Math.floor(m / 2)).fill('R')],
  ];
  const grid: CurvePoint[] = [];
  for (let i = 0; i <= m; i += 1) {
    const a = gridToScreen(layout, i, 0);
    const b = gridToScreen(layout, i, n);
    grid.push(
      { x: a.x, y: a.y, theta: i, arcLength: i },
      { x: b.x, y: b.y, theta: i + 0.2, arcLength: i + 0.2 },
      { x: Number.NaN, y: Number.NaN, theta: i + 0.3, arcLength: i + 0.3 },
    );
  }
  for (let j = 0; j <= n; j += 1) {
    const a = gridToScreen(layout, 0, j);
    const b = gridToScreen(layout, m, j);
    grid.push(
      { x: a.x, y: a.y, theta: 20 + j, arcLength: 20 + j },
      { x: b.x, y: b.y, theta: 20 + j + 0.2, arcLength: 20 + j + 0.2 },
      { x: Number.NaN, y: Number.NaN, theta: 20 + j + 0.3, arcLength: 20 + j + 0.3 },
    );
  }
  const focus: CurvePoint[] = [];
  const secondary: CurvePoint[] = [];
  for (let idx = 0; idx < samplePaths.length; idx += 1) {
    const points = pathToPoints(layout, samplePaths[idx]!);
    for (const point of points) {
      (idx === 0 ? focus : secondary).push({ x: point.x, y: point.y, theta: idx, arcLength: 0 });
    }
    (idx === 0 ? focus : secondary).push({ x: Number.NaN, y: Number.NaN, theta: idx, arcLength: 0 });
  }
  const start = gridToScreen(layout, 0, 0);
  const end = gridToScreen(layout, m, n);
  const markers: CurvePoint[] = [
    { x: start.x - 8, y: start.y, theta: 90, arcLength: 90 },
    { x: start.x + 8, y: start.y, theta: 91, arcLength: 91 },
    { x: Number.NaN, y: Number.NaN, theta: 92, arcLength: 92 },
    { x: end.x - 8, y: end.y, theta: 93, arcLength: 93 },
    { x: end.x + 8, y: end.y, theta: 94, arcLength: 94 },
  ];

  return {
    coordinateSystem: 'canvas',
    paths: [
      { points: grid, opacity: 0.3, strokeWidth: 0.7 },
      { points: secondary, opacity: 0.48, strokeWidth: 0.78 },
      { points: focus, opacity: 0.9, strokeWidth: 1.05 },
      { points: markers, opacity: 0.86, strokeWidth: 1.2 },
    ],
  };
}

function mulberry32(seed: number): () => number {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}
