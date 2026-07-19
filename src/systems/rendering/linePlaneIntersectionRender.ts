import type p5 from 'p5';
import { canvas2d } from './canvas2d';
import { addVec3, project, scaleVec3, vec3, type Projected, type Vec3 } from '../../curve/projection3d';
import {
  AXIS_LIMIT,
  LINE_HALF_LENGTH,
  computeLinePlaneMetrics,
  planeAnchor,
  planeQuad,
  pointOnLine,
  stateLabel,
  viewFromParams,
  type LinePlaneParams,
} from '../../curve/modules/line-plane-intersection/geometry';

type Snap = {
  width: number;
  height: number;
  params: LinePlaneParams;
  rotating: boolean;
};

const BG: [number, number, number] = [10, 10, 10];
const GOLD: [number, number, number] = [212, 184, 122];
const PLANE: [number, number, number] = [160, 205, 255];
const NORMAL: [number, number, number] = [164, 225, 176];
const WARN: [number, number, number] = [255, 187, 122];
const GUIDE: [number, number, number] = [255, 255, 255];

const PLANE_HALF = 2.2;

type Layout = { cx: number; cy: number; scale: number };

function createLayout(width: number, height: number): Layout {
  const size = Math.min(width, height);
  return { cx: width / 2, cy: height / 2, scale: size / 9.4 };
}

function toScreen(layout: Layout, point: Projected): { x: number; y: number } {
  return { x: layout.cx + point.x * layout.scale, y: layout.cy - point.y * layout.scale };
}

function screenOf(layout: Layout, v: Vec3, params: LinePlaneParams): { x: number; y: number } {
  return toScreen(layout, project(v, viewFromParams(params)));
}

function setDash(p: p5, pattern: number[]): void {
  canvas2d(p).setLineDash(pattern);
}

function drawArrow(
  p: p5,
  from: { x: number; y: number },
  to: { x: number; y: number },
  color: [number, number, number],
  weight: number,
  alpha = 255,
): void {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy);
  if (len < 1e-6) return;

  p.push();
  p.stroke(color[0], color[1], color[2], alpha);
  p.strokeWeight(weight);
  p.line(from.x, from.y, to.x, to.y);

  const head = Math.min(13, len * 0.3);
  const ux = dx / len;
  const uy = dy / len;
  p.noStroke();
  p.fill(color[0], color[1], color[2], alpha);
  p.triangle(
    to.x,
    to.y,
    to.x - ux * head - uy * head * 0.42,
    to.y - uy * head + ux * head * 0.42,
    to.x - ux * head + uy * head * 0.42,
    to.y - uy * head - ux * head * 0.42,
  );
  p.pop();
}

function drawLabel(
  p: p5,
  at: { x: number; y: number },
  text: string,
  color: [number, number, number],
  alpha = 230,
): void {
  p.push();
  p.noStroke();
  p.fill(color[0], color[1], color[2], alpha);
  p.textSize(14);
  p.textAlign(p.LEFT, p.CENTER);
  p.text(text, at.x + 9, at.y - 9);
  p.pop();
}

function drawAxes(p: p5, layout: Layout, params: LinePlaneParams): void {
  const origin = screenOf(layout, vec3(0, 0, 0), params);
  const axes: Array<{ end: Vec3; label: string }> = [
    { end: vec3(AXIS_LIMIT, 0, 0), label: 'x' },
    { end: vec3(0, AXIS_LIMIT, 0), label: 'y' },
    { end: vec3(0, 0, AXIS_LIMIT), label: 'z' },
  ];

  p.push();
  setDash(p, [4, 6]);
  for (const axis of axes) {
    const end = screenOf(layout, axis.end, params);
    p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 46);
    p.strokeWeight(1.3);
    p.line(origin.x, origin.y, end.x, end.y);
    drawLabel(p, end, axis.label, GUIDE, 70);
  }
  setDash(p, []);
  p.pop();
}

