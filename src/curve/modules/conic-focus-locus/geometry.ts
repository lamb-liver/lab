import type { CurvePoint, ThumbnailSpec } from '../../types';

export const CURVE_DENSITY = 0.02;
export const BASE_CANVAS = 600;

export type Point2 = { x: number; y: number };
export type LineSegment = { x1: number; y1: number; x2: number; y2: number };

export type EllipseParams = { a: number; b: number; c: number };

export function ellipseParameters(a: number, e: number): EllipseParams {
  const c = a * e;
  const b = Math.sqrt(Math.max(0, a * a - c * c));
  return { a, b, c };
}

export function focusPoints(c: number): [Point2, Point2] {
  return [
    { x: -c, y: 0 },
    { x: c, y: 0 },
  ];
}

export function orbitPoint(a: number, b: number, time: number): Point2 {
  return {
    x: a * Math.cos(time),
    y: b * Math.sin(time),
  };
}

export function buildEllipseCurve(
  a: number,
  b: number,
  step = CURVE_DENSITY,
): Point2[] {
  const points: Point2[] = [];
  const twoPi = Math.PI * 2;

  for (let angle = 0; angle <= twoPi; angle += step) {
    points.push({
      x: a * Math.cos(angle),
      y: b * Math.sin(angle),
    });
  }

  return points;
}

export function buildFocusConnections(
  focuses: ReadonlyArray<Point2>,
  orbit: Point2,
  revealProgress: number,
): LineSegment[] {
  return focuses.map((focus) => ({
    x1: focus.x,
    y1: focus.y,
    x2: focus.x + (orbit.x - focus.x) * revealProgress,
    y2: focus.y + (orbit.y - focus.y) * revealProgress,
  }));
}

export function sampleConicFocusLocusCurve(
  semiMajorAxis: number,
  eccentricity: number,
  step: number,
): CurvePoint[] {
  const { a, b } = ellipseParameters(semiMajorAxis, eccentricity);
  const raw = buildEllipseCurve(a, b, step);
  const points: CurvePoint[] = [];
  let cumulative = 0;
  let prevX = 0;
  let prevY = 0;

  for (let i = 0; i < raw.length; i++) {
    const { x, y } = raw[i]!;
    if (i > 0) {
      cumulative += Math.hypot(x - prevX, y - prevY);
    }
    points.push({ x, y, theta: i * step, arcLength: cumulative });
    prevX = x;
    prevY = y;
  }

  return points;
}

export function buildConicFocusLocusThumbnail(
  semiMajorAxis: number,
  eccentricity: number,
): ThumbnailSpec {
  const { a, b, c } = ellipseParameters(semiMajorAxis, eccentricity);
  const focuses = focusPoints(c);
  const orbit = orbitPoint(a, b, Math.PI * 0.28);
  const ellipse = sampleConicFocusLocusCurve(semiMajorAxis, eccentricity, CURVE_DENSITY);
  const focusLines = focuses.map((focus, index) => ({
    points: lineToCurvePoints(focus, orbit, index * 10),
    stroke: index === 0 ? 'rgba(212, 184, 122, 0.88)' : 'rgba(130, 170, 220, 0.68)',
    strokeWidth: 1.05,
    opacity: 0.95,
  }));

  return {
    paths: [
      {
        points: ellipse,
        opacity: 0.42,
        strokeWidth: 0.9,
      },
      {
        points: sampleConicFocusLocusCurve(semiMajorAxis, eccentricity, 0.08)
          .filter((point) => point.theta >= 0 && point.theta <= Math.PI * 0.58),
        stroke: 'rgb(212, 184, 122)',
        strokeWidth: 1.35,
        opacity: 1,
      },
      ...focusLines,
    ],
    circles: [
      ...focuses.map((focus, index) => ({
        x: focus.x,
        y: focus.y,
        r: 4.6,
        fill: index === 0 ? 'rgba(212, 184, 122, 0.82)' : 'rgba(130, 170, 220, 0.72)',
        stroke: 'rgba(255, 255, 255, 0.35)',
        strokeWidth: 0.45,
      })),
      {
        x: orbit.x,
        y: orbit.y,
        r: 5.8,
        fill: 'rgb(212, 184, 122)',
        stroke: 'rgba(255, 255, 255, 0.45)',
        strokeWidth: 0.55,
      },
    ],
  };
}

function lineToCurvePoints(a: Point2, b: Point2, thetaBase: number): CurvePoint[] {
  return [
    { x: a.x, y: a.y, theta: thetaBase, arcLength: 0 },
    { x: b.x, y: b.y, theta: thetaBase + 1, arcLength: Math.hypot(b.x - a.x, b.y - a.y) },
  ];
}
