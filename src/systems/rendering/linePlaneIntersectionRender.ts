import type p5 from 'p5';
import { addVec3, planeAnchor, planeQuad, scaleVec3 } from '../../curve/projection3d';
import {
  createScene3dLayout,
  drawArrow,
  drawAxes,
  drawLabel,
  drawReadout,
  drawRotatingHint,
  screenOf,
  type Rgb,
} from './scene3d';
import {
  AXIS_LIMIT,
  LINE_HALF_LENGTH,
  computeLinePlaneMetrics,
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

const BG: Rgb = [10, 10, 10];
const GOLD: Rgb = [212, 184, 122];
const PLANE: Rgb = [160, 205, 255];
const NORMAL: Rgb = [164, 225, 176];
const WARN: Rgb = [255, 187, 122];

const PLANE_HALF = 2.2;

export function renderLinePlaneIntersectionScene(p: p5, snap: Snap): void {
  const { width, height, params } = snap;
  p.background(BG[0], BG[1], BG[2]);

  const layout = createScene3dLayout(width, height, { scaleDivisor: 9.4 });
  const view = viewFromParams(params);
  const metrics = computeLinePlaneMetrics(params);
  const contained = metrics.state === 'contained';
  const parallel = metrics.state === 'parallel';

  drawAxes(p, layout, view, AXIS_LIMIT);

  // 平面 n·r = h
  const quad = planeQuad(metrics.n, params.h, PLANE_HALF).map((corner) =>
    screenOf(layout, corner, view),
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
  const anchorScreen = screenOf(layout, anchor, view);
  const normalTip = screenOf(layout, addVec3(anchor, scaleVec3(metrics.n, 1.3)), view);
  drawArrow(p, anchorScreen, normalTip, NORMAL, 2.6, 220);
  drawLabel(p, normalTip, 'n', NORMAL);

  // 直線 r(t) = r₀ + t·d；三種狀態用顏色分開，不只寫在文字裡
  const lineStart = screenOf(layout, pointOnLine(metrics, -LINE_HALF_LENGTH), view);
  const lineEnd = screenOf(layout, pointOnLine(metrics, LINE_HALF_LENGTH), view);
  const lineColor = contained ? NORMAL : parallel ? WARN : GOLD;
  p.push();
  p.stroke(lineColor[0], lineColor[1], lineColor[2], contained ? 255 : 235);
  p.strokeWeight(contained ? 4.4 : 3.6);
  p.line(lineStart.x, lineStart.y, lineEnd.x, lineEnd.y);
  p.pop();
  drawLabel(p, lineEnd, 'r(t)', lineColor);

  // 起點 r₀ 與方向 d
  const r0Screen = screenOf(layout, metrics.r0, view);
  const dTip = screenOf(layout, addVec3(metrics.r0, metrics.d), view);
  drawArrow(p, r0Screen, dTip, GOLD, 2.4, 200);
  drawLabel(p, dTip, 'd', GOLD, 190);
  p.push();
  p.noStroke();
  p.fill(GOLD[0], GOLD[1], GOLD[2], 230);
  p.circle(r0Screen.x, r0Screen.y, 8);
  p.pop();
  drawLabel(p, r0Screen, 'r₀', GOLD, 190);

  if (metrics.point) {
    const hit = screenOf(layout, metrics.point, view);
    p.push();
    p.noStroke();
    p.fill(GOLD[0], GOLD[1], GOLD[2], 245);
    p.circle(hit.x, hit.y, 13);
    p.noFill();
    p.stroke(GOLD[0], GOLD[1], GOLD[2], 120);
    p.strokeWeight(1.6);
    p.circle(hit.x, hit.y, 24);
    p.pop();
    drawLabel(p, hit, `t = ${metrics.t!.toFixed(2)}`, GOLD);
  }

  drawReadout(
    p,
    width,
    [
      `n·d = ${metrics.nDotD.toFixed(3)}　n·r₀ − h = ${metrics.offset.toFixed(3)}`,
      stateLabel(metrics.state),
    ],
    { highlightIndex: metrics.state === 'point' ? -1 : 1, highlightColor: WARN },
  );

  if (snap.rotating) drawRotatingHint(p, width, height);
}
