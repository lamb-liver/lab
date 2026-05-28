import {
  PLANE_SCALE_MAX,
  CIRCLE_CENTER_X_RATIO,
  CIRCLE_CENTER_Y_RATIO,
  PLOT_H_RATIO,
  PLOT_W_RATIO,
  PLOT_X_RATIO,
  PLOT_Y_RATIO,
} from './constants';
import type { Complex, PlotRect } from './types';

export function computePlotRect(canvasW: number, canvasH: number): PlotRect {
  return {
    x: canvasW * PLOT_X_RATIO,
    y: canvasH * PLOT_Y_RATIO,
    w: canvasW * PLOT_W_RATIO,
    h: canvasH * PLOT_H_RATIO,
  };
}

export type PlaneTransform = {
  cx: number;
  cy: number;
  unit: number;
};

export function getPlaneTransform(
  plot: PlotRect,
  scaleMax = PLANE_SCALE_MAX,
): PlaneTransform {
  return {
    cx: plot.x + plot.w * 0.5,
    cy: plot.y + plot.h * 0.5,
    unit: (Math.min(plot.w, plot.h) * 0.38) / scaleMax,
  };
}

export function complexToScreen(
  z: Complex,
  plot: PlotRect,
  scaleMax = PLANE_SCALE_MAX,
): { x: number; y: number } {
  const { cx, cy, unit } = getPlaneTransform(plot, scaleMax);
  return {
    x: cx + z.re * unit,
    y: cy - z.im * unit,
  };
}

export function screenToComplex(
  px: number,
  py: number,
  plot: PlotRect,
  scaleMax = PLANE_SCALE_MAX,
): Complex {
  const { cx, cy, unit } = getPlaneTransform(plot, scaleMax);
  return {
    re: Math.max(-scaleMax, Math.min(scaleMax, (px - cx) / unit)),
    im: Math.max(-scaleMax, Math.min(scaleMax, (cy - py) / unit)),
  };
}

export function getCircleCenter(plot: PlotRect): { x: number; y: number } {
  return {
    x: plot.x + plot.w * CIRCLE_CENTER_X_RATIO,
    y: plot.y + plot.h * CIRCLE_CENTER_Y_RATIO,
  };
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

export function measureComplexEulerCanvas(host: HTMLElement): {
  width: number;
  height: number;
} {
  const w = Math.min(900, Math.max(320, Math.round(host.clientWidth || 320)));
  const plotH = w * (398 / 650);
  const height = Math.max(300, Math.round(plotH + 100));
  return { width: w, height };
}

/** 依繪圖區高度縮放原型中的半徑常數（基準 plot.h ≈ 398） */
export function circleRadius(plot: PlotRect, baseR: number): number {
  const refH = 600 * PLOT_H_RATIO;
  return baseR * (plot.h / refH);
}
