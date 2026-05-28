import type { CurvePoint, ParamValues, ThumbnailSpec } from '../../types';

export const BINOMIAL_VIEW = {
  width: 900,
  height: 900,
};

export const MODE_SQUARE = 0;
export const MODE_CUBE = 1;

export type BinomialMode = 'square' | 'cube';

export function normalizeLen(value: number | undefined): number {
  const rounded = Math.round(value ?? 4);
  return Math.max(1, Math.min(10, rounded));
}

export function modeFromValue(value: number | undefined): BinomialMode {
  return Math.round(value ?? MODE_SQUARE) === MODE_CUBE ? 'cube' : 'square';
}

export function project3(
  origin: { x: number; y: number },
  ex: { x: number; y: number },
  ey: { x: number; y: number },
  ez: { x: number; y: number },
  x: number,
  y: number,
  z: number,
): { x: number; y: number } {
  return {
    x: origin.x + ex.x * x + ey.x * y + ez.x * z,
    y: origin.y + ex.y * x + ey.y * y + ez.y * z,
  };
}

export function buildBinomialThumbnail(params: ParamValues): ThumbnailSpec {
  const a = normalizeLen(params.a);
  const b = normalizeLen(params.b);
  const total = a + b;
  const size = 430;
  const unit = size / total;
  const x0 = BINOMIAL_VIEW.width / 2 - size / 2;
  const y0 = 180;
  const aw = a * unit;
  const bw = b * unit;

  const path: CurvePoint[] = [
    { x: x0, y: y0, theta: 0, arcLength: 0 },
    { x: x0 + size, y: y0, theta: 1, arcLength: 1 },
    { x: x0 + size, y: y0 + size, theta: 2, arcLength: 2 },
    { x: x0, y: y0 + size, theta: 3, arcLength: 3 },
    { x: x0, y: y0, theta: 4, arcLength: 4 },
    { x: Number.NaN, y: Number.NaN, theta: 5, arcLength: 5 },
    { x: x0 + aw, y: y0, theta: 6, arcLength: 6 },
    { x: x0 + aw, y: y0 + size, theta: 7, arcLength: 7 },
    { x: Number.NaN, y: Number.NaN, theta: 8, arcLength: 8 },
    { x: x0, y: y0 + aw, theta: 9, arcLength: 9 },
    { x: x0 + size, y: y0 + aw, theta: 10, arcLength: 10 },
    { x: Number.NaN, y: Number.NaN, theta: 11, arcLength: 11 },
    { x: x0 + aw, y: y0 + aw, theta: 12, arcLength: 12 },
    { x: x0 + aw + bw, y: y0 + aw + bw, theta: 13, arcLength: 13 },
  ];

  return {
    coordinateSystem: 'canvas',
    paths: [{ points: path, opacity: 0.82, strokeWidth: 0.8 }],
  };
}
