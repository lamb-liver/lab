import { describe, expect, it } from 'vitest';
import { deriveLogarithmicState } from './geometry';
import { logarithmicScaleModule } from './index';

describe('deriveLogarithmicState', () => {
  it('shows only exponential curve by default', () => {
    const data = deriveLogarithmicState({
      a: 0.65,
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
      a: 0.65,
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

  it('keeps the slope a slider and reads out y = 10^(ax), log₁₀ y = ax', () => {
    const data = deriveLogarithmicState({ a: 0.5, compareMode: 0, showExp: 1 });
    expect(data.curves[0]!.fn(2)).toBeCloseTo(10, 10);
    expect(logarithmicScaleModule.paramSchema.map((f) => f.key)).toEqual(['a', 'p', 'm']);
    const meta = logarithmicScaleModule.getMetadata(logarithmicScaleModule.defaultParams);
    expect(meta.formula).toBe('y = 10^(ax) · log₁₀ y = ax');
    expect(meta.stats.find((s) => s.key === 'formula')?.value).toBe('log₁₀ y = ax');
    expect(meta.stats.find((s) => s.key === 'a')?.value).toBe('0.65');
  });
});

