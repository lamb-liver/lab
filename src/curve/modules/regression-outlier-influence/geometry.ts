import type { CurvePoint, ThumbnailSpec } from '../../types';
import {
  SCATTER_PLOT,
  clamp,
  regression,
  worldToCanvas,
  type RegressionFit,
  type ScatterPoint,
} from '../scatter-correlation-regression/geometry';

export type InfluenceStats = {
  b0: number;
  b: number;
  deltaB: number;
  horizontalDistance: number;
  baseResidual: number;
};

export const BASE_POINTS: ScatterPoint[] = [
  { x: 1.05, y: 2.05 },
  { x: 1.72, y: 2.55 },
  { x: 2.36, y: 2.92 },
  { x: 3.02, y: 3.48 },
  { x: 3.74, y: 4.02 },
  { x: 4.38, y: 4.52 },
  { x: 5.04, y: 5.02 },
  { x: 5.76, y: 5.54 },
  { x: 6.42, y: 6.08 },
  { x: 7.12, y: 6.62 },
];

export const DEFAULT_OUTLIER: ScatterPoint = { x: 8.85, y: 2.15 };

export const OUTLIER_PRESETS = {
  highLeverage: { x: 9.35, y: 5.35 },
  highResidual: { x: 4.7, y: 8.9 },
  highInfluence: { x: 9.35, y: 1.65 },
  lowInfluence: { x: 4.7, y: 5.2 },
} satisfies Record<string, ScatterPoint>;

export function influenceStats(
  outlier: ScatterPoint,
  baseFit: RegressionFit | null = regression(BASE_POINTS),
  allFit: RegressionFit | null = regression([...BASE_POINTS, outlier]),
): InfluenceStats {
  if (!baseFit || !allFit) {
    return { b0: 0, b: 0, deltaB: 0, horizontalDistance: 0, baseResidual: 0 };
  }

  const yBase = baseFit.a + baseFit.b * outlier.x;
  return {
    b0: baseFit.b,
    b: allFit.b,
    deltaB: allFit.b - baseFit.b,
    horizontalDistance: Math.abs(outlier.x - baseFit.xbar),
    baseResidual: outlier.y - yBase,
  };
}

export function buildRegressionOutlierInfluenceThumbnail(): ThumbnailSpec {
  const baseFit = regression(BASE_POINTS);
  const allFit = regression([...BASE_POINTS, DEFAULT_OUTLIER]);
  const frame = [
    { x: SCATTER_PLOT.x, y: SCATTER_PLOT.y },
    { x: SCATTER_PLOT.x + SCATTER_PLOT.w, y: SCATTER_PLOT.y },
    { x: SCATTER_PLOT.x + SCATTER_PLOT.w, y: SCATTER_PLOT.y + SCATTER_PLOT.h },
    { x: SCATTER_PLOT.x, y: SCATTER_PLOT.y + SCATTER_PLOT.h },
  ].map(toCurvePoint);

  const baseLine = baseFit ? lineForFit(baseFit).map(toCurvePoint) : [];
  const allLine = allFit ? lineForFit(allFit).map(toCurvePoint) : [];
  const outlier = worldToCanvas(SCATTER_PLOT, DEFAULT_OUTLIER.x, DEFAULT_OUTLIER.y);

  return {
    coordinateSystem: 'canvas',
    paths: [
      { points: frame, closed: true, stroke: 'rgb(255, 255, 255)', strokeWidth: 0.8, opacity: 0.16 },
      { points: baseLine, stroke: 'rgb(255, 255, 255)', strokeWidth: 1.1, opacity: 0.45 },
      { points: allLine, stroke: 'rgb(212, 184, 122)', strokeWidth: 1.8, opacity: 0.95 },
    ],
    circles: [
      ...BASE_POINTS.map((point) => {
        const c = worldToCanvas(SCATTER_PLOT, point.x, point.y);
        return { x: c.x, y: c.y, r: 3.8, fill: 'rgb(255, 255, 255)', opacity: 0.55 };
      }),
      { x: outlier.x, y: outlier.y, r: 5.8, fill: 'rgb(231, 111, 81)', opacity: 0.95 },
    ],
  };
}

function lineForFit(fit: RegressionFit): ScatterPoint[] {
  return [
    worldToCanvas(SCATTER_PLOT, 0, clamp(fit.a, 0, 10)),
    worldToCanvas(SCATTER_PLOT, 10, clamp(fit.a + fit.b * 10, 0, 10)),
  ];
}

function toCurvePoint(point: ScatterPoint, i: number): CurvePoint {
  return { x: point.x, y: point.y, theta: i, arcLength: i };
}
