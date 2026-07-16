import type p5 from 'p5';
import { describe, expect, it } from 'vitest';
import { BASE_CANVAS_SIZE, BASE_POINT_STEP } from '../../curve/constants';
import { workCurveBySlug } from '../../curve/registry';
import { renderFrame } from './frame';
import type { RenderConfig } from './types';

/**
 * Runtime consumers of the morph pipeline（renderFrame 以原始模組座標繪製）。
 * 其他作品走自訂 hook / plot helpers，runtime 不經過 renderFrame。
 * 新增 morph 作品時把 slug 加進來。
 */
const MORPH_WORK_SLUGS = [
  'rose-curve',
  'lissajous-curve',
  'harmonograph-curve',
  'spirograph-curve',
] as const;

const STAGE_HALF = BASE_CANVAS_SIZE / 2;

describe('morph 幾何不超出設計舞台', () => {
  for (const slug of MORPH_WORK_SLUGS) {
    it(`${slug} 在 schema 全參數範圍內點都落在 ±${STAGE_HALF}`, () => {
      const module = workCurveBySlug[slug];
      expect(module, `missing module for ${slug}`).toBeDefined();

      const variants = [module.defaultParams];
      for (const def of module.paramSchema) {
        variants.push({ ...module.defaultParams, [def.key]: def.min });
        variants.push({ ...module.defaultParams, [def.key]: def.max });
      }

      for (const params of variants) {
        const out = module.sample(params, {
          step: module.sampleStep ?? BASE_POINT_STEP,
          purpose: 'default',
        });
        const points = Array.isArray(out) ? out : out.paths.flatMap((path) => path.points);
        expect(points.length).toBeGreaterThan(0);
        for (const point of points) {
          expect(Math.abs(point.x), `${slug} x out of stage`).toBeLessThanOrEqual(STAGE_HALF);
          expect(Math.abs(point.y), `${slug} y out of stage`).toBeLessThanOrEqual(STAGE_HALF);
        }
      }
    });
  }
});

type Call = { method: string; args: unknown[] };

function recordingP5(): { p: p5; calls: Call[] } {
  const calls: Call[] = [];
  const p = new Proxy(
    {},
    {
      get(_target, prop: string) {
        return (...args: unknown[]) => {
          calls.push({ method: prop, args });
        };
      },
    },
  ) as unknown as p5;
  return { p, calls };
}

const minimalConfig: RenderConfig = {
  background: [10, 10, 12],
  grid: 'none',
  curveStyle: {
    ghost: { stroke: { r: 200, g: 180, b: 120, a: 60 }, weight: 1 },
    reveal: { layers: [{ stroke: { r: 212, g: 184, b: 122, a: 255 }, weight: 1.6 }] },
  },
  revealMode: 'byArcLength',
};

function snapAt(size: number) {
  return {
    width: size,
    height: size,
    params: {},
    revealProgress: 1,
    points: [
      { x: -STAGE_HALF, y: 0, theta: 0, arcLength: 0 },
      { x: STAGE_HALF, y: 0, theta: Math.PI, arcLength: BASE_CANVAS_SIZE },
    ],
  };
}

describe('renderFrame 畫布縮放', () => {
  it('畫布小於設計尺寸時以 min(w,h)/BASE_CANVAS_SIZE 縮放曲線', () => {
    const { p, calls } = recordingP5();
    renderFrame(p, snapAt(375), minimalConfig);
    const scaleCalls = calls.filter((c) => c.method === 'scale');
    expect(scaleCalls).toHaveLength(1);
    expect(scaleCalls[0].args[0]).toBeCloseTo(375 / BASE_CANVAS_SIZE, 5);
  });

  it('畫布達設計尺寸時不縮放', () => {
    const { p, calls } = recordingP5();
    renderFrame(p, snapAt(BASE_CANVAS_SIZE), minimalConfig);
    expect(calls.filter((c) => c.method === 'scale')).toHaveLength(0);
  });
});
