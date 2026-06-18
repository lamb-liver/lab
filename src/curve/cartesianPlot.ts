export const VIEW_LERP_PER_SEC = 8;
export const MAX_VISUAL_DELTA_MS = 50;

export type PlotRect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type ViewSmoothState = {
  viewHalfY: number;
};

export function computeWorkPlotRect(size: number, bottomReserve = 0): PlotRect {
  const pad = size < 560 ? 42 : 48;
  const caption = 24;
  return {
    x: pad,
    y: Math.round(pad * 0.55),
    w: size - pad * 2,
    h: size - pad - caption - bottomReserve - Math.round(pad * 0.35),
  };
}

export function niceYStep(half: number) {
  if (half <= 4) return 1;
  if (half <= 8) return 2;
  return 4;
}

export function worldToScreen(
  plot: PlotRect,
  viewHalfY: number,
  xMin: number,
  xMax: number,
  x: number,
  y: number,
): { x: number; y: number } {
  return {
    x: plot.x + ((x - xMin) / (xMax - xMin)) * plot.w,
    y: plot.y + plot.h - ((y + viewHalfY) / (viewHalfY * 2)) * plot.h,
  };
}

export function screenToWorld(
  plot: PlotRect,
  viewHalfY: number,
  xMin: number,
  xMax: number,
  screenX: number,
  screenY: number,
) {
  return {
    x: xMin + ((screenX - plot.x) / plot.w) * (xMax - xMin),
    y: ((plot.y + plot.h - screenY) / plot.h) * (viewHalfY * 2) - viewHalfY,
  };
}

export function screenToWorldX(
  plot: PlotRect,
  xMin: number,
  xMax: number,
  screenX: number,
) {
  return xMin + ((screenX - plot.x) / plot.w) * (xMax - xMin);
}

export function stepViewHalfYSmoothing(
  smooth: ViewSmoothState,
  target: number,
  deltaMs: number,
  maxDeltaMs = MAX_VISUAL_DELTA_MS,
  ratePerSec = VIEW_LERP_PER_SEC,
): ViewSmoothState {
  const dtSec = Math.min(deltaMs, maxDeltaMs) / 1000;
  const alpha = 1 - Math.exp(-ratePerSec * dtSec);
  return { viewHalfY: smooth.viewHalfY + (target - smooth.viewHalfY) * alpha };
}
