import { describe, expect, it } from 'vitest';
import { arg, mag, normalizeAngle, powerOf } from '../../curve/modules/demoivre-nth-roots/geometry';
import {
  DEFAULT_POWERS_ROOTS_PARAMS,
  modeVerdict,
  multiply,
  readings,
  type PowersRootsMode,
} from './geometry';

const MODES: PowersRootsMode[] = ['multiply', 'power', 'roots'];

describe('乘冪與方根：同一個幅角加法', () => {
  it('乘法的幅角是兩幅角之和，模是兩模之積', () => {
    const { z1, z2 } = DEFAULT_POWERS_ROOTS_PARAMS;
    const product = multiply(z1, z2);
    expect(mag(product)).toBeCloseTo(mag(z1) * mag(z2), 8);
    expect(normalizeAngle(arg(product))).toBeCloseTo(normalizeAngle(arg(z1) + arg(z2)), 8);
  });

  it('自乘 n 次等於把同一個幅角加 n 遍', () => {
    const z = DEFAULT_POWERS_ROOTS_PARAMS.z1;
    const n = 3;
    let acc = { re: 1, im: 0 };
    for (let i = 0; i < n; i += 1) acc = multiply(acc, z);
    const powered = powerOf(z, n);
    expect(acc.re).toBeCloseTo(powered.re, 6);
    expect(acc.im).toBeCloseTo(powered.im, 6);
  });

  it('切換模式不改 z₁、z₂，只改讀法', () => {
    for (const mode of MODES) {
      const verdict = modeVerdict({ ...DEFAULT_POWERS_ROOTS_PARAMS, mode });
      expect(verdict.length).toBeGreaterThan(0);
      const rows = readings({ ...DEFAULT_POWERS_ROOTS_PARAMS, mode });
      expect(rows.length).toBe(3);
    }
  });

  it('w = 0 的方根讀法不假裝均勻分佈', () => {
    const params = {
      ...DEFAULT_POWERS_ROOTS_PARAMS,
      mode: 'roots' as const,
      z1: { re: 0, im: 0 },
    };
    expect(modeVerdict(params)).toContain('幅角沒有定義');
    expect(readings(params).map(([label]) => label)).toEqual(['w', '|w|', '根']);
  });
});
