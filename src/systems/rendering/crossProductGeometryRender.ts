import type p5 from 'p5';
import { canvas2d } from './canvas2d';
import { project, vec3, type Projected, type Vec3 } from '../../curve/projection3d';
import {
  computeCrossProductMetrics,
  normalArrowTip,
  parallelogramVertices,
  viewFromParams,
  type CrossProductGeometryParams,
} from '../../curve/modules/cross-product-geometry/geometry';

type CrossProductSnap = {
  width: number;
  height: number;
  params: CrossProductGeometryParams;
  rotating: boolean;
};

const BG: [number, number, number] = [10, 10, 10];
const GOLD: [number, number, number] = [212, 184, 122];
const A_COLOR: [number, number, number] = [160, 205, 255];
const B_COLOR: [number, number, number] = [164, 225, 176];
const GUIDE: [number, number, number] = [255, 255, 255];

type Layout = { cx: number; cy: number; scale: number };

function createLayout(width: number, height: number): Layout {
  const size = Math.min(width, height);
  return { cx: width / 2, cy: height / 2 + size * 0.04, scale: size / 9.5 };
}

/** 投影座標的 y 軸向上；canvas 由上而下，所以要翻轉 */
function toScreen(layout: Layout, point: Projected): { x: number; y: number } {
  return { x: layout.cx + point.x * layout.scale, y: layout.cy - point.y * layout.scale };
}

function projectToScreen(
  layout: Layout,
  v: Vec3,
  params: CrossProductGeometryParams,
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

  const head = Math.min(16, len * 0.28);
  const ux = dx / len;
  const uy = dy / len;
  const baseX = to.x - ux * head;
  const baseY = to.y - uy * head;
  const nx = -uy;
  const ny = ux;
  p.noStroke();
  p.fill(color[0], color[1], color[2], alpha);
  p.triangle(
    to.x,
    to.y,
    baseX + nx * head * 0.42,
    baseY + ny * head * 0.42,
    baseX - nx * head * 0.42,
    baseY - ny * head * 0.42,
  );
  p.pop();
}

function drawLabel(
  p: p5,
  at: { x: number; y: number },
  text: string,
  color: [number, number, number],
  alpha = 235,
): void {
  p.push();
  p.noStroke();
  p.fill(color[0], color[1], color[2], alpha);
  p.textSize(15);
  p.textAlign(p.LEFT, p.CENTER);
  p.text(text, at.x + 10, at.y - 8);
  p.pop();
}

/** 三條世界座標軸，提供旋轉時的方位參考 */
function drawAxes(p: p5, layout: Layout, params: CrossProductGeometryParams): void {
  const origin = projectToScreen(layout, vec3(0, 0, 0), params);
  const axes: Array<{ end: Vec3; label: string }> = [
    { end: vec3(4.4, 0, 0), label: 'x' },
    { end: vec3(0, 4.4, 0), label: 'y' },
    { end: vec3(0, 0, 4.4), label: 'z' },
  ];

  p.push();
  setDash(p, [4, 6]);
  for (const axis of axes) {
    const end = projectToScreen(layout, axis.end, params);
    p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 46);
    p.strokeWeight(1.4);
    p.line(origin.x, origin.y, end.x, end.y);
    drawLabel(p, end, axis.label, GUIDE, 70);
  }
  setDash(p, []);
  p.pop();
}

function drawParallelogram(
  p: p5,
  layout: Layout,
  params: CrossProductGeometryParams,
  degenerate: boolean,
): void {
  const quad = parallelogramVertices(
    computeCrossProductMetrics(params).a,
    computeCrossProductMetrics(params).b,
  ).map((point) => projectToScreen(layout, point, params));

  p.push();
  p.noStroke();
  p.fill(GOLD[0], GOLD[1], GOLD[2], degenerate ? 18 : 46);
  p.beginShape();
  for (const point of quad) p.vertex(point.x, point.y);
  p.endShape(p.CLOSE);

  p.noFill();
  p.stroke(GOLD[0], GOLD[1], GOLD[2], degenerate ? 90 : 190);
  p.strokeWeight(2);
  p.beginShape();
  for (const point of quad) p.vertex(point.x, point.y);
  p.endShape(p.CLOSE);
  p.pop();
}

