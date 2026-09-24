import { describe, expect, it } from 'vitest';
import {
  ANSWER_INTERVAL,
  COMPLEMENT_AREA,
  EXACT_PROBABILITY,
  SAMPLE_TARGET,
  SQUEEZE,
  areaRatio,
  choiceFor,
  generateSamples,
  riemannProbability,
  runningEstimate,
} from './geometry';

describe('2024 AMC 12A #20 邊上隨機點的面積機率', () => {
  it('精確值 (1+ln2)/2 ≈ 0.8466，落在選項 (D) (3/4, 7/8]', () => {
    expect(EXACT_PROBABILITY).toBeCloseTo(0.8466, 4);
    expect(choiceFor(EXACT_PROBABILITY)).toBe('D');
    expect(EXACT_PROBABILITY).toBeGreaterThan(ANSWER_INTERVAL.low);
    expect(EXACT_PROBABILITY).toBeLessThanOrEqual(ANSWER_INTERVAL.high);
  });

  it('面積比是 xy：P、Q 都在中點時是 1/4', () => {
    expect(areaRatio(0.5, 0.5)).toBeCloseTo(0.25, 12);
    expect(areaRatio(1, 1)).toBe(1);
  });

  it('數值積分與精確值一致', () => {
    expect(riemannProbability(200_000)).toBeCloseTo(EXACT_PROBABILITY, 6);
  });

  it('不用積分的夾擠：補集面積在 1/8 與 1/4 之間', () => {
    expect(COMPLEMENT_AREA).toBeGreaterThan(SQUEEZE.innerTriangle);
    expect(COMPLEMENT_AREA).toBeLessThan(SQUEEZE.outerSquare);
    expect(1 - SQUEEZE.outerSquare).toBe(ANSWER_INTERVAL.low);
    expect(1 - SQUEEZE.innerTriangle).toBe(ANSWER_INTERVAL.high);
  });

  it('兩萬次模擬收斂到 0.8466 附近', () => {
    const samples = generateSamples(SAMPLE_TARGET, 2024);
    const estimate = runningEstimate(samples, SAMPLE_TARGET);
    expect(Math.abs(estimate - EXACT_PROBABILITY)).toBeLessThan(0.01);
    expect(choiceFor(estimate)).toBe('D');
  });

  it('區間邊界判定', () => {
    expect(choiceFor(0.75)).toBe('C');
    expect(choiceFor(0.875)).toBe('D');
    expect(choiceFor(0.375)).toBe('A');
    expect(choiceFor(0.2)).toBeNull();
  });
});
