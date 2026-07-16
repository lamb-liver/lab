import { describe, expect, it } from 'vitest';
import { buildBifurcationPoints, buildCobwebSteps, buildOrbitData, logistic } from './geometry';

describe('logistic-bifurcation 幾何', () => {
  it('logistic 映射的不動點', () => {
    expect(logistic(2, 0.5)).toBe(0.5);
    expect(logistic(3, 0)).toBe(0);
  });

  it('r<3 時軌道收斂到 1 − 1/r', () => {
    const { orbit1, period } = buildOrbitData({ r: 2.8, x0: 0.3 });
    const tail = orbit1.slice(-10);
    for (const x of tail) {
      expect(x).toBeCloseTo(1 - 1 / 2.8, 3);
    }
    expect(period).toBe(1);
  });

  it('r=3.2 時軌道為週期 2', () => {
    const { orbit1, period } = buildOrbitData({ r: 3.2, x0: 0.3 });
    expect(period).toBe(2);
    for (let i = orbit1.length - 10; i < orbit1.length - 2; i += 1) {
      expect(orbit1[i]).toBeCloseTo(orbit1[i + 2]!, 6);
    }
  });

  it('分岔圖在收斂區間每個 r 的吸引值皆為 1 − 1/r', () => {
    const points = buildBifurcationPoints({ rMin: 2.5, rMax: 2.9, xMin: 0, xMax: 1 }, 1, 60, 400, 20);
    expect(points.length).toBeGreaterThan(0);
    for (const point of points) {
      expect(point.value).toBeCloseTo(1 - 1 / point.r, 2);
    }
  });

  it('cobweb 步數符合要求', () => {
    const steps = buildCobwebSteps({ r: 3.5, x0: 0.2 }, 40);
    expect(steps).toHaveLength(40);
    for (const step of steps) {
      expect(step.from).toBeDefined();
      expect(step.vertical).toBeDefined();
      expect(step.next).toBeDefined();
    }
  });
});
