/**
 * 2023 高考數學新課標 I 卷第 12 題：哪些物體放得進棱長 1 的正方體。
 * 每個物體各有一個卡住它的尺寸：內切球直徑 1、內接正四面體棱長 √2、
 * 體對角線 √3、過六條棱中點的正六邊形截面內切圓直徑 √6/2。
 */

export type Vec3 = readonly [number, number, number];
export type OptionKey = 'A' | 'B' | 'C' | 'D';

export type ContainerOption = {
  key: OptionKey;
  /** 物體的關鍵尺寸 */
  size: number;
  /** 正方體能給的極限 */
  limit: number;
};

export const LIMITS = {
  sphere: 1,
  tetrahedron: Math.SQRT2,
  rod: Math.sqrt(3),
  disk: Math.sqrt(6) / 2,
} as const;

export const OPTIONS: ContainerOption[] = [
  { key: 'A', size: 0.99, limit: LIMITS.sphere },
  { key: 'B', size: 1.4, limit: LIMITS.tetrahedron },
  { key: 'C', size: 1.8, limit: LIMITS.rod },
  { key: 'D', size: 1.2, limit: LIMITS.disk },
];

export function fits(option: ContainerOption): boolean {
  return option.size <= option.limit;
}

export const CUBE_VERTICES: Vec3[] = [
  [0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0],
  [0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1],
];

export const CUBE_EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 0],
  [4, 5], [5, 6], [6, 7], [7, 4],
  [0, 4], [1, 5], [2, 6], [3, 7],
];

/** 四個互不相鄰的頂點，六條棱都是面對角線 */
export const TETRAHEDRON: Vec3[] = [
  [0, 0, 0], [1, 1, 0], [1, 0, 1], [0, 1, 1],
];

/** 平面 x + y + z = 3/2 截出的正六邊形（六條棱的中點） */
export const HEXAGON: Vec3[] = [
  [1, 0.5, 0], [0.5, 1, 0], [0, 1, 0.5], [0, 0.5, 1], [0.5, 0, 1], [1, 0, 0.5],
];

export const CENTER: Vec3 = [0.5, 0.5, 0.5];

export function distance(a: Vec3, b: Vec3): number {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

/** 六邊形平面上一圈點（半徑 r，圓心是正方體中心） */
export function diskPoints(radius: number, n = 64): Vec3[] {
  const u: Vec3 = [1 / Math.SQRT2, -1 / Math.SQRT2, 0];
  const v: Vec3 = [1 / Math.sqrt(6), 1 / Math.sqrt(6), -2 / Math.sqrt(6)];
  return Array.from({ length: n }, (_, i) => {
    const t = (2 * Math.PI * i) / n;
    return [
      CENTER[0] + radius * (Math.cos(t) * u[0] + Math.sin(t) * v[0]),
      CENTER[1] + radius * (Math.cos(t) * u[1] + Math.sin(t) * v[1]),
      CENTER[2] + radius * (Math.cos(t) * u[2] + Math.sin(t) * v[2]),
    ] as Vec3;
  });
}

/** 正交投影：繞 z 軸轉 yaw，再往下看 pitch */
export function project(p: Vec3, yaw: number, pitch: number): { x: number; y: number } {
  const x = p[0] - 0.5;
  const y = p[1] - 0.5;
  const z = p[2] - 0.5;
  const xr = x * Math.cos(yaw) - y * Math.sin(yaw);
  const yr = x * Math.sin(yaw) + y * Math.cos(yaw);
  return { x: xr, y: -(z * Math.cos(pitch) - yr * Math.sin(pitch)) };
}
