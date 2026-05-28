import type { CurvePoint, ParamValues, ThumbnailSpec } from '../../types';

export const CATALAN_VIEW = {
  width: 900,
  height: 900,
};

export const MODE_PATH = 0;
export const MODE_PAREN = 1;
export const MODE_TRIANGULATION = 2;

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
  const n = normalizeN(params.n);
  const words = generateDyckWords(n);
  const word = words[0] ?? '';
  const size = 430;
  const x0 = CATALAN_VIEW.width / 2 - size / 2;
  const y0 = 180 + size;
  const step = size / n;
  const points: CurvePoint[] = [];

  let x = 0;
  let y = 0;
  points.push({ x: x0, y: y0, theta: 0, arcLength: 0 });
  for (let i = 0; i < word.length; i += 1) {
    if (word[i] === '(') y += 1;
    else x += 1;
    points.push({ x: x0 + x * step, y: y0 - y * step, theta: i + 1, arcLength: i + 1 });
  }

  return { paths: [{ points, opacity: 0.82, strokeWidth: 0.8 }] };
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
