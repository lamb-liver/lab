import { describe, expect, it } from 'vitest';
import {
  clampDragWorld,
  computeDotProductMetrics,
  createDotProductLayout,
  screenToWorld,
  worldToScreen,
} from './geometry';
import { dotProductGeometryModule } from './index';

describe('dot product geometry', () => {
  it('computes dot, angle and projection', () => {
    const metrics = computeDotProductMetrics({
      ux: 3,
      uy: 0,
      vx: 2,
      vy: 2,
      mode: 'dot',
    });

    expect(metrics.dot).toBe(6);
    expect(metrics.cosTheta).toBeCloseTo(Math.SQRT1_2, 6);
    expect(metrics.projection.x).toBeCloseTo(1.5, 6);
    expect(metrics.projection.y).toBeCloseTo(1.5, 6);
  });

  it('keeps screen/world mapping consistent', () => {
    const layout = createDotProductLayout(640, 640, {
      ux: 3.2,
      uy: 1.6,
      vx: 2.2,
      vy: 3,
      mode: 'dot',
    });
    const world = { x: -2.25, y: 1.75 };
    const screen = worldToScreen(layout, world);
    expect(screenToWorld(layout, screen).x).toBeCloseTo(world.x, 6);
    expect(screenToWorld(layout, screen).y).toBeCloseTo(world.y, 6);
  });

  it('clamps dragged endpoints', () => {
    expect(clampDragWorld({ x: 8, y: -9 })).toEqual({ x: 6, y: -6 });
  });
});

describe('dotProductGeometryModule', () => {
  it('returns thumbnail paths and four metadata rows', () => {
    const result = dotProductGeometryModule.sample(
      dotProductGeometryModule.defaultParams,
      { step: 1, purpose: 'thumbnail' },
    );
    const metadata = dotProductGeometryModule.getMetadata(
      dotProductGeometryModule.defaultParams,
    );

    expect('paths' in result).toBe(true);
    expect((result as { paths: unknown[] }).paths.length).toBeGreaterThanOrEqual(4);
    expect(metadata.stats).toHaveLength(4);
  });
});
