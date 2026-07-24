import { canvas2d } from './canvas2d';
import type p5 from 'p5';
import { GOLD, MUTED, X_MAX, X_MIN } from '../../explore/function-equations/constants';
import {
  baseValue,
  bottomCaption,
  clamp,
  computeSceneLayout,
  curvesForView,
  niceYStep,
  polyValue,
  positiveIntervals,
  quadraticValue,
  quadraticRoots,
  quadraticVertex,
  rootsFromSample,
  signLineLabel,
  targetViewHalfYFromCurves,
  transformValue,
  worldToScreen,
} from '../../explore/function-equations/geometry';
import type {
  FunctionEquationsParams,
  FunctionEquationsSmooth,
  PlotRect,
  SceneLayout,
} from '../../explore/function-equations/types';

type FunctionEquationsRenderSnap = {
  params: FunctionEquationsParams;
  smooth: FunctionEquationsSmooth;
};

function withPlotClip(p: p5, plot: PlotRect, draw: () => void) {
  p.push();
  canvas2d(p).beginPath();
  canvas2d(p).rect(plot.x, plot.y, plot.w, plot.h);
  canvas2d(p).clip();
  draw();
  p.pop();
}

function drawDashed(p: p5, draw: () => void) {
  p.push();
  canvas2d(p).save();
  canvas2d(p).setLineDash([4, 6]);
  draw();
  canvas2d(p).restore();
  p.pop();
}

