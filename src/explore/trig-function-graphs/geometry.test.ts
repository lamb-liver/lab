import { describe, expect, it } from 'vitest';
import {
  DEFAULT_PARAMS,
  TAU,
  buildTrigFunctionGraphStats,
  computeTrigFunctionGraphLayout,
  pickThetaDrag,
  thetaFromCircle,
  thetaFromGraph,
  transformedSin,
} from './geometry';

describe('trig function graphs geometry', () => {
  it('preserves theta turn when dragging around the unit circle', () => {
    const layout = computeTrigFunctionGraphLayout(860, 520, 'unfold');
    const theta = thetaFromCircle(
      TAU + 0.1,
      layout.circle.cx + layout.circle.r,
      layout.circle.cy,
      layout.circle,
    );

    expect(theta).toBeCloseTo(TAU);
  });

  it('clamps graph drag to the visible theta range', () => {
    const layout = computeTrigFunctionGraphLayout(860, 520, 'unfold');

    expect(thetaFromGraph(layout.graph.x - 100, layout)).toBeCloseTo(-Math.PI);
    expect(thetaFromGraph(layout.graph.x + layout.graph.w + 100, layout)).toBeCloseTo(TAU * 2);
  });

  it('only uses graph drag outside radian mode', () => {
    const layout = computeTrigFunctionGraphLayout(860, 520, 'radian');
    const target = pickThetaDrag(
      layout.graph.x + layout.graph.w / 2,
      layout.graph.y + layout.graph.h / 2,
      layout,
      'radian',
    );

    expect(target).toBeNull();
  });

  it('computes the transformed sine from A, T, phi, and k', () => {
    const y = transformedSin(Math.PI / 2, {
      ...DEFAULT_PARAMS,
      amplitude: 2,
      period: TAU,
      phase: 0,
      verticalShift: -0.5,
    });

    expect(y).toBeCloseTo(1.5);
  });

  it('builds non-empty stats for every mode', () => {
    for (const mode of ['radian', 'unfold', 'transform'] as const) {
      expect(buildTrigFunctionGraphStats({ ...DEFAULT_PARAMS, mode }).length).toBeGreaterThan(0);
    }
  });
});
