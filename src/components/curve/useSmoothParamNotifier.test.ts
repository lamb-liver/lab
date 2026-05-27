import { describe, expect, it } from 'vitest';
import { quantizeSmoothParam } from './useSmoothParamNotifier';

describe('useSmoothParamNotifier', () => {
  it('quantizes phase-like keys in units of π', () => {
    expect(quantizeSmoothParam('phase', Math.PI * 0.512)).toBe('0.51');
    expect(quantizeSmoothParam('delta', Math.PI * 0.512)).toBe('0.51');
    expect(quantizeSmoothParam('theta1', Math.PI)).toBe('1.00');
  });

  it('quantizes generic numeric params to two decimals', () => {
    expect(quantizeSmoothParam('ampA', 1.234)).toBe('1.23');
    expect(quantizeSmoothParam('k', 6)).toBe('6');
  });
});
