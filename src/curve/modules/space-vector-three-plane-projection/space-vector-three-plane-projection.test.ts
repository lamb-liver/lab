import { describe, expect, it } from 'vitest';
import { BASE_CANVAS_SIZE, BASE_POINT_STEP } from '../../constants';
import { lengthVec3 } from '../../projection3d';
import { spaceVectorThreePlaneProjectionModule } from './index';
import {
  AXIS_LIMIT,
  DEFAULT_SPACE_VECTOR_PROJECTION_PARAMS,
  projectionsOf,
  vectorFromParams,
  visibleProjections,
  type SpaceVectorProjectionParams,
} from './geometry';

function withParams(
  patch: Partial<SpaceVectorProjectionParams>,
): SpaceVectorProjectionParams {
  return { ...DEFAULT_SPACE_VECTOR_PROJECTION_PARAMS, ...patch };
}

describe('space-vector-three-plane-projection module', () => {
  it('預設參數採樣非空且落在設計舞台內', () => {
    const out = spaceVectorThreePlaneProjectionModule.sample(
      spaceVectorThreePlaneProjectionModule.defaultParams,
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
    const spec = spaceVectorThreePlaneProjectionModule.sample(
      withParams({
        vx: AXIS_LIMIT,
        vy: AXIS_LIMIT,
        vz: AXIS_LIMIT,
        yaw: 180,
        pitch: -80,
      }) as never,
      { step: BASE_POINT_STEP, purpose: 'thumbnail' },
    );
    const points = Array.isArray(spec) ? spec : spec.paths.flatMap((path) => path.points);
    for (const point of points) {
      expect(Math.abs(point.x)).toBeLessThanOrEqual(BASE_CANVAS_SIZE / 2);
      expect(Math.abs(point.y)).toBeLessThanOrEqual(BASE_CANVAS_SIZE / 2);
    }
  });

  it('投影就是把不屬於該平面的分量設為零', () => {
    const v = vectorFromParams(withParams({ vx: 2.1, vy: -1.4, vz: 0.8 }));
    const [xy, xz, yz] = projectionsOf(v);

    expect(xy!.vector).toEqual({ x: 2.1, y: -1.4, z: 0 });
    expect(xz!.vector).toEqual({ x: 2.1, y: 0, z: 0.8 });
    expect(yz!.vector).toEqual({ x: 0, y: -1.4, z: 0.8 });
  });

  it('三個投影兩兩共用一個分量', () => {
    const v = vectorFromParams(withParams({ vx: 1.3, vy: 2.2, vz: -0.7 }));
    const [xy, xz, yz] = projectionsOf(v);

    expect(xy!.vector.x).toBeCloseTo(xz!.vector.x, 9); // 共用 x
    expect(xy!.vector.y).toBeCloseTo(yz!.vector.y, 9); // 共用 y
    expect(xz!.vector.z).toBeCloseTo(yz!.vector.z, 9); // 共用 z
  });

  it('每個投影長度不超過 ‖v‖，且三者平方和等於 2‖v‖²', () => {
    const v = vectorFromParams(withParams({ vx: 2.1, vy: 1.5, vz: 1.9 }));
    const norm = lengthVec3(v);
    const projections = projectionsOf(v);

    for (const item of projections) {
      expect(item.length).toBeLessThanOrEqual(norm + 1e-9);
    }

    // 每個分量在三個影子裡恰好各出現兩次，所以平方和是 2‖v‖²
    const sumOfSquares = projections.reduce((acc, item) => acc + item.length ** 2, 0);
    expect(sumOfSquares).toBeCloseTo(2 * norm ** 2, 9);
  });

  it('落在坐標平面上的向量，該平面的影子等於自己', () => {
    const v = vectorFromParams(withParams({ vx: 1.8, vy: -2.4, vz: 0 }));
    const [xy] = projectionsOf(v);
    expect(xy!.vector).toEqual(v);
    expect(xy!.length).toBeCloseTo(lengthVec3(v), 9);
  });

  it('聚焦單一平面時只留下該投影', () => {
    const v = vectorFromParams(DEFAULT_SPACE_VECTOR_PROJECTION_PARAMS);
    expect(visibleProjections(v, 'all')).toHaveLength(3);
    for (const plane of ['xy', 'xz', 'yz'] as const) {
      const visible = visibleProjections(v, plane);
      expect(visible).toHaveLength(1);
      expect(visible[0]!.plane).toBe(plane);
    }
  });
});
