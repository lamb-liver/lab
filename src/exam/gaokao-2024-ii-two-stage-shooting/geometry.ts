/**
 * 2024 高考數學新課標 II 卷第 18 題。
 * 先投的人三球都沒進就出局。過關後另一人投三球，每進一球 5 分，得分只算後一輪。
 * 只要 0<p<q，甲打資格賽時，得分 15 的機率與期望得分都比較大。
 * 圖上把甲固定在第一小題的 p=0.4，只讓乙的 q 變動。
 */

export const N_MIN = 45;
export const N_MAX = 95;
export const DEFAULT_N = 50;
export const FIXED_P = 2 / 5;

export type StageReading = {
  n: number;
  p: number;
  q: number;
  /** 百分位標籤，例如 50 → "0.50"。 */
  rateText: string;
  /** 甲打資格賽時，得分是 15 的機率。 */
  chanceGold: number;
  /** 乙打資格賽時，得分是 15 的機率。 */
  chanceWhite: number;
  /** 甲打資格賽時的期望得分。 */
  scoreGold: number;
  /** 乙打資格賽時的期望得分。 */
  scoreWhite: number;
  /** 甲打資格賽時，得分不少於 5 的機率。 */
  atLeastFive: number;
  atGiven: boolean;
};

function clampN(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_N;
  return Math.min(N_MAX, Math.max(N_MIN, Math.round(value)));
}

/** 三球至少進一球。 */
function qualify(rate: number): number {
  const miss = 1 - rate;
  return 1 - miss * miss * miss;
}

export function pairedLabels(
  gold: number,
  white: number,
  digits: number,
): { gold: string; white: string } {
  let places = digits;
  while (places < 6 && gold.toFixed(places) === white.toFixed(places)) places += 1;
  return { gold: gold.toFixed(places), white: white.toFixed(places) };
}

export function readStage(n: number): StageReading {
  const value = clampN(n);
  const p = FIXED_P;
  const q = value / 100;
  const qualifyP = qualify(p);
  const qualifyQ = qualify(q);
  return {
    n: value,
    p,
    q,
    rateText: `0.${String(value).padStart(2, '0')}`,
    chanceGold: qualifyP * q * q * q,
    chanceWhite: qualifyQ * p * p * p,
    scoreGold: 15 * q * qualifyP,
    scoreWhite: 15 * p * qualifyQ,
    atLeastFive: qualifyP * qualifyQ,
    atGiven: value === DEFAULT_N,
  };
}
