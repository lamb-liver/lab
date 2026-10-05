import type { CurvePoint, ThumbnailSpec } from '../../types';
import { buildPointCloudStroke } from '../../thumbnailPointCloud';
import { juliaSmooth } from '../julia-set/math';

export const MANDEL_VIEW = {
  cx0: -2.2,
  cx1: 0.8,
  cy0: -1.25,
  cy1: 1.25,
} as const;

export type MapFrame = {
  left: number;
  top: number;
  w: number;
  h: number;
};

export type InsetFrame = {
  left: number;
  top: number;
  w: number;
  h: number;
};

export function mapFrame(width: number, height: number): MapFrame {
  const pad = Math.min(width, height) * 0.05;
  const availW = width - pad * 2;
  const availH = height - pad * 2;
  const viewW = MANDEL_VIEW.cx1 - MANDEL_VIEW.cx0;
  const viewH = MANDEL_VIEW.cy1 - MANDEL_VIEW.cy0;
  const scale = Math.min(availW / viewW, availH / viewH);
  const w = viewW * scale;
  const h = viewH * scale;
  return {
    left: (width - w) / 2,
    top: (height - h) / 2,
    w,
    h,
  };
}

export function insetFrame(width: number, height: number): InsetFrame {
  const s = Math.round(Math.min(width, height) * 0.26);
  const margin = 12;
  return {
    left: width - s - margin,
    top: margin,
    w: s,
    h: s,
  };
}

export function clampC(cx: number, cy: number): { cx: number; cy: number } {
  return {
    cx: Math.min(MANDEL_VIEW.cx1, Math.max(MANDEL_VIEW.cx0, cx)),
    cy: Math.min(MANDEL_VIEW.cy1, Math.max(MANDEL_VIEW.cy0, cy)),
  };
}

function inside(x: number, y: number, frame: { left: number; top: number; w: number; h: number }) {
  return x >= frame.left && x <= frame.left + frame.w && y >= frame.top && y <= frame.top + frame.h;
}

/** 地圖上的像素換成 c。角落小圖不接受新的點選；拖曳進行中可穿過它。 */
export function cFromPixel(
  x: number,
  y: number,
  frame: MapFrame,
  inset: InsetFrame,
  allowInset = false,
): { cx: number; cy: number } | null {
  if (!inside(x, y, frame) || (!allowInset && inside(x, y, inset))) return null;
  const cx = MANDEL_VIEW.cx0 + ((x - frame.left) / frame.w) * (MANDEL_VIEW.cx1 - MANDEL_VIEW.cx0);
  const cy = MANDEL_VIEW.cy1 - ((y - frame.top) / frame.h) * (MANDEL_VIEW.cy1 - MANDEL_VIEW.cy0);
  return clampC(cx, cy);
}

export function pixelFromC(cx: number, cy: number, frame: MapFrame): { x: number; y: number } {
  const c = clampC(cx, cy);
  return {
    x: frame.left + ((c.cx - MANDEL_VIEW.cx0) / (MANDEL_VIEW.cx1 - MANDEL_VIEW.cx0)) * frame.w,
    y: frame.top + ((MANDEL_VIEW.cy1 - c.cy) / (MANDEL_VIEW.cy1 - MANDEL_VIEW.cy0)) * frame.h,
  };
}

export function mandelbrotEscape(cx: number, cy: number, maxIter: number): number {
  return juliaSmooth(0, 0, cx, cy, maxIter);
}

export function sampleMandelbrotThumbnail(maxIter: number, marker: { cx: number; cy: number }): ThumbnailSpec {
  const grid = 64;
  const points: CurvePoint[] = [];
  const { cx0, cx1, cy0, cy1 } = MANDEL_VIEW;
  const midX = (cx0 + cx1) / 2;
  const midY = (cy0 + cy1) / 2;
  const halfW = (cx1 - cx0) / 2;
  const halfH = (cy1 - cy0) / 2;
  const span = 240;

  for (let gy = 0; gy < grid; gy += 1) {
    const cy = cy1 - (gy / (grid - 1)) * (cy1 - cy0);
    for (let gx = 0; gx < grid; gx += 1) {
      const cx = cx0 + (gx / (grid - 1)) * (cx1 - cx0);
      const t = mandelbrotEscape(cx, cy, maxIter);
      if (t < maxIter * 0.55) continue;
      points.push({
        x: ((cx - midX) / halfW) * span,
        y: ((cy - midY) / halfH) * span,
        theta: t,
        arcLength: t,
      });
    }
  }

  const mark = clampC(marker.cx, marker.cy);
  return {
    paths: [{ points: buildPointCloudStroke(points, { epsilon: 8 }), strokeWidth: 2.6 }],
    circles: [
      {
        x: ((mark.cx - midX) / halfW) * span,
        y: ((mark.cy - midY) / halfH) * span,
        r: 5,
        fill: 'none',
        stroke: '#d4b87a',
        strokeWidth: 1.5,
      },
    ],
  };
}
