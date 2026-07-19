import type p5 from 'p5';
import { canvas2d } from './canvas2d';
import { project, vec3, type Projected, type Vec3 } from '../../curve/projection3d';
import {
  AXIS_LIMIT,
  vectorFromParams,
  viewFromParams,
  visibleProjections,
  type ProjectionPlane,
  type SpaceVectorProjectionParams,
} from '../../curve/modules/space-vector-three-plane-projection/geometry';

type Snap = {
  width: number;
  height: number;
  params: SpaceVectorProjectionParams;
  rotating: boolean;
};

const BG: [number, number, number] = [10, 10, 10];
const GOLD: [number, number, number] = [212, 184, 122];
const GUIDE: [number, number, number] = [255, 255, 255];

/**
 * 三個影子是同一類物件的分類色。避開橘色 [255, 187, 122]：它與主體的金色相鄰，
 * 兩支箭頭並排時難以分辨，所以用藍／綠／紫這組彼此距離較平均的三元組。
 */
const PLANE_COLOR: Record<Exclude<ProjectionPlane, 'all'>, [number, number, number]> = {
  xy: [160, 205, 255],
  xz: [164, 225, 176],
  yz: [198, 166, 235],
};

type Layout = { cx: number; cy: number; scale: number };

function createLayout(width: number, height: number): Layout {
  const size = Math.min(width, height);
  return { cx: width / 2, cy: height / 2 + size * 0.03, scale: size / 8.6 };
}

function toScreen(layout: Layout, point: Projected): { x: number; y: number } {
  return { x: layout.cx + point.x * layout.scale, y: layout.cy - point.y * layout.scale };
}

function screenOf(
  layout: Layout,
  v: Vec3,
  params: SpaceVectorProjectionParams,
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

  const head = Math.min(14, len * 0.3);
  const ux = dx / len;
  const uy = dy / len;
  const baseX = to.x - ux * head;
  const baseY = to.y - uy * head;
  p.noStroke();
  p.fill(color[0], color[1], color[2], alpha);
  p.triangle(
    to.x,
    to.y,
    baseX - uy * head * 0.42,
    baseY + ux * head * 0.42,
    baseX + uy * head * 0.42,
    baseY - ux * head * 0.42,
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

/** 三個坐標平面畫成半透明方塊，讓「影子落在平面上」看得出來 */
function drawPlanes(
  p: p5,
  layout: Layout,
  params: SpaceVectorProjectionParams,
): void {
  const L = AXIS_LIMIT;
  const quads: Array<{ plane: Exclude<ProjectionPlane, 'all'>; corners: Vec3[] }> = [
    { plane: 'xy', corners: [vec3(0, 0, 0), vec3(L, 0, 0), vec3(L, L, 0), vec3(0, L, 0)] },
    { plane: 'xz', corners: [vec3(0, 0, 0), vec3(L, 0, 0), vec3(L, 0, L), vec3(0, 0, L)] },
    { plane: 'yz', corners: [vec3(0, 0, 0), vec3(0, L, 0), vec3(0, L, L), vec3(0, 0, L)] },
  ];

  const focus = params.plane;
  p.push();
  for (const quad of quads) {
    const visible = focus === 'all' || focus === quad.plane;
    const color = PLANE_COLOR[quad.plane];
    p.noStroke();
    p.fill(color[0], color[1], color[2], visible ? 16 : 5);
    p.beginShape();
    for (const corner of quad.corners) {
      const point = screenOf(layout, corner, params);
      p.vertex(point.x, point.y);
    }
    p.endShape(p.CLOSE);
  }
  p.pop();
}

function drawAxes(p: p5, layout: Layout, params: SpaceVectorProjectionParams): void {
  const origin = screenOf(layout, vec3(0, 0, 0), params);
  const axes: Array<{ end: Vec3; label: string }> = [
    { end: vec3(AXIS_LIMIT + 0.9, 0, 0), label: 'x' },
    { end: vec3(0, AXIS_LIMIT + 0.9, 0), label: 'y' },
    { end: vec3(0, 0, AXIS_LIMIT + 0.9), label: 'z' },
  ];

  p.push();
  setDash(p, [4, 6]);
  for (const axis of axes) {
    const end = screenOf(layout, axis.end, params);
    p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 52);
    p.strokeWeight(1.4);
    p.line(origin.x, origin.y, end.x, end.y);
    drawLabel(p, end, axis.label, GUIDE, 78);
  }
  setDash(p, []);
  p.pop();
}

function drawReadout(
  p: p5,
  width: number,
  params: SpaceVectorProjectionParams,
  norm: number,
): void {
  const lines =
    params.plane === 'all'
      ? [
          '三個影子兩兩共用一個分量，可互相校驗同一支 v',
          `‖v‖ = ${norm.toFixed(3)}`,
        ]
      : [`聚焦 ${params.plane} 平面：把不屬於它的分量設為 0`, `‖v‖ = ${norm.toFixed(3)}`];

  p.push();
  p.noStroke();
  p.textSize(14);
  p.textAlign(p.LEFT, p.TOP);
  lines.forEach((line, index) => {
    p.fill(GUIDE[0], GUIDE[1], GUIDE[2], 150);
    p.text(line, 18, 16 + index * 20, width - 36);
  });
  p.pop();
}

export function renderSpaceVectorThreePlaneProjectionScene(p: p5, snap: Snap): void {
  const { width, height, params } = snap;
  p.background(BG[0], BG[1], BG[2]);

  const layout = createLayout(width, height);
  const v = vectorFromParams(params);
  const origin = screenOf(layout, vec3(0, 0, 0), params);
  const tip = screenOf(layout, v, params);
  const projections = visibleProjections(v, params.plane);

  drawPlanes(p, layout, params);
  drawAxes(p, layout, params);

  // 由 v 的端點垂下到各影子端點的輔助線：說明影子是怎麼落下去的
  p.push();
  setDash(p, [5, 6]);
  for (const item of projections) {
    const shadow = screenOf(layout, item.vector, params);
    const color = PLANE_COLOR[item.plane];
    p.stroke(color[0], color[1], color[2], 110);
    p.strokeWeight(1.5);
    p.line(tip.x, tip.y, shadow.x, shadow.y);
  }
  setDash(p, []);
  p.pop();

  for (const item of projections) {
    const shadow = screenOf(layout, item.vector, params);
    const color = PLANE_COLOR[item.plane];
    drawArrow(p, origin, shadow, color, 2.8, 225);
    drawLabel(p, shadow, item.plane, color);
  }

  drawArrow(p, origin, tip, GOLD, 4);
  drawLabel(p, tip, 'v', GOLD);

  drawReadout(p, width, params, Math.hypot(v.x, v.y, v.z));

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
