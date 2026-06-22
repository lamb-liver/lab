import type p5 from 'p5';
import {
  computeDotProductMetrics,
  createDotProductLayout,
  shortestAngleDelta,
  vectorFromParams,
  worldToScreen,
  type DotProductGeometryParams,
  type DotProductMetrics,
  type Vec2,
} from '../../curve/modules/dot-product-geometry/geometry';

type DotProductGeometrySnap = {
  width: number;
  height: number;
  params: DotProductGeometryParams;
  showAngle: boolean;
  showProjection: boolean;
  activeDrag: 'u' | 'v' | null;
};

const BG: [number, number, number] = [10, 10, 10];
const ACCENT: [number, number, number] = [212, 184, 122];
const GUIDE: [number, number, number] = [255, 255, 255];
const U_COLOR: [number, number, number] = [160, 205, 255];
const V_COLOR: [number, number, number] = [164, 225, 176];
const PROJ_COLOR: [number, number, number] = [255, 187, 122];

function setDash(p: p5, pattern: number[]): void {
  const ctx = p.drawingContext as CanvasRenderingContext2D;
  ctx.setLineDash(pattern);
}

function withPlotClip(p: p5, plotMin: number, plotMax: number, draw: () => void): void {
  const ctx = p.drawingContext as CanvasRenderingContext2D;
  p.push();
  ctx.save();
  ctx.beginPath();
  ctx.rect(plotMin, plotMin, plotMax - plotMin, plotMax - plotMin);
  ctx.clip();
  draw();
  ctx.restore();
  p.pop();
}

function drawLine(
  p: p5,
  a: Vec2,
  b: Vec2,
  color: readonly [number, number, number],
  alpha: number,
  weight: number,
  dashed = false,
): void {
  p.push();
  p.stroke(...color, alpha);
  p.strokeWeight(weight);
  p.strokeCap(p.ROUND);
  setDash(p, dashed ? [5, 8] : []);
  p.line(a.x, a.y, b.x, b.y);
  setDash(p, []);
  p.pop();
}

function drawArrow(
  p: p5,
  from: Vec2,
  to: Vec2,
  color: readonly [number, number, number],
  alpha: number,
  active = false,
): void {
  const len = Math.hypot(to.x - from.x, to.y - from.y);
  if (len < 0.001) return;
  const angle = Math.atan2(to.y - from.y, to.x - from.x);

  drawLine(p, from, to, color, active ? 46 : 22, active ? 8 : 6);
  drawLine(p, from, to, color, alpha, active ? 2.6 : 2);

  const head = active ? 14 : 12;
  const wing = 0.7;
  p.push();
  p.noStroke();
  p.fill(...color, alpha);
  p.triangle(
    to.x,
    to.y,
    to.x - Math.cos(angle - wing) * head,
    to.y - Math.sin(angle - wing) * head,
    to.x - Math.cos(angle + wing) * head,
    to.y - Math.sin(angle + wing) * head,
  );
  p.pop();
}

function drawGrid(p: p5, width: number, height: number, origin: Vec2, scale: number, extent: number): void {
  const min = Math.floor(-extent);
  const max = Math.ceil(extent);

  p.push();
  p.noFill();
  p.strokeWeight(1);
  for (let i = min; i <= max; i++) {
    const alpha = i === 0 ? 30 : 8;
    p.stroke(...GUIDE, alpha);
    const x = origin.x + i * scale;
    const y = origin.y - i * scale;
    p.line(x, 0, x, height);
    p.line(0, y, width, y);
  }
  p.pop();
}

function drawProjection(
  p: p5,
  origin: Vec2,
  screenU: Vec2,
  screenProjection: Vec2,
): void {
  drawLine(p, screenU, screenProjection, GUIDE, 34, 1, true);
  drawArrow(p, origin, screenProjection, PROJ_COLOR, 220);

  p.push();
  p.noStroke();
  p.fill(...PROJ_COLOR, 230);
  p.circle(screenProjection.x, screenProjection.y, 6);
  p.pop();
}

function drawAngleArc(
  p: p5,
  origin: Vec2,
  screenU: Vec2,
  screenV: Vec2,
  metrics: DotProductMetrics,
): Vec2 | null {
  if (!metrics.hasAngle) return null;

  const angleU = Math.atan2(screenU.y - origin.y, screenU.x - origin.x);
  const angleV = Math.atan2(screenV.y - origin.y, screenV.x - origin.x);
  const delta = shortestAngleDelta(angleU, angleV);
  const radius = 56;

  p.push();
  p.noFill();
  p.stroke(...ACCENT, metrics.isPerpendicular ? 230 : 112);
  p.strokeWeight(metrics.isPerpendicular ? 2.4 : 1.4);
  p.arc(origin.x, origin.y, radius * 2, radius * 2, angleU, angleU + delta);
  p.pop();

  const mid = angleU + delta * 0.5;
  return {
    x: origin.x + Math.cos(mid) * (radius + 26),
    y: origin.y + Math.sin(mid) * (radius + 26),
  };
}

