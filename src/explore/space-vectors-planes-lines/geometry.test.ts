import { describe, expect, it } from 'vitest';
import { crossVec3, dotVec3, lengthVec3, subVec3 } from '../../curve/projection3d';
import {
  DEFAULT_SPACE_VECTORS_PARAMS,
  PLANE_HALF,
  computeSpaceVectorsMetrics,
  directionFromAngles,
  footOnPlane,
  planeQuad,
  spanningVectors,
  type SpaceVectorsParams,
} from './geometry';

function withParams(patch: Partial<SpaceVectorsParams>): SpaceVectorsParams {
  return { ...DEFAULT_SPACE_VECTORS_PARAMS, ...patch };
}

describe('space-vectors-planes-lines explore geometry', () => {
  it('三個影子各自只把一個分量設為零', () => {
    const metrics = computeSpaceVectorsMetrics(withParams({ vx: 1.4, vy: -0.9, vz: 2.2 }));
    const [xy, xz, yz] = metrics.shadows;

    expect(xy!.vector).toEqual({ x: 1.4, y: -0.9, z: 0 });
    expect(xz!.vector).toEqual({ x: 1.4, y: 0, z: 2.2 });
    expect(yz!.vector).toEqual({ x: 0, y: -0.9, z: 2.2 });
  });

  it('a、b 張成的平面法向就是設定的法向', () => {
    for (const tilt of [0, 35, 64, 90]) {
      const unitNormal = directionFromAngles(tilt, 41);
      const { a, b } = spanningVectors(unitNormal);

      // a、b 都落在平面內
      expect(dotVec3(a, unitNormal)).toBeCloseTo(0, 9);
      expect(dotVec3(b, unitNormal)).toBeCloseTo(0, 9);
      // a × b 與法向平行
      const spanNormal = crossVec3(a, b);
      const cosine =
        dotVec3(spanNormal, unitNormal) / (lengthVec3(spanNormal) * lengthVec3(unitNormal));
      expect(Math.abs(cosine)).toBeCloseTo(1, 9);
    }
  });

  it('n̂·v 為零時 v 的方向落在平面內', () => {
    // 法向朝 +z，v 水平 → n̂·v = 0
    const metrics = computeSpaceVectorsMetrics(
      withParams({ planeTilt: 90, planeAzimuth: 0, vx: 2, vy: 1, vz: 0, h: 0.8 }),
    );
    expect(metrics.normalComponent).toBeCloseTo(0, 9);
    expect(metrics.state).toBe('parallel');
  });

  it('n̂·v 與 h 同時為零時 v 完全落在平面內', () => {
    const metrics = computeSpaceVectorsMetrics(
      withParams({ planeTilt: 90, planeAzimuth: 0, vx: 2, vy: 1, vz: 0, h: 0 }),
    );
    expect(metrics.state).toBe('inPlane');
    expect(metrics.signedDistance).toBeCloseTo(0, 9);
  });

  it('其餘情況為有距離，且帶號距離就是 n̂·v − h', () => {
    const params = withParams({ planeTilt: 90, planeAzimuth: 0, vx: 0, vy: 0, vz: 2, h: 0.5 });
    const metrics = computeSpaceVectorsMetrics(params);
    expect(metrics.state).toBe('apart');
    expect(metrics.signedDistance).toBeCloseTo(2 - 0.5, 9);
  });

  it('垂足落在平面上，且 v 到垂足的方向平行於法向', () => {
    const params = withParams({});
    const metrics = computeSpaceVectorsMetrics(params);
    const foot = footOnPlane(metrics);

    expect(dotVec3(metrics.unitNormal, foot)).toBeCloseTo(params.h, 9);

    const gap = subVec3(metrics.v, foot);
    if (lengthVec3(gap) > 1e-9) {
      const cosine = dotVec3(gap, metrics.unitNormal) / lengthVec3(gap);
      expect(Math.abs(cosine)).toBeCloseTo(1, 9);
    }
  });

  it('平面方塊的四個角都滿足 n̂·r = h', () => {
    const unitNormal = directionFromAngles(47, 23);
    const h = 0.65;
    for (const corner of planeQuad(unitNormal, h, PLANE_HALF)) {
      expect(dotVec3(unitNormal, corner)).toBeCloseTo(h, 9);
    }
  });

  it('切換讀法不會改變任何幾何量', () => {
    const base = computeSpaceVectorsMetrics(withParams({ mode: 'position' }));
    for (const mode of ['direction', 'relation'] as const) {
      const other = computeSpaceVectorsMetrics(withParams({ mode }));
      expect(other.v).toEqual(base.v);
      expect(other.unitNormal).toEqual(base.unitNormal);
      expect(other.signedDistance).toBeCloseTo(base.signedDistance, 12);
      expect(other.state).toBe(base.state);
    }
  });
});
