import { describe, expect, it } from 'vitest';
import {
  FUNCTION_DERIVATIVE_PRESETS,
  nearestZeroInfo,
  presetById,
  slopeStateText,
  visibleZeros,
  zeroTypeText,
} from './geometry';

describe('function derivative graph geometry', () => {
  it('defines the three expected function presets', () => {
    expect(FUNCTION_DERIVATIVE_PRESETS.map((preset) => preset.id)).toEqual([
      'quad',
      'cubic',
      'sin',
    ]);
  });

  it('detects derivative zero types', () => {
    const quad = presetById('quad');
    const cubic = presetById('cubic');
    expect(visibleZeros(quad)).toEqual([0]);
    expect(zeroTypeText(quad, 0)).toBe('極小值候選');
    expect(zeroTypeText(cubic, -1)).toBe('極大值候選');
    expect(zeroTypeText(cubic, 1)).toBe('極小值候選');
  });

  it('uses proximity to derivative zeros for extremum candidates', () => {
    const cubic = presetById('cubic');
    expect(nearestZeroInfo(cubic, -1.01)?.near).toBe(true);
    expect(nearestZeroInfo(cubic, 0)?.near).toBe(false);
  });

  it('formats slope states with a horizontal tolerance', () => {
    expect(slopeStateText(0.01)).toBe('水平');
    expect(slopeStateText(0.5)).toBe('遞增');
    expect(slopeStateText(-0.5)).toBe('遞減');
  });
});
