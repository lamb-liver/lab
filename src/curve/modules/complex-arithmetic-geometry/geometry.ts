import { TWO_PI } from '../../constants';
import type { CurvePoint, ThumbnailSpec } from '../../types';

export type Vec2 = { x: number; y: number };

export function polar(r: number, theta: number): Vec2 {
  return { x: r * Math.cos(theta), y: r * Math.sin(theta) };
}

export function add(a: Vec2, b: Vec2): Vec2 {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function multiply(a: Vec2, b: Vec2): Vec2 {
  return {
    x: a.x * b.x - a.y * b.y,
    y: a.x * b.y + a.y * b.x,
  };
}

export function computeViewportRadius(r1: number, r2: number): number {
  return Math.max(r1 + r2, r1 * r2, r1, r2, 1);
}

export function sampleComplexArithmeticGeometryThumbnail(
  r1: number,
  theta1: number,
  r2: number,
  theta2: number,
  scale = 70,
): ThumbnailSpec {
  const z1 = polar(r1, theta1);
  const z2 = polar(r2, theta2);
  const sum = add(z1, z2);
  const prod = multiply(z1, z2);

  const toPoint = (v: Vec2, arc: number): CurvePoint => ({
    x: v.x * scale,
    y: -v.y * scale,
    theta: arc,
    arcLength: Math.hypot(v.x, v.y) * scale,
  });

  const unit: CurvePoint[] = [];
  const step = TWO_PI / 48;
  for (let t = 0; t <= TWO_PI + step; t += step) {
    unit.push({
      x: Math.cos(t) * scale,
      y: -Math.sin(t) * scale,
      theta: t,
      arcLength: t * scale,
    });
  }

  return {
    paths: [
      { points: unit, opacity: 0.35, strokeWidth: 0.8, excludeFromBbox: true },
      { points: [toPoint({ x: 0, y: 0 }, 0), toPoint(z1, 1)], strokeWidth: 1.2 },
      { points: [toPoint({ x: 0, y: 0 }, 0), toPoint(z2, 1)], strokeWidth: 1.2 },
      { points: [toPoint({ x: 0, y: 0 }, 0), toPoint(sum, 1)], strokeWidth: 1.4 },
      { points: [toPoint({ x: 0, y: 0 }, 0), toPoint(prod, 1)], strokeWidth: 1.4 },
    ],
  };
}
