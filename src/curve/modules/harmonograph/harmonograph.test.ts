import { describe, expect, it } from 'vitest';
import { harmonographModule } from './index';

describe('harmonographModule.sample', () => {
  it('returns empty for invalid frequencies', () => {
    expect(
      harmonographModule.sample({ a: 0, b: 2, delta: 0, d: 0.01 }, { step: 0.01 }),
    ).toEqual([]);
  });

  it('produces monotonic arcLength', () => {
    const points = harmonographModule.sample(harmonographModule.defaultParams, {
      step: 0.01,
    });
    for (let i = 1; i < points.length; i++) {
      expect(points[i]!.arcLength).toBeGreaterThanOrEqual(points[i - 1]!.arcLength);
    }
  });

  it('shortens sampling domain when damping is high', () => {
    const light = harmonographModule.sample(
      { a: 3, b: 2, delta: 0, d: 0 },
      { step: 0.01 },
    );
    const heavy = harmonographModule.sample(
      { a: 3, b: 2, delta: 0, d: 0.2 },
      { step: 0.01 },
    );
    expect(heavy.length).toBeLessThan(light.length);
    expect(heavy.at(-1)!.theta).toBeLessThan(Math.PI * 10);
  });
});
