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

/**
 * 題目給 PQ = Q − P，所以 P = Q − PQ，對頂點 P' = Q + PQ。
 * 四組 (mode, sign) 只是 2PQ = ±(αu₀ ± βv₀) 的符號讀法：
 * 從 P 出發的兩條邊是 sign·u 與 sign·(±v)，加起來恆為 2PQ，
 * 所以四組解畫出的是同一個平行四邊形（面積都是 204）。
 */
export function vertexP(q: Point2): Point2 {
  return sub2(q, PQ);
}

export function edgesFromP(scales: SideScales, sign: 1 | -1): { e1: Vec2; e2: Vec2 } {
  const { u, v } = sideVectors(scales);
  const e1 = scale2(u, sign);
  const e2 = scale2(scales.mode === 'sum' ? v : scale2(v, -1), sign);
  return { e1, e2 };
}

/** 頂點依序：P、P+e1、P'（=Q+PQ）、P+e2。 */
export function verticesFromCenter(q: Point2, scales: SideScales, sign: 1 | -1): Point2[] {
  const p = vertexP(q);
  const { e1, e2 } = edgesFromP(scales, sign);
  return [p, add2(p, e1), add2(q, PQ), add2(p, e2)];
}

/** 從 P 畫出的帶號邊向量 u=αu₀、v=βv₀ 的箭頭尖端。 */
export function arrowTips(q: Point2, scales: SideScales): { uTip: Point2; vTip: Point2 } {
  const p = vertexP(q);
  const { u, v } = sideVectors(scales);
  return { uTip: add2(p, u), vTip: add2(p, v) };
}

function keyFromSigns(alphaSign: 1 | -1, betaSign: 1 | -1): SolutionKey {
  for (const key of ALL_SOLUTIONS) {
    const s = solveSideScales(key.mode, key.sign);
    if (Math.sign(s.alpha) === alphaSign && Math.sign(s.beta) === betaSign) return key;
  }
  return ALL_SOLUTIONS[0];
}

/**
 * 拖曳 snap：找最近的箭頭尖端候選（±αu₀、±βv₀ 四個點），
 * 只翻轉被拖的那個係數的正負號，另一個沿用目前的解。
 */
export function nearestSolution(
  point: Point2,
  current: SolutionKey = ALL_SOLUTIONS[0],
  q: Point2 = { x: 0, y: 0 },
): SolutionKey {
  const base = solveSideScales('sum', 1);
  const p = vertexP(q);
  const a = Math.abs(base.alpha);
  const b = Math.abs(base.beta);
  const cur = solveSideScales(current.mode, current.sign);
  const curA = (Math.sign(cur.alpha) || 1) as 1 | -1;
  const curB = (Math.sign(cur.beta) || 1) as 1 | -1;
  const candidates: Array<{ pt: Point2; which: 'alpha' | 'beta'; s: 1 | -1 }> = [
    { pt: add2(p, scale2(DIR_PARALLEL, a)), which: 'alpha', s: 1 },
    { pt: add2(p, scale2(DIR_PARALLEL, -a)), which: 'alpha', s: -1 },
    { pt: add2(p, scale2(DIR_PERP, b)), which: 'beta', s: 1 },
    { pt: add2(p, scale2(DIR_PERP, -b)), which: 'beta', s: -1 },
  ];
  let best = candidates[0];
  let bestDist = Number.POSITIVE_INFINITY;
  for (const c of candidates) {
    const d = (c.pt.x - point.x) ** 2 + (c.pt.y - point.y) ** 2;
    if (d < bestDist) {
      bestDist = d;
      best = c;
    }
  }
  return best.which === 'alpha' ? keyFromSigns(best.s, curB) : keyFromSigns(curA, best.s);
}

/** 其他符號組合的箭頭尖端（畫成可拖的淡色把手）。 */
export function ghostTips(q: Point2, scales: SideScales): Point2[] {
  const p = vertexP(q);
  const { u, v } = sideVectors(scales);
  return [sub2(p, u), sub2(p, v)];
}

export const OFFICIAL_AREA = 204;
export const UNIT_CROSS = Math.abs(cross2(DIR_PARALLEL, DIR_PERP)); // 17
