import { describe, expect, it } from 'vitest';
import { BASE_CANVAS_SIZE, BASE_POINT_STEP } from '../../constants';
import { crossVec3, dotVec3, lengthVec3, vec3 } from '../../projection3d';
import { crossProductGeometryModule } from './index';
import {
  A_LENGTH,
  DEFAULT_CROSS_PRODUCT_PARAMS,
  computeCrossProductMetrics,
  parallelogramVertices,
  vectorsFromParams,
  type CrossProductGeometryParams,
} from './geometry';

function withParams(patch: Partial<CrossProductGeometryParams>): CrossProductGeometryParams {
  return { ...DEFAULT_CROSS_PRODUCT_PARAMS, ...patch };
}

describe('cross-product-geometry module', () => {
  it('預設參數採樣非空且落在設計舞台內', () => {
    const out = crossProductGeometryModule.sample(crossProductGeometryModule.defaultParams, {
      step: crossProductGeometryModule.sampleStep ?? BASE_POINT_STEP,
      purpose: 'default',
    });
    const points = Array.isArray(out) ? out : out.paths.flatMap((path) => path.points);
    expect(points.length).toBeGreaterThan(0);
    for (const point of points) {
      expect(Math.abs(point.x)).toBeLessThanOrEqual(BASE_CANVAS_SIZE / 2);
      expect(Math.abs(point.y)).toBeLessThanOrEqual(BASE_CANVAS_SIZE / 2);
    }
  });

  it('縮圖在極端參數下仍不超出舞台', () => {
    const spec = crossProductGeometryModule.sample(
      withParams({ lenB: 4, theta: 0, phi: 90, yaw: 180, pitch: -80 }) as never,
      { step: BASE_POINT_STEP, purpose: 'thumbnail' },
    );
    const points = Array.isArray(spec) ? spec : spec.paths.flatMap((path) => path.points);
    for (const point of points) {
      expect(Math.abs(point.x)).toBeLessThanOrEqual(BASE_CANVAS_SIZE / 2);
      expect(Math.abs(point.y)).toBeLessThanOrEqual(BASE_CANVAS_SIZE / 2);
    }
  });

  it('‖a × b‖ = |a| |b| sinθ', () => {
    for (const theta of [15, 45, 90, 137]) {
      for (const lenB of [0.8, 2.4, 4]) {
        const metrics = computeCrossProductMetrics(withParams({ theta, lenB }));
        const expected = A_LENGTH * lenB * Math.sin((theta * Math.PI) / 180);
        expect(metrics.area).toBeCloseTo(expected, 6);
      }
    }
  });

  it('θ 就是 a 與 b 的夾角，與 φ 無關', () => {
    for (const phi of [-90, -30, 0, 45, 90]) {
      const params = withParams({ theta: 62, phi });
      const { a, b } = vectorsFromParams(params);
      const cosAngle = dotVec3(a, b) / (lengthVec3(a) * lengthVec3(b));
      expect(Math.acos(cosAngle) * (180 / Math.PI)).toBeCloseTo(62, 6);
      expect(lengthVec3(b)).toBeCloseTo(params.lenB, 6);
    }
  });

  it('n 同時垂直於 a 與 b', () => {
    const metrics = computeCrossProductMetrics(withParams({ theta: 73, phi: 41 }));
    expect(dotVec3(metrics.n, metrics.a)).toBeCloseTo(0, 6);
    expect(dotVec3(metrics.n, metrics.b)).toBeCloseTo(0, 6);
  });

  it('平行或反向時退化：面積趨近 0', () => {
    for (const theta of [0, 180]) {
      const metrics = computeCrossProductMetrics(withParams({ theta }));
      expect(metrics.area).toBeCloseTo(0, 6);
      expect(metrics.isDegenerate).toBe(true);
    }
    expect(computeCrossProductMetrics(withParams({ theta: 90 })).isDegenerate).toBe(false);
  });

  it('交換順序時法向反轉（右手定則）', () => {
    const { a, b } = vectorsFromParams(withParams({ theta: 55, phi: 20 }));
    const ab = crossVec3(a, b);
    const ba = crossVec3(b, a);
    expect(ba.x).toBeCloseTo(-ab.x, 9);
    expect(ba.y).toBeCloseTo(-ab.y, 9);
    expect(ba.z).toBeCloseTo(-ab.z, 9);
  });

  it('平行四邊形的對邊互相平行且等長', () => {
    const { a, b } = vectorsFromParams(withParams({ theta: 48, phi: 12 }));
    const [origin, atip, far, btip] = parallelogramVertices(a, b) as [
      typeof a, typeof a, typeof a, typeof a,
    ];
    // origin→a 應與 b→(a+b) 相同
    expect(atip.x - origin.x).toBeCloseTo(far.x - btip.x, 9);
    expect(atip.y - origin.y).toBeCloseTo(far.y - btip.y, 9);
    expect(atip.z - origin.z).toBeCloseTo(far.z - btip.z, 9);
  });

  it('右手定則基底：e₁ × e₂ = e₃', () => {
    const result = crossVec3(vec3(1, 0, 0), vec3(0, 1, 0));
    expect(result.x).toBeCloseTo(0, 9);
    expect(result.y).toBeCloseTo(0, 9);
    expect(result.z).toBeCloseTo(1, 9);
  });
});
