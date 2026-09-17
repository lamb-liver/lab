export type Point2 = { x: number; y: number };
export type Vec2 = { x: number; y: number };

/** 與 5x − y = 0 平行的邊方向 */
export const DIR_PARALLEL: Vec2 = { x: 1, y: 5 };
/** 與 3x − 2y = 0 垂直的邊方向（斜率 −2/3） */
export const DIR_PERP: Vec2 = { x: 3, y: -2 };

export const PQ: Vec2 = { x: 10, y: -1 };

export function cross2(u: Vec2, v: Vec2): number {
  return u.x * v.y - u.y * v.x;
}

export function scale2(v: Vec2, s: number): Vec2 {
  return { x: v.x * s, y: v.y * s };
}

export function add2(u: Vec2, v: Vec2): Vec2 {
  return { x: u.x + v.x, y: u.y + v.y };
}

export function sub2(u: Vec2, v: Vec2): Vec2 {
  return { x: u.x - v.x, y: u.y - v.y };
}

export type SideScales = { alpha: number; beta: number; mode: 'sum' | 'diff' };

export type SolutionKey = { mode: SideScales['mode']; sign: 1 | -1 };

/** 四組離散解（mode × sign）；連續拖曳無法同時維持全部約束。 */
export const ALL_SOLUTIONS: readonly SolutionKey[] = [
  { mode: 'sum', sign: 1 },
  { mode: 'sum', sign: -1 },
  { mode: 'diff', sign: 1 },
  { mode: 'diff', sign: -1 },
] as const;

/**
 * 2·PQ = ±(α DIR_PARALLEL ± β DIR_PERP).
 * 四組解的 |αβ| 皆為 12，面積 = |αβ|·|DIR_PARALLEL × DIR_PERP| = 204。
 */
export function solveSideScales(mode: 'sum' | 'diff', sign: 1 | -1 = 1): SideScales {
  const target = scale2(PQ, 2 * sign);
  if (mode === 'sum') {
    // α + 3β = tx ; 5α − 2β = ty
    const { x: tx, y: ty } = target;
    const beta = (5 * tx - ty) / 17;
    const alpha = tx - 3 * beta;
    return { alpha, beta, mode };
  }
  // α − 3β = tx ; 5α + 2β = ty
  const { x: tx, y: ty } = target;
  const beta = (ty - 5 * tx) / 17;
  const alpha = tx + 3 * beta;
  return { alpha, beta, mode };
}

export function sideVectors(scales: SideScales): { u: Vec2; v: Vec2 } {
  return {
    u: scale2(DIR_PARALLEL, scales.alpha),
    v: scale2(DIR_PERP, scales.beta),
  };
}

export function parallelogramArea(scales: SideScales): number {
  const { u, v } = sideVectors(scales);
  return Math.abs(cross2(u, v));
}

export function verticesFromCenter(q: Point2, scales: SideScales): Point2[] {
  const { u, v } = sideVectors(scales);
  const halfDiag =
    scales.mode === 'sum' ? scale2(add2(u, v), 0.5) : scale2(sub2(u, v), 0.5);
  const p = add2(q, halfDiag);
  // Adjacent vertices from P: P−u and P−v; opposite: Q − (P−Q)
  const a = sub2(p, u);
  const b = sub2(p, v);
  const opposite = sub2(q, halfDiag);
  return [p, a, opposite, b];
}

/** 與 P 相鄰的兩頂點（可拖來切換四組解）。 */
export function adjacentVertices(q: Point2, scales: SideScales): Point2[] {
  const verts = verticesFromCenter(q, scales);
  return [verts[1], verts[3]];
}

/**
 * Snap 目標：P 與兩相鄰頂點。含 P 才能區分同形的 PQ 同向／反向。
 */
export function solutionSnapTargets(q: Point2, scales: SideScales): Point2[] {
  const verts = verticesFromCenter(q, scales);
  return [verts[0], verts[1], verts[3]];
}

/**
 * 依世界座標點，選出 snap 目標最近的一組 (mode, sign) 解。
 * PQ 固定 + 方向鎖死後只有四組解，故拖曳只能 snap，不能連續變形。
 */
export function nearestSolution(point: Point2, q: Point2 = { x: 0, y: 0 }): SolutionKey {
  let best: SolutionKey = ALL_SOLUTIONS[0];
  let bestDist = Number.POSITIVE_INFINITY;
  for (const key of ALL_SOLUTIONS) {
    const scales = solveSideScales(key.mode, key.sign);
    for (const vertex of solutionSnapTargets(q, scales)) {
      const dx = vertex.x - point.x;
      const dy = vertex.y - point.y;
      const dist = dx * dx + dy * dy;
      if (dist < bestDist) {
        bestDist = dist;
        best = key;
      }
    }
  }
  return best;
}

export const OFFICIAL_AREA = 204;
export const UNIT_CROSS = Math.abs(cross2(DIR_PARALLEL, DIR_PERP)); // 17
