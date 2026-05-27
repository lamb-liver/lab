import type { CurvePoint, ThumbnailSpec } from '../../types';

export const FIBONACCI_VIEW = {
  width: 1200,
  height: 820,
  originX: 0.52,
  originY: 0.56,
  viewScale: 0.76,
};

export type FibonacciTile = {
  x: number;
  y: number;
  s: number;
  dir: number;
  arc: FibonacciArc;
};

export type FibonacciArc = {
  cx: number;
  cy: number;
  radius: number;
  start: number;
  end: number;
};

export type FibonacciGeometry = {
  tiles: FibonacciTile[];
  bounds: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  };
  center: {
    x: number;
    y: number;
  };
  worldWidth: number;
  worldHeight: number;
};

const TAU = Math.PI * 2;
const HALF_PI = Math.PI / 2;
export const PHI = (1 + Math.sqrt(5)) / 2;
type Point = { x: number; y: number };

export function buildFibonacci(n: number): number[] {
  const count = Math.max(2, Math.round(n));
  const values = [1, 1];
  while (values.length < count) {
    const len = values.length;
    values.push(values[len - 1]! + values[len - 2]!);
  }
  return values;
}

export function buildSpiralGeometry(fib: number[]): FibonacciGeometry {
  const tiles: FibonacciTile[] = [];
  const bounds = {
    minX: 0,
    minY: 0,
    maxX: 1,
    maxY: 1,
  };

  tiles.push(createTile(0, 0, 1, 0));
  tiles.push(createTile(1, 0, 1, 1));
  bounds.maxX = 2;
  bounds.maxY = 1;

  for (let i = 2; i < fib.length; i += 1) {
    const s = fib[i]!;
    const dir = (i - 1) % 4;
    let x = 0;
    let y = 0;

    if (dir === 0) {
      x = bounds.maxX;
      y = bounds.minY;
    } else if (dir === 1) {
      x = bounds.minX;
      y = bounds.maxY;
    } else if (dir === 2) {
      x = bounds.minX - s;
      y = bounds.minY;
    } else {
      x = bounds.minX;
      y = bounds.minY - s;
    }

    tiles.push(createTile(x, y, s, dir));
    bounds.minX = Math.min(bounds.minX, x);
    bounds.minY = Math.min(bounds.minY, y);
    bounds.maxX = Math.max(bounds.maxX, x + s);
    bounds.maxY = Math.max(bounds.maxY, y + s);
  }

  const worldWidth = bounds.maxX - bounds.minX;
  const worldHeight = bounds.maxY - bounds.minY;

  return {
    tiles,
    bounds,
    center: {
      x: (bounds.minX + bounds.maxX) * 0.5,
      y: (bounds.minY + bounds.maxY) * 0.5,
    },
    worldWidth,
    worldHeight,
  };
}

export function getTileRevealProgress(revealProgress: number, tileIndex: number, count: number): number {
  const t = revealProgress * count - tileIndex;
  return Math.pow(clamp01(t), 0.82);
}

export function sampleArcPoints(
  arc: FibonacciArc,
  progress = 1,
  step = 0.035,
): Point[] {
  const end = arc.start + (arc.end - arc.start) * clamp01(progress);
  const direction = end >= arc.start ? 1 : -1;
  const points: Point[] = [];
  for (let a = arc.start; direction > 0 ? a <= end : a >= end; a += step * direction) {
    points.push({
      x: arc.cx + Math.cos(a) * arc.radius,
      y: arc.cy + Math.sin(a) * arc.radius,
    });
  }
  points.push({
    x: arc.cx + Math.cos(end) * arc.radius,
    y: arc.cy + Math.sin(end) * arc.radius,
  });
  return points;
}

