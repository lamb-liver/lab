import { describe, expect, it } from 'vitest';
import { BASE_CANVAS_SIZE } from '../../constants';
import type { ThumbnailSpec } from '../../types';
import {
  DEFAULT_DEMOIVRE_NTH_ROOTS_PARAMS,
  computeDemoivreMetrics,
  mag,
  nthRoots,
  normalizeAngle,
  powerOf,
  type DemoivreNthRootsParams,
} from './geometry';
import {
  demoivreNthRootsModule,
  demoivreNthRootsParamsForMetadata,
} from './index';

const DEFAULTS = DEFAULT_DEMOIVRE_NTH_ROOTS_PARAMS;

describe('棣美弗定理與 n 次方根', () => {
  it('z^n 的模是 |z|^n，幅角是 n Arg(z)', () => {
    const metrics = computeDemoivreMetrics(DEFAULTS);
    const zn = powerOf(metrics.z, metrics.n);
    expect(mag(zn)).toBeCloseTo(metrics.r ** metrics.n, 8);
    expect(normalizeAngle(Math.atan2(zn.im, zn.re))).toBeCloseTo(
      normalizeAngle(metrics.n * metrics.theta),
      8,
    );
  });

  it('每個 n 次方根的 n 次方都回到 z', () => {
    const metrics = computeDemoivreMetrics({ ...DEFAULTS, mode: 'roots', n: 5 });
    const roots = nthRoots(metrics.z, metrics.n);
    expect(roots).toHaveLength(5);
    for (const root of roots) {
      const back = powerOf(root, metrics.n);
      expect(back.re).toBeCloseTo(metrics.z.re, 6);
      expect(back.im).toBeCloseTo(metrics.z.im, 6);
    }
  });

  it('相鄰方根的幅角差是 2π/n', () => {
    const metrics = computeDemoivreMetrics({ ...DEFAULTS, mode: 'roots', n: 4 });
    const angles = nthRoots(metrics.z, 4).map((root) => Math.atan2(root.im, root.re));
    const step = Math.PI / 2;
    expect(normalizeAngle(angles[1]! - angles[0]!)).toBeCloseTo(step, 6);
    expect(normalizeAngle(angles[2]! - angles[1]!)).toBeCloseTo(step, 6);
    expect(normalizeAngle(angles[3]! - angles[2]!)).toBeCloseTo(step, 6);
  });

  it('原點的所有方根都是 0', () => {
    const roots = nthRoots({ re: 0, im: 0 }, 4);
    for (const root of roots) {
      expect(mag(root)).toBe(0);
    }
  });
});

describe('demoivreNthRootsModule', () => {
  it('縮圖不超出設計舞台', () => {
    const half = BASE_CANVAS_SIZE / 2;
    const variants: DemoivreNthRootsParams[] = [
      DEFAULTS,
      { ...DEFAULTS, n: 8, re: 1.4, im: 1.4 },
      { ...DEFAULTS, mode: 'roots', n: 6 },
    ];
    for (const params of variants) {
      const spec = demoivreNthRootsModule.sample(
        demoivreNthRootsParamsForMetadata(params),
        { step: 1, purpose: 'thumbnail' },
      ) as ThumbnailSpec;
      let maxExtent = 0;
      for (const path of spec.paths) {
        for (const point of path.points) {
          maxExtent = Math.max(maxExtent, Math.abs(point.x), Math.abs(point.y));
        }
      }
      expect(maxExtent).toBeLessThanOrEqual(half);
    }
  });

  it('metadata 讀出 z 與 z^n', () => {
    const meta = demoivreNthRootsModule.getMetadata(demoivreNthRootsModule.defaultParams);
    expect(meta.stats.find((stat) => stat.key === 'z')?.value).toBe('1.15 + 0.55i');
    expect(meta.formula).toContain('r^n e^(inθ)');
  });

  it('原點的幅角標成未定義', () => {
    const meta = demoivreNthRootsModule.getMetadata(
      demoivreNthRootsParamsForMetadata({ ...DEFAULTS, re: 0, im: 0 }),
    );
    expect(meta.stats.find((stat) => stat.key === 'theta')?.value).toBe('未定義');
  });
});
