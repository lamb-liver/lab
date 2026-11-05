/**
 * 2025 高考數學新課標 I 卷第 8 題：2 + log₂x = 3 + log₃y = 5 + log₅z = k。
 * x = 2^(k−2)、y = 3^(k−3)、z = 5^(k−5)。取對數後 ln x、ln y、ln z 是 k 的三條直線，
 * 兩兩交點把 k 軸切成四段，每段的大小順序固定。
 */

export type Name = 'x' | 'y' | 'z';

export const BASES: Record<Name, { base: number; offset: number }> = {
  x: { base: 2, offset: 2 },
  y: { base: 3, offset: 3 },
  z: { base: 5, offset: 5 },
};

export const K_MIN = 1;
export const K_MAX = 11;
export const DEFAULT_K = 3;

/** ln(值) = (k − offset)·ln(base) */
export function logValue(name: Name, k: number): number {
  const { base, offset } = BASES[name];
  return (k - offset) * Math.log(base);
}

export function value(name: Name, k: number): number {
  return Math.exp(logValue(name, k));
}

/** 兩條直線的交點 k：(k−p)ln a = (k−q)ln b */
function crossing(a: Name, b: Name): number {
  const A = BASES[a];
  const B = BASES[b];
  const la = Math.log(A.base);
  const lb = Math.log(B.base);
  return (A.offset * la - B.offset * lb) / (la - lb);
}

export const CROSSINGS = {
  xy: crossing('x', 'y'),
  xz: crossing('x', 'z'),
  yz: crossing('y', 'z'),
} as const;

/** 由大到小排列 */
export function orderAt(k: number): Name[] {
  return (['x', 'y', 'z'] as Name[]).sort((a, b) => logValue(b, k) - logValue(a, k));
}

export function orderLabel(order: Name[]): string {
  return order.join(' > ');
}

export const OPTIONS: { key: 'A' | 'B' | 'C' | 'D'; order: Name[] }[] = [
  { key: 'A', order: ['x', 'y', 'z'] },
  { key: 'B', order: ['x', 'z', 'y'] },
  { key: 'C', order: ['y', 'x', 'z'] },
  { key: 'D', order: ['y', 'z', 'x'] },
];

/** k 軸上依序出現的四段 */
export function segments(): { from: number; to: number; order: Name[] }[] {
  const cuts = [CROSSINGS.xy, CROSSINGS.xz, CROSSINGS.yz].sort((a, b) => a - b);
  const edges = [-Infinity, ...cuts, Infinity];
  return edges.slice(0, -1).map((from, i) => {
    const to = edges[i + 1];
    const mid = Number.isFinite(from) && Number.isFinite(to) ? (from + to) / 2 : Number.isFinite(to) ? to - 1 : from + 1;
    return { from, to, order: orderAt(mid) };
  });
}

export function clampK(k: number): number {
  if (!Number.isFinite(k)) return DEFAULT_K;
  return Math.min(K_MAX, Math.max(K_MIN, k));
}
