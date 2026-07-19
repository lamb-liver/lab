import type p5 from 'p5';
import { canvas2d } from './canvas2d';
import { addVec3, project, scaleVec3, vec3, type Projected, type Vec3 } from '../../curve/projection3d';
import {
  AXIS_LIMIT,
  PLANE_HALF,
  computePlaneNormalDistanceMetrics,
  formatGeneralForm,
  planeQuad,
  viewFromParams,
  type PlaneNormalDistanceParams,
} from '../../curve/modules/plane-normal-distance/geometry';

type Snap = {
  width: number;
  height: number;
  params: PlaneNormalDistanceParams;
  rotating: boolean;
};

const BG: [number, number, number] = [10, 10, 10];
const GOLD: [number, number, number] = [212, 184, 122];
const PLANE: [number, number, number] = [160, 205, 255];
const NORMAL: [number, number, number] = [164, 225, 176];
const GUIDE: [number, number, number] = [255, 255, 255];

type Layout = { cx: number; cy: number; scale: number };

function createLayout(width: number, height: number): Layout {
  const size = Math.min(width, height);
  return { cx: width / 2, cy: height / 2, scale: size / 8.4 };
}

function toScreen(layout: Layout, point: Projected): { x: number; y: number } {
  return { x: layout.cx + point.x * layout.scale, y: layout.cy - point.y * layout.scale };
}

function screenOf(
  layout: Layout,
  v: Vec3,
  params: PlaneNormalDistanceParams,
): { x: number; y: number } {
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

function drawAxes(p: p5, layout: Layout, params: PlaneNormalDistanceParams): void {
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

export function renderPlaneNormalDistanceScene(p: p5, snap: Snap): void {
  const { width, height, params } = snap;
  p.background(BG[0], BG[1], BG[2]);

  const layout = createLayout(width, height);
  const metrics = computePlaneNormalDistanceMetrics(params);

  drawAxes(p, layout, params);

  // 平面
  const quad = planeQuad(metrics.unitNormal, params.h, PLANE_HALF).map((corner) =>
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

  // 單位法向，自平面錨點畫出
  const anchor = scaleVec3(metrics.unitNormal, params.h);
  const anchorScreen = screenOf(layout, anchor, params);
  const normalTip = screenOf(layout, addVec3(anchor, metrics.unitNormal), params);
  drawArrow(p, anchorScreen, normalTip, NORMAL, 2.8, 235);
  drawLabel(p, normalTip, 'n̂', NORMAL);

  // 垂線段：P₁ 到垂足
  const pointScreen = screenOf(layout, metrics.point, params);
  const footScreen = screenOf(layout, metrics.foot, params);
  p.push();
  p.stroke(GOLD[0], GOLD[1], GOLD[2], 240);
  p.strokeWeight(3.4);
  p.line(pointScreen.x, pointScreen.y, footScreen.x, footScreen.y);
  p.pop();

  // 垂足的直角記號：沿平面上任一方向畫一小段
  p.push();
  p.noStroke();
  p.fill(PLANE[0], PLANE[1], PLANE[2], 235);
  p.circle(footScreen.x, footScreen.y, 9);
  p.pop();
  drawLabel(p, footScreen, '垂足', PLANE, 190);

  p.push();
  p.noStroke();
  p.fill(GOLD[0], GOLD[1], GOLD[2], 245);
  p.circle(pointScreen.x, pointScreen.y, 12);
  p.pop();
  drawLabel(p, pointScreen, 'P₁', GOLD);

  // 距離標在垂線段中點
  const mid = {
    x: (pointScreen.x + footScreen.x) / 2,
    y: (pointScreen.y + footScreen.y) / 2,
  };
  drawLabel(p, mid, `d = ${metrics.distance.toFixed(3)}`, GOLD);

  // 讀數：一般式會隨尺度改變，距離不會
  const lines = [
    formatGeneralForm(metrics.coefficients, metrics.constant),
    `距離 ${metrics.distance.toFixed(3)}　帶號 ${metrics.signedDistance.toFixed(3)}`,
    '同乘非零常數只改變係數，不改變平面與距離',
  ];
  p.push();
  p.noStroke();
  p.textSize(14);
  p.textAlign(p.LEFT, p.TOP);
  lines.forEach((line, index) => {
    p.fill(GUIDE[0], GUIDE[1], GUIDE[2], index === 2 ? 120 : 155);
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
