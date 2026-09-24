/**
 * 2024 AMC 12A #20：正三角形 ABC 的邊 AB、AC 上各隨機取一點 P、Q，
 * 求 △APQ 面積小於 △ABC 一半的機率落在哪個區間。
 *
 * 令 x=AP/AB、y=AQ/AC（各自在 [0,1] 均勻），兩三角形共用 ∠A，面積比 = xy。
 * 所求 = 單位正方形中 xy<1/2 的面積 = 1/2 + ∫_{1/2}^{1} 1/(2x) dx = (1+ln2)/2 ≈ 0.8466。
 *
 * 不用積分也能選對區間：補集 {xy ≥ 1/2} 落在 [1/2,1]² 裡（面積 < 1/4），
 * 又因雙曲線 y=1/(2x) 下凸，它包含 (1/2,1)、(1,1)、(1,1/2) 三點圍成的三角形（面積 > 1/8，
 * 弦在曲線上方但兩者不重合）。所以機率介於 3/4 與 7/8 之間，是選項 (D)。
 */

export const HALF = 0.5;
export const EXACT_PROBABILITY = (1 + Math.LN2) / 2;
export const ANSWER_INTERVAL = { low: 3 / 4, high: 7 / 8 } as const;
export const SAMPLE_TARGET = 20_000;

/** 官方五個選項的區間（左端點是否包含） */
export const CHOICES = [
  { key: 'A', low: 3 / 8, high: 1 / 2, lowClosed: true, label: '[3/8, 1/2]' },
  { key: 'B', low: 1 / 2, high: 2 / 3, lowClosed: false, label: '(1/2, 2/3]' },
  { key: 'C', low: 2 / 3, high: 3 / 4, lowClosed: false, label: '(2/3, 3/4]' },
  { key: 'D', low: 3 / 4, high: 7 / 8, lowClosed: false, label: '(3/4, 7/8]' },
  { key: 'E', low: 7 / 8, high: 1, lowClosed: false, label: '(7/8, 1]' },
] as const;

export type ChoiceKey = (typeof CHOICES)[number]['key'];

export function choiceFor(value: number): ChoiceKey | null {
  for (const choice of CHOICES) {
    const aboveLow = choice.lowClosed ? value >= choice.low : value > choice.low;
    if (aboveLow && value <= choice.high) return choice.key;
  }
  return null;
}

/** △APQ 與 △ABC 的面積比（共用 ∠A） */
export function areaRatio(x: number, y: number): number {
  return x * y;
}

export function isSmall(x: number, y: number): boolean {
  return areaRatio(x, y) < HALF;
}

/** 補集 {xy ≥ 1/2} 的面積 (1−ln2)/2 */
export const COMPLEMENT_AREA = (1 - Math.LN2) / 2;
/** 不用積分的夾擠：補集面積介於內接三角形 1/8 與外框正方形 1/4 之間 */
export const SQUEEZE = { innerTriangle: 1 / 8, outerSquare: 1 / 4 } as const;

/** 以中點和逼近 ∫ 面積，供測試與畫面交叉核對 */
export function riemannProbability(steps: number): number {
  let sum = 0;
  for (let i = 0; i < steps; i += 1) {
    const x = (i + 0.5) / steps;
    sum += Math.min(1, HALF / x);
  }
  return sum / steps;
}

export type Sample = { x: number; y: number; small: boolean };

export function generateSamples(count: number, seed = 2024): Sample[] {
  const random = mulberry32(seed);
  return Array.from({ length: count }, () => {
    const x = random();
    const y = random();
    return { x, y, small: isSmall(x, y) };
  });
}

export function runningEstimate(samples: readonly Sample[], count: number): number {
  const n = Math.min(samples.length, Math.max(0, Math.floor(count)));
  if (n === 0) return 0;
  let hits = 0;
  for (let i = 0; i < n; i += 1) if (samples[i].small) hits += 1;
  return hits / n;
}

function mulberry32(seed: number): () => number {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}
