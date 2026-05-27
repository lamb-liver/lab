import { TWO_PI } from '../../constants';
import type { CurvePoint, ThumbnailSpec } from '../../types';

const SAFE_RATIO = 0.72;

export function computePolarScale(
  width: number,
  height: number,
  r: number,
): number {
  return (Math.min(width, height) * SAFE_RATIO) / (Math.max(r, 1) * 2);
}

export function sampleComplexPolarFormThumbnail(
  r: number,
  theta: number,
): ThumbnailSpec {
  const scale = computePolarScale(600, 600, r);
  const zx = r * Math.cos(theta);
  const zy = r * Math.sin(theta);
  const sx = zx * scale;
  const sy = -zy * scale;

  const unit: CurvePoint[] = [];
  const step = TWO_PI / 48;
  for (let a = 0; a <= TWO_PI + step; a += step) {
    unit.push({
      x: Math.cos(a) * scale,
      y: -Math.sin(a) * scale,
      theta: a,
      arcLength: a * scale,
    });
  }

  return {
    paths: [
      { points: unit, opacity: 0.35, strokeWidth: 0.8, excludeFromBbox: true },
      {
        points: [
          { x: 0, y: 0, theta: 0, arcLength: 0 },
          { x: sx, y: sy, theta: 1, arcLength: Math.hypot(sx, sy) },
        ],
        strokeWidth: 1.4,
      },
    ],
  };
}
