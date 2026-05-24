import type { CurveModule, CurvePoint, ThumbnailPath, ThumbnailSpec } from '../curve/types';
import { workCurveBySlug } from '../curve/registry';

const VIEW_W = 320;
const VIEW_H = 200;
const PAD = 16;
const ACCENT = 'rgb(212, 184, 122)';
const BASE_POINT_STEP = 0.006;
const DEFAULT_PATH_OPACITY = 1;
const DEFAULT_PATH_STROKE_WIDTH = 1.2;

function fitToView(spec: ThumbnailSpec): Array<ThumbnailPath & { fitted: Array<{ x: number; y: number }> }> {
  const nonEmptyPaths = spec.paths.filter((path) => path.points.length > 0);
  if (nonEmptyPaths.length === 0) return [];
  const pathsForBbox = nonEmptyPaths.filter((path) => path.excludeFromBbox !== true);
  const sourcePaths = pathsForBbox.length > 0 ? pathsForBbox : nonEmptyPaths;
  const points = sourcePaths.flatMap((path) => path.points);
  if (points.length === 0) return [];

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
    return [];
  }

  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;
  const scale = Math.min((VIEW_W - PAD * 2) / rangeX, (VIEW_H - PAD * 2) / rangeY);
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;

  return nonEmptyPaths.map((path) => ({
    ...path,
    fitted: path.points.map((p) => ({
      x: Number.isFinite(p.x) ? VIEW_W / 2 + (p.x - cx) * scale : Number.NaN,
      y: Number.isFinite(p.y) ? VIEW_H / 2 - (p.y - cy) * scale : Number.NaN,
    })),
  }));
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
  const fittedPaths = fitToView(spec);
  if (fittedPaths.length === 0) return null;

  const pathNodes = fittedPaths
    .map((path) => {
      const d = polylinePath(path.fitted, path.closed);
      if (!d) return '';
      const opacity = path.opacity ?? DEFAULT_PATH_OPACITY;
      const strokeWidth = path.strokeWidth ?? DEFAULT_PATH_STROKE_WIDTH;
      return `<path d="${d}" fill="none" stroke="${ACCENT}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" opacity="${opacity}"/>`;
    })
    .filter(Boolean)
    .join('');

  if (!pathNodes) return null;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 ${VIEW_W} ${VIEW_H}" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><rect width="100%" height="100%" fill="#0a0a0a"/>${pathNodes}</svg>`;
}
