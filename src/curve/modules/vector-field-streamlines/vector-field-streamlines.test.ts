import { describe, expect, it } from 'vitest';
import {
  createVectorFieldAnimState,
  stepVectorFieldAnimation,
} from './animation';
import {
  BOUND_LIMIT,
  buildAllStreamlines,
  evaluateVectorField,
  integrateStreamline,
} from './geometry';
import { vectorFieldStreamlinesModule } from './index';
import type { ParamValues } from '../../types';

const DEFAULT_PARAMS = vectorFieldStreamlinesModule.defaultParams;
type VectorFieldAnimState = ReturnType<typeof createVectorFieldAnimState>;

function makeState(patch: Partial<VectorFieldAnimState> = {}): VectorFieldAnimState {
  return {
    ...createVectorFieldAnimState(DEFAULT_PARAMS),
    ...patch,
  };
}

function makeParams(patch: Partial<ParamValues> = {}): ParamValues {
  return {
    ...DEFAULT_PARAMS,
    ...patch,
  } as ParamValues;
}

describe('evaluateVectorField', () => {
  it('is non-zero away from origin', () => {
    const v = evaluateVectorField(1, 0, 0);
    expect(Math.hypot(v.x, v.y)).toBeGreaterThan(0);
  });
});

describe('integrateStreamline', () => {
  it('produces a polyline from seed', () => {
    const path = integrateStreamline({ x: 1, y: 0 }, 50, 0.03, 0);
    expect(path.length).toBeGreaterThan(2);
    expect(path[0]).toEqual({ x: 1, y: 0 });
  });

  it('stops at boundary', () => {
    const path = integrateStreamline({ x: 4.5, y: 0 }, 400, 0.03, 0);
    const last = path[path.length - 1]!;
    expect(Math.abs(last.x)).toBeLessThanOrEqual(BOUND_LIMIT + 0.5);
  });
});

describe('buildAllStreamlines', () => {
  it('returns count matching request', () => {
    const lines = buildAllStreamlines(12, 80, 0.03, 0);
    expect(lines.length).toBe(12);
    for (const line of lines) {
      expect(line.length).toBeGreaterThan(1);
    }
  });
});

describe('stepVectorFieldAnimation', () => {
  it('reuses streamlines before the rebuild interval when params are unchanged', () => {
    const state = makeState({ framesSinceBuild: 0 });
    const next = stepVectorFieldAnimation(state, DEFAULT_PARAMS);

    expect(next.streamlines).toBe(state.streamlines);
    expect(next.framesSinceBuild).toBe(1);
    expect(next.time).toBeCloseTo(state.time + DEFAULT_PARAMS.flowSpeed);
  });

  it('rebuilds streamlines at the rebuild interval', () => {
    const state = makeState({ framesSinceBuild: 3 });
    const next = stepVectorFieldAnimation(state, DEFAULT_PARAMS);

    expect(next.streamlines).not.toBe(state.streamlines);
    expect(next.framesSinceBuild).toBe(0);
  });

  it('rebuilds immediately when streamlineCount changes', () => {
    const state = makeState({ framesSinceBuild: 0 });
    const next = stepVectorFieldAnimation(
      state,
      makeParams({ streamlineCount: DEFAULT_PARAMS.streamlineCount + 1 }),
    );

    expect(next.streamlines).not.toBe(state.streamlines);
    expect(next.streamlines.length).toBe(Math.round(DEFAULT_PARAMS.streamlineCount + 1));
    expect(next.framesSinceBuild).toBe(0);
  });

  it('rebuilds immediately when integrationSteps changes', () => {
    const state = makeState({ framesSinceBuild: 0 });
    const next = stepVectorFieldAnimation(
      state,
      makeParams({ integrationSteps: DEFAULT_PARAMS.integrationSteps + 20 }),
    );

    expect(next.streamlines).not.toBe(state.streamlines);
    expect(next.framesSinceBuild).toBe(0);
  });

  it('keeps streamlines reference stable before the interval', () => {
    const state = makeState({ framesSinceBuild: 1 });
    const next = stepVectorFieldAnimation(state, DEFAULT_PARAMS);

    expect(next.streamlines).toBe(state.streamlines);
    expect(next.framesSinceBuild).toBe(2);
  });
});

describe('vectorFieldStreamlinesModule', () => {
  it('thumbnail returns many paths', () => {
    const result = vectorFieldStreamlinesModule.sample(
      vectorFieldStreamlinesModule.defaultParams,
      { step: 1, purpose: 'thumbnail' },
    );
    expect('paths' in result).toBe(true);
    expect((result as { paths: unknown[] }).paths.length).toBeGreaterThan(4);
  });
});
