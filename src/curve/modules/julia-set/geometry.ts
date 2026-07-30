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

  // Keep the filled interior (the never-escaping body) plus a wide boundary band,
  // so the fractal reads as a coherent Julia set instead of the thin boundary shell
  // that renders as scattered dust at thumbnail scale. The interior is lightly
  // subsampled to hold the point count down and keep a little internal texture.
  const boundaryBand = 42;
  let interiorIndex = 0;

  for (let gy = 0; gy < grid; gy++) {
    const zy = -(gy / grid - 0.5) * zoom;
    for (let gx = 0; gx < grid; gx++) {
      const zx = (gx / grid - 0.5) * zoom;
      const t = juliaSmooth(zx, zy, cx, cy, maxIter);
      const isInterior = t >= maxIter - 0.5;
      if (!isInterior && t < maxIter - boundaryBand) continue;
      if (isInterior && (interiorIndex++ & 1)) continue;
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
