import { describe, expect, it } from 'vitest';
import {
  bifurcationData,
  chaosGamePoints,
  classifyBehavior,
  cobwebPath,
  distinctCount,
  logisticCurvePoints,
  logisticMap,
  orbit,
} from './geometry';
import { CHAOS_VERTICES } from './constants';

// 點是否落在三角形內（重心座標，含容差）
function inTriangle([px, py]: readonly [number, number], eps = 1e-6): boolean {
  const [[ax, ay], [bx, by], [cx, cy]] = CHAOS_VERTICES;
  const d = (by - cy) * (ax - cx) + (cx - bx) * (ay - cy);
  const a = ((by - cy) * (px - cx) + (cx - bx) * (py - cy)) / d;
  const b = ((cy - ay) * (px - cx) + (ax - cx) * (py - cy)) / d;
  const c = 1 - a - b;
  return a >= -eps && b >= -eps && c >= -eps;
}

describe('logisticMap', () => {
  it('computes r·x·(1−x)', () => {
    expect(logisticMap(2, 0.5)).toBeCloseTo(0.5); // 固定點
    expect(logisticMap(4, 0.5)).toBeCloseTo(1); // 峰值 r/4
    expect(logisticMap(3, 0)).toBe(0);
  });
});

describe('orbit', () => {
  it('has length steps+1 and starts at x0', () => {
    const xs = orbit(3.2, 0.2, 10);
    expect(xs).toHaveLength(11);
    expect(xs[0]).toBe(0.2);
  });

  it('stays at the fixed point x=0.5 when r=2', () => {
    const xs = orbit(2, 0.5, 5);
    for (const x of xs) expect(x).toBeCloseTo(0.5);
  });
});

describe('cobwebPath', () => {
  it('starts on the x-axis and steps curve→diagonal', () => {
    const p = cobwebPath(3.2, 0.2, 3);
    expect(p).toHaveLength(2 * 3 + 1);
    expect(p[0]).toEqual([0.2, 0]);
    const fx0 = logisticMap(3.2, 0.2);
    expect(p[1][0]).toBeCloseTo(0.2);
    expect(p[1][1]).toBeCloseTo(fx0); // 垂直到曲線
    expect(p[2][0]).toBeCloseTo(fx0);
    expect(p[2][1]).toBeCloseTo(fx0); // 水平到對角線
  });
});

describe('logisticCurvePoints', () => {
  it('spans [0,1] with a peak of r/4 at x=0.5', () => {
    const pts = logisticCurvePoints(3.6, 100);
    expect(pts[0]).toEqual([0, 0]);
    expect(pts[pts.length - 1][0]).toBeCloseTo(1);
    expect(pts[pts.length - 1][1]).toBeCloseTo(0);
    const mid = pts[50];
    expect(mid[0]).toBeCloseTo(0.5);
    expect(mid[1]).toBeCloseTo(3.6 / 4);
  });
});

describe('bifurcationData', () => {
  it('produces columns+1 entries spanning the r range', () => {
    const data = bifurcationData({ rMin: 2, rMax: 4, columns: 100, samples: 10 });
    expect(data).toHaveLength(101);
    expect(data[0].r).toBeCloseTo(2);
    expect(data[data.length - 1].r).toBeCloseTo(4);
    expect(data[0].xs).toHaveLength(10);
  });

  it('collapses to one attractor value in the fixed regime, splits after bifurcation', () => {
    const fixed = bifurcationData({ rMin: 2.5, rMax: 2.5, columns: 0, samples: 20 })[0];
    expect(distinctCount(fixed.xs)).toBe(1);

    const period2 = bifurcationData({ rMin: 3.2, rMax: 3.2, columns: 0, samples: 20 })[0];
    expect(distinctCount(period2.xs)).toBe(2);

    const chaos = bifurcationData({ rMin: 3.9, rMax: 3.9, columns: 0, samples: 40 })[0];
    expect(distinctCount(chaos.xs)).toBeGreaterThan(8);

    const edge = bifurcationData({ rMin: 4, rMax: 4, columns: 0, samples: 40 })[0];
    expect(distinctCount(edge.xs)).toBeGreaterThan(8);
  });
});

describe('chaosGamePoints', () => {
  it('is deterministic for a fixed seed', () => {
    const a = chaosGamePoints(0.5, { steps: 50, seed: 7 });
    const b = chaosGamePoints(0.5, { steps: 50, seed: 7 });
    expect(a).toEqual(b);
    expect(a).toHaveLength(50);
  });

  it('keeps every point inside the triangle hull (Sierpinski, ratio 0.5)', () => {
    const pts = chaosGamePoints(0.5, { steps: 2000, seed: 3 });
    expect(pts.every((p) => inTriangle(p))).toBe(true);
  });
});

describe('classifyBehavior', () => {
  it('detects a fixed point in the stable regime', () => {
    expect(classifyBehavior(2.5).kind).toBe('fixed');
  });

  it('detects period-2 after the first bifurcation', () => {
    const b = classifyBehavior(3.2);
    expect(b.kind).toBe('periodic');
    expect(b.period).toBe(2);
  });

  it('does not mistake slow convergence below r=3 for a 2-cycle', () => {
    expect(classifyBehavior(2.99).kind).toBe('fixed');
  });

  it('detects period-4', () => {
    const b = classifyBehavior(3.5);
    expect(b.kind).toBe('periodic');
    expect(b.period).toBe(4);
  });

  it('does not claim a proof of chaos from a finite tail', () => {
    expect(classifyBehavior(3.9).kind).toBe('unresolved');
    expect(classifyBehavior(4, 0.5).kind).toBe('fixed');
  });
});
