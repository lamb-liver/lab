import {
  PLOT_H_RATIO,
  PLOT_W_RATIO,
  PLOT_X_RATIO,
  PLOT_Y_RATIO,
} from './constants';
import type { FunctionDef, PlotRect } from './types';

export function computePlotRect(canvasW: number, canvasH: number): PlotRect {
  return {
    x: canvasW * PLOT_X_RATIO,
    y: canvasH * PLOT_Y_RATIO,
    w: canvasW * PLOT_W_RATIO,
    h: canvasH * PLOT_H_RATIO,
  };
}

export function sx(x: number, fn: FunctionDef, plot: PlotRect): number {
  return plot.x + ((x - fn.a) / (fn.b - fn.a)) * plot.w;
}

export function sy(y: number, fn: FunctionDef, plot: PlotRect): number {
  return plot.y + ((fn.yMax - y) / (fn.yMax - fn.yMin)) * plot.h;
}

export function screenToTangentT(
  px: number,
  fn: FunctionDef,
  plot: PlotRect,
): number {
  const x = fn.a + ((px - plot.x) / plot.w) * (fn.b - fn.a);
  const clamped = Math.max(fn.a, Math.min(fn.b, x));
  return (clamped - fn.a) / (fn.b - fn.a);
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

export function measureLimitsCanvas(host: HTMLElement): {
  width: number;
  height: number;
} {
  const w = Math.min(
    900,
    Math.max(320, Math.round(host.clientWidth || 320)),
  );
  const plotH = w * (350 / 650);
  const height = Math.max(260, Math.round(plotH + 100));
  return { width: w, height };
}
