import type p5 from 'p5';
import { ROOT_LABELS, PLOT_X_MAX, PLOT_X_MIN } from '../../curve/modules/polynomial-roots-multiplicity/constants';
import {
  buildCaption,
  computePolynomialPlotRect,
  computeSignLineRect,
  niceYStep,
  rootLabelOffsets,
  worldToScreen,
  type PlotRect,
  type PolynomialMeta,
  type PolynomialRootsMultiplicityParams,
  type PolynomialSceneCache,
  type ViewSmoothState,
} from '../../curve/modules/polynomial-roots-multiplicity/geometry';

export type PolynomialRootsMultiplicitySnap = {
  size: number;
  params: PolynomialRootsMultiplicityParams;
  scene: PolynomialSceneCache;
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

function drawPolynomialCurve(
  p: p5,
  plot: PlotRect,
  viewHalfY: number,
  points: Array<{ x: number; y: number }>,
) {
  const layers = [
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

function drawRootGuides(
  p: p5,
  plot: PlotRect,
  viewHalfY: number,
  meta: PolynomialMeta,
) {
  const offsets = rootLabelOffsets(meta.roots, plot, viewHalfY, 20, 15);

  for (let i = 0; i < meta.roots.length; i++) {
    const r = meta.roots[i];
    const m = meta.mult[i];
    const top = worldToScreen(plot, viewHalfY, r, viewHalfY);
    const bottom = worldToScreen(plot, viewHalfY, r, -viewHalfY);

    drawDashed(p, () => {
      p.stroke(255, 255, 255, m === 1 ? 14 : 24);
      p.strokeWeight(1);
      p.line(top.x, top.y, bottom.x, bottom.y);
    });

    const labelPos = worldToScreen(plot, viewHalfY, r, 0);
    p.noStroke();
    p.fill(...MUTED, 155);
    p.textSize(10);
    p.text(m === 1 ? '穿過' : '碰觸', labelPos.x + 10, labelPos.y - offsets[i]);
  }
}

function drawRootMarkers(
  p: p5,
  plot: PlotRect,
  viewHalfY: number,
  meta: PolynomialMeta,
) {
  const offsets = rootLabelOffsets(meta.roots, plot, viewHalfY, 12, 14);

  for (let i = 0; i < meta.roots.length; i++) {
    const r = meta.roots[i];
    const m = meta.mult[i];
    if (r < PLOT_X_MIN || r > PLOT_X_MAX) continue;

    const s = worldToScreen(plot, viewHalfY, r, 0);
    const radius = m === 1 ? 5.0 : 6.6;

    drawGlowPoint(p, s.x, s.y, radius, 220);

    p.noFill();
    p.stroke(255, 255, 255, m === 1 ? 24 : 46);
    p.strokeWeight(1);
    p.circle(s.x, s.y, m === 1 ? 15 : 23);

    p.noStroke();
    p.fill(...GOLD, 220);
    p.textSize(11);
    p.text(ROOT_LABELS[i], s.x + 8, s.y - offsets[i]);
  }
}

function drawSignNumberLine(
  p: p5,
  signLine: PlotRect,
  meta: PolynomialMeta,
) {
  const y = signLine.y + 14;
  const x0 = signLine.x;
  const x1 = signLine.x + signLine.w;

  p.stroke(255, 255, 255, 18);
  p.strokeWeight(1);
  p.line(x0, y, x1, y);

  for (const seg of meta.signedSegments) {
    const sx0 = p.map(seg.a, PLOT_X_MIN, PLOT_X_MAX, x0, x1);
    const sx1 = p.map(seg.b, PLOT_X_MIN, PLOT_X_MAX, x0, x1);

    if (seg.sign > 0) {
      p.stroke(...GOLD, 195);
      p.strokeWeight(4);
    } else {
      p.stroke(255, 255, 255, 36);
      p.strokeWeight(2);
    }

    p.line(sx0, y, sx1, y);
  }

  for (let x = PLOT_X_MIN; x <= PLOT_X_MAX; x += 1) {
    const sx = p.map(x, PLOT_X_MIN, PLOT_X_MAX, x0, x1);
    p.stroke(255, 255, 255, x === 0 ? 36 : 14);
    p.strokeWeight(1);
    p.line(sx, y - 4, sx, y + 4);
  }

  for (const r of meta.breaks) {
    if (r < PLOT_X_MIN || r > PLOT_X_MAX) continue;
    const sx = p.map(r, PLOT_X_MIN, PLOT_X_MAX, x0, x1);
    drawGlowPoint(p, sx, y, 2.5, 190);
  }

  p.noStroke();
  p.fill(...MUTED, 185);
  p.textSize(11);
  p.text('金色：f(x)>0；灰色：f(x)<0', x0, y - 14);
  p.text('-5', x0 - 5, y + 22);
  p.text('5', x1 - 6, y + 22);
}

function drawCaption(p: p5, size: number, text: string) {
  p.noStroke();
  p.fill(...MUTED, 175);
  p.textSize(12);
  p.textAlign(p.CENTER, p.BASELINE);
  p.text(text, size / 2, size - 12);
  p.textAlign(p.LEFT, p.BASELINE);
}

export function renderPolynomialRootsMultiplicityScene(
  p: p5,
  snap: PolynomialRootsMultiplicitySnap,
): number {
  const plot = computePolynomialPlotRect(snap.size);
  const signLine = computeSignLineRect(plot);
  const { meta, curve, targetViewHalfY } = snap.scene;
  const viewHalfY = snap.smooth.viewHalfY;

  p.background(10, 10, 10);

  withPlotClip(p, plot, () => {
    drawGridAndAxes(p, plot, viewHalfY);

    if (snap.params.advanced) {
      drawRootGuides(p, plot, viewHalfY, meta);
    }

    drawPolynomialCurve(p, plot, viewHalfY, curve);
    drawRootMarkers(p, plot, viewHalfY, meta);
  });

  drawSignNumberLine(p, signLine, meta);
  drawCaption(p, snap.size, buildCaption(meta));

  return targetViewHalfY;
}
