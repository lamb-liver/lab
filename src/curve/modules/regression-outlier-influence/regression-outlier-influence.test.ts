import { describe, expect, it } from 'vitest';
import { DEFAULT_OUTLIER, OUTLIER_PRESETS, influenceStats } from '.';

describe('regression-outlier-influence', () => {
  it('separates low influence from high influence presets', () => {
    const neutral = influenceStats(DEFAULT_OUTLIER);
    const low = influenceStats(OUTLIER_PRESETS.lowInfluence);
    const high = influenceStats(OUTLIER_PRESETS.highInfluence);

    expect(Math.abs(low.deltaB)).toBeLessThan(0.08);
    expect(Math.abs(high.deltaB)).toBeGreaterThan(Math.abs(neutral.deltaB));
    expect(Math.abs(high.deltaB)).toBeGreaterThan(Math.abs(low.deltaB) * 5);
  });
});
