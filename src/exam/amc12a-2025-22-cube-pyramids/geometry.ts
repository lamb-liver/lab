/**
 * 2025 AMC 12A #22：三個數獨立、均勻取自 [0,1]。
 * 最大的那個大於另外兩個的兩倍。機率是 1/4。
 *
 * 把 (x,y,z) 放進單位正立方體。x 嚴格最大且 x>2y、x>2z 的區域是
 * 底在 x=1 上、邊長 1/2 的正方形、高為 1 的錐體，體積 (1/3)·(1/4)·1 = 1/12。
 * 錐尖在原點，高的垂足落在底面的一角，不是正四角錐；體積公式仍然適用。
 * y、z 各有一塊同樣的錐體。三塊只在體積為 0 的面上相遇，合起來 1/4。
 */

export const ONE_PYRAMID_VOLUME = 1 / 12;
export const TOTAL_PROBABILITY = 1 / 4;

export type Axis = 'x' | 'y' | 'z';
export type Vec3 = readonly [number, number, number];

export const APEX: Vec3 = [0, 0, 0];

export const SAMPLE_INSIDE_X: Vec3 = [0.8, 0.2, 0.2];
export const SAMPLE_INSIDE_Y: Vec3 = [0.2, 0.8, 0.15];
export const SAMPLE_INSIDE_Z: Vec3 = [0.15, 0.2, 0.85];
export const SAMPLE_OUTSIDE: Vec3 = [0.55, 0.4, 0.4];

export function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

/** 嚴格落在哪一塊。邊界（最大的正好等於第二大的兩倍）回 null。 */
export function pyramidOf(x: number, y: number, z: number): Axis | null {
  if (x > y && x > z && y < x / 2 && z < x / 2) return 'x';
  if (y > x && y > z && x < y / 2 && z < y / 2) return 'y';
  if (z > x && z > y && x < z / 2 && y < z / 2) return 'z';
  return null;
}

export function holds(x: number, y: number, z: number): boolean {
  return pyramidOf(x, y, z) !== null;
}

/** 底面四角。軸對應的座標是 1，另外兩個在 [0, 1/2]。 */
export function baseCorners(axis: Axis): Vec3[] {
  const s = 1 / 2;
  if (axis === 'x') return [[1, 0, 0], [1, s, 0], [1, s, s], [1, 0, s]];
  if (axis === 'y') return [[0, 1, 0], [s, 1, 0], [s, 1, s], [0, 1, s]];
  return [[0, 0, 1], [s, 0, 1], [s, s, 1], [0, s, 1]];
}

/** (1/3) × 底面積 1/4 × 高 1 */
export function pyramidVolume(): number {
  return (1 / 3) * (1 / 4) * 1;
}
