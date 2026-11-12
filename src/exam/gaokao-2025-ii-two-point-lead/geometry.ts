/**
 * 2025 高考數學新課標 II 卷第 19 題。
 * 打完 k 球後，甲至少領先兩分的機率是 p_k，乙至少領先兩分是 q_k。
 * (p_4 − p_3) / (q_4 − q_3) = (p/q)^2。這個比是 4 時 p = 2/3。
 * 領先差 d_k = p_k − q_k 在奇數次下降，下一個偶數次再升高。
 */

export const DENOM = 150;
export const N_MIN = 78;
export const N_MAX = 135;
export const DEFAULT_N = 100;
export const LEAD_FROM = 2;
export const LEAD_TO = 8;

export type LeadStep = {
  k: number;
  ahead: number;
  behind: number;
  difference: number;
};

export type LeadReading = {
  n: number;
  p: number;
  q: number;
  /** p_4 − p_3。 */
  goldGap: number;
  /** q_4 − q_3。 */
  whiteGap: number;
  /** goldGap / whiteGap，等於 (p/q)^2。 */
  gapRatio: number;
  steps: LeadStep[];
  atAnswer: boolean;
};

function clampN(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_N;
  return Math.min(N_MAX, Math.max(N_MIN, Math.round(value)));
}

function ways(k: number, wins: number): number {
  let count = 1;
  for (let i = 0; i < wins; i += 1) count = (count * (k - i)) / (i + 1);
  return count;
}

function leadAt(k: number, p: number): { ahead: number; behind: number } {
  const q = 1 - p;
  const aheadFrom = Math.ceil((k + 2) / 2);
  const behindTo = Math.floor((k - 2) / 2);
  let ahead = 0;
  let behind = 0;
  for (let wins = 0; wins <= k; wins += 1) {
    const piece = ways(k, wins) * p ** wins * q ** (k - wins);
    if (wins >= aheadFrom) ahead += piece;
    if (wins <= behindTo) behind += piece;
  }
  return { ahead, behind };
}

export function readLead(n: number): LeadReading {
  const value = clampN(n);
  const p = value / DENOM;
  const q = 1 - p;
  const three = leadAt(3, p);
  const four = leadAt(4, p);
  const goldGap = four.ahead - three.ahead;
  const whiteGap = four.behind - three.behind;
  const steps: LeadStep[] = [];
  for (let k = LEAD_FROM; k <= LEAD_TO; k += 1) {
    const row = leadAt(k, p);
    steps.push({
      k,
      ahead: row.ahead,
      behind: row.behind,
      difference: row.ahead - row.behind,
    });
  }
  return {
    n: value,
    p,
    q,
    goldGap,
    whiteGap,
    gapRatio: goldGap / whiteGap,
    steps,
    atAnswer: value === DEFAULT_N,
  };
}