function drawGridAndAxes(p: p5, plot: PlotRect, viewHalfY: number) {
  p.noFill();
  p.strokeWeight(1);
  p.stroke(255, 255, 255, 8);

  for (let x = X_MIN; x <= X_MAX; x += 1) {
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

function drawCurve(p: p5, plot: PlotRect, viewHalfY: number, points: Array<{ x: number; y: number }>, ghost: boolean) {
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
    p.beginShape();
    for (const pt of points) {
      if (!Number.isFinite(pt.y)) continue;
      const s = worldToScreen(plot, viewHalfY, pt.x, pt.y);
      p.vertex(s.x, s.y);
    }
    p.endShape();
  }
}

function drawGlowPoint(p: p5, x: number, y: number, r: number, alpha: number) {
  p.noStroke();
  p.fill(...GOLD, 32);
  p.circle(x, y, r * 5);
  p.fill(...GOLD, 90);
  p.circle(x, y, r * 2.3);
  p.fill(...GOLD, alpha);
  p.circle(x, y, r * 1.25);
}

function drawZeroMarkers(p: p5, plot: PlotRect, viewHalfY: number, points: Array<{ x: number; y: number }>) {
  for (const r of rootsFromSample(points)) {
    const s = worldToScreen(plot, viewHalfY, r, 0);
    drawGlowPoint(p, s.x, s.y, 4.5, 210);
  }
}

function drawExactRootMarkers(
  p: p5,
  plot: PlotRect,
  viewHalfY: number,
  roots: number[],
) {
  for (const r of roots) {
    if (r < X_MIN || r > X_MAX) continue;
    const s = worldToScreen(plot, viewHalfY, r, 0);
    drawGlowPoint(p, s.x, s.y, 4.8, 220);
  }
}

function drawQuadraticVertex(p: p5, plot: PlotRect, viewHalfY: number, x: number, y: number) {
  if (x < X_MIN || x > X_MAX) return;
  const s = worldToScreen(plot, viewHalfY, x, y);

  p.noFill();
  p.stroke(...GOLD, 80);
  p.strokeWeight(1);
  p.circle(s.x, s.y, 13);

  p.noStroke();
  p.fill(...GOLD, 220);
  p.textSize(11);
  p.text('V', s.x + 8, s.y - 8);
}

function drawPolynomialRootHandles(
  p: p5,
  plot: PlotRect,
  viewHalfY: number,
  params: FunctionEquationsParams,
) {
  for (let i = 0; i < params.polynomial.roots.length; i++) {
    const r = params.polynomial.roots[i];
    const m = params.polynomial.mult[i];
    const s = worldToScreen(plot, viewHalfY, r, 0);

    drawGlowPoint(p, s.x, s.y, m === 1 ? 5 : 6.5, 220);

    p.noFill();
    p.stroke(255, 255, 255, m === 1 ? 24 : 42);
    p.strokeWeight(1);
    p.circle(s.x, s.y, m === 1 ? 15 : 22);

    p.noStroke();
    p.fill(...MUTED, 180);
    p.textSize(11);
    p.text(`r${i + 1}`, s.x + 8, s.y - 10);
  }
}

function drawSignNumberLine(
  p: p5,
  layout: SceneLayout,
  intervals: [number, number][],
  label: string,
) {
  const nl = layout.numberLine;
  const y = nl.y;
  const x0 = nl.x;
  const x1 = nl.x + nl.w;

  p.stroke(255, 255, 255, 18);
  p.strokeWeight(1);
  p.line(x0, y, x1, y);

  for (let x = X_MIN; x <= X_MAX; x += 1) {
    const sx = p.map(x, X_MIN, X_MAX, x0, x1);
    p.stroke(255, 255, 255, x === 0 ? 35 : 15);
    p.line(sx, y - 4, sx, y + 4);
  }

  for (const seg of intervals) {
    const a = clamp(seg[0], X_MIN, X_MAX);
    const b = clamp(seg[1], X_MIN, X_MAX);
    if (b <= a) continue;
    p.stroke(...GOLD, 190);
    p.strokeWeight(4);
    p.line(p.map(a, X_MIN, X_MAX, x0, x1), y, p.map(b, X_MIN, X_MAX, x0, x1), y);
  }

  p.noStroke();
  p.fill(...MUTED, 185);
  p.textSize(11);
  p.text(label, x0, y - 12);
  p.text('-5', x0 - 5, y + 22);
  p.text('5', x1 - 6, y + 22);
}

function drawBottomCaption(p: p5, width: number, height: number, text: string) {
  p.noStroke();
  p.fill(...MUTED, 175);
  p.textSize(12);
  p.textAlign(p.CENTER, p.BASELINE);
  p.text(text, width / 2, height - 14);
  p.textAlign(p.LEFT, p.BASELINE);
}

function drawTransformScene(
  p: p5,
  layout: SceneLayout,
  viewHalfY: number,
  params: FunctionEquationsParams,
) {
  const tr = params.transform;
  const xs = Array.from({ length: Math.floor((X_MAX - X_MIN) / 0.035) + 1 }, (_, i) => X_MIN + i * 0.035);
  const ghost = xs.map((x) => ({ x, y: baseValue(tr.basis, x) }));
  const curve = xs.map((x) => ({ x, y: transformValue(tr, x) }));

  withPlotClip(p, layout.plot, () => {
    drawGridAndAxes(p, layout.plot, viewHalfY);
    drawCurve(p, layout.plot, viewHalfY, ghost, true);
    drawCurve(p, layout.plot, viewHalfY, curve, false);
    drawZeroMarkers(p, layout.plot, viewHalfY, curve);

    if (params.advanced) {
      const a = worldToScreen(layout.plot, viewHalfY, tr.h, -viewHalfY);
      const b = worldToScreen(layout.plot, viewHalfY, tr.h, viewHalfY);
      drawDashed(p, () => {
        p.stroke(255, 255, 255, 20);
        p.strokeWeight(1);
        p.line(a.x, a.y, b.x, b.y);
      });
    }
  });
}

function drawQuadraticScene(
  p: p5,
  layout: SceneLayout,
  viewHalfY: number,
  params: FunctionEquationsParams,
) {
  const xs = Array.from({ length: Math.floor((X_MAX - X_MIN) / 0.035) + 1 }, (_, i) => X_MIN + i * 0.035);
  const curve = xs.map((x) => ({ x, y: quadraticValue(params.quadratic, x) }));
  const roots = quadraticRoots(params.quadratic);
  const vertex = quadraticVertex(params.quadratic);

  withPlotClip(p, layout.plot, () => {
    drawGridAndAxes(p, layout.plot, viewHalfY);
    drawCurve(p, layout.plot, viewHalfY, curve, false);
    drawQuadraticVertex(p, layout.plot, viewHalfY, vertex.x, vertex.y);
    drawExactRootMarkers(p, layout.plot, viewHalfY, roots);

    if (params.advanced) {
      const a = worldToScreen(layout.plot, viewHalfY, vertex.x, -viewHalfY);
      const b = worldToScreen(layout.plot, viewHalfY, vertex.x, viewHalfY);
      drawDashed(p, () => {
        p.stroke(255, 255, 255, 20);
        p.strokeWeight(1);
        p.line(a.x, a.y, b.x, b.y);
      });
    }
  });
}

function drawPolynomialScene(
  p: p5,
  layout: SceneLayout,
  viewHalfY: number,
  params: FunctionEquationsParams,
) {
  const xs = Array.from({ length: Math.floor((X_MAX - X_MIN) / 0.025) + 1 }, (_, i) => X_MIN + i * 0.025);
  const curve = xs.map((x) => ({ x, y: polyValue(params.polynomial, x) }));

  withPlotClip(p, layout.plot, () => {
    drawGridAndAxes(p, layout.plot, viewHalfY);
    drawCurve(p, layout.plot, viewHalfY, curve, false);
    drawPolynomialRootHandles(p, layout.plot, viewHalfY, params);

    if (params.advanced) {
      for (const r of params.polynomial.roots) {
        const a = worldToScreen(layout.plot, viewHalfY, r, -viewHalfY);
        const b = worldToScreen(layout.plot, viewHalfY, r, viewHalfY);
        drawDashed(p, () => {
          p.stroke(255, 255, 255, 15);
          p.strokeWeight(1);
          p.line(a.x, a.y, b.x, b.y);
        });
      }
    }
  });
}

export function renderFunctionEquationsExploreScene(p: p5, snap: FunctionEquationsRenderSnap) {
  const { params, smooth } = snap;
  const layout = computeSceneLayout(p.width, p.height);
  const targetViewHalfY = targetViewHalfYFromCurves(curvesForView(params));
  const viewHalfY = smooth.viewHalfY;

  p.background(10, 10, 10);

  if (params.mode === 'transform') drawTransformScene(p, layout, viewHalfY, params);
  if (params.mode === 'quadratic') drawQuadraticScene(p, layout, viewHalfY, params);
  if (params.mode === 'polynomial') drawPolynomialScene(p, layout, viewHalfY, params);

  drawSignNumberLine(p, layout, positiveIntervals(params), signLineLabel(params));
  drawBottomCaption(p, p.width, p.height, bottomCaption(params));

  return targetViewHalfY;
}
