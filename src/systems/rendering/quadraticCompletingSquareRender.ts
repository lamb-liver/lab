import type p5 from 'p5';
import { ROOT_LABELS } from '../../curve/modules/quadratic-completing-square/constants';
import {
  buildCaption,
  computeWorkPlotRect,
  niceYStep,
  worldToScreen,
  type PlotRect,
  type QuadraticCompletingSquareParams,
  type QuadraticSceneCache,
  type ViewSmoothState,
} from '../../curve/modules/quadratic-completing-square/geometry';
import { PLOT_X_MAX, PLOT_X_MIN } from '../../curve/modules/quadratic-completing-square/constants';

type QuadraticCompletingSquareSnap = {
  size: number;
  params: QuadraticCompletingSquareParams;
  scene: QuadraticSceneCache;
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

function drawParabola(
  p: p5,
  plot: PlotRect,
  viewHalfY: number,
  points: Array<{ x: number; y: number }>,
  ghost = false,
) {
  const layers = ghost
    ? [{ w: 1.05, a: 18 }]
    : [
        { w: 8, a: 15 },
        { w: 4, a: 42 },
        { w: 1.65, a: 235 },
      ];

  p.noFill();
  for (const layer of layers) {
    p.stroke(...GOLD, layer.a);
    p.strokeWeight(layer.w);
    drawSegmentedPolyline(p, plot, viewHalfY, points);
  }
}

function drawGlowPoint(p: p5, x: number, y: number, r: number, alpha: number) {
  p.noStroke();
  p.fill(...GOLD, 30);
  p.circle(x, y, r * 5.0);
  p.fill(...GOLD, 85);
  p.circle(x, y, r * 2.35);
  p.fill(...GOLD, alpha);
  p.circle(x, y, r * 1.2);
}

function drawArrowLine(
  p: p5,
  a: { x: number; y: number },
  b: { x: number; y: number },
  alpha: number,
) {
  if (
    !Number.isFinite(a.x) ||
    !Number.isFinite(a.y) ||
    !Number.isFinite(b.x) ||
    !Number.isFinite(b.y)
  ) {
    return;
  }

  p.stroke(...GOLD, alpha);
  p.strokeWeight(1);
  p.line(a.x, a.y, b.x, b.y);

  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  if (len < 12) return;

  const ux = dx / len;
  const uy = dy / len;
  const size = 7;
  const px = -uy;
  const py = ux;

  p.line(b.x, b.y, b.x - ux * size + px * size * 0.55, b.y - uy * size + py * size * 0.55);
  p.line(b.x, b.y, b.x - ux * size - px * size * 0.55, b.y - uy * size - py * size * 0.55);
}

function drawAxisAndVertex(
  p: p5,
  plot: PlotRect,
  viewHalfY: number,
  meta: QuadraticSceneCache['meta'],
) {
  const axisTop = worldToScreen(plot, viewHalfY, meta.h, viewHalfY);
  const axisBottom = worldToScreen(plot, viewHalfY, meta.h, -viewHalfY);
  const vertex = worldToScreen(plot, viewHalfY, meta.h, meta.k);

  drawDashed(p, () => {
    p.stroke(255, 255, 255, 22);
    p.strokeWeight(1);
    p.line(axisTop.x, axisTop.y, axisBottom.x, axisBottom.y);
  });

  drawGlowPoint(p, vertex.x, vertex.y, 5.6, 230);

  p.noFill();
  p.stroke(...GOLD, 70);
  p.strokeWeight(1);
  p.circle(vertex.x, vertex.y, 16);

  p.noStroke();
  p.fill(...GOLD, 225);
  p.textSize(11);
  p.text('V', vertex.x + 9, vertex.y - 9);
}

function drawRootMarkers(
  p: p5,
  plot: PlotRect,
  viewHalfY: number,
  roots: number[],
) {
  for (let i = 0; i < roots.length; i++) {
    const r = roots[i];
    if (r < PLOT_X_MIN || r > PLOT_X_MAX) continue;

    const s = worldToScreen(plot, viewHalfY, r, 0);
    drawGlowPoint(p, s.x, s.y, roots.length === 1 ? 6.0 : 4.8, 215);

    p.noStroke();
    p.fill(...MUTED, 180);
    p.textSize(11);
    p.text(roots.length === 1 ? 'x₀' : ROOT_LABELS[i], s.x + 8, s.y + 16);
  }
}

function drawCompletingSquareGuides(
  p: p5,
  plot: PlotRect,
  viewHalfY: number,
  meta: QuadraticSceneCache['meta'],
) {
  const origin = worldToScreen(plot, viewHalfY, 0, 0);
  const vertex = worldToScreen(plot, viewHalfY, meta.h, meta.k);
  const yAtVertex = worldToScreen(plot, viewHalfY, 0, meta.k);

  drawDashed(p, () => {
    p.stroke(255, 255, 255, 14);
    p.strokeWeight(1);
    p.line(plot.x, yAtVertex.y, plot.x + plot.w, yAtVertex.y);
  });

  if (Math.hypot(vertex.x - origin.x, vertex.y - origin.y) > 10) {
    drawArrowLine(p, origin, vertex, 20);
  }

  p.noStroke();
  p.fill(...MUTED, 150);
  p.textSize(10);
  p.text('y=ax²', origin.x + 10, origin.y - 10);
}

function drawCaption(p: p5, size: number, text: string) {
  p.noStroke();
  p.fill(...MUTED, 175);
  p.textSize(12);
  p.textAlign(p.CENTER, p.BASELINE);
  p.text(text, size / 2, size - 12);
  p.textAlign(p.LEFT, p.BASELINE);
}

export function renderQuadraticCompletingSquareScene(
  p: p5,
  snap: QuadraticCompletingSquareSnap,
): number {
  const plot = computeWorkPlotRect(snap.size);
  const { meta, curve, baseCurve, targetViewHalfY } = snap.scene;
  const viewHalfY = snap.smooth.viewHalfY;

  p.background(10, 10, 10);

  withPlotClip(p, plot, () => {
    drawGridAndAxes(p, plot, viewHalfY);

    if (snap.params.advanced) {
      drawParabola(p, plot, viewHalfY, baseCurve, true);
      drawCompletingSquareGuides(p, plot, viewHalfY, meta);
    }

    drawParabola(p, plot, viewHalfY, curve, false);
    drawAxisAndVertex(p, plot, viewHalfY, meta);
    drawRootMarkers(p, plot, viewHalfY, meta.roots);
  });

  drawCaption(p, snap.size, buildCaption(meta));

  return targetViewHalfY;
}
