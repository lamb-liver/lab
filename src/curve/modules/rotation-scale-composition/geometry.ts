import type { CurvePoint } from '../../types';

export type Point2 = { x: number; y: number };

export type LinearMatrix = {
  a: number;
  b: number;
  c: number;
  d: number;
};

export type LineSegment = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

const REGION_RATIO = 0.8;
export const STACK_LAYERS = 60;

export function buildBaseSquare(canvasWidth: number): Point2[] {
  const half = canvasWidth * REGION_RATIO * 0.5;
  return [
    { x: -half, y: -half },
    { x: half, y: -half },
    { x: half, y: half },
    { x: -half, y: half },
    { x: -half, y: -half },
  ];
}

export function buildRotationScaleMatrix(
  rotationStepDeg: number,
  scaleFactor: number,
  time: number,
): LinearMatrix {
  const breathAngle = (rotationStepDeg * Math.PI) / 180 + Math.sin(time) * 0.05;
  return {
    a: scaleFactor * Math.cos(breathAngle),
    b: -scaleFactor * Math.sin(breathAngle),
    c: scaleFactor * Math.sin(breathAngle),
    d: scaleFactor * Math.cos(breathAngle),
  };
}

export function applyMatrixTransform(
  points: ReadonlyArray<Point2>,
  matrix: LinearMatrix,
): Point2[] {
  return points.map((pt) => ({
    x: matrix.a * pt.x + matrix.b * pt.y,
    y: matrix.c * pt.x + matrix.d * pt.y,
  }));
}

function collectLayerSegments(
  outer: ReadonlyArray<Point2>,
  inner: ReadonlyArray<Point2>,
  segments: LineSegment[],
): void {
  for (let i = 0; i < outer.length - 1; i++) {
    const o = outer[i]!;
    const oNext = outer[i + 1]!;
    const inn = inner[i]!;

    segments.push({ x1: o.x, y1: o.y, x2: oNext.x, y2: oNext.y });
    segments.push({ x1: o.x, y1: o.y, x2: inn.x, y2: inn.y });
  }
}

export function buildStackedSegments(
  initialPattern: ReadonlyArray<Point2>,
  matrix: LinearMatrix,
  layerCount: number,
): LineSegment[] {
  const segments: LineSegment[] = [];
  let current = [...initialPattern];

  for (let layer = 0; layer < layerCount; layer++) {
    const next = applyMatrixTransform(current, matrix);
    collectLayerSegments(current, next, segments);
    current = next;
  }

  return segments;
}

export function sampleRotationScaleCompositionCurve(
  canvasWidth: number,
  rotationStepDeg: number,
  scaleFactor: number,
  time: number,
  step: number,
): CurvePoint[] {
  const base = buildBaseSquare(canvasWidth);
  const matrix = buildRotationScaleMatrix(rotationStepDeg, scaleFactor, time);
  let current = base;
  const layers = Math.min(8, STACK_LAYERS);

  for (let i = 0; i < layers; i++) {
    current = applyMatrixTransform(current, matrix);
  }

  const points: CurvePoint[] = [];
  let arcLength = 0;

  for (let i = 0; i < current.length; i += Math.max(1, Math.round(step))) {
    const pt = current[i]!;
    if (points.length > 0) {
      const prev = points[points.length - 1]!;
      arcLength += Math.hypot(pt.x - prev.x, pt.y - prev.y);
    }
    points.push({ x: pt.x, y: pt.y, theta: i, arcLength });
  }

  return points;
}
