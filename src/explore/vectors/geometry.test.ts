import { describe, expect, it } from 'vitest';
import {
  GUIDE_BASIS,
  getVectorGuideState,
  projectOnto,
  solveBasisCoordinates,
  type VectorGuideRole,
} from './geometry';

describe('projectOnto', () => {
  it('marks zero direction as non-viable', () => {
    expect(projectOnto({ x: 0, y: 0 }, { x: 2, y: 1 }).viable).toBe(false);
  });

  it('returns a projection parallel to the direction', () => {
    const p = { x: 2, y: 1 };
    const u = { x: -0.5, y: 2.4 };
    const projection = projectOnto(p, u);

    expect(projection.viable).toBe(true);
    expect(Math.abs(p.x * projection.vector.y - p.y * projection.vector.x)).toBeLessThan(1e-9);
  });
});

describe('solveBasisCoordinates', () => {
  it('reconstructs the original point in the guide basis', () => {
    const p = { x: 2.1, y: 1.4 };
    const result = solveBasisCoordinates(p, GUIDE_BASIS.e1, GUIDE_BASIS.e2);

    expect(result.viable).toBe(true);
    expect(result.s * GUIDE_BASIS.e1.x + result.t * GUIDE_BASIS.e2.x).toBeCloseTo(p.x);
    expect(result.s * GUIDE_BASIS.e1.y + result.t * GUIDE_BASIS.e2.y).toBeCloseTo(p.y);
  });

  it('marks a degenerate basis as non-viable', () => {
    const result = solveBasisCoordinates(
      { x: 1, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
    );

    expect(result.viable).toBe(false);
    expect(Math.abs(result.det)).toBeLessThan(1e-9);
  });
});

describe('getVectorGuideState', () => {
  it.each([
    ['position', '位置'],
    ['direction', '方向'],
    ['coordinate', '座標'],
  ] as const)('returns a non-empty %s summary', (role: VectorGuideRole, keyword: string) => {
    const state = getVectorGuideState({
      guideRole: role,
      guideP: { x: 1.8, y: 1.1 },
      guideU: { x: -0.8, y: 2.2 },
    });

    expect(state.summary).toContain(keyword);
    expect(state.stats.length).toBeGreaterThan(0);
  });
});
