import { describe, expect, it } from 'vitest';
import { BASE_CANVAS_SIZE, BASE_POINT_STEP } from '../../constants';
import { dotVec3, lengthVec3 } from '../../projection3d';
import { linePlaneIntersectionModule } from './index';
import {
  DEFAULT_LINE_PLANE_PARAMS,
  computeLinePlaneMetrics,
  directionFromAngles,
  planeAnchor,
  planeBasis,
  planeQuad,
  pointOnLine,
  type LinePlaneParams,
} from './geometry';

function withParams(patch: Partial<LinePlaneParams>): LinePlaneParams {
  return { ...DEFAULT_LINE_PLANE_PARAMS, ...patch };
}

describe('line-plane-intersection module', () => {
  it('預設參數採樣非空且落在設計舞台內', () => {
    const out = linePlaneIntersectionModule.sample(
      linePlaneIntersectionModule.defaultParams,
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
      { planeTilt: 90, planeAzimuth: 180, h: 2, lineTilt: 90, lineAzimuth: 180, originZ: 2 },
      { planeTilt: -90, planeAzimuth: -180, h: -2, lineTilt: -90, originZ: -2, yaw: 180, pitch: -80 },
    ]) {
      const spec = linePlaneIntersectionModule.sample(withParams(patch) as never, {
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

  it('角度參數化出來的方向恆為單位向量', () => {
    for (const tilt of [-90, -33, 0, 47, 90]) {
      for (const azimuth of [-180, -60, 0, 108, 180]) {
        expect(lengthVec3(directionFromAngles(tilt, azimuth))).toBeCloseTo(1, 9);
      }
    }
  });

  it('n·d ≠ 0 時交點同時滿足直線與平面方程', () => {
    const params = withParams({});
    const metrics = computeLinePlaneMetrics(params);

    expect(metrics.state).toBe('point');
    expect(metrics.point).not.toBeNull();

    // 落在平面上：n·r = h
    expect(dotVec3(metrics.n, metrics.point!)).toBeCloseTo(params.h, 9);
    // 落在直線上：r = r₀ + t·d
    const fromLine = pointOnLine(metrics, metrics.t!);
    expect(fromLine.x).toBeCloseTo(metrics.point!.x, 9);
    expect(fromLine.y).toBeCloseTo(metrics.point!.y, 9);
    expect(fromLine.z).toBeCloseTo(metrics.point!.z, 9);
  });

  it('t 的正負代表交點落在起點的哪一側', () => {
    const metrics = computeLinePlaneMetrics(withParams({}));
    const expectedSign = -metrics.offset / metrics.nDotD > 0 ? 1 : -1;
    expect(Math.sign(metrics.t!)).toBe(expectedSign);
  });

  it('n·d = 0 且起點不在平面上：平行且不相交', () => {
    // 平面法向朝 +z，直線水平 → n·d = 0；h 拉開讓起點不在平面上
    const metrics = computeLinePlaneMetrics(
      withParams({ planeTilt: 90, planeAzimuth: 0, lineTilt: 0, lineAzimuth: 0, originZ: 0, h: 1.2 }),
    );
    expect(Math.abs(metrics.nDotD)).toBeLessThan(1e-9);
    expect(metrics.state).toBe('parallel');
    expect(metrics.t).toBeNull();
    expect(metrics.point).toBeNull();
  });

  it('n·d = 0 且起點在平面上：整條直線落在平面上', () => {
    const metrics = computeLinePlaneMetrics(
      withParams({ planeTilt: 90, planeAzimuth: 0, lineTilt: 0, lineAzimuth: 0, originZ: 0, h: 0 }),
    );
    expect(metrics.state).toBe('contained');
    expect(metrics.t).toBeNull();

    // 直線上任一點都滿足 n·r = h
    for (const t of [-2, 0, 1.5]) {
      expect(dotVec3(metrics.n, pointOnLine(metrics, t))).toBeCloseTo(0, 9);
    }
  });

  it('平面基底彼此正交且垂直於 n', () => {
    for (const tilt of [0, 45, 90, -70]) {
      const n = directionFromAngles(tilt, 37);
      const { u, v } = planeBasis(n);
      expect(dotVec3(u, n)).toBeCloseTo(0, 9);
      expect(dotVec3(v, n)).toBeCloseTo(0, 9);
      expect(dotVec3(u, v)).toBeCloseTo(0, 9);
      expect(lengthVec3(u)).toBeCloseTo(1, 9);
      expect(lengthVec3(v)).toBeCloseTo(1, 9);
    }
  });

  it('平面方塊的四個角都滿足 n·r = h', () => {
    const n = directionFromAngles(52, 19);
    const h = 0.8;
    expect(dotVec3(n, planeAnchor(n, h))).toBeCloseTo(h, 9);
    for (const corner of planeQuad(n, h, 2.2)) {
      expect(dotVec3(n, corner)).toBeCloseTo(h, 9);
    }
  });
});
