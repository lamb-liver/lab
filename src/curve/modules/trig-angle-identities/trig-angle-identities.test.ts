import { describe, expect, it } from 'vitest';
import type { ParamValues } from '../../types';
import {
  formulaDisplayLine,
  formulaFromId,
  makeCompositionSnap,
  setCircularTarget,
  stepTrigAngleIdentitiesSmoothing,
} from './geometry';
import {
  asTrigAngleIdentitiesModuleParams,
  trigAngleIdentitiesModule,
} from './index';

describe('trig-angle-identities module', () => {
  it('makeCompositionSnap keeps lhs equal to rhs', () => {
    const params = asTrigAngleIdentitiesModuleParams({
      formulaId: 'sinSum',
      alpha: (2 * Math.PI) / 3,
      beta: Math.PI / 6,
    });
    const snap = makeCompositionSnap(params, { alpha: params.alpha, beta: params.beta, guideMix: 1 });
    expect(snap.lhs).toBeCloseTo(snap.rhs, 6);
    expect(Math.abs(snap.error)).toBeLessThan(1e-9);
  });

  it('setCircularTarget follows shortest arc', () => {
    const next = setCircularTarget(0.1, Math.PI * 2 - 0.05);
    expect(next).toBeCloseTo(-0.05, 2);
  });

  it('getMetadata reports m, d, and formula values', () => {
    // getMetadata 內部以 asTrigAngleIdentitiesModuleParams 還原富參數
    const meta = trigAngleIdentitiesModule.getMetadata(
      asTrigAngleIdentitiesModuleParams({
        formulaId: 'sinSum',
        alpha: (2 * Math.PI) / 3,
        beta: Math.PI / 6,
        showRadians: false,
      }) as unknown as ParamValues,
      { revealPct: 100, smoothParams: {} },
    );

    expect(meta.title).toBe('sinα + sinβ');
    expect(meta.stats.find((s) => s.key === 'm')?.value).toBe('75°');
    expect(meta.stats.find((s) => s.key === 'd')?.value).toBe('45°');
    expect(formulaDisplayLine(formulaFromId('sinSum'))).toContain('2sinm');
  });

  it('thumbnail sample returns unit circle, directions, and m guide', () => {
    const spec = trigAngleIdentitiesModule.sample(
      asTrigAngleIdentitiesModuleParams({ formulaId: 'sinSum' }) as unknown as ParamValues,
      { step: 1, purpose: 'thumbnail' },
    );
    expect(spec).toHaveProperty('paths');
    if ('paths' in spec) {
      expect(spec.paths.length).toBeGreaterThanOrEqual(5);
      expect(spec.paths[0]?.points.length).toBeGreaterThan(40);
    }
  });

  it('stepTrigAngleIdentitiesSmoothing moves toward toggles', () => {
    const smooth = stepTrigAngleIdentitiesSmoothing(
      { alpha: 0, beta: 0, guideMix: 1 },
      asTrigAngleIdentitiesModuleParams({
        alpha: 1,
        beta: 0.5,
        showGuides: false,
      }),
      16.67,
    );

    expect(smooth.alpha).toBeGreaterThan(0);
    expect(smooth.beta).toBeGreaterThan(0);
    expect(smooth.guideMix).toBeLessThan(1);
  });
});
