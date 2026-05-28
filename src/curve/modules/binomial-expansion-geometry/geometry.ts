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
  const a = Math.max(2, normalizeLen(params.a));
  const b = Math.max(2, normalizeLen(params.b));
  const total = a + b;
  const size = 430;
  const unit = size / total;
  const x0 = BINOMIAL_VIEW.width / 2 - size / 2;
  const y0 = 180;
  const aw = a * unit;
  const bw = b * unit;

  const outlineAndSplit: CurvePoint[] = [
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
  const blocks: CurvePoint[] = [
    { x: x0, y: y0, theta: 20, arcLength: 20 },
    { x: x0 + aw, y: y0, theta: 21, arcLength: 21 },
    { x: x0 + aw, y: y0 + aw, theta: 22, arcLength: 22 },
    { x: x0, y: y0 + aw, theta: 23, arcLength: 23 },
    { x: x0, y: y0, theta: 24, arcLength: 24 },
    { x: Number.NaN, y: Number.NaN, theta: 25, arcLength: 25 },
    { x: x0 + aw, y: y0, theta: 26, arcLength: 26 },
    { x: x0 + size, y: y0, theta: 27, arcLength: 27 },
    { x: x0 + size, y: y0 + aw, theta: 28, arcLength: 28 },
    { x: x0 + aw, y: y0 + aw, theta: 29, arcLength: 29 },
    { x: x0 + aw, y: y0, theta: 30, arcLength: 30 },
    { x: Number.NaN, y: Number.NaN, theta: 31, arcLength: 31 },
    { x: x0, y: y0 + aw, theta: 32, arcLength: 32 },
    { x: x0 + aw, y: y0 + aw, theta: 33, arcLength: 33 },
    { x: x0 + aw, y: y0 + size, theta: 34, arcLength: 34 },
    { x: x0, y: y0 + size, theta: 35, arcLength: 35 },
    { x: x0, y: y0 + aw, theta: 36, arcLength: 36 },
    { x: Number.NaN, y: Number.NaN, theta: 37, arcLength: 37 },
    { x: x0 + aw, y: y0 + aw, theta: 38, arcLength: 38 },
    { x: x0 + size, y: y0 + aw, theta: 39, arcLength: 39 },
    { x: x0 + size, y: y0 + size, theta: 40, arcLength: 40 },
    { x: x0 + aw, y: y0 + size, theta: 41, arcLength: 41 },
    { x: x0 + aw, y: y0 + aw, theta: 42, arcLength: 42 },
  ];

  return {
    coordinateSystem: 'canvas',
    paths: [
      { points: blocks, opacity: 0.4, strokeWidth: 0.85 },
      { points: outlineAndSplit, opacity: 0.9, strokeWidth: 1.02 },
    ],
  };
}
