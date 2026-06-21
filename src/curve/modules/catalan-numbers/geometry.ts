import { mulberry32 } from '../../prng';
import type { CurvePoint, ParamValues, ThumbnailCircle, ThumbnailSpec } from '../../types';

export const CATALAN_VIEW = {
  width: 900,
  height: 900,
};

export const MODE_PATH = 0;
export const MODE_PAREN = 1;
export const MODE_TRIANGULATION = 2;

const ACCENT_FILL = 'rgb(212, 184, 122)';
const BOUNDARY_STROKE = 'rgba(130, 170, 220, 0.56)';
const GUIDE_STROKE = 'rgba(255, 255, 255, 0.38)';

export type CatalanMode = 'path' | 'paren' | 'triangulation';

export function normalizeN(value: number | undefined): number {
  const rounded = Math.round(value ?? 4);
  return Math.max(1, Math.min(9, rounded));
}

export function modeFromValue(value: number | undefined): CatalanMode {
  const mode = Math.round(value ?? MODE_PATH);
  if (mode === MODE_PAREN) return 'paren';
  if (mode === MODE_TRIANGULATION) return 'triangulation';
  return 'path';
}

export function choose(n: number, k: number): number {
  const safeK = Math.min(k, n - k);
  let result = 1;
  for (let i = 1; i <= safeK; i += 1) result = (result * (n - safeK + i)) / i;
  return Math.round(result);
}

export function buildCatalanNumbers(maxN: number): number[] {
  const arr: number[] = [1];
  for (let n = 0; n < maxN; n += 1) {
    let sum = 0;
    for (let i = 0; i <= n; i += 1) sum += arr[i]! * arr[n - i]!;
    arr[n + 1] = sum;
  }
  return arr;
}

export function generateDyckWords(n: number): string[] {
  const words: string[] = [];
  function walk(open: number, close: number, str: string) {
    if (str.length === 2 * n) {
      words.push(str);
      return;
    }
    if (open < n) walk(open + 1, close, `${str}(`);
    if (close < open) walk(open, close + 1, `${str})`);
  }
  walk(0, 0, '');
  return words;
}

export function matchParentheses(word: string): Array<[number, number]> {
  const stack: number[] = [];
  const pairs: Array<[number, number]> = [];
  for (let i = 0; i < word.length; i += 1) {
    if (word[i] === '(') stack.push(i);
    else {
      const j = stack.pop();
      if (j !== undefined) pairs.push([j, i]);
    }
  }
  return pairs;
}

export function generateTriangulations(vertexCount: number): number[][][] {
  const maxDisplayVertexCount = 8;
  if (vertexCount > maxDisplayVertexCount) return generateSampleTriangulations(vertexCount, 80);

  const memo = new Map<string, number[][][]>();
  function triangulate(i: number, j: number): number[][][] {
    const key = `${i}:${j}`;
    const cached = memo.get(key);
    if (cached) return cached;
    if (j - i < 2) return [[]];
    const result: number[][][] = [];
    for (let k = i + 1; k < j; k += 1) {
      const left = triangulate(i, k);
      const right = triangulate(k, j);
      for (const a of left) for (const b of right) result.push([...a, ...b, [i, k, j]]);
    }
    memo.set(key, result);
    return result;
  }
  return triangulate(0, vertexCount - 1);
}

export function generateSampleTriangulations(vertexCount: number, count: number): number[][][] {
  const samples: number[][][] = [];
  const rng = mulberry32(vertexCount * 17 + 31);
  for (let s = 0; s < count; s += 1) samples.push(randomFanTriangulation(vertexCount, rng));
  return samples;
}

function randomFanTriangulation(vertexCount: number, rng: () => number): number[][] {
  const vertices: number[] = [];
  for (let i = 0; i < vertexCount; i += 1) vertices.push(i);
  const triangles: number[][] = [];

  function split(poly: number[]) {
    if (poly.length < 3) return;
    if (poly.length === 3) {
      triangles.push([poly[0]!, poly[1]!, poly[2]!]);
      return;
    }
    const base = 0;
    const k = Math.floor(rng() * (poly.length - 2)) + 1;
    triangles.push([poly[base]!, poly[k]!, poly[poly.length - 1]!]);
    const left = poly.slice(base, k + 1);
    const right = [poly[base]!, ...poly.slice(k)];
    if (left.length >= 3) split(left);
    if (right.length >= 3) split(right);
  }

  split(vertices);
  return triangles;
}

