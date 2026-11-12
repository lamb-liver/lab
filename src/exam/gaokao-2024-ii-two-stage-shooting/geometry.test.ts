import { describe, expect, it } from 'vitest';
import { DEFAULT_N, FIXED_P, N_MAX, N_MIN, pairedLabels, readStage } from './geometry';

function qualify(rate: number): number {
  const miss = 1 - rate;
  return 1 - miss * miss * miss;
}

describe('readStage', () => {
  it('matches the given pair p = 2/5, q = 1/2', () => {
    const reading = readStage(DEFAULT_N);
    expect(reading.atGiven).toBe(true);
    expect(reading.p).toBeCloseTo(FIXED_P, 12);
    expect(reading.q).toBeCloseTo(1 / 2, 12);
    expect(reading.rateText).toBe('0.50');
    expect(reading.chanceGold).toBeCloseTo(98 / 1000, 12);
    expect(reading.chanceWhite).toBeCloseTo(7 / 125, 12);
    expect(reading.scoreGold).toBeCloseTo(147 / 25, 12);
    expect(reading.scoreWhite).toBeCloseTo(21 / 4, 12);
    expect(reading.atLeastFive).toBeCloseTo(343 / 500, 12);
    expect(pairedLabels(reading.chanceGold, reading.chanceWhite, 3)).toEqual({
      gold: '0.098',
      white: '0.056',
    });
    expect(pairedLabels(reading.scoreGold, reading.scoreWhite, 2)).toEqual({
      gold: '5.88',
      white: '5.25',
    });
    expect(reading.atLeastFive.toFixed(3)).toBe('0.686');
  });

  it('keeps both comparisons strict, with distinct labels, at every stop', () => {
    const seen = new Set<string>();
    for (let n = N_MIN; n <= N_MAX; n += 1) {
      const reading = readStage(n);
      const q = n / 100;
      const qualifyP = qualify(FIXED_P);
      const qualifyQ = qualify(q);
      const odds = (rate: number) => 3 / rate ** 2 - 3 / rate + 1;
      expect(reading.rateText).toBe(`0.${String(n).padStart(2, '0')}`);
      expect(seen.has(reading.rateText)).toBe(false);
      seen.add(reading.rateText);
      expect(reading.chanceGold).toBeCloseTo(qualifyP * q ** 3, 12);
      expect(reading.chanceWhite).toBeCloseTo(qualifyQ * FIXED_P ** 3, 12);
      expect(reading.scoreGold).toBeCloseTo(15 * q * qualifyP, 12);
      expect(reading.scoreWhite).toBeCloseTo(15 * FIXED_P * qualifyQ, 12);
      expect(reading.scoreGold - reading.scoreWhite).toBeCloseTo(
        15 * FIXED_P * q * (q - FIXED_P) * (3 - FIXED_P - q),
        10,
      );
      expect(reading.chanceGold / reading.chanceWhite).toBeCloseTo(odds(FIXED_P) / odds(q), 8);
      expect(reading.chanceGold).toBeGreaterThan(reading.chanceWhite);
      expect(reading.scoreGold).toBeGreaterThan(reading.scoreWhite);
      const chance = pairedLabels(reading.chanceGold, reading.chanceWhite, 3);
      const score = pairedLabels(reading.scoreGold, reading.scoreWhite, 2);
      expect(Number(chance.gold)).toBeGreaterThan(Number(chance.white));
      expect(Number(score.gold)).toBeGreaterThan(Number(score.white));
      expect(reading.atGiven).toBe(n === DEFAULT_N);
    }
    expect(seen.size).toBe(N_MAX - N_MIN + 1);
  });

  it('clamps non-finite and out-of-range stops', () => {
    expect(readStage(Number.NaN).n).toBe(DEFAULT_N);
    expect(readStage(Number.POSITIVE_INFINITY).atGiven).toBe(true);
    expect(readStage(1).n).toBe(N_MIN);
    expect(readStage(200).n).toBe(N_MAX);
  });
});