function drawNode(
  p: p5,
  point: Vec2,
  label: string,
  color: readonly [number, number, number],
  active: boolean,
): void {
  p.push();
  p.noStroke();
  p.fill(...color, active ? 56 : 30);
  p.circle(point.x, point.y, active ? 28 : 22);
  p.fill(...color, 230);
  p.circle(point.x, point.y, active ? 9 : 7);
  p.fill(BG[0], BG[1], BG[2], 190);
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(9);
  p.text(label, point.x, point.y - 1);
  p.pop();
}

function clampLabel(point: Vec2, width: number, height: number): Vec2 {
  return {
    x: Math.max(20, Math.min(width - 20, point.x)),
    y: Math.max(22, Math.min(height - 18, point.y)),
  };
}

function drawLabel(
  p: p5,
  label: string,
  point: Vec2,
  color: readonly [number, number, number],
  width: number,
  height: number,
): void {
  const clamped = clampLabel(point, width, height);
  p.push();
  p.noStroke();
  p.fill(...color, 210);
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(12);
  p.text(label, clamped.x, clamped.y);
  p.pop();
}

function drawBadge(p: p5, metrics: DotProductMetrics): void {
  const text = Math.abs(metrics.dot) < 1e-6 || metrics.isPerpendicular
    ? `${metrics.resultLabel} = 0`
    : `${metrics.resultLabel} ${metrics.dot > 0 ? '>' : '<'} 0`;

  p.push();
  p.noStroke();
  p.fill(...ACCENT, metrics.isPerpendicular ? 44 : 18);
  p.rect(24, 24, 106, 30, 999);
  p.fill(235, 235, 235, metrics.isPerpendicular ? 178 : 112);
  p.textAlign(p.LEFT, p.CENTER);
  p.textSize(12);
  p.text(text, 38, 39);
  p.pop();
}

export function renderDotProductGeometryScene(
  p: p5,
  snap: DotProductGeometrySnap,
): void {
  p.background(...BG);

  const layout = createDotProductLayout(snap.width, snap.height, snap.params);
  const metrics = computeDotProductMetrics(snap.params);
  const { u, v } = vectorFromParams(snap.params);
  const origin = worldToScreen(layout, { x: 0, y: 0 });
  const screenU = worldToScreen(layout, u);
  const screenV = worldToScreen(layout, v);
  const screenProjection = worldToScreen(layout, metrics.projection);

  let angleLabel: Vec2 | null = null;

  withPlotClip(p, layout.plotMin, layout.plotMax, () => {
    drawGrid(p, snap.width, snap.height, origin, layout.scale, layout.extent);

    if (snap.showProjection) {
      drawProjection(p, origin, screenU, screenProjection);
    }

    if (snap.showAngle) {
      angleLabel = drawAngleArc(p, origin, screenU, screenV, metrics);
    }

    drawArrow(p, origin, screenU, U_COLOR, 210, snap.activeDrag === 'u');
    drawArrow(p, origin, screenV, V_COLOR, 188, snap.activeDrag === 'v');
    drawNode(p, screenU, metrics.labelA, U_COLOR, snap.activeDrag === 'u');
    drawNode(p, screenV, metrics.labelB, V_COLOR, snap.activeDrag === 'v');

    p.noStroke();
    p.fill(255, 255, 255, 92);
    p.circle(origin.x, origin.y, 4);
  });

  drawBadge(p, metrics);
  drawLabel(p, metrics.labelA, { x: screenU.x + 18, y: screenU.y - 14 }, U_COLOR, snap.width, snap.height);
  drawLabel(p, metrics.labelB, { x: screenV.x + 18, y: screenV.y - 14 }, V_COLOR, snap.width, snap.height);

  if (snap.showProjection) {
    drawLabel(
      p,
      `proj_${metrics.labelB} ${metrics.labelA}`,
      { x: screenProjection.x + 40, y: screenProjection.y + 16 },
      PROJ_COLOR,
      snap.width,
      snap.height,
    );
  }

  if (angleLabel) {
    const angleText = metrics.isPerpendicular
      ? `${metrics.labelA} ⟂ ${metrics.labelB}`
      : `θ ${((metrics.theta * 180) / Math.PI).toFixed(1)}°`;
    drawLabel(p, angleText, angleLabel, ACCENT, snap.width, snap.height);
  }
}
