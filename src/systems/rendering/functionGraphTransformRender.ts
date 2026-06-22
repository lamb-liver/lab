import type p5 from 'p5';
import {
  baseValue,
  buildCaption,
  buildCurves,
  computeWorkPlotRect,
  niceYStep,
  targetViewHalfYFromCurves,
  worldToScreen,
  type FunctionGraphTransformParams,
  type PlotRect,
  type ViewSmoothState,
} from '../../curve/modules/function-graph-transform/geometry';
import { PLOT_X_MAX, PLOT_X_MIN } from '../../curve/modules/function-graph-transform/constants';

type FunctionGraphTransformSnap = {
  size: number;
  params: FunctionGraphTransformParams;
  smooth: ViewSmoothState;
};

const GOLD: [number, number, number] = [212, 184, 122];
const MUTED: [number, number, number] = [136, 136, 136];

function withPlotClip(p: p5, plot: PlotRect, draw: () => void) {
  p.push();
  p.drawingContext.beginPath();
  p.drawingContext.rect(plot.x, plot.y, plot.w, plot.h);
  p.drawingContext.clip();
  draw();
  p.pop();
}

function drawDashed(p: p5, draw: () => void) {
  p.push();
  p.drawingContext.save();
  p.drawingContext.setLineDash([4, 6]);
  draw();
  p.drawingContext.restore();
  p.pop();
}

function drawGridAndAxes(p: p5, plot: PlotRect, viewHalfY: number) {
  p.noFill();
  p.strokeWeight(1);
  p.stroke(255, 255, 255, 8);

  for (let x = PLOT_X_MIN; x <= PLOT_X_MAX; x += 1) {
    const sx = worldToScreen(plot, viewHalfY, x, 0).x;
    p.line(sx, plot.y, sx, plot.y + plot.h);
  }

  const yStep = niceYStep(viewHalfY);
  for (let y = -viewHalfY; y <= viewHalfY + 0.001; y += yStep) {
    const sy = worldToScreen(plot, viewHalfY, 0, y).y;
    p.line(plot.x, sy, plot.x + plot.w, sy);
  }

  p.stroke(255, 255, 255, 30);
  const origin = worldToScreen(plot, viewHalfY, 0, 0);
  p.line(plot.x, origin.y, plot.x + plot.w, origin.y);
  p.line(origin.x, plot.y, origin.x, plot.y + plot.h);
}

function drawSegmentedPolyline(
  p: p5,
  plot: PlotRect,
  viewHalfY: number,
  points: Array<{ x: number; y: number }>,
) {
  let inShape = false;

  for (const pt of points) {
    if (!Number.isFinite(pt.y)) {
      if (inShape) {
        p.endShape();
        inShape = false;
      }
      continue;
    }

    const s = worldToScreen(plot, viewHalfY, pt.x, pt.y);
    if (!Number.isFinite(s.x) || !Number.isFinite(s.y)) {
      if (inShape) {
        p.endShape();
        inShape = false;
      }
      continue;
    }

    if (!inShape) {
      p.beginShape();
      inShape = true;
    }
    p.vertex(s.x, s.y);
  }

  if (inShape) p.endShape();
}

function drawCurve(
  p: p5,
  plot: PlotRect,
  viewHalfY: number,
  points: Array<{ x: number; y: number }>,
  ghost: boolean,
) {
  const layers = ghost
    ? [{ w: 1.1, a: 20 }]
    : [
        { w: 7, a: 16 },
        { w: 3.5, a: 42 },
        { w: 1.55, a: 232 },
      ];

  p.noFill();
  for (const layer of layers) {
    p.stroke(...GOLD, layer.a);
    p.strokeWeight(layer.w);
    drawSegmentedPolyline(p, plot, viewHalfY, points);
  }
}

function drawTransformGuides(
  p: p5,
  plot: PlotRect,
  viewHalfY: number,
  params: FunctionGraphTransformParams,
) {
  const origin = worldToScreen(plot, viewHalfY, 0, 0);
  const shifted = worldToScreen(plot, viewHalfY, params.h, params.k);
  const xAxis = worldToScreen(plot, viewHalfY, 0, params.k).y;
  const yAxis = worldToScreen(plot, viewHalfY, params.h, 0).x;

  drawDashed(p, () => {
    p.stroke(255, 255, 255, 18);
    p.strokeWeight(1);
    p.line(plot.x, xAxis, plot.x + plot.w, xAxis);
    p.line(yAxis, plot.y, yAxis, plot.y + plot.h);
  });

  drawDashed(p, () => {
    p.stroke(...GOLD, 28);
    p.strokeWeight(1);
    p.line(origin.x, origin.y, shifted.x, shifted.y);
  });

  if (Math.abs(params.b) >= 0.15) {
    const guideInputs = [-2, -1, 0, 1, 2];
    for (const input of guideInputs) {
      const y0 = baseValue(params.basis, input);
      const x1 = params.h + input / params.b;
      const y1 = params.k + params.a * y0;
      const a = worldToScreen(plot, viewHalfY, input, y0);
      const b = worldToScreen(plot, viewHalfY, x1, y1);

      drawDashed(p, () => {
        p.stroke(255, 255, 255, input === 0 ? 28 : 12);
        p.strokeWeight(1);
        p.line(a.x, a.y, b.x, b.y);
      });
    }
  }
}

function drawGlowPoint(p: p5, x: number, y: number, r: number, alpha: number) {
  p.noStroke();
  p.fill(...GOLD, 30);
  p.circle(x, y, r * 5.2);
  p.fill(...GOLD, 82);
  p.circle(x, y, r * 2.3);
  p.fill(...GOLD, alpha);
  p.circle(x, y, r * 1.25);
}

function drawFeaturePoints(
  p: p5,
  plot: PlotRect,
  viewHalfY: number,
  params: FunctionGraphTransformParams,
) {
  const base = worldToScreen(plot, viewHalfY, 0, 0);
  const target = worldToScreen(plot, viewHalfY, params.h, params.k);

  drawGlowPoint(p, base.x, base.y, 3.2, 90);
  drawGlowPoint(p, target.x, target.y, 5.2, 230);

  p.noStroke();
  p.fill(...MUTED, 180);
  p.textSize(11);
  p.text('O', base.x + 8, base.y - 8);

  p.fill(...GOLD, 220);
  p.text('P', target.x + 9, target.y - 9);
}

function drawCaption(p: p5, size: number, text: string) {
  p.noStroke();
  p.fill(...MUTED, 175);
  p.textSize(12);
  p.textAlign(p.CENTER, p.BASELINE);
  p.text(text, size / 2, size - 12);
  p.textAlign(p.LEFT, p.BASELINE);
}

export function renderFunctionGraphTransformScene(
  p: p5,
  snap: FunctionGraphTransformSnap,
): number {
  const plot = computeWorkPlotRect(snap.size);
  const { ghost, active } = buildCurves(snap.params);
  const targetViewHalfY = targetViewHalfYFromCurves([ghost, active]);

  const viewHalfY = snap.smooth.viewHalfY;

  p.background(10, 10, 10);

  withPlotClip(p, plot, () => {
    drawGridAndAxes(p, plot, viewHalfY);
    drawCurve(p, plot, viewHalfY, ghost, true);

    if (snap.params.advanced) {
      drawTransformGuides(p, plot, viewHalfY, snap.params);
    }

    drawCurve(p, plot, viewHalfY, active, false);
    drawFeaturePoints(p, plot, viewHalfY, snap.params);
  });

  drawCaption(p, snap.size, buildCaption(snap.params));

  return targetViewHalfY;
}
