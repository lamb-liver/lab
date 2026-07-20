import type p5 from 'p5';
import { canvas2d } from './canvas2d';
import { addVec3, project, scaleVec3, vec3, type Projected, type Vec3 } from '../../curve/projection3d';
import {
  AXIS_LIMIT,
  PLANE_HALF,
  computeSpaceVectorsMetrics,
  footOnPlane,
  planeQuad,
  stateLabel,
  viewFromParams,
  type SpaceVectorsParams,
} from '../../explore/space-vectors-planes-lines/geometry';

type Snap = {
  width: number;
  height: number;
  params: SpaceVectorsParams;
  rotating: boolean;
};

const BG: [number, number, number] = [10, 10, 10];
const GOLD: [number, number, number] = [212, 184, 122];
const PLANE: [number, number, number] = [160, 205, 255];
const NORMAL: [number, number, number] = [164, 225, 176];
const SHADOW: [number, number, number] = [198, 166, 235];
const GUIDE: [number, number, number] = [255, 255, 255];

type Layout = { cx: number; cy: number; scale: number };

function createLayout(width: number, height: number): Layout {
  const size = Math.min(width, height);
  return { cx: width / 2, cy: height / 2 + size * 0.02, scale: size / 8.8 };
}

function toScreen(layout: Layout, point: Projected): { x: number; y: number } {
  return { x: layout.cx + point.x * layout.scale, y: layout.cy - point.y * layout.scale };
}

function screenOf(layout: Layout, v: Vec3, params: SpaceVectorsParams): { x: number; y: number } {
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

function drawAxes(p: p5, layout: Layout, params: SpaceVectorsParams): void {
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

export function renderSpaceVectorsPlanesLinesScene(p: p5, snap: Snap): void {
  const { width, height, params } = snap;
  p.background(BG[0], BG[1], BG[2]);

  const layout = createLayout(width, height);
  const metrics = computeSpaceVectorsMetrics(params);
  const origin = screenOf(layout, vec3(0, 0, 0), params);
  const tip = screenOf(layout, metrics.v, params);
  const mode = params.mode;

  // 同一個場景，三種讀法只改變強調程度
  const planeAlpha = mode === 'position' ? 10 : 30;
  const planeStroke = mode === 'position' ? 70 : 170;
  const vectorAlpha = mode === 'direction' ? 120 : 255;

  drawAxes(p, layout, params);

  const quad = planeQuad(metrics.unitNormal, params.h, PLANE_HALF).map((corner) =>
    screenOf(layout, corner, params),
  );
  p.push();
  p.noStroke();
  p.fill(PLANE[0], PLANE[1], PLANE[2], planeAlpha);
  p.beginShape();
  for (const corner of quad) p.vertex(corner.x, corner.y);
  p.endShape(p.CLOSE);
  p.noFill();
  p.stroke(PLANE[0], PLANE[1], PLANE[2], planeStroke);
  p.strokeWeight(2);
  p.beginShape();
  for (const corner of quad) p.vertex(corner.x, corner.y);
  p.endShape(p.CLOSE);
  p.pop();

  // 位置讀法：把 v 攤成三張坐標平面上的影子
  if (mode === 'position') {
    p.push();
    setDash(p, [5, 6]);
    for (const shadow of metrics.shadows) {
      const end = screenOf(layout, shadow.vector, params);
      p.stroke(SHADOW[0], SHADOW[1], SHADOW[2], 110);
      p.strokeWeight(1.5);
      p.line(tip.x, tip.y, end.x, end.y);
    }
    setDash(p, []);
    p.pop();

    for (const shadow of metrics.shadows) {
      const end = screenOf(layout, shadow.vector, params);
      drawArrow(p, origin, end, SHADOW, 2.4, 210);
      drawLabel(p, end, shadow.plane, SHADOW, 200);
    }
  }

  // 方向讀法：畫出張成平面的 a、b，法向特別亮
  if (mode === 'direction') {
    const anchor = scaleVec3(metrics.unitNormal, params.h);
    for (const [span, name] of [
      [metrics.a, 'a'],
      [metrics.b, 'b'],
    ] as const) {
      const end = screenOf(layout, addVec3(anchor, span), params);
      drawArrow(p, screenOf(layout, anchor, params), end, PLANE, 2.8, 235);
      drawLabel(p, end, name, PLANE);
    }
  }

  // 法向量：方向與關係兩種讀法都靠它
  const anchor = scaleVec3(metrics.unitNormal, params.h);
  const anchorScreen = screenOf(layout, anchor, params);
  const normalTip = screenOf(layout, addVec3(anchor, metrics.unitNormal), params);
  drawArrow(p, anchorScreen, normalTip, NORMAL, mode === 'position' ? 2 : 3, mode === 'position' ? 120 : 245);
  if (mode !== 'position') drawLabel(p, normalTip, 'n̂', NORMAL);

  // 關係讀法：v 端點到平面的垂線段
  if (mode === 'relation' && metrics.state === 'apart') {
    const foot = screenOf(layout, footOnPlane(metrics), params);
    p.push();
    p.stroke(GOLD[0], GOLD[1], GOLD[2], 220);
    p.strokeWeight(2.6);
    setDash(p, [6, 5]);
    p.line(tip.x, tip.y, foot.x, foot.y);
    setDash(p, []);
    p.noStroke();
    p.fill(PLANE[0], PLANE[1], PLANE[2], 230);
    p.circle(foot.x, foot.y, 8);
    p.pop();
  }

  drawArrow(p, origin, tip, GOLD, 3.8, vectorAlpha);
  drawLabel(p, tip, 'v', GOLD, vectorAlpha);

  const readouts: Record<typeof mode, string[]> = {
    position: ['位置讀法：一個 3D 位置攤成三張 2D 圖', `‖v‖ = ${Math.hypot(metrics.v.x, metrics.v.y, metrics.v.z).toFixed(3)}`],
    direction: ['方向讀法：a、b 張成的面壓縮成一支 n̂', `n̂ = (${metrics.unitNormal.x.toFixed(2)}, ${metrics.unitNormal.y.toFixed(2)}, ${metrics.unitNormal.z.toFixed(2)})`],
    relation: [`關係讀法：n̂·v − h = ${metrics.signedDistance.toFixed(3)}`, stateLabel(metrics.state)],
  };

  p.push();
  p.noStroke();
  p.textSize(14);
  p.textAlign(p.LEFT, p.TOP);
  readouts[mode].forEach((line, index) => {
    const highlight = mode === 'relation' && index === 1;
    p.fill(
      highlight ? GOLD[0] : GUIDE[0],
      highlight ? GOLD[1] : GUIDE[1],
      highlight ? GOLD[2] : GUIDE[2],
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
