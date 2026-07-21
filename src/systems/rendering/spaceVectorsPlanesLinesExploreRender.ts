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
  setDash,
  type Rgb,
} from './scene3d';
import {
  AXIS_LIMIT,
  PLANE_HALF,
  computeSpaceVectorsMetrics,
  footOnPlane,
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

const BG: Rgb = [10, 10, 10];
const GOLD: Rgb = [212, 184, 122];
const PLANE: Rgb = [160, 205, 255];
const NORMAL: Rgb = [164, 225, 176];
const SHADOW: Rgb = [198, 166, 235];

export function renderSpaceVectorsPlanesLinesScene(p: p5, snap: Snap): void {
  const { width, height, params } = snap;
  p.background(BG[0], BG[1], BG[2]);

  const layout = createScene3dLayout(width, height, { scaleDivisor: 8.8, verticalOffset: 0.02 });
  const view = viewFromParams(params);
  const metrics = computeSpaceVectorsMetrics(params);
  const origin = screenOf(layout, vec3(0, 0, 0), view);
  const tip = screenOf(layout, metrics.v, view);
  const mode = params.mode;

  // 同一個場景，三種讀法只改變強調程度
  const planeAlpha = mode === 'position' ? 10 : 30;
  const planeStroke = mode === 'position' ? 70 : 170;
  const vectorAlpha = mode === 'direction' ? 120 : 255;

  drawAxes(p, layout, view, AXIS_LIMIT);

  const quad = planeQuad(metrics.unitNormal, params.h, PLANE_HALF).map((corner) =>
    screenOf(layout, corner, view),
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
      const end = screenOf(layout, shadow.vector, view);
      p.stroke(SHADOW[0], SHADOW[1], SHADOW[2], 110);
      p.strokeWeight(1.5);
      p.line(tip.x, tip.y, end.x, end.y);
    }
    setDash(p, []);
    p.pop();

    for (const shadow of metrics.shadows) {
      const end = screenOf(layout, shadow.vector, view);
      drawArrow(p, origin, end, SHADOW, 2.4, 210);
      drawLabel(p, end, shadow.plane, SHADOW, 200);
    }
  }

  const anchor = planeAnchor(metrics.unitNormal, params.h);
  const anchorScreen = screenOf(layout, anchor, view);

  // 方向讀法：畫出張成平面的 a、b
  if (mode === 'direction') {
    for (const [span, name] of [
      [metrics.a, 'a'],
      [metrics.b, 'b'],
    ] as const) {
      const end = screenOf(layout, addVec3(anchor, span), view);
      drawArrow(p, anchorScreen, end, PLANE, 2.8, 235);
      drawLabel(p, end, name, PLANE);
    }
  }

  // 法向量：方向與關係兩種讀法都靠它
  const normalTip = screenOf(layout, addVec3(anchor, metrics.unitNormal), view);
  drawArrow(
    p,
    anchorScreen,
    normalTip,
    NORMAL,
    mode === 'position' ? 2 : 3,
    mode === 'position' ? 120 : 245,
  );
  if (mode !== 'position') drawLabel(p, normalTip, 'n̂', NORMAL);

  // 關係讀法：v 端點到平面的垂線段
  if (mode === 'relation' && metrics.state === 'apart') {
    const foot = screenOf(layout, footOnPlane(metrics), view);
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
    position: [
      '位置讀法：一個 3D 位置攤成三張 2D 圖',
      `‖v‖ = ${Math.hypot(metrics.v.x, metrics.v.y, metrics.v.z).toFixed(3)}`,
    ],
    direction: [
      '方向讀法：a、b 張成的面壓縮成一支 n̂',
      `n̂ = (${metrics.unitNormal.x.toFixed(2)}, ${metrics.unitNormal.y.toFixed(2)}, ${metrics.unitNormal.z.toFixed(2)})`,
    ],
    relation: [
      `關係讀法：n̂·v − h = ${metrics.signedDistance.toFixed(3)}`,
      stateLabel(metrics.state),
    ],
  };
  drawReadout(p, width, readouts[mode], {
    highlightIndex: mode === 'relation' ? 1 : -1,
    highlightColor: GOLD,
  });

  if (snap.rotating) drawRotatingHint(p, width, height);
}
