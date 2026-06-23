import { describe, expect, it } from 'vitest';
import { stepConicEnvelopeAnimation } from './animation';
import {
  buildEnvelopeGeometry,
  buildSymmetricLines,
  envelopePoint,
  sampleConicEnvelopeOutline,
} from './geometry';
import { conicEnvelopeModule } from './index';

describe('buildSymmetricLines', () => {
  it('returns four quadrant lines per point', () => {
    expect(buildSymmetricLines({ x: 100, y: 80 })).toHaveLength(4);
  });
});

describe('buildEnvelopeGeometry', () => {
  it('reveals a subset of lines by progress', () => {
    const partial = buildEnvelopeGeometry({
      canvasWidth: 600,
      lineDensity: 10,
      currentRatio: 1,
      time: 0,
      revealProgress: 0.5,
    });
    const full = buildEnvelopeGeometry({
      canvasWidth: 600,
      lineDensity: 10,
      currentRatio: 1,
      time: 0,
      revealProgress: 1,
    });
    expect(partial.visibleLines.length).toBeLessThan(full.fullLines.length);
    expect(partial.fullLines.length).toBe(full.fullLines.length);
  });
});

describe('envelopePoint', () => {
  it('lies on axes intercept construction', () => {
    const pt = envelopePoint(0.5, 480, 1, 1);
    expect(pt.x).toBeGreaterThan(0);
    expect(pt.y).toBeGreaterThan(0);
  });
});

describe('stepConicEnvelopeAnimation', () => {
  it('line density change resets reveal', () => {
    const defaults = conicEnvelopeModule.defaultParams;
    const state = stepConicEnvelopeAnimation(
      {
        revealProgress: 1,
        isComplete: true,
        time: 1,
        currentRatio: 1,
        previousDensity: defaults.lineDensity,
        previousRatio: defaults.deformationRatio,
        pendingRevealReset: false,
        pendingRevealSince: 0,
      },
      { ...defaults, lineDensity: 60 },
      0.0025,
    );
    expect(state.revealProgress).toBeCloseTo(0.0025);
    expect(state.isComplete).toBe(false);
  });

  it('deformation ratio change waits for pending reset before replaying reveal', () => {
    const defaults = conicEnvelopeModule.defaultParams;
    const pending = stepConicEnvelopeAnimation(
      {
        revealProgress: 0.5,
        isComplete: false,
        time: 0,
        currentRatio: 1,
        previousDensity: defaults.lineDensity,
        previousRatio: defaults.deformationRatio,
        pendingRevealReset: false,
        pendingRevealSince: 0,
      },
      { ...defaults, deformationRatio: 1.5 },
      0.0025,
      1000 / 60,
      100,
    );
    expect(pending.revealProgress).toBeGreaterThan(0.5);
    expect(pending.pendingRevealReset).toBe(true);

    const state = stepConicEnvelopeAnimation(
      pending,
      { ...defaults, deformationRatio: 1.5 },
      0.0025,
      1000 / 60,
      1400,
    );
    expect(state.revealProgress).toBeCloseTo(0.0025);
    expect(state.isComplete).toBe(false);
  });
});

describe('conicEnvelopeModule.sample', () => {
  it('returns outline points for thumbnail', () => {
    const points = sampleConicEnvelopeOutline(1, 4);
    expect(points.length).toBeGreaterThan(10);
  });
});
