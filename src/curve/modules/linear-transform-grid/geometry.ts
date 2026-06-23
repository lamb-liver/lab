import type { CurvePoint } from '../../types';

export type Matrix2x2 = {
  m11: number;
  m12: number;
  m21: number;
  m22: number;
};

type LineSegment = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export const REGION_RATIO = 0.75;
export const GRID_DENSITY = 10;
const FIT_PADDING = 40;
export const GRID_SEGMENT_COUNT = (GRID_DENSITY + 1) * 2;

export function calculateMatrix(
  shearX: number,
  scaleY: number,
  time: number,
): Matrix2x2 {
  const wave = Math.sin(time) * 0.4;
  return {
    m11: 1 + wave * 0.2,
    m21: 0,
    m12: shearX,
    m22: scaleY,
  };
}

export function transformPoint(
  x: number,
  y: number,
  matrix: Matrix2x2,
): { x: number; y: number } {
  return {
    x: matrix.m11 * x + matrix.m12 * y,
    y: matrix.m21 * x + matrix.m22 * y,
  };
}

export function calculateTransformBounds(
  canvasWidth: number,
  canvasHeight: number,
  matrix: Matrix2x2,
): { scaleFactor: number } {
  const size = canvasWidth * REGION_RATIO;
  const halfSize = size / 2;

  const corners = [
    transformPoint(-halfSize, -halfSize, matrix),
    transformPoint(halfSize, -halfSize, matrix),
    transformPoint(halfSize, halfSize, matrix),
    transformPoint(-halfSize, halfSize, matrix),
  ];

  const xs = corners.map((p) => p.x);
  const ys = corners.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const transformedWidth = maxX - minX;
  const transformedHeight = maxY - minY;

  const scaleFactor = Math.min(
    (canvasWidth - FIT_PADDING * 2) / transformedWidth,
    (canvasHeight - FIT_PADDING * 2) / transformedHeight,
  );

  return { scaleFactor };
}

export function buildGridLines(
  canvasWidth: number,
  matrix: Matrix2x2,
  revealProgress: number,
): LineSegment[] {
  const lines: LineSegment[] = [];
  const size = canvasWidth * REGION_RATIO;
  const halfSize = size / 2;
  const spacing = size / GRID_DENSITY;
  const visibleExtent = halfSize * revealProgress;

  for (let i = -GRID_DENSITY / 2; i <= GRID_DENSITY / 2; i++) {
    const offset = i * spacing;

    const verticalStart = transformPoint(offset, -visibleExtent, matrix);
    const verticalEnd = transformPoint(offset, visibleExtent, matrix);
    lines.push({
      x1: verticalStart.x,
      y1: verticalStart.y,
      x2: verticalEnd.x,
      y2: verticalEnd.y,
    });

    const horizontalStart = transformPoint(-visibleExtent, offset, matrix);
    const horizontalEnd = transformPoint(visibleExtent, offset, matrix);
    lines.push({
      x1: horizontalStart.x,
      y1: horizontalStart.y,
      x2: horizontalEnd.x,
      y2: horizontalEnd.y,
    });
  }

  return lines;
}

/** 縮圖用：取變換後中央垂直線上的採樣點 */
export function sampleLinearTransformGridCurve(
  shearX: number,
  scaleY: number,
  canvasWidth: number,
  time: number,
  step: number,
  revealProgress = 1,
): CurvePoint[] {
  const matrix = calculateMatrix(shearX, scaleY, time);
  const { scaleFactor } = calculateTransformBounds(
    canvasWidth,
    canvasWidth,
    matrix,
  );

  const size = canvasWidth * REGION_RATIO;
  const halfSize = size / 2;
  const visibleExtent = halfSize * revealProgress;
  const points: CurvePoint[] = [];
  let arcLength = 0;

  for (let y = -visibleExtent; y <= visibleExtent; y += step) {
    const t = transformPoint(0, y, matrix);
    const x = t.x * scaleFactor;
    const py = t.y * scaleFactor;
    if (points.length > 0) {
      const prev = points[points.length - 1]!;
      arcLength += Math.hypot(x - prev.x, py - prev.y);
    }
    points.push({
      x,
      y: py,
      theta: y,
      arcLength,
    });
  }

  return points;
}
