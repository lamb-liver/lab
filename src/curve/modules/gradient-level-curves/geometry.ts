import type { CurvePoint, ThumbnailSpec } from '../../types';
import { BASE_CANVAS_SIZE } from '../../constants';

export type Vec2 = { x: number; y: number };

/** 世界座標半幅；正方形視窗 [-4, 4]² */
export const AXIS_HALF = 4;

const EPS = 1e-9;
const CIRCLE_STEPS = 96;
const HYPERBOLA_STEPS = 64;
const ARROW_LENGTH = 1.35;
const TANGENT_HALF = 0.85;
const FAMILY_SKIP = 0.25;

export const SURFACE_KINDS = ['paraboloid', 'saddle', 'product'] as const;
export type SurfaceKind = (typeof SURFACE_KINDS)[number];

export type GradientLevelCurvesParams = {
  kind: SurfaceKind;
  px: number;
  py: number;
  showFamily: boolean;
};

export const DEFAULT_GRADIENT_LEVEL_CURVES_PARAMS: GradientLevelCurvesParams = {
  kind: 'paraboloid',
  px: 1.6,
  py: 1.1,
  showFamily: true,
};

export const SURFACE_FORMULA: Record<SurfaceKind, { f: string; grad: string }> = {
  paraboloid: { f: 'f = x² + y²', grad: '∇f = (2x, 2y)' },
  saddle: { f: 'f = x² − y²', grad: '∇f = (2x, −2y)' },
  product: { f: 'f = xy', grad: '∇f = (y, x)' },
};

const FAMILY_LEVELS: Record<SurfaceKind, number[]> = {
  paraboloid: [1, 4, 9],
  saddle: [-8, -4, -1, 1, 4, 8],
  product: [-6, -2, -0.5, 0.5, 2, 6],
};

export type PlotLayout = {
  origin: Vec2;
  scale: number;
  half: number;
};

export type LevelPath = { c: number; points: Vec2[]; closed: boolean };

export type GradientMetrics = {
  point: Vec2;
  value: number;
  gradient: Vec2;
  gradientLength: number;
  unitGradient: Vec2;
  unitTangent: Vec2;
  arrowTip: Vec2;
  tangentFrom: Vec2;
  tangentTo: Vec2;
  current: LevelPath[];
  family: LevelPath[];
  critical: boolean;
};

export function surfaceKindFromIndex(index: number): SurfaceKind {
  const clamped = Math.max(0, Math.min(SURFACE_KINDS.length - 1, Math.round(index)));
  return SURFACE_KINDS[clamped] ?? 'paraboloid';
}

export function valueAt(kind: SurfaceKind, x: number, y: number): number {
  if (kind === 'paraboloid') return x * x + y * y;
  if (kind === 'saddle') return x * x - y * y;
  return x * y;
}

export function gradientAt(kind: SurfaceKind, x: number, y: number): Vec2 {
  if (kind === 'paraboloid') return { x: 2 * x, y: 2 * y };
  if (kind === 'saddle') return { x: 2 * x, y: -2 * y };
  return { x: y, y: x };
}

export function clampToScene(x: number, y: number): Vec2 {
  return {
    x: Math.max(-AXIS_HALF, Math.min(AXIS_HALF, x)),
    y: Math.max(-AXIS_HALF, Math.min(AXIS_HALF, y)),
  };
}

export function formatVec(v: Vec2, digits = 2): string {
  return `(${v.x.toFixed(digits)}, ${v.y.toFixed(digits)})`;
}

export function createPlotLayout(width: number, height: number): PlotLayout {
  const base = Math.min(width, height);
  const margin = Math.max(28, base * 0.08);
  const usable = base - margin * 2;
  return {
    origin: { x: width / 2, y: height / 2 },
    scale: usable / (AXIS_HALF * 2),
    half: AXIS_HALF,
  };
}

export function toScreen(layout: PlotLayout, point: Vec2): Vec2 {
  return {
    x: layout.origin.x + point.x * layout.scale,
    y: layout.origin.y - point.y * layout.scale,
  };
}