/** a 與 b 之間的夾角弧線，畫在兩者張成的平面上 */
function drawAngleArc(
  p: p5,
  layout: Layout,
  params: CrossProductGeometryParams,
  a: Vec3,
  b: Vec3,
): void {
  const steps = 36;
  const radius = 0.9;
  const points: Array<{ x: number; y: number }> = [];
  const lenA = Math.hypot(a.x, a.y, a.z);
  const lenB = Math.hypot(b.x, b.y, b.z);
  if (lenA < 1e-6 || lenB < 1e-6) return;

  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    // 在 a、b 之間做球面線性插值，弧線才會貼在張成平面上
    const mix = vec3(
      (a.x / lenA) * (1 - t) + (b.x / lenB) * t,
      (a.y / lenA) * (1 - t) + (b.y / lenB) * t,
      (a.z / lenA) * (1 - t) + (b.z / lenB) * t,
    );
    const len = Math.hypot(mix.x, mix.y, mix.z);
    if (len < 1e-6) continue;
    points.push(
      projectToScreen(
        layout,
        vec3((mix.x / len) * radius, (mix.y / len) * radius, (mix.z / len) * radius),
        params,
      ),
    );
  }

  p.push();
  p.noFill();
  p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 120);
  p.strokeWeight(1.6);
  p.beginShape();
  for (const point of points) p.vertex(point.x, point.y);
  p.endShape();
  p.pop();
}

function drawReadout(
  p: p5,
  width: number,
  params: CrossProductGeometryParams,
  area: number,
  degenerate: boolean,
): void {
  const lines = [
    params.mode === 'righthand'
      ? '右手定則：四指由 a 轉向 b，拇指指向 n'
      : '平行四邊形面積 = ‖a × b‖',
    `‖a × b‖ = ${area.toFixed(3)}`,
  ];
  if (degenerate) lines.push('a 與 b 近平行：面積與法向趨近 0');

  p.push();
  p.noStroke();
  p.textSize(14);
  p.textAlign(p.LEFT, p.TOP);
  lines.forEach((line, index) => {
    const isWarning = degenerate && index === lines.length - 1;
    p.fill(
      isWarning ? 255 : GUIDE[0],
      isWarning ? 187 : GUIDE[1],
      isWarning ? 122 : GUIDE[2],
      isWarning ? 235 : 150,
    );
    p.text(line, 18, 16 + index * 20, width - 36);
  });
  p.pop();
}

export function renderCrossProductGeometryScene(p: p5, snap: CrossProductSnap): void {
  const { width, height, params } = snap;
  p.background(BG[0], BG[1], BG[2]);

  const layout = createLayout(width, height);
  const metrics = computeCrossProductMetrics(params);
  const origin = projectToScreen(layout, vec3(0, 0, 0), params);

  drawAxes(p, layout, params);
  drawParallelogram(p, layout, params, metrics.isDegenerate);
  drawAngleArc(p, layout, params, metrics.a, metrics.b);

  const aTip = projectToScreen(layout, metrics.a, params);
  const bTip = projectToScreen(layout, metrics.b, params);
  drawArrow(p, origin, aTip, A_COLOR, 3.4);
  drawArrow(p, origin, bTip, B_COLOR, 3.4);
  drawLabel(p, aTip, 'a', A_COLOR);
  drawLabel(p, bTip, 'b', B_COLOR);

  if (!metrics.isDegenerate) {
    const nTip = projectToScreen(layout, normalArrowTip(metrics), params);
    drawArrow(p, origin, nTip, GOLD, 3.8, params.mode === 'righthand' ? 255 : 210);
    drawLabel(p, nTip, 'n = a × b', GOLD);
  }

  drawReadout(p, width, params, metrics.area, metrics.isDegenerate);

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
