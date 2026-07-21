import type p5 from 'p5';
import { addVec3, planeAnchor, planeQuad, vec3 } from '../../curve/projection3d';
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
  PLANE_HALF,
  computePlaneNormalDistanceMetrics,
  formatGeneralForm,
  viewFromParams,
  type PlaneNormalDistanceParams,
} from '../../curve/modules/plane-normal-distance/geometry';

type Snap = {
  width: number;
  height: number;
  params: PlaneNormalDistanceParams;
  rotating: boolean;
};

const BG: Rgb = [10, 10, 10];
const GOLD: Rgb = [212, 184, 122];
const PLANE: Rgb = [160, 205, 255];
const NORMAL: Rgb = [164, 225, 176];

export function renderPlaneNormalDistanceScene(p: p5, snap: Snap): void {
  const { width, height, params } = snap;
  p.background(BG[0], BG[1], BG[2]);

  const layout = createScene3dLayout(width, height, { scaleDivisor: 8.4 });
  const view = viewFromParams(params);
  const metrics = computePlaneNormalDistanceMetrics(params);

  drawAxes(p, layout, view, AXIS_LIMIT);

  const quad = planeQuad(metrics.unitNormal, params.h, PLANE_HALF).map((corner) =>
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

  // 單位法向，自平面錨點畫出
  const anchor = planeAnchor(metrics.unitNormal, params.h);
  const anchorScreen = screenOf(layout, anchor, view);
  const normalTip = screenOf(layout, addVec3(anchor, metrics.unitNormal), view);
  drawArrow(p, anchorScreen, normalTip, NORMAL, 2.8, 235);
  drawLabel(p, normalTip, 'n̂', NORMAL);

  // 垂線段：P₁ 到垂足
  const pointScreen = screenOf(layout, metrics.point, view);
  const footScreen = screenOf(layout, metrics.foot, view);
  p.push();
  p.stroke(GOLD[0], GOLD[1], GOLD[2], 240);
  p.strokeWeight(3.4);
  p.line(pointScreen.x, pointScreen.y, footScreen.x, footScreen.y);
  p.noStroke();
  p.fill(PLANE[0], PLANE[1], PLANE[2], 235);
  p.circle(footScreen.x, footScreen.y, 9);
  p.fill(GOLD[0], GOLD[1], GOLD[2], 245);
  p.circle(pointScreen.x, pointScreen.y, 12);
  p.pop();

  drawLabel(p, footScreen, '垂足', PLANE, 190);
  drawLabel(p, pointScreen, 'P₁', GOLD);
  drawLabel(
    p,
    { x: (pointScreen.x + footScreen.x) / 2, y: (pointScreen.y + footScreen.y) / 2 },
    `d = ${metrics.distance.toFixed(3)}`,
    GOLD,
  );

  // 一般式會隨尺度改變，距離不會
  drawReadout(p, width, [
    formatGeneralForm(metrics.coefficients, metrics.constant),
    `距離 ${metrics.distance.toFixed(3)}　帶號 ${metrics.signedDistance.toFixed(3)}`,
    '同乘非零常數只改變係數，不改變平面與距離',
  ]);

  if (snap.rotating) drawRotatingHint(p, width, height);
}