export function toWorld(layout: PlotLayout, point: Vec2): Vec2 {
  return {
    x: (point.x - layout.origin.x) / layout.scale,
    y: (layout.origin.y - point.y) / layout.scale,
  };
}

function unit(v: Vec2): Vec2 {
  const length = Math.hypot(v.x, v.y);
  if (length < EPS) return { x: 0, y: 0 };
  return { x: v.x / length, y: v.y / length };
}

function addScaled(point: Vec2, direction: Vec2, scale: number): Vec2 {
  return { x: point.x + direction.x * scale, y: point.y + direction.y * scale };
}

function inBox(point: Vec2): boolean {
  return Math.abs(point.x) <= AXIS_HALF + 1e-9 && Math.abs(point.y) <= AXIS_HALF + 1e-9;
}

function splitByBox(points: Vec2[], closed: boolean): Vec2[][] {
  const groups: Vec2[][] = [];
  let current: Vec2[] = [];
  const flush = () => {
    if (current.length >= 2) groups.push(current);
    current = [];
  };

  for (const point of points) {
    if (inBox(point)) current.push(point);
    else flush();
  }

  if (
    closed &&
    groups.length > 0 &&
    current.length > 0 &&
    inBox(points[0]!) &&
    inBox(points[points.length - 1]!)
  ) {
    current.push(...groups[0]!);
    groups[0] = current;
    current = [];
  }

  flush();
  return groups;
}

function sampleCircle(radius: number): Vec2[] {
  if (radius <= EPS) return [{ x: 0, y: 0 }];
  const points: Vec2[] = [];
  for (let i = 0; i <= CIRCLE_STEPS; i += 1) {
    const t = (i / CIRCLE_STEPS) * Math.PI * 2;
    points.push({ x: radius * Math.cos(t), y: radius * Math.sin(t) });
  }
  return points;
}

function sampleHyperbolaSaddle(c: number): Vec2[][] {
  if (Math.abs(c) < EPS) {
    return [
      [
        { x: -AXIS_HALF, y: -AXIS_HALF },
        { x: AXIS_HALF, y: AXIS_HALF },
      ],
      [
        { x: -AXIS_HALF, y: AXIS_HALF },
        { x: AXIS_HALF, y: -AXIS_HALF },
      ],
    ];
  }

  const branches: Vec2[][] = [];
  if (c > 0) {
    const s = Math.sqrt(c);
    if (s >= AXIS_HALF) return branches;
    const tMax = Math.acosh(AXIS_HALF / s);
    for (const sign of [1, -1]) {
      const points: Vec2[] = [];
      for (let i = 0; i <= HYPERBOLA_STEPS; i += 1) {
        const t = -tMax + (2 * tMax * i) / HYPERBOLA_STEPS;
        points.push({ x: sign * s * Math.cosh(t), y: s * Math.sinh(t) });
      }
      branches.push(points);
    }
    return branches;
  }

  const s = Math.sqrt(-c);
  if (s >= AXIS_HALF) return branches;
  const tMax = Math.acosh(AXIS_HALF / s);
  for (const sign of [1, -1]) {
    const points: Vec2[] = [];
    for (let i = 0; i <= HYPERBOLA_STEPS; i += 1) {
      const t = -tMax + (2 * tMax * i) / HYPERBOLA_STEPS;
      points.push({ x: s * Math.sinh(t), y: sign * s * Math.cosh(t) });
    }
    branches.push(points);
  }
  return branches;
}

function sampleHyperbolaProduct(c: number): Vec2[][] {
  if (Math.abs(c) < EPS) {
    return [
      [
        { x: -AXIS_HALF, y: 0 },
        { x: AXIS_HALF, y: 0 },
      ],
      [
        { x: 0, y: -AXIS_HALF },
        { x: 0, y: AXIS_HALF },
      ],
    ];
  }

  const xMin = Math.abs(c) / AXIS_HALF;
  if (xMin >= AXIS_HALF) return [];

  const branches: Vec2[][] = [];
  for (const sign of [1, -1]) {
    const points: Vec2[] = [];
    for (let i = 0; i <= HYPERBOLA_STEPS; i += 1) {
      const x = sign * (xMin + ((AXIS_HALF - xMin) * i) / HYPERBOLA_STEPS);
      points.push({ x, y: c / x });
    }
    branches.push(points);
  }
  return branches;
}

