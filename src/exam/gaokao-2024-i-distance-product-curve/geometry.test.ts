import { describe, expect, it } from 'vitest';
import { X_RIGHT, bound, distanceToF, distanceToLine, firstQuadrantMax, upperY } from './geometry';

describe('2024 高考數學新課標 I 卷第 11 題的距離乘積曲線', () => {
  it('A：原點在曲線上，2·2 = 4', () => {
    expect(upperY(0)).toBeCloseTo(0, 12);
    expect(distanceToF(0, 0) * distanceToLine(0)).toBeCloseTo(4, 12);
  });

  it('B：(2√2, 0) 在曲線上，也是最右端', () => {
    expect(upperY(X_RIGHT)).toBeCloseTo(0, 6);
    expect(upperY(X_RIGHT + 0.01)).toBeNull();
  });

  it('曲線上每一點的距離乘積都是 4', () => {
    for (const x of [-1, -0.5, 0.7, 1.5, 2, 2.5]) {
      const y = upperY(x) as number;
      expect(distanceToF(x, y) * distanceToLine(x)).toBeCloseTo(4, 10);
    }
  });

  it('C 錯：x = 2 時 y = 1，但第一象限最大值約 1.039', () => {
    expect(upperY(2)).toBeCloseTo(1, 12);
    expect(upperY(1.5) as number).toBeGreaterThan(1);
    const best = firstQuadrantMax();
    expect(best.y).toBeGreaterThan(1.03);
    expect(best.y).toBeLessThan(1.05);
  });

  it('D：y ≤ 4/(x+2)', () => {
    for (let x = -1.5; x <= X_RIGHT; x += 0.01) {
      const y = upperY(x);
      if (y !== null) expect(y).toBeLessThanOrEqual(bound(x) + 1e-12);
    }
  });
});
