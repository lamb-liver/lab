import type p5 from 'p5';
import {
  add,
  createVectorAdditionScalarLayout,
  scaleVec,
  vectorFromParams,
  worldToScreen,
  type Vec2,
  type VectorAdditionScalarParams,
} from '../../curve/modules/vector-addition-scalar/geometry';

type VectorAdditionScalarSnap = {
  width: number;
  height: number;
  params: VectorAdditionScalarParams;
  showComponents: boolean;
  activeDrag: 'u' | 'v' | null;
};

const BG: [number, number, number] = [10, 10, 10];
const ACCENT: [number, number, number] = [212, 184, 122];
const GUIDE: [number, number, number] = [255, 255, 255];
const U_COLOR: [number, number, number] = [155, 204, 255];
const V_COLOR: [number, number, number] = [164, 225, 176];
const SUM_COLOR: [number, number, number] = [245, 215, 132];
const SCALED_COLOR: [number, number, number] = [255, 178, 126];

function setDash(p: p5, pattern: number[]): void {
  const ctx = p.drawingContext as CanvasRenderingContext2D;
  ctx.setLineDash(pattern);
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
  setDash(p, dashed ? [6, 6] : []);
  p.line(a.x, a.y, b.x, b.y);
  setDash(p, []);
  p.pop();
}

function drawArrow(
  p: p5,
  from: Vec2,
  to: Vec2,
  color: readonly [number, number, number],
  coreAlpha: number,
  active = false,
): void {
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  const len = Math.hypot(to.x - from.x, to.y - from.y);
  if (len < 0.001) return;

  drawLine(p, from, to, color, active ? 52 : 26, active ? 8 : 6);
  drawLine(p, from, to, color, coreAlpha, active ? 2.4 : 1.8);

  const head = active ? 13 : 11;
  const wing = 0.72;
  const left = {
    x: to.x - Math.cos(angle - wing) * head,
    y: to.y - Math.sin(angle - wing) * head,
  };
  const right = {
    x: to.x - Math.cos(angle + wing) * head,
    y: to.y - Math.sin(angle + wing) * head,
  };

  p.push();
  p.noFill();
  p.stroke(...color, coreAlpha);
  p.strokeWeight(active ? 2.4 : 1.8);
  p.strokeCap(p.ROUND);
  p.line(to.x, to.y, left.x, left.y);
  p.line(to.x, to.y, right.x, right.y);
  p.pop();
}

function drawGrid(p: p5, width: number, height: number, origin: Vec2, scale: number, extent: number): void {
  const step = 1;
  const min = Math.floor(-extent);
  const max = Math.ceil(extent);

  p.push();
  p.noFill();
  p.strokeWeight(1);
  for (let i = min; i <= max; i += step) {
    const alpha = i === 0 ? 28 : 9;
    p.stroke(...GUIDE, alpha);
    const x = origin.x + i * scale;
    const y = origin.y - i * scale;
    p.line(x, 0, x, height);
    p.line(0, y, width, y);
  }
  p.pop();
}

function drawNode(
  p: p5,
  point: Vec2,
  color: readonly [number, number, number],
  active: boolean,
): void {
  p.push();
  p.noStroke();
  p.fill(...color, active ? 58 : 32);
  p.circle(point.x, point.y, active ? 20 : 16);
  p.fill(...color, active ? 255 : 210);
  p.circle(point.x, point.y, active ? 7 : 5.5);
  p.pop();
}

function clampLabel(point: Vec2, width: number, height: number): Vec2 {
  return {
    x: Math.max(18, Math.min(width - 18, point.x)),
    y: Math.max(22, Math.min(height - 16, point.y)),
  };
}

function drawLabel(
  p: p5,
  text: string,
  point: Vec2,
  color: readonly [number, number, number],
  width: number,
  height: number,
): void {
  const label = clampLabel(point, width, height);
  p.push();
  p.noStroke();
  p.fill(...color, 210);
  p.textSize(13);
  p.textAlign(p.CENTER, p.CENTER);
  p.text(text, label.x, label.y);
  p.pop();
}

function drawComponents(
  p: p5,
  origin: Vec2,
  point: Vec2,
  color: readonly [number, number, number],
): void {
  const footX = { x: point.x, y: origin.y };
  const footY = { x: origin.x, y: point.y };
  drawLine(p, point, footX, color, 54, 1, true);
  drawLine(p, point, footY, color, 40, 1, true);
}

export function renderVectorAdditionScalarScene(
  p: p5,
  snap: VectorAdditionScalarSnap,
): void {
  p.background(...BG);

  const layout = createVectorAdditionScalarLayout(snap.width, snap.height, snap.params);
  const { u, v } = vectorFromParams(snap.params);
  const sum = add(u, v);
  const scaled = scaleVec(v, snap.params.scalar);

  const origin = worldToScreen(layout, { x: 0, y: 0 });
  const screenU = worldToScreen(layout, u);
  const screenV = worldToScreen(layout, v);
  const screenSum = worldToScreen(layout, sum);
  const screenScaled = worldToScreen(layout, scaled);
  const translatedU = worldToScreen(layout, add(u, v));
  const translatedV = worldToScreen(layout, add(v, u));

  drawGrid(p, snap.width, snap.height, origin, layout.scale, layout.extent);

  drawLine(p, screenU, translatedU, ACCENT, 42, 1.1, true);
  drawLine(p, screenV, translatedV, ACCENT, 42, 1.1, true);

  if (snap.showComponents) {
    drawComponents(p, origin, screenU, U_COLOR);
    drawComponents(p, origin, screenV, V_COLOR);
    drawComponents(p, origin, screenScaled, SCALED_COLOR);
  }

  drawArrow(p, origin, screenU, U_COLOR, 190, snap.activeDrag === 'u');
  drawArrow(p, origin, screenV, V_COLOR, 190, snap.activeDrag === 'v');
  drawArrow(p, origin, screenSum, SUM_COLOR, 255);
  drawArrow(p, origin, screenScaled, SCALED_COLOR, 228);

  drawNode(p, screenU, U_COLOR, snap.activeDrag === 'u');
  drawNode(p, screenV, V_COLOR, snap.activeDrag === 'v');
  drawNode(p, screenSum, SUM_COLOR, false);
  drawNode(p, screenScaled, SCALED_COLOR, false);

  drawLabel(p, 'u', { x: screenU.x + 16, y: screenU.y - 12 }, U_COLOR, snap.width, snap.height);
  drawLabel(p, 'v', { x: screenV.x + 16, y: screenV.y - 12 }, V_COLOR, snap.width, snap.height);
  drawLabel(p, 'u + v', { x: screenSum.x + 24, y: screenSum.y - 14 }, SUM_COLOR, snap.width, snap.height);
  drawLabel(p, 'c v', { x: screenScaled.x + 22, y: screenScaled.y + 14 }, SCALED_COLOR, snap.width, snap.height);
}
