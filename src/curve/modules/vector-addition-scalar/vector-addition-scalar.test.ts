import { describe, expect, it } from 'vitest';
import {
  add,
  clampDragWorld,
  createVectorAdditionScalarLayout,
  scaleVec,
  screenToWorld,
  worldToScreen,
} from './geometry';
import {
  DEFAULT_VECTOR_ADDITION_SCALAR_PARAMS,
  vectorAdditionScalarModule,
} from './index';

describe('vector arithmetic geometry', () => {
  it('computes vector sum and scalar multiple', () => {
    expect(add({ x: 1, y: 2 }, { x: -3, y: 0.5 })).toEqual({ x: -2, y: 2.5 });
    expect(scaleVec({ x: 2, y: -1 }, -1.5)).toEqual({ x: -3, y: 1.5 });
  });

  it('keeps screen/world mapping consistent', () => {
    const layout = createVectorAdditionScalarLayout(
      640,
      640,
      DEFAULT_VECTOR_ADDITION_SCALAR_PARAMS,
    );
    const world = { x: 1.25, y: -0.75 };
    const screen = worldToScreen(layout, world);
    expect(screenToWorld(layout, screen).x).toBeCloseTo(world.x, 6);
    expect(screenToWorld(layout, screen).y).toBeCloseTo(world.y, 6);
  });

  it('clamps dragged endpoints to the interaction limit', () => {
    expect(clampDragWorld({ x: 4, y: -5 })).toEqual({ x: 3, y: -3 });
  });
});

describe('vectorAdditionScalarModule', () => {
  it('returns a thumbnail spec and four metadata rows', () => {
    const result = vectorAdditionScalarModule.sample(
      vectorAdditionScalarModule.defaultParams,
      { step: 1, purpose: 'thumbnail' },
    );
    const metadata = vectorAdditionScalarModule.getMetadata(
      vectorAdditionScalarModule.defaultParams,
    );

    expect('paths' in result).toBe(true);
    expect((result as { paths: unknown[] }).paths.length).toBeGreaterThanOrEqual(4);
    expect(metadata.stats).toHaveLength(4);
  });
});
