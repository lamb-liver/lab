/**
 * 2024 高考數學新課標 I 卷第 4 題。
 * cos(α+β)=m，tan α tan β=2，求 cos(α−β)。
 * 記 P=cos α cos β、Q=sin α sin β。乘積 k 使 Q=kP，
 * 所以 cos(α−β)=((1+k)/(1−k)) cos(α+β)。k=2 時這個倍數是 −3。
 * 圖上把 α 固定成 π/4，只為了用一條滑桿畫出 β；答案仍是 −3m。
 */

export const PRODUCT_MIN = 0.4;
export const PRODUCT_MAX = 4;
export const DEFAULT_PRODUCT = 2;
export const ALPHA = Math.PI / 4;

export type SumDifferenceReading = {
  product: number;
  alpha: number;
  beta: number;
  sumCos: number;
  diffCos: number;
  /** k=1 時和的餘弦為 0，倍數沒有定義。 */
  factor: number | null;
  atGiven: boolean;
  sumVanishes: boolean;
};

function clampProduct(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_PRODUCT;
  return Math.min(PRODUCT_MAX, Math.max(PRODUCT_MIN, value));
}

export function readSumDifference(product: number): SumDifferenceReading {
  const k = clampProduct(product);
  const alpha = ALPHA;
  const beta = Math.atan(k);
  const sumCos = Math.cos(alpha + beta);
  const diffCos = Math.cos(alpha - beta);
  const factor = Math.abs(1 - k) < 1e-9 ? null : (1 + k) / (1 - k);
  return {
    product: k,
    alpha,
    beta,
    sumCos,
    diffCos,
    factor,
    atGiven: Math.abs(k - 2) < 0.005,
    sumVanishes: Math.abs(k - 1) < 0.03,
  };
}
