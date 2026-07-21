import type p5 from 'p5';
import { vec3, type Vec3 } from '../../curve/projection3d';
import {
  createScene3dLayout,
  drawArrow,
  drawAxes,
  drawLabel,
  drawReadout,
  drawRotatingHint,
  screenOf,
  type Rgb,
  type Scene3dLayout,
} from './scene3d';
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

const BG: Rgb = [10, 10, 10];
const GOLD: Rgb = [212, 184, 122];
const A_COLOR: Rgb = [160, 205, 255];
const B_COLOR: Rgb = [164, 225, 176];
const GUIDE: Rgb = [255, 255, 255];
const WARN: Rgb = [255, 187, 122];

/** a、b 之間的夾角弧線，沿兩者張成的平面畫，才看得出角在哪個面上 */
function drawAngleArc(
  p: p5,
  layout: Scene3dLayout,
  view: ReturnType<typeof viewFromParams>,
  a: Vec3,
  b: Vec3,
): void {
  const lenA = Math.hypot(a.x, a.y, a.z);
  const lenB = Math.hypot(b.x, b.y, b.z);
  if (lenA < 1e-6 || lenB < 1e-6) return;

  const steps = 36;
  const radius = 0.9;
  const points = [];
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const mix = vec3(
      (a.x / lenA) * (1 - t) + (b.x / lenB) * t,
      (a.y / lenA) * (1 - t) + (b.y / lenB) * t,
      (a.z / lenA) * (1 - t) + (b.z / lenB) * t,
    );
    const len = Math.hypot(mix.x, mix.y, mix.z);
    if (len < 1e-6) continue;
    points.push(
      screenOf(
        layout,
        vec3((mix.x / len) * radius, (mix.y / len) * radius, (mix.z / len) * radius),
        view,
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

export function renderCrossProductGeometryScene(p: p5, snap: CrossProductSnap): void {
  const { width, height, params } = snap;
  p.background(BG[0], BG[1], BG[2]);

  const layout = createScene3dLayout(width, height, { scaleDivisor: 9.5, verticalOffset: 0.04 });
  const view = viewFromParams(params);
  const metrics = computeCrossProductMetrics(params);
  const origin = screenOf(layout, vec3(0, 0, 0), view);

  drawAxes(p, layout, view, 4.4);

  const quad = parallelogramVertices(metrics.a, metrics.b).map((point) =>
    screenOf(layout, point, view),
  );
  p.push();
  p.noStroke();
  p.fill(GOLD[0], GOLD[1], GOLD[2], metrics.isDegenerate ? 18 : 46);
  p.beginShape();
  for (const point of quad) p.vertex(point.x, point.y);
  p.endShape(p.CLOSE);
  p.noFill();
  p.stroke(GOLD[0], GOLD[1], GOLD[2], metrics.isDegenerate ? 90 : 190);
  p.strokeWeight(2);
  p.beginShape();
  for (const point of quad) p.vertex(point.x, point.y);
  p.endShape(p.CLOSE);
  p.pop();

  drawAngleArc(p, layout, view, metrics.a, metrics.b);

  const aTip = screenOf(layout, metrics.a, view);
  const bTip = screenOf(layout, metrics.b, view);
  drawArrow(p, origin, aTip, A_COLOR, 3.4);
  drawArrow(p, origin, bTip, B_COLOR, 3.4);
  drawLabel(p, aTip, 'a', A_COLOR);
  drawLabel(p, bTip, 'b', B_COLOR);

  if (!metrics.isDegenerate) {
    const nTip = screenOf(layout, normalArrowTip(metrics), view);
    drawArrow(p, origin, nTip, GOLD, 3.8, params.mode === 'righthand' ? 255 : 210);
    drawLabel(p, nTip, 'n = a × b', GOLD);
  }

  const lines = [
    params.mode === 'righthand'
      ? '右手定則：四指由 a 轉向 b，拇指指向 n'
      : '平行四邊形面積 = ‖a × b‖',
    `‖a × b‖ = ${metrics.area.toFixed(3)}`,
  ];
  if (metrics.isDegenerate) lines.push('a 與 b 近平行：面積與法向趨近 0');
  drawReadout(p, width, lines, {
    highlightIndex: metrics.isDegenerate ? lines.length - 1 : -1,
    highlightColor: WARN,
  });

  if (snap.rotating) drawRotatingHint(p, width, height);
}