export function sampleLogSpiralReference(
  geometry: FibonacciGeometry,
  step = 0.035,
): Point[] {
  const anchors = geometry.tiles.map((tile) => pointOnArc(tile.arc, 0.5));
  if (anchors.length < 2) return [];

  const fit = deriveLogSpiralFit(anchors);
  if (!fit) return [];

  const points: Point[] = [];
  const direction = fit.thetaEnd >= fit.thetaStart ? 1 : -1;
  for (
    let theta = fit.thetaStart;
    direction > 0 ? theta <= fit.thetaEnd : theta >= fit.thetaEnd;
    theta += step * direction
  ) {
    const radius = fit.radiusStart * Math.exp(fit.growth * (theta - fit.thetaStart));
    points.push({
      x: fit.pole.x + Math.cos(theta) * radius,
      y: fit.pole.y + Math.sin(theta) * radius,
    });
  }

  const endRadius = fit.radiusStart * Math.exp(fit.growth * (fit.thetaEnd - fit.thetaStart));
  points.push({
    x: fit.pole.x + Math.cos(fit.thetaEnd) * endRadius,
    y: fit.pole.y + Math.sin(fit.thetaEnd) * endRadius,
  });
  return points;
}

export function buildFibonacciThumbnail(n: number): ThumbnailSpec {
  const fib = buildFibonacci(n);
  const geometry = buildSpiralGeometry(fib);
  return {
    paths: [
      ...geometry.tiles.map((tile) => ({
        points: rectToCurvePoints(tile),
        closed: true,
        opacity: 0.35,
        strokeWidth: 0.8,
      })),
      {
        points: pointsToCurvePoints(sampleLogSpiralReference(geometry, 0.05)),
        opacity: 0.3,
        strokeWidth: 0.8,
      },
      ...geometry.tiles.map((tile) => ({
        points: pointsToCurvePoints(sampleArcPoints(tile.arc, 1, 0.04)),
        opacity: 1,
        strokeWidth: 1.2,
      })),
    ],
  };
}

export function fibonacciRatio(fib: number[]): number {
  if (fib.length < 2) return 1;
  return fib[fib.length - 1]! / fib[fib.length - 2]!;
}

function createTile(x: number, y: number, s: number, dir: number): FibonacciTile {
  return {
    x,
    y,
    s,
    dir,
    arc: buildArc(x, y, s, dir),
  };
}

function buildArc(x: number, y: number, s: number, dir: number): FibonacciArc {
  if (dir === 0) {
    return {
      cx: x,
      cy: y + s,
      radius: s,
      start: -HALF_PI,
      end: 0,
    };
  }

  if (dir === 1) {
    return {
      cx: x,
      cy: y,
      radius: s,
      start: 0,
      end: HALF_PI,
    };
  }

  if (dir === 2) {
    return {
      cx: x + s,
      cy: y,
      radius: s,
      start: HALF_PI,
      end: Math.PI,
    };
  }

  return {
    cx: x + s,
    cy: y + s,
    radius: s,
    start: Math.PI,
    end: Math.PI + HALF_PI,
  };
}

function pointOnArc(arc: FibonacciArc, progress: number): Point {
  const angle = arc.start + (arc.end - arc.start) * clamp01(progress);
  return {
    x: arc.cx + Math.cos(angle) * arc.radius,
    y: arc.cy + Math.sin(angle) * arc.radius,
  };
}

function deriveLogSpiralFit(anchors: Point[]):
  | {
      pole: Point;
      thetaStart: number;
      thetaEnd: number;
      radiusStart: number;
      growth: number;
    }
  | null {
  const beforeLast = anchors[anchors.length - 2];
  const last = anchors[anchors.length - 1];
  if (!beforeLast || !last || !anchors[0]) return null;

  const candidates = [
    derivePoleFromQuarterTurn(beforeLast, last, PHI, HALF_PI),
    derivePoleFromQuarterTurn(beforeLast, last, PHI, -HALF_PI),
  ].filter((point): point is Point => point !== null);

  const fit = candidates
    .map((pole) => buildFitForPole(pole, anchors))
    .filter((candidate): candidate is NonNullable<typeof candidate> => candidate !== null)
    .sort((a, b) => a.error - b.error)[0];

  return fit
    ? {
        pole: fit.pole,
        thetaStart: fit.thetaStart,
        thetaEnd: fit.thetaEnd,
        radiusStart: fit.radiusStart,
        growth: fit.growth,
      }
    : null;
}

