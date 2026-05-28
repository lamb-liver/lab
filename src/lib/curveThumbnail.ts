import type {
  CurveModule,
  CurvePoint,
  ThumbnailCircle,
  ThumbnailPath,
  ThumbnailSpec,
} from '../curve/types';
import { workCurveBySlug } from '../curve/registry';

const VIEW_W = 320;
const VIEW_H = 200;
const PAD = 16;
const ACCENT = 'rgb(212, 184, 122)';
const GUIDE_STROKE = 'rgb(255, 255, 255)';
const BASE_POINT_STEP = 0.006;
const DEFAULT_PATH_OPACITY = 1;
const DEFAULT_PATH_STROKE_WIDTH = 1.2;

type FitTransform = {
  scale: number;
  cx: number;
  cy: number;
  coordinateSystem: 'math' | 'canvas';
};

function collectBboxPoints(spec: ThumbnailSpec): CurvePoint[] {
  const pathsForBbox = spec.paths.filter((p) => p.excludeFromBbox !== true);
  const pathPoints = (pathsForBbox.length > 0 ? pathsForBbox : spec.paths).flatMap((p) => p.points);
  const circlePoints: CurvePoint[] = (spec.circles ?? []).map((c) => ({
    x: c.x,
    y: c.y,
    theta: 0,
    arcLength: 0,
  }));
  return [...pathPoints, ...circlePoints];
}

function computeFitTransform(spec: ThumbnailSpec): FitTransform | null {
  const points = collectBboxPoints(spec);
  if (points.length === 0) return null;

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const p of points) {
    if (!Number.isFinite(p.x) || !Number.isFinite(p.y)) continue;
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
  }
  if (!Number.isFinite(minX) || !Number.isFinite(maxX) || !Number.isFinite(minY) || !Number.isFinite(maxY)) {
    return null;
  }

  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;
  const scale = Math.min((VIEW_W - PAD * 2) / rangeX, (VIEW_H - PAD * 2) / rangeY);
  return {
    scale,
    cx: (minX + maxX) / 2,
    cy: (minY + maxY) / 2,
    coordinateSystem: spec.coordinateSystem ?? 'math',
  };
}

function mapXY(x: number, y: number, t: FitTransform): { x: number; y: number } {
  return {
    x: VIEW_W / 2 + (x - t.cx) * t.scale,
    y:
      t.coordinateSystem === 'canvas'
        ? VIEW_H / 2 + (y - t.cy) * t.scale
        : VIEW_H / 2 - (y - t.cy) * t.scale,
  };
}

function fitToView(
  spec: ThumbnailSpec,
): { paths: Array<ThumbnailPath & { fitted: Array<{ x: number; y: number }> }>; circles: Array<ThumbnailCircle & { fittedR: number }> } {
  const t = computeFitTransform(spec);
  if (!t) return { paths: [], circles: [] };

  const paths = spec.paths
    .filter((path) => path.points.length > 0)
    .map((path) => ({
      ...path,
      fitted: path.points.map((p) => {
        if (!Number.isFinite(p.x) || !Number.isFinite(p.y)) {
          return { x: Number.NaN, y: Number.NaN };
        }
        return mapXY(p.x, p.y, t);
      }),
    }));

  const circles = (spec.circles ?? []).map((circle) => {
    const { x, y } = mapXY(circle.x, circle.y, t);
    return { ...circle, x, y, fittedR: Math.max(0.35, circle.r * t.scale) };
  });

  return { paths, circles };
}

function polylinePath(pts: Array<{ x: number; y: number }>, closed = false): string {
  if (pts.length === 0) return '';
  const fmt = (n: number) => n.toFixed(4);
  let body = '';
  let drawing = false;
  for (const p of pts) {
    if (!Number.isFinite(p.x) || !Number.isFinite(p.y)) {
      drawing = false;
      continue;
    }
    if (!drawing) {
      body += `M ${fmt(p.x)} ${fmt(p.y)}`;
      drawing = true;
    } else {
      body += ` L ${fmt(p.x)} ${fmt(p.y)}`;
    }
  }
  if (!body) return '';
  return closed ? `${body} Z` : body;
}

export function normalizeToThumbnailSpec(raw: CurvePoint[] | ThumbnailSpec): ThumbnailSpec {
  if (Array.isArray(raw)) {
    return { paths: [{ points: raw }] };
  }
  return raw;
}

function sampleForThumbnail(module: CurveModule): ThumbnailSpec {
  const raw = module.sample(module.defaultParams, {
    step: module.sampleStep ?? BASE_POINT_STEP,
    revealProgress: 1,
    purpose: 'thumbnail',
  });
  return normalizeToThumbnailSpec(raw);
}

/** 建置期靜態 SVG：預設參數、完整曲線（reveal=1） */
export function getCurveThumbnailSvg(slug: string): string | null {
  const module = workCurveBySlug[slug];
  if (!module) return null;
  const spec = sampleForThumbnail(module);
  const { paths: fittedPaths, circles: fittedCircles } = fitToView(spec);
  if (fittedPaths.length === 0 && fittedCircles.length === 0) return null;

  const pathNodes = fittedPaths
    .map((path) => {
      const d = polylinePath(path.fitted, path.closed);
      if (!d) return '';
      const opacity = path.opacity ?? DEFAULT_PATH_OPACITY;
      const fill = path.fill ?? 'none';
      const hasFill = fill !== 'none';
      const stroke = path.stroke ?? (hasFill ? 'none' : ACCENT);
      const strokeWidth =
        path.strokeWidth ?? (hasFill && stroke === 'none' ? 0 : DEFAULT_PATH_STROKE_WIDTH);
      return `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" opacity="${opacity}"/>`;
    })
    .filter(Boolean)
    .join('');

  const circleNodes = fittedCircles
    .map((circle) => {
      const fill = circle.fill ?? 'none';
      const stroke = circle.stroke ?? 'none';
      const strokeWidth = circle.strokeWidth ?? 0;
      const opacity = circle.opacity ?? 1;
      return `<circle cx="${circle.x.toFixed(4)}" cy="${circle.y.toFixed(4)}" r="${circle.fittedR.toFixed(4)}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${opacity}"/>`;
    })
    .join('');

  const nodes = pathNodes + circleNodes;
  if (!nodes) return null;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 ${VIEW_W} ${VIEW_H}" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><rect width="100%" height="100%" fill="#0a0a0a"/>${nodes}</svg>`;
}