export function buildCatalanThumbnail(params: ParamValues): ThumbnailSpec {
  const n = Math.max(4, normalizeN(params.n));
  const words = generateDyckWords(n);
  const word = words[0] ?? '';
  const altWords = words.slice(1, 3);
  const size = 430;
  const x0 = CATALAN_VIEW.width / 2 - size / 2;
  const y0 = 180 + size;
  const step = size / (2 * n);
  const grid: CurvePoint[] = [];
  for (let i = 0; i <= 2 * n; i += 1) {
    grid.push(
      { x: x0 + i * step, y: y0, theta: i, arcLength: i },
      { x: x0 + i * step, y: y0 - n * step, theta: i + 0.2, arcLength: i + 0.2 },
      { x: Number.NaN, y: Number.NaN, theta: i + 0.3, arcLength: i + 0.3 },
    );
  }
  for (let j = 0; j <= n; j += 1) {
    grid.push(
      { x: x0, y: y0 - j * step, theta: 30 + j, arcLength: 30 + j },
      { x: x0 + 2 * n * step, y: y0 - j * step, theta: 30 + j + 0.2, arcLength: 30 + j + 0.2 },
      { x: Number.NaN, y: Number.NaN, theta: 30 + j + 0.3, arcLength: 30 + j + 0.3 },
    );
  }
  const boundary: CurvePoint[] = [
    { x: x0, y: y0, theta: 80, arcLength: 80 },
    { x: x0 + 2 * n * step, y: y0 - n * step, theta: 81, arcLength: 81 },
  ];
  const points: CurvePoint[] = [];
  const secondary: CurvePoint[] = [];

  let x = 0;
  let y = 0;
  points.push({ x: x0, y: y0, theta: 0, arcLength: 0 });
  for (let i = 0; i < word.length; i += 1) {
    if (word[i] === '(') y += 1;
    else x += 1;
    points.push({ x: x0 + x * step, y: y0 - y * step, theta: i + 1, arcLength: i + 1 });
  }
  for (let w = 0; w < altWords.length; w += 1) {
    let sx = 0;
    let sy = 0;
    secondary.push({ x: x0, y: y0, theta: 100 + w * 20, arcLength: 100 + w * 20 });
    for (let i = 0; i < altWords[w]!.length; i += 1) {
      if (altWords[w]![i] === '(') sy += 1;
      else sx += 1;
      secondary.push({
        x: x0 + sx * step,
        y: y0 - sy * step,
        theta: 100 + w * 20 + i + 1,
        arcLength: 100 + w * 20 + i + 1,
      });
    }
    secondary.push({
      x: Number.NaN,
      y: Number.NaN,
      theta: 100 + w * 20 + 18,
      arcLength: 100 + w * 20 + 18,
    });
  }
  const circles: ThumbnailCircle[] = [
    {
      x: x0,
      y: y0,
      r: 9,
      fill: '#0a0a0a',
      stroke: GUIDE_STROKE,
      strokeWidth: 1,
      opacity: 0.9,
    },
    {
      x: x0 + 2 * n * step,
      y: y0 - n * step,
      r: 11,
      fill: ACCENT_FILL,
      stroke: ACCENT_FILL,
      strokeWidth: 0.8,
      opacity: 0.94,
    },
  ];

  return {
    coordinateSystem: 'canvas',
    paths: [
      { points: grid, opacity: 0.28, strokeWidth: 0.68 },
      { points: boundary, stroke: BOUNDARY_STROKE, opacity: 0.9, strokeWidth: 0.82 },
      { points: secondary, opacity: 0.38, strokeWidth: 0.76 },
      { points, opacity: 0.94, strokeWidth: 1.15 },
    ],
    circles,
  };
}
