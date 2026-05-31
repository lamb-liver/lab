import { describe, expect, it } from 'vitest';
import {
  clampDragWorld,
  createVectorProjectionLayout,
  getProjectionData,
  screenToWorld,
  worldToScreen,
} from './geometry';
import { vectorProjectionModule } from './index';

describe('vector projection geometry', () => {
  it('computes projection and perpendicular component', () => {
    const data = getProjectionData({
      ax: 3,
      ay: 3,
      bx: 2,
      by: 0,
      projectionMode: 'a_on_b',
      viewMode: 'projection',
    });

    expect(data.valid).toBe(true);
    expect(data.proj.x).toBeCloseTo(3, 6);
    expect(data.proj.y).toBeCloseTo(0, 6);
    expect(data.perp.x).toBeCloseTo(0, 6);
    expect(data.perp.y).toBeCloseTo(3, 6);
    expect(data.perpDot).toBeCloseTo(0, 6);
  });

  it('keeps screen/world mapping consistent', () => {
    const layout = createVectorProjectionLayout(640, 640, {
      ax: 3.3,
      ay: 2.4,
      bx: 4.2,
      by: 1.2,
      projectionMode: 'a_on_b',
      viewMode: 'projection',
    });
    const world = { x: -2.5, y: 1.25 };
    const screen = worldToScreen(layout, world);
    expect(screenToWorld(layout, screen).x).toBeCloseTo(world.x, 6);
    expect(screenToWorld(layout, screen).y).toBeCloseTo(world.y, 6);
  });

  it('clamps dragged endpoints', () => {
    expect(clampDragWorld({ x: 8, y: -9 })).toEqual({ x: 6, y: -6 });
  });
});

describe('vectorProjectionModule', () => {
  it('returns thumbnail paths and four metadata rows', () => {
    const result = vectorProjectionModule.sample(
      vectorProjectionModule.defaultParams,
      { step: 1, purpose: 'thumbnail' },
    );
    const metadata = vectorProjectionModule.getMetadata(
      vectorProjectionModule.defaultParams,
    );

    expect('paths' in result).toBe(true);
    expect((result as { paths: unknown[] }).paths.length).toBeGreaterThanOrEqual(4);
    expect(metadata.stats).toHaveLength(4);
  });
});
