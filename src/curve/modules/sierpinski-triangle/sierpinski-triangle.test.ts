import { describe, expect, it } from 'vitest';
import {
  buildChaosSteps,
  buildRecursiveTopology,
  buildRootTriangle,
  chaosPointCountForDepth,
} from './geometry';

const root = buildRootTriangle(0, 600);

describe('sierpinski-triangle 幾何', () => {
  it('深度 d 的實心葉三角形數為 3^d', () => {
    for (const depth of [1, 2, 3, 4]) {
      const topology = buildRecursiveTopology(root, depth);
      const leaves = topology.filter((tri) => tri.type === 'solid' && tri.depth === depth);
      expect(leaves, `depth ${depth}`).toHaveLength(3 ** depth);
    }
  });

  it('chaos game 以種子決定且每步為中點', () => {
    const a = buildChaosSteps(root, 50);
    const b = buildChaosSteps(root, 50);
    expect(a).toEqual(b);
    for (const step of a) {
      expect(step.point.x).toBeCloseTo((step.from.x + step.target.x) / 2, 9);
      expect(step.point.y).toBeCloseTo((step.from.y + step.target.y) / 2, 9);
    }
  });

  it('chaos 點數隨深度以 3^d 成長', () => {
    expect(chaosPointCountForDepth(3)).toBe(500 + Math.round(27 * 0.7));
    expect(chaosPointCountForDepth(5)).toBeGreaterThan(chaosPointCountForDepth(3));
  });

  it('chaos 點不逸出根三角形的外接範圍', () => {
    const xs = [root.a.x, root.b.x, root.c.x];
    const ys = [root.a.y, root.b.y, root.c.y];
    for (const step of buildChaosSteps(root, 300)) {
      expect(step.point.x).toBeGreaterThanOrEqual(Math.min(...xs));
      expect(step.point.x).toBeLessThanOrEqual(Math.max(...xs));
      expect(step.point.y).toBeGreaterThanOrEqual(Math.min(...ys));
      expect(step.point.y).toBeLessThanOrEqual(Math.max(...ys));
    }
  });
});
