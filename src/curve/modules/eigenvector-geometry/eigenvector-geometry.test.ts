import { describe, expect, it } from 'vitest';
import {
  eigenData,
  eigenStatusText,
  matVec,
  type Matrix2,
} from './geometry';

describe('eigenvector geometry', () => {
  it('detects two real eigen directions for diagonal stretch', () => {
    const eigen = eigenData({ a: 1.8, b: 0, c: 0, d: 0.65 });
    expect(eigen.kind).toBe('two');
    if (eigen.kind !== 'two') return;
    expect(eigen.directions[0]?.lambda).toBeCloseTo(1.8);
    expect(eigen.directions[1]?.lambda).toBeCloseTo(0.65);
    expect(eigenStatusText(eigen)).toBe('兩方向');
  });

  it('detects complex eigen values for rotation', () => {
    const angle = Math.PI / 4;
    const matrix: Matrix2 = {
      a: Math.cos(angle),
      b: -Math.sin(angle),
      c: Math.sin(angle),
      d: Math.cos(angle),
    };
    const eigen = eigenData(matrix);
    expect(eigen.kind).toBe('complex');
    if (eigen.kind !== 'complex') return;
    expect(eigen.real).toBeCloseTo(Math.SQRT1_2);
    expect(eigen.imag).toBeCloseTo(Math.SQRT1_2);
  });

  it('returns directions that satisfy A v = lambda v', () => {
    const matrix = { a: 1.15, b: 0.75, c: 0.45, d: 0.35 };
    const eigen = eigenData(matrix);
    expect(eigen.kind).toBe('two');
    if (eigen.kind !== 'two') return;

    for (const direction of eigen.directions) {
      const av = matVec(matrix, direction.v);
      expect(av.x).toBeCloseTo(direction.lambda * direction.v.x);
      expect(av.y).toBeCloseTo(direction.lambda * direction.v.y);
    }
  });
});
