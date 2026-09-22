import type p5 from 'p5';
import { canvas2d } from './canvas2d';
import { drawReadout } from './readout';
import {
  AXIS_HALF,
  SURFACE_FORMULA,
  computeGradientMetrics,
  createPlotLayout,
  formatVec,
  toScreen,
  type GradientLevelCurvesParams,
  type LevelPath,
  type PlotLayout,
  type Vec2,
} from '../../curve/modules/gradient-level-curves/geometry';

type Snapshot = {
  width: number;
  height: number;
  params: GradientLevelCurvesParams;
  dragging: boolean;
};

type Rgb = [number, number, number];

const BG: Rgb = [10, 10, 10];
const ACCENT: Rgb = [212, 184, 122];
const GUIDE: Rgb = [255, 255, 255];

function withPlotClip(p: p5, layout: PlotLayout, draw: () => void): void {
  const ctx = canvas2d(p);
  const topLeft = toScreen(layout, { x: -layout.half, y: layout.half });
  const size = layout.half * 2 * layout.scale;
  p.push();
  ctx.save();
  ctx.beginPath();
  ctx.rect(topLeft.x, topLeft.y, size, size);
  ctx.clip();
  draw();
  ctx.restore();
  p.pop();
}

function drawGrid(p: p5, layout: PlotLayout): void {
  p.push();
  p.strokeWeight(1);
  p.noFill();
  for (let value = -AXIS_HALF; value <= AXIS_HALF; value += 1) {
    const alpha = value === 0 ? 30 : 8;
    p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], alpha);
    const x = toScreen(layout, { x: value, y: 0 }).x;
    const y = toScreen(layout, { x: 0, y: value }).y;
    p.line(x, toScreen(layout, { x: 0, y: -AXIS_HALF }).y, x, toScreen(layout, { x: 0, y: AXIS_HALF }).y);
    p.line(toScreen(layout, { x: -AXIS_HALF, y: 0 }).x, y, toScreen(layout, { x: AXIS_HALF, y: 0 }).x, y);
  }

  p.noStroke();
  p.fill(GUIDE[0], GUIDE[1], GUIDE[2], 74);
  p.textSize(12);
  const xLabel = toScreen(layout, { x: AXIS_HALF * 0.92, y: 0 });
  const yLabel = toScreen(layout, { x: 0, y: AXIS_HALF * 0.92 });
  p.textAlign(p.CENTER, p.TOP);
  p.text('x', xLabel.x, xLabel.y + 8);
  p.textAlign(p.LEFT, p.CENTER);
  p.text('y', yLabel.x + 8, yLabel.y);
  p.pop();
}

function drawPath(
  p: p5,
  layout: PlotLayout,
  path: LevelPath,
  color: Rgb,
  alpha: number,
  weight: number,
  dashed = false,
): void {
  if (path.points.length < 2) return;
  const ctx = canvas2d(p);
  p.push();
  p.noFill();
  p.stroke(color[0], color[1], color[2], alpha);
  p.strokeWeight(weight);
  p.strokeJoin(p.ROUND);
  p.strokeCap(p.ROUND);
  ctx.setLineDash(dashed ? [5, 7] : []);
  p.beginShape();
  for (const point of path.points) {
    const screen = toScreen(layout, point);
    p.vertex(screen.x, screen.y);
  }
  if (path.closed) p.endShape(p.CLOSE);
  else p.endShape();
  ctx.setLineDash([]);
  p.pop();
}

function drawArrow(p: p5, from: Vec2, to: Vec2, color: Rgb, alpha: number, weight: number): void {
  const len = Math.hypot(to.x - from.x, to.y - from.y);
  if (len < 0.5) return;
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  p.push();
  p.stroke(color[0], color[1], color[2], alpha);
  p.strokeWeight(weight);
  p.line(from.x, from.y, to.x, to.y);
  p.noStroke();
  p.fill(color[0], color[1], color[2], alpha);
  p.translate(to.x, to.y);
  p.rotate(angle);
  p.triangle(0, 0, -9, -4, -9, 4);
  p.pop();
}

export function renderGradientLevelCurvesScene(p: p5, snap: Snapshot): void {
  const { width, height, params } = snap;
  const metrics = computeGradientMetrics(params);
  const layout = createPlotLayout(width, height);
  const formula = SURFACE_FORMULA[params.kind];

  p.background(BG[0], BG[1], BG[2]);
  drawGrid(p, layout);

  withPlotClip(p, layout, () => {
    for (const path of metrics.family) {
      drawPath(p, layout, path, ACCENT, 70, 1.4, true);
    }

    for (const path of metrics.current) {
      drawPath(p, layout, path, ACCENT, 16, 7);
      drawPath(p, layout, path, ACCENT, 42, 3.5);
      drawPath(p, layout, path, ACCENT, 230, 1.6);
    }

    if (!metrics.critical) {
      const from = toScreen(layout, metrics.tangentFrom);
      const to = toScreen(layout, metrics.tangentTo);
      p.push();
      p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 90);
      p.strokeWeight(1.4);
      p.line(from.x, from.y, to.x, to.y);
      p.pop();

      drawArrow(
        p,
        toScreen(layout, metrics.point),
        toScreen(layout, metrics.arrowTip),
        ACCENT,
        230,
        2.2,
      );
    }
  });

  const point = toScreen(layout, metrics.point);
  p.push();
  p.noStroke();
  if (snap.dragging) {
    p.fill(ACCENT[0], ACCENT[1], ACCENT[2], 52);
    p.circle(point.x, point.y, 24);
  }
  p.fill(ACCENT[0], ACCENT[1], ACCENT[2], 235);
  p.circle(point.x, point.y, 12);
  p.pop();

  drawReadout(
    p,
    width,
    [
      formula.f,
      metrics.critical ? '臨界點 ∇f = 0' : `∇f(P) = ${formatVec(metrics.gradient)}`,
      `f(P) = ${metrics.value.toFixed(2)}　P = ${formatVec(metrics.point)}`,
    ],
    { highlightIndex: 0, highlightColor: ACCENT },
  );
}
