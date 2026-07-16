import { describe, expect, it } from 'vitest';
import { BASE_CANVAS_SIZE, BASE_POINT_STEP } from '../../constants';
import { spaceVectorThreePlaneProjectionModule } from './index';

// TODO: 替換佔位幾何後，補上此作品核心數學性質的斷言。
describe('space-vector-three-plane-projection module', () => {
  it('預設參數採樣非空且落在設計舞台內', () => {
    const out = spaceVectorThreePlaneProjectionModule.sample(spaceVectorThreePlaneProjectionModule.defaultParams, {
      step: spaceVectorThreePlaneProjectionModule.sampleStep ?? BASE_POINT_STEP,
      purpose: 'default',
    });
    const points = Array.isArray(out) ? out : out.paths.flatMap((path) => path.points);
    expect(points.length).toBeGreaterThan(0);
    for (const point of points) {
      expect(Math.abs(point.x)).toBeLessThanOrEqual(BASE_CANVAS_SIZE / 2);
      expect(Math.abs(point.y)).toBeLessThanOrEqual(BASE_CANVAS_SIZE / 2);
    }
  });
});
