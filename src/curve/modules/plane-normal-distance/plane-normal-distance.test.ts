import { describe, expect, it } from 'vitest';
import { BASE_CANVAS_SIZE, BASE_POINT_STEP } from '../../constants';
import { dotVec3, lengthVec3, subVec3 } from '../../projection3d';
import { planeNormalDistanceModule } from './index';
import {
  DEFAULT_PLANE_NORMAL_DISTANCE_PARAMS,
  PLANE_HALF,
  computePlaneNormalDistanceMetrics,
  directionFromAngles,
  distanceFromGeneralForm,
  planeBasis,
  planeQuad,
  type PlaneNormalDistanceParams,
} from './geometry';

function withParams(
  patch: Partial<PlaneNormalDistanceParams>,
): PlaneNormalDistanceParams {
  return { ...DEFAULT_PLANE_NORMAL_DISTANCE_PARAMS, ...patch };
}

describe('plane-normal-distance module', () => {
  it('預設參數採樣非空且落在設計舞台內', () => {
    const out = planeNormalDistanceModule.sample(
      planeNormalDistanceModule.defaultParams,
      { step: BASE_POINT_STEP, purpose: 'default' },
    );
    const points = Array.isArray(out) ? out : out.paths.flatMap((path) => path.points);
    expect(points.length).toBeGreaterThan(0);
    for (const point of points) {
      expect(Math.abs(point.x)).toBeLessThanOrEqual(BASE_CANVAS_SIZE / 2);
      expect(Math.abs(point.y)).toBeLessThanOrEqual(BASE_CANVAS_SIZE / 2);
    }
  });

  it('縮圖在極端參數下仍不超出舞台', () => {
    for (const patch of [
      { planeTilt: 90, planeAzimuth: 180, h: 2, pointX: 3, pointZ: 3, scale: 3 },
      { planeTilt: -90, h: -2, pointX: -3, pointZ: -3, scale: -3, yaw: 180, pitch: -80 },
    ]) {
      const spec = planeNormalDistanceModule.sample(withParams(patch) as never, {
        step: BASE_POINT_STEP,
        purpose: 'thumbnail',
      });
      const points = Array.isArray(spec) ? spec : spec.paths.flatMap((path) => path.points);
      for (const point of points) {
        expect(Math.abs(point.x)).toBeLessThanOrEqual(BASE_CANVAS_SIZE / 2);
        expect(Math.abs(point.y)).toBeLessThanOrEqual(BASE_CANVAS_SIZE / 2);
      }
    }
  });

  it('垂足落在平面上', () => {
    const params = withParams({});
    const metrics = computePlaneNormalDistanceMetrics(params);
    expect(dotVec3(metrics.unitNormal, metrics.foot)).toBeCloseTo(params.h, 9);
  });

  it('垂足是平面上離 P₁ 最近的點', () => {
    const metrics = computePlaneNormalDistanceMetrics(withParams({}));
    expect(lengthVec3(subVec3(metrics.point, metrics.foot))).toBeCloseTo(metrics.distance, 9);

    // 平面上任何其他點都不會更近
    const { u, v } = planeBasis(metrics.unitNormal);
    for (const [su, sv] of [[0.4, 0], [0, -0.7], [1.1, 0.9]] as const) {
      const other = {
        x: metrics.foot.x + u.x * su + v.x * sv,
        y: metrics.foot.y + u.y * su + v.y * sv,
        z: metrics.foot.z + u.z * su + v.z * sv,
      };
      expect(lengthVec3(subVec3(metrics.point, other))).toBeGreaterThan(metrics.distance);
    }
  });

  it('P₁ 到垂足的方向與法向平行', () => {
    const metrics = computePlaneNormalDistanceMetrics(withParams({ pointX: 1.6, pointZ: -1.1 }));
    const gap = subVec3(metrics.point, metrics.foot);
    const cosine =
      dotVec3(gap, metrics.unitNormal) / (lengthVec3(gap) * lengthVec3(metrics.unitNormal));
    expect(Math.abs(cosine)).toBeCloseTo(1, 9);
  });

  it('(a, b, c, h) 同乘非零常數不改變距離', () => {
    const base = computePlaneNormalDistanceMetrics(withParams({ scale: 1 }));
    for (const scale of [-4, -0.5, 0.25, 1, 3.7]) {
      const metrics = computePlaneNormalDistanceMetrics(withParams({ scale }));
      const viaGeneralForm = distanceFromGeneralForm(
        metrics.coefficients,
        metrics.constant,
        metrics.point,
      );
      expect(viaGeneralForm).toBeCloseTo(base.distance, 9);
      // 係數本身確實跟著尺度改變
      expect(lengthVec3(metrics.coefficients)).toBeCloseTo(Math.abs(scale), 9);
    }
  });

  it('帶號距離的正負代表測試點落在法向的哪一側', () => {
    const above = computePlaneNormalDistanceMetrics(
      withParams({ planeTilt: 90, planeAzimuth: 0, h: 0, pointX: 0, pointZ: 1.5 }),
    );
    const below = computePlaneNormalDistanceMetrics(
      withParams({ planeTilt: 90, planeAzimuth: 0, h: 0, pointX: 0, pointZ: -1.5 }),
    );
    expect(above.signedDistance).toBeCloseTo(1.5, 9);
    expect(below.signedDistance).toBeCloseTo(-1.5, 9);
    expect(above.distance).toBeCloseTo(below.distance, 9);
  });

  it('點落在平面上時距離為零且垂足等於自己', () => {
    const metrics = computePlaneNormalDistanceMetrics(
      withParams({ planeTilt: 90, planeAzimuth: 0, h: 0, pointX: 1.4, pointZ: 0 }),
    );
    expect(metrics.distance).toBeCloseTo(0, 9);
    expect(metrics.foot.x).toBeCloseTo(metrics.point.x, 9);
    expect(metrics.foot.z).toBeCloseTo(metrics.point.z, 9);
  });

  it('平面方塊的四個角都滿足 n̂·r = h', () => {
    const unitNormal = directionFromAngles(53, 21);
    const h = 0.7;
    for (const corner of planeQuad(unitNormal, h, PLANE_HALF)) {
      expect(dotVec3(unitNormal, corner)).toBeCloseTo(h, 9);
    }
  });
});