function derivePoleFromQuarterTurn(
  from: Point,
  to: Point,
  scale: number,
  angle: number,
): Point | null {
  const cos = Math.cos(angle) * scale;
  const sin = Math.sin(angle) * scale;
  const a = cos - 1;
  const b = -sin;
  const c = sin;
  const d = cos - 1;
  const rhsX = cos * from.x - sin * from.y - to.x;
  const rhsY = sin * from.x + cos * from.y - to.y;
  const det = a * d - b * c;
  if (Math.abs(det) < 1e-9) return null;
  return {
    x: (rhsX * d - b * rhsY) / det,
    y: (a * rhsY - rhsX * c) / det,
  };
}

function buildFitForPole(pole: Point, anchors: Point[]) {
  const unwrapped = unwrapAngles(
    anchors.map((point) => Math.atan2(point.y - pole.y, point.x - pole.x)),
  );
  const radii = anchors.map((point) => Math.hypot(point.x - pole.x, point.y - pole.y));
  const firstRadius = radii[0];
  const lastRadius = radii[radii.length - 1];
  const thetaStart = unwrapped[0];
  const thetaEnd = unwrapped[unwrapped.length - 1];
  if (
    firstRadius === undefined ||
    lastRadius === undefined ||
    thetaStart === undefined ||
    thetaEnd === undefined ||
    firstRadius <= 0 ||
    lastRadius <= 0 ||
    Math.abs(thetaEnd - thetaStart) < 1e-9
  ) {
    return null;
  }

  const growth = Math.log(lastRadius / firstRadius) / (thetaEnd - thetaStart);
  let error = 0;
  for (let i = 1; i < radii.length; i += 1) {
    const prev = radii[i - 1]!;
    const current = radii[i]!;
    if (prev > 0 && current > 0) {
      error += Math.abs(Math.log(current / prev) - Math.log(PHI));
    }
  }

  return {
    pole,
    thetaStart,
    thetaEnd,
    radiusStart: firstRadius,
    growth,
    error,
  };
}

function unwrapAngles(angles: number[]): number[] {
  if (angles.length === 0) return [];
  const positive = unwrapAnglesWithDirection(angles, 1);
  const negative = unwrapAnglesWithDirection(angles, -1);
  return Math.abs((positive.at(-1) ?? 0) - positive[0]!) >=
    Math.abs((negative.at(-1) ?? 0) - negative[0]!)
    ? positive
    : negative;
}

function unwrapAnglesWithDirection(angles: number[], direction: 1 | -1): number[] {
  const out = [angles[0]!];
  for (let i = 1; i < angles.length; i += 1) {
    let next = angles[i]!;
    const prev = out[i - 1]!;
    if (direction > 0) {
      while (next <= prev) next += TAU;
    } else {
      while (next >= prev) next -= TAU;
    }
    out.push(next);
  }
  return out;
}

function rectToCurvePoints(tile: FibonacciTile): CurvePoint[] {
  return pointsToCurvePoints([
    { x: tile.x, y: tile.y },
    { x: tile.x + tile.s, y: tile.y },
    { x: tile.x + tile.s, y: tile.y + tile.s },
    { x: tile.x, y: tile.y + tile.s },
  ]);
}

function pointsToCurvePoints(raw: Array<{ x: number; y: number }>): CurvePoint[] {
  let cumulative = 0;
  let prev = raw[0];
  return raw.map((point, index) => {
    if (index > 0 && prev) {
      cumulative += Math.hypot(point.x - prev.x, point.y - prev.y);
    }
    prev = point;
    return {
      x: point.x,
      y: point.y,
      theta: (index / Math.max(1, raw.length - 1)) * TAU,
      arcLength: cumulative,
    };
  });
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}
