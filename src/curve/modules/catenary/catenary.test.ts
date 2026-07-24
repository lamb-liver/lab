import { describe, expect, it } from 'vitest';
import { updateCameraFromBounds } from './camera';
import { stepCatenaryAnimation } from './animation';
import {
  buildParametricCurve,
  computeTractrixBounds,
  evaluateTractrix,
  mirrorY,
  pullingOscillation,
} from './geometry';
import { catenaryModule } from './index';
import { createCatenaryAnimState } from './animation';

describe('evaluateTractrix', () => {
  it('at t=0 starts on y-axis at L', () => {
    const pt = evaluateTractrix(0, 1.5);
    expect(pt.x).toBe(0);
    expect(pt.y).toBe(1.5);
  });

  it('moves forward for t>0', () => {
    const pt = evaluateTractrix(2, 1.5);
    expect(pt.x).toBeGreaterThan(0);
    expect(pt.y).toBeGreaterThan(0);
    expect(pt.y).toBeLessThan(1.5);
  });
});

describe('pullingOscillation', () => {
  it('ranges 0 to 1', () => {
    expect(pullingOscillation(0)).toBeCloseTo(0);
    expect(pullingOscillation(Math.PI)).toBeCloseTo(1);
  });
});

describe('updateCameraFromBounds', () => {
  it('produces positive scale', () => {
    const bounds = computeTractrixBounds(1.5, 3.5, 1);
    const cam = updateCameraFromBounds(
      bounds,
      600,
      600,
    );
    expect(cam.scale).toBeGreaterThan(0);
  });
});

describe('stepCatenaryAnimation', () => {
  it('rebuilds ghost when L changes', () => {
    const defaults = catenaryModule.defaultParams;
    const initial = createCatenaryAnimState(defaults);
    const state = stepCatenaryAnimation(initial, { ...defaults, ropeLength: 2 });
    expect(state.ghostUpper.length).toBeGreaterThan(10);
    expect(state.smoothRopeLength).not.toBe(initial.smoothRopeLength);
  });
});

describe('catenaryModule.sample', () => {
  it('returns tractrix points for default sample', () => {
    const result = catenaryModule.sample(catenaryModule.defaultParams, { step: 1 });
    expect(Array.isArray(result)).toBe(true);
    if (!Array.isArray(result)) return;
    expect(result.length).toBeGreaterThan(10);
  });

  it('returns six paths for thumbnail sample', () => {
    const result = catenaryModule.sample(catenaryModule.defaultParams, {
      step: 1,
      purpose: 'thumbnail',
      revealProgress: 1,
    });
    expect(Array.isArray(result)).toBe(false);
    if (Array.isArray(result)) return;
    expect(result.paths.length).toBe(6);
    expect(result.paths[0]?.excludeFromBbox).toBe(true);
    expect(result.paths[1]?.excludeFromBbox).toBe(true);
  });
});

describe('mirrorY', () => {
  it('negates y', () => {
    const mirrored = mirrorY([{ x: 1, y: 2 }]);
    expect(mirrored[0]!.y).toBe(-2);
  });
});

describe('buildParametricCurve', () => {
  it('samples inclusive end', () => {
    const pts = buildParametricCurve((t) => ({ x: t, y: 0 }), 0, 0.02, 0.01);
    expect(pts.length).toBeGreaterThanOrEqual(3);
  });
});
