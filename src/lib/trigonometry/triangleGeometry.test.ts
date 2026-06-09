import { describe, expect, it } from 'vitest';
import {
  circumcircleFromTriangle,
  computeTriangleSidesAngles,
  preventTriangleCollapse,
  type TriangleVerts,
} from './triangleGeometry';

const SAMPLE: TriangleVerts = {
  A: { x: -1.18, y: -0.78 },
  B: { x: 1.18, y: -0.78 },
  C: { x: -0.18, y: 1.02 },
};

describe('triangleGeometry', () => {
  it('computeTriangleSidesAngles keeps law-of-sines ratio', () => {
    const g = computeTriangleSidesAngles(SAMPLE);
    const ratioA = g.a / Math.sin(g.A);
    const ratioB = g.b / Math.sin(g.B);
    expect(ratioA).toBeCloseTo(ratioB, 3);
    expect(g.R).toBeCloseTo(ratioA / 2, 3);
  });

  it('circumcircleFromTriangle matches R', () => {
    const { A, B, C } = SAMPLE;
    const cc = circumcircleFromTriangle(A, B, C);
    const g = computeTriangleSidesAngles(SAMPLE);
    expect(cc).not.toBeNull();
    expect(cc!.r).toBeCloseTo(g.R, 3);
  });

  it('preventTriangleCollapse restores area from near-degenerate drag', () => {
    const collapsed = {
      A: { x: 0, y: 0 },
      B: { x: 0.01, y: 0 },
      C: { x: 0.02, y: 0 },
    };
    const next = preventTriangleCollapse(collapsed, 'C');
    expect(Math.abs(computeTriangleSidesAngles(next).a)).toBeGreaterThan(0);
  });
});
