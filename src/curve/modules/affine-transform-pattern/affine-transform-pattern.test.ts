import { describe, expect, it } from 'vitest';
import { stepAffineTransformPatternAnimation } from './animation';
import {
  buildAffineMatrix,
  buildBasePattern,
  buildRecursiveTransformSegments,
  buildTranslationVectors,
  sampleAffineTransformPatternCurve,
} from './geometry';
import { affineTransformPatternModule } from './index';

describe('buildTranslationVectors', () => {
  it('scales distance by reveal progress', () => {
    const half = buildTranslationVectors(80, 0.5);
    expect(half[0]!.tx).toBeCloseTo(40);
  });
});

describe('buildRecursiveTransformSegments', () => {
  it('reveal 0 keeps mother pattern only (zero translation)', () => {
    const base = buildBasePattern();
    const matrix = buildAffineMatrix(45, 0);
    const translations = buildTranslationVectors(80, 0);
    expect(translations.every((t) => t.tx === 0 && t.ty === 0)).toBe(true);
    const segments = buildRecursiveTransformSegments(base, matrix, translations);
    const baseSpan = Math.max(
      ...base.slice(1).map((pt, index) => {
        const prev = base[index]!;
        return Math.hypot(pt.x - prev.x, pt.y - prev.y);
      }),
    );
    const maxSpan = Math.max(
      ...segments.map((s) => Math.hypot(s.x2 - s.x1, s.y2 - s.y1)),
    );
    expect(maxSpan).toBeGreaterThan(10);
    expect(maxSpan).toBeLessThan(baseSpan * 1.5);
  });

  it('reveal 1 yields spread pattern', () => {
    const base = buildBasePattern();
    const matrix = buildAffineMatrix(45, 0);
    const translations = buildTranslationVectors(80, 1);
    const segments = buildRecursiveTransformSegments(base, matrix, translations);
    const maxSpan = Math.max(
      ...segments.map((s) => Math.hypot(s.x2 - s.x1, s.y2 - s.y1)),
    );
    expect(maxSpan).toBeGreaterThan(20);
  });
});

describe('stepAffineTransformPatternAnimation', () => {
  it('rotation or translation change waits for pending reset before replaying reveal', () => {
    const defaults = affineTransformPatternModule.defaultParams;
    const pending = stepAffineTransformPatternAnimation(
      {
        params: defaults,
        targetParams: defaults,
        revealProgress: 1,
        isComplete: true,
        time: 1,
        currentRotationDeg: defaults.rotationDeg,
        currentTranslation: defaults.translation,
        previousRotationDeg: defaults.rotationDeg,
        previousTranslation: defaults.translation,
        pendingRevealReset: false,
        pendingRevealSince: 0,
      },
      { ...defaults, rotationDeg: 10 },
      0.004,
      1000 / 60,
      100,
    );
    expect(pending.revealProgress).toBe(1);
    expect(pending.pendingRevealReset).toBe(true);

    const state = stepAffineTransformPatternAnimation(
      pending,
      { ...defaults, rotationDeg: 10 },
      0.004,
      1000 / 60,
      1400,
    );
    expect(state.revealProgress).toBeCloseTo(0.004);
    expect(state.isComplete).toBe(false);
  });

  it('evolution speed change does not reset reveal', () => {
    const defaults = affineTransformPatternModule.defaultParams;
    const state = stepAffineTransformPatternAnimation(
      {
        params: defaults,
        targetParams: defaults,
        revealProgress: 0.5,
        isComplete: false,
        time: 0,
        currentRotationDeg: defaults.rotationDeg,
        currentTranslation: defaults.translation,
        previousRotationDeg: defaults.rotationDeg,
        previousTranslation: defaults.translation,
        pendingRevealReset: false,
        pendingRevealSince: 0,
      },
      { ...defaults, evolutionSpeed: 0.04 },
      0.004,
    );
    expect(state.revealProgress).toBeGreaterThan(0.5);
  });
});

describe('affineTransformPatternModule.sample', () => {
  it('returns points for default sample', () => {
    const points = affineTransformPatternModule.sample(
      affineTransformPatternModule.defaultParams,
      { step: 1 },
    );
    expect(points.length).toBeGreaterThan(3);
    expect(points.at(-1)!.arcLength).toBeGreaterThan(0);
  });
});

describe('sampleAffineTransformPatternCurve', () => {
  it('returns closed polygon vertices', () => {
    const points = sampleAffineTransformPatternCurve(45, 80, 0, 1, 1);
    expect(points.length).toBeGreaterThanOrEqual(4);
  });
});