export function sampleLevel(kind: SurfaceKind, c: number): LevelPath[] {
  if (kind === 'paraboloid') {
    if (c < -EPS) return [];
    if (c <= EPS) return [{ c, points: [{ x: 0, y: 0 }], closed: true }];
    const radius = Math.sqrt(c);
    const closed = radius <= AXIS_HALF + 1e-9;
    return splitByBox(sampleCircle(radius), true).map((points) => ({
      c,
      points,
      closed,
    }));
  }

  const branches = kind === 'saddle' ? sampleHyperbolaSaddle(c) : sampleHyperbolaProduct(c);
  return branches
    .map((points) => splitByBox(points, false))
    .flat()
    .map((points) => ({ c, points, closed: false }));
}

export function computeGradientMetrics(
  params: GradientLevelCurvesParams,
): GradientMetrics {
  const point = clampToScene(params.px, params.py);
  const value = valueAt(params.kind, point.x, point.y);
  const gradient = gradientAt(params.kind, point.x, point.y);
  const gradientLength = Math.hypot(gradient.x, gradient.y);
  const critical = gradientLength < 1e-6;
  const unitGradient = unit(gradient);
  const unitTangent = { x: -unitGradient.y, y: unitGradient.x };

  const current = sampleLevel(params.kind, value);
  const family: LevelPath[] = [];
  if (params.showFamily) {
    for (const c of FAMILY_LEVELS[params.kind]) {
      if (Math.abs(c - value) < FAMILY_SKIP) continue;
      family.push(...sampleLevel(params.kind, c));
    }
  }

  const arrowTip = critical ? point : addScaled(point, unitGradient, ARROW_LENGTH);

  return {
    point,
    value,
    gradient,
    gradientLength,
    unitGradient,
    unitTangent,
    arrowTip,
    tangentFrom: addScaled(point, unitTangent, -TANGENT_HALF),
    tangentTo: addScaled(point, unitTangent, TANGENT_HALF),
    current,
    family,
    critical,
  };
}

/**
 * 縮圖尺度：世界最遠 4，乘 60 後為 240，落在 BASE_CANVAS_SIZE / 2 = 300 之內。
 */
const THUMBNAIL_SCALE = 60;

function toThumb(point: Vec2, index: number): CurvePoint {
  return {
    x: point.x * THUMBNAIL_SCALE,
    y: point.y * THUMBNAIL_SCALE,
    theta: index,
    arcLength: index,
  };
}

function pathToThumb(path: LevelPath): CurvePoint[] {
  return path.points.map((point, index) => toThumb(point, index));
}

export function sampleGradientThumbnail(
  params: GradientLevelCurvesParams,
): ThumbnailSpec {
  const metrics = computeGradientMetrics({ ...params, showFamily: true });
  const paths: ThumbnailSpec['paths'] = [];

  for (const path of metrics.family) {
    if (path.points.length >= 2) {
      paths.push({ points: pathToThumb(path), closed: path.closed, opacity: 0.45 });
    }
  }
  for (const path of metrics.current) {
    if (path.points.length >= 2) {
      paths.push({ points: pathToThumb(path), closed: path.closed });
    }
  }
  if (!metrics.critical) {
    const tip = clampToScene(metrics.arrowTip.x, metrics.arrowTip.y);
    paths.push({
      points: [toThumb(metrics.point, 0), toThumb(tip, 1)],
    });
  }

  const half = BASE_CANVAS_SIZE / 2;
  const circles: ThumbnailSpec['circles'] = [
    {
      x: Math.max(-half, Math.min(half, metrics.point.x * THUMBNAIL_SCALE)),
      y: Math.max(-half, Math.min(half, metrics.point.y * THUMBNAIL_SCALE)),
      r: 5,
    },
  ];

  return { paths, circles };
}
