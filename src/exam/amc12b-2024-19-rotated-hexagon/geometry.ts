/**
 * 2024 AMC 12B #19：邊長 14 的正三角形繞中心轉 θ，0<θ≤60°。
 * 六個頂點交錯排出的凸六邊形面積是 91√3 時，tan θ = 5√3/11。
 *
 * 六個頂點在外接圓上，相鄰圓心角交替為 θ 與 120°−θ。
 * 面積 = 49 (3 sin θ + √3 cos θ)。在 (0, 60°] 嚴格遞增，
 * 從 49√3 增到 98√3，所以 91√3 只有一解。
 * 平方後的另一個根 t = 4√3 是 tan(120°−θ)，角度超過 60°，捨去。
 * 30° 的面積是 147，60° 的正六邊形是 98√3，都不是 91√3。
 */

export const SIDE = 14;
export const SQRT3 = Math.sqrt(3);
export const TRIANGLE_AREA_FACTOR = 49;
export const TARGET_AREA_FACTOR = 91;
export const HEX_AT_60_FACTOR = 98;

export type Point2 = { x: number; y: number };

export function circumradius(): number {
  return (SIDE * SQRT3) / 3;
}

export function officialTan(): number {
  return (5 * SQRT3) / 11;
}

export function officialTheta(): number {
  return Math.atan(officialTan());
}

/** 從 start 起交錯取兩個三角形的頂點。θ ∈ [0, 2π/3] 時這就是凸包順序。 */
export function hexVertices(theta: number, start = Math.PI / 2): Point2[] {
  const radius = circumradius();
  const step = (2 * Math.PI) / 3;
  const angles = [0, 1, 2].flatMap((k) => [start + k * step, start + k * step + theta]);
  return angles.map((angle) => ({
    x: radius * Math.cos(angle),
    y: radius * Math.sin(angle),
  }));
}

export function triangleVertices(which: 0 | 1, theta: number, start = Math.PI / 2): Point2[] {
  const radius = circumradius();
  const step = (2 * Math.PI) / 3;
  const shift = which === 0 ? 0 : theta;
  return [0, 1, 2].map((k) => {
    const angle = start + shift + k * step;
    return { x: radius * Math.cos(angle), y: radius * Math.sin(angle) };
  });
}

export function shoelace(points: Point2[]): number {
  let sum = 0;
  for (let i = 0; i < points.length; i += 1) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    sum += a.x * b.y - b.x * a.y;
  }
  return Math.abs(sum) / 2;
}

/** 49 (3 sin θ + √3 cos θ) */
export function hullArea(theta: number): number {
  return TRIANGLE_AREA_FACTOR * (3 * Math.sin(theta) + SQRT3 * Math.cos(theta));
}

export function areaOverSqrt3(theta: number): number {
  return hullArea(theta) / SQRT3;
}

/** 11t² − 49√3 t + 60 = 0 的兩根：5√3/11 與 4√3。 */
export function tangentQuadraticRoots(): [number, number] {
  const disc = 49 ** 2 * 3 - 4 * 11 * 60;
  const root = Math.sqrt(disc);
  const larger = (49 * SQRT3 + root) / 22;
  const smaller = (49 * SQRT3 - root) / 22;
  return [smaller, larger];
}
