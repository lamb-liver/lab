import type { CurvePoint, ThumbnailSpec } from '../../types';
import { buildPointCloudStroke } from '../../thumbnailPointCloud';
import { JULIA_CFG } from './config';
import { juliaSmooth } from './math';

export function sampleJuliaSetThumbnail(
  cx: number,
  cy: number,
  maxIter: number = JULIA_CFG.MAX_ITER,
  zoom = JULIA_CFG.ZOOM,
  grid = 168,
): ThumbnailSpec {
  const points: CurvePoint[] = [];
  const scale = 180 / zoom;

  for (let gy = 0; gy < grid; gy++) {
    const zy = -(gy / grid - 0.5) * zoom;
    for (let gx = 0; gx < grid; gx++) {
      const zx = (gx / grid - 0.5) * zoom;
      const t = juliaSmooth(zx, zy, cx, cy, maxIter);
      if (t >= maxIter - 0.5 || t < maxIter - 24) continue;
      points.push({
        x: zx * scale,
        y: -zy * scale,
        theta: t,
        arcLength: t,
      });
    }
  }

  return {
    paths: [{ points: buildPointCloudStroke(points, { epsilon: 0.55 }), strokeWidth: 0.95 }],
  };
}
