import { describe, expect, it } from 'vitest';
import {
  getTrigValues,
  normalizeAngle,
  quadrantLabel,
  setCircularTarget,
  stepUnitCircleSmoothing,
} from './geometry';
import { unitCircleTrigDefinitionModule } from './index';

describe('unit-circle-trig-definition module', () => {
  it('getTrigValues keeps sin²+cos²=1', () => {
    const { cosValue, sinValue } = getTrigValues(Math.PI / 3);
    expect(cosValue * cosValue + sinValue * sinValue).toBeCloseTo(1, 6);
  });

  it('setCircularTarget follows shortest arc', () => {
    const next = setCircularTarget(0.1, Math.PI * 2 - 0.05);
    expect(next).toBeCloseTo(-0.05, 2);
  });

  it('getMetadata reports quadrant and trig values', () => {
    const meta = unitCircleTrigDefinitionModule.getMetadata(
      { theta: Math.PI / 4 },
      { revealPct: 100, smoothParams: { theta: Math.PI / 4 } },
    );

    expect(meta.title).toBe('單位圓定義');
    expect(meta.stats.find((s) => s.key === 'identity')?.value).toBe('1');
    expect(meta.stats.find((s) => s.key === 'quadrant')?.value).toContain('第一象限');
  });

  it('thumbnail sample returns unit circle and projection paths', () => {
    const spec = unitCircleTrigDefinitionModule.sample(
      { theta: Math.PI / 4 },
      { step: 1, purpose: 'thumbnail' },
    );
    expect(spec).toHaveProperty('paths');
    if ('paths' in spec) {
      expect(spec.paths.length).toBeGreaterThanOrEqual(4);
      expect(spec.paths[0]?.points.length).toBeGreaterThan(40);
    }
  });

  it('stepUnitCircleSmoothing moves toward toggles', () => {
    const smooth = stepUnitCircleSmoothing(
      { theta: 0, quadrantMix: 1, specialMix: 1, tangentMix: 1 },
      {
        theta: 1,
        showQuadrants: false,
        showSpecialAngles: false,
        showTangent: false,
        showRadians: false,
      },
      16.67,
    );

    expect(smooth.theta).toBeGreaterThan(0);
    expect(smooth.quadrantMix).toBeLessThan(1);
    expect(normalizeAngle(Math.PI)).toBeCloseTo(Math.PI);
    expect(quadrantLabel(Math.PI / 4)).toBe('第一象限');
  });
});
