/**
 * 2025 高考數學新課標 I 卷第 14 題：1～5 號球有放回取 3 次，X 是至少被取到一次的球數。
 * 每顆球被取到的機率 1 − (4/5)³ = 61/125，期望值的線性給出 E(X) = 5 · 61/125 = 61/25。
 */

export const BALLS = 5;
export const DRAWS = 3;

export const HIT_PROBABILITY = 1 - ((BALLS - 1) / BALLS) ** DRAWS; // 61/125
export const EXPECTATION = BALLS * HIT_PROBABILITY; // 61/25

/** X 的分佈（分子，分母 125） */
export const DISTRIBUTION: Record<1 | 2 | 3, number> = { 1: 5, 2: 60, 3: 60 };
export const TOTAL_OUTCOMES = BALLS ** DRAWS;

export function distinctCount(draws: readonly number[]): number {
  return new Set(draws).size;
}

/** 可重現的亂數（mulberry32），讓測試與重播穩定 */
export function makeRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 一輪：取 3 次，回傳球號 1..5 */
export function drawRound(rng: () => number): number[] {
  return Array.from({ length: DRAWS }, () => 1 + Math.floor(rng() * BALLS));
}

export type Tally = {
  rounds: number;
  /** 每顆球在幾輪裡至少出現一次 */
  hits: number[];
  /** X 的總和 */
  sumX: number;
  last: number[];
};

export const EMPTY_TALLY: Tally = { rounds: 0, hits: Array(BALLS).fill(0), sumX: 0, last: [] };

export function addRound(tally: Tally, round: readonly number[]): Tally {
  const seen = new Set(round);
  return {
    rounds: tally.rounds + 1,
    hits: tally.hits.map((h, i) => h + (seen.has(i + 1) ? 1 : 0)),
    sumX: tally.sumX + seen.size,
    last: [...round],
  };
}

export function runRounds(tally: Tally, rng: () => number, n: number): Tally {
  let next = tally;
  for (let i = 0; i < n; i += 1) next = addRound(next, drawRound(rng));
  return next;
}

export function averageX(tally: Tally): number | null {
  return tally.rounds === 0 ? null : tally.sumX / tally.rounds;
}
