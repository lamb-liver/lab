import { describe, expect, it } from 'vitest';
import { deriveLogarithmicState } from './geometry';
import { logarithmicScaleModule } from './index';

describe('deriveLogarithmicState', () => {
  it('shows only exponential curve by default', () => {
    const data = deriveLogarithmicState({
      p: 2.4,
      m: 3,
      compareMode: 0,
      showExp: 1,
      showPower: 0,
      showLinear: 0,
    });
    expect(data.curves).toHaveLength(1);
    expect(data.curves[0]!.id).toBe('exp');
  });

  it('includes linear curve when compare mode is on', () => {
    const data = deriveLogarithmicState({
      p: 2.4,
      m: 3,
      compareMode: 1,
      showExp: 1,
      showPower: 0,
      showLinear: 1,
    });
    expect(data.curves.map((c) => c.id)).toEqual(['exp', 'linear']);
    expect(data.curves[1]!.fn(1)).toBe(1 + 250 * 3 * 1);
  });

  it('plots y = 10^x and reads out log₁₀ y = x (no slope a)', () => {
    const data = deriveLogarithmicState({ compareMode: 0, showExp: 1 });
    const exp = data.curves[0]!;
    expect(exp.fn(0)).toBe(1);
    expect(exp.fn(2)).toBeCloseTo(100, 10);
    expect(exp.fn(data.xMax)).toBeCloseTo(data.yMax, 6);
    expect(logarithmicScaleModule.paramSchema.map((f) => f.key)).toEqual(['p', 'm']);
    const meta = logarithmicScaleModule.getMetadata(logarithmicScaleModule.defaultParams);
    expect(meta.formula).toBe('y = 10^x · log₁₀ y = x');
    expect(meta.stats.find((s) => s.key === 'formula')?.value).toBe('log₁₀ y = x');
    expect(meta.stats.some((s) => s.key === 'a')).toBe(false);
  });
});
