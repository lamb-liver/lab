import { describe, expect, it } from 'vitest';
import {
  buildModel,
  createDefaultDiscreteState,
  getStats,
  setProbabilityAt,
  syncTailThreshold,
} from './geometry';

describe('discrete random variables geometry', () => {
  it('keeps edited probabilities normalized', () => {
    const state = createDefaultDiscreteState();
    const next = setProbabilityAt(state.positionPmf, 4, 0.8);

    expect(next[4]).toBeCloseTo(0.8);
    expect(next.reduce((sum, p) => sum + p, 0)).toBeCloseTo(1);
  });

  it('clamps geometric tail threshold to the visible rows', () => {
    const state = createDefaultDiscreteState();
    state.mode = 'tail';
    state.tailModel = 'geometric';
    state.p = 0.9;
    state.k = 36;

    const model = buildModel(state);
    const maxK = model.rows[model.rows.length - 1].x;
    const stats = getStats(state, model.rows);

    expect(maxK).toBe(16);
    expect(stats.threshold).toBe(maxK);
    expect(stats.tailProb).toBeCloseTo((1 - 0.9) ** (maxK - 1));
  });

  it('syncs binomial and geometric parameter bounds', () => {
    const state = createDefaultDiscreteState();
    state.mode = 'tail';
    state.tailModel = 'binomial';
    state.n = 30;
    state.p = 1;
    state.k = 30;
    syncTailThreshold(state);

    expect(state.n).toBe(20);
    expect(state.p).toBe(0.95);
    expect(state.k).toBe(20);

    state.tailModel = 'geometric';
    state.p = 1;
    state.k = 100;
    syncTailThreshold(state);

    expect(state.p).toBe(0.9);
    expect(state.k).toBe(16);
  });
});
