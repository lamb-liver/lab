/**
 * 2026 高考數學新課標 I 卷第 11 題：三個單位圓 C₁(−1,0)、C₂(1,0)、C₃(0,√3)，
 * 直線 y = kx + b 截三圓的弦長 s₁、s₂、s₃。sᵢ = 2√(1 − dᵢ²)，dᵢ 是圓心到直線的距離。
 */

export const CENTERS = [
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: Math.sqrt(3) },
] as const;

export const K_RANGE = 4;
export const B_RANGE = 2.5;

export function distance(k: number, b: number, c: { x: number; y: number }): number {
  return Math.abs(k * c.x - c.y + b) / Math.sqrt(1 + k * k);
}

/** 弦長；不相交時回傳 null */
export function chord(k: number, b: number, c: { x: number; y: number }): number | null {
  const d = distance(k, b, c);
  return d < 1 ? 2 * Math.sqrt(1 - d * d) : null;
}

export function chords(k: number, b: number): (number | null)[] {
  return CENTERS.map((c) => chord(k, b, c));
}

export function chordSum(k: number, b: number): number | null {
  const all = chords(k, b);
  return all.every((s) => s !== null) ? (all as number[]).reduce((a, v) => a + v, 0) : null;
}

/** 選項 B：三條弦等長的直線 */
export const EQUAL_LINES = [
  { k: 0, b: Math.sqrt(3) / 2 },
  { k: Math.sqrt(3), b: 0 },
  { k: -Math.sqrt(3), b: 0 },
] as const;

/** 選項 C：b = 0 且弦長和為 3 的直線（t = 1/√(1+k²) = 1/2 或 5/14） */
export const SUM3_LINES = [
  { k: Math.sqrt(3), b: 0 },
  { k: -Math.sqrt(3), b: 0 },
  { k: Math.sqrt(171) / 5, b: 0 },
  { k: -Math.sqrt(171) / 5, b: 0 },
] as const;

/** 選項 D：b = 0 時弦長和的最大值 2√21/3，在 k² = 17/4 取到 */
export const MAX_SUM = (2 * Math.sqrt(21)) / 3;
export const K_AT_MAX = Math.sqrt(17) / 2;

/** b = 0 時以 t = 1/√(1+k²) 表示的弦長和 4t + 2√(1 − 3t²) */
export function sumThroughOrigin(k: number): number | null {
  return chordSum(k, 0);
}
