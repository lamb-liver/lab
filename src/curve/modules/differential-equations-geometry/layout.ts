import {
  DOMAIN,
  PLOT_H_RATIO,
  PLOT_W_RATIO,
  PLOT_X_RATIO,
  PLOT_Y_RATIO,
} from './constants';
import type { PlotRect } from './types';

export function computePlotRect(canvasW: number, canvasH: number): PlotRect {
  return {
    x: canvasW * PLOT_X_RATIO,
    y: canvasH * PLOT_Y_RATIO,
    w: canvasW * PLOT_W_RATIO,
    h: canvasH * PLOT_H_RATIO,
  };
}

export function sx(x: number, plot: PlotRect): number {
  return (
    plot.x +
    ((x - DOMAIN.xMin) / (DOMAIN.xMax - DOMAIN.xMin)) * plot.w
  );
}

export function sy(y: number, plot: PlotRect): number {
  return (
    plot.y +
    ((DOMAIN.yMax - y) / (DOMAIN.yMax - DOMAIN.yMin)) * plot.h
  );
}

export function wx(px: number, plot: PlotRect): number {
  return (
    DOMAIN.xMin +
    ((px - plot.x) / plot.w) * (DOMAIN.xMax - DOMAIN.xMin)
  );
}

export function wy(py: number, plot: PlotRect): number {
  return (
    DOMAIN.yMin +
    ((plot.y + plot.h - py) / plot.h) * (DOMAIN.yMax - DOMAIN.yMin)
  );
}

export function isInsidePlot(
  px: number,
  py: number,
  plot: PlotRect,
): boolean {
  return (
    px >= plot.x &&
    px <= plot.x + plot.w &&
    py >= plot.y &&
    py <= plot.y + plot.h
  );
}

export function measureDiffEqCanvas(host: HTMLElement): {
  width: number;
  height: number;
} {
  const w = Math.min(900, Math.max(320, Math.round(host.clientWidth || 320)));
  const plotH = w * (372 / 650);
  const height = Math.max(280, Math.round(plotH + 100));
  return { width: w, height };
}