export function renderLinePlaneIntersectionScene(p: p5, snap: Snap): void {
  const { width, height, params } = snap;
  p.background(BG[0], BG[1], BG[2]);

  const layout = createLayout(width, height);
  const metrics = computeLinePlaneMetrics(params);
  const contained = metrics.state === 'contained';
  const parallel = metrics.state === 'parallel';

  drawAxes(p, layout, params);

  // 平面 n·r = h
  const quad = planeQuad(metrics.n, params.h, PLANE_HALF).map((corner) =>
    screenOf(layout, corner, params),
  );
  p.push();
  p.noStroke();
  p.fill(PLANE[0], PLANE[1], PLANE[2], 30);
  p.beginShape();
  for (const corner of quad) p.vertex(corner.x, corner.y);
  p.endShape(p.CLOSE);
  p.noFill();
  p.stroke(PLANE[0], PLANE[1], PLANE[2], 170);
  p.strokeWeight(2);
  p.beginShape();
  for (const corner of quad) p.vertex(corner.x, corner.y);
  p.endShape(p.CLOSE);
  p.pop();

  // 法向量 n，自平面上距離原點最近的錨點畫出
  const anchor = planeAnchor(metrics.n, params.h);
  const anchorScreen = screenOf(layout, anchor, params);
  const normalTip = screenOf(layout, addVec3(anchor, scaleVec3(metrics.n, 1.3)), params);
  drawArrow(p, anchorScreen, normalTip, NORMAL, 2.6, 220);
  drawLabel(p, normalTip, 'n', NORMAL);

  // 直線 r(t) = r₀ + t·d
  const lineStart = screenOf(layout, pointOnLine(metrics, -LINE_HALF_LENGTH), params);
  const lineEnd = screenOf(layout, pointOnLine(metrics, LINE_HALF_LENGTH), params);
  const lineColor = contained ? NORMAL : parallel ? WARN : GOLD;
  p.push();
  p.stroke(lineColor[0], lineColor[1], lineColor[2], contained ? 255 : 235);
  p.strokeWeight(contained ? 4.4 : 3.6);
  p.line(lineStart.x, lineStart.y, lineEnd.x, lineEnd.y);
  p.pop();
  drawLabel(p, lineEnd, 'r(t)', lineColor);

  // 起點 r₀ 與方向 d
  const r0Screen = screenOf(layout, metrics.r0, params);
  const dTip = screenOf(layout, addVec3(metrics.r0, metrics.d), params);
  drawArrow(p, r0Screen, dTip, GOLD, 2.4, 200);
  drawLabel(p, dTip, 'd', GOLD, 190);
  p.push();
  p.noStroke();
  p.fill(GOLD[0], GOLD[1], GOLD[2], 230);
  p.circle(r0Screen.x, r0Screen.y, 8);
  p.pop();
  drawLabel(p, r0Screen, 'r₀', GOLD, 190);

  // 交點
  if (metrics.point) {
    const hit = screenOf(layout, metrics.point, params);
    p.push();
    p.noStroke();
    p.fill(GOLD[0], GOLD[1], GOLD[2], 245);
    p.circle(hit.x, hit.y, 13);
    p.stroke(GOLD[0], GOLD[1], GOLD[2], 120);
    p.noFill();
    p.strokeWeight(1.6);
    p.circle(hit.x, hit.y, 24);
    p.pop();
    drawLabel(p, hit, `t = ${metrics.t!.toFixed(2)}`, GOLD);
  }

  // 讀數
  const lines = [
    `n·d = ${metrics.nDotD.toFixed(3)}　n·r₀ − h = ${metrics.offset.toFixed(3)}`,
    stateLabel(metrics.state),
  ];
  p.push();
  p.noStroke();
  p.textSize(14);
  p.textAlign(p.LEFT, p.TOP);
  lines.forEach((line, index) => {
    const highlight = index === 1 && metrics.state !== 'point';
    p.fill(
      highlight ? WARN[0] : GUIDE[0],
      highlight ? WARN[1] : GUIDE[1],
      highlight ? WARN[2] : GUIDE[2],
      highlight ? 235 : 150,
    );
    p.text(line, 18, 16 + index * 20, width - 36);
  });
  p.pop();

  if (snap.rotating) {
    p.push();
    p.noStroke();
    p.fill(GUIDE[0], GUIDE[1], GUIDE[2], 110);
    p.textSize(13);
    p.textAlign(p.RIGHT, p.BOTTOM);
    p.text('拖動中：旋轉視角', width - 18, height - 16);
    p.pop();
  }
}
