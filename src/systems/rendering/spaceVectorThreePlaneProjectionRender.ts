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
  setDash,
  type Rgb,
  type Scene3dLayout,
} from './scene3d';
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

const BG: Rgb = [10, 10, 10];
const GOLD: Rgb = [212, 184, 122];

/**
 * 三個影子是同一類物件的分類色。避開橘色 [255, 187, 122]：它與主體的金色相鄰，
 * 兩支箭頭並排時難以分辨，所以用藍／綠／紫這組彼此距離較平均的三元組。
 */
const PLANE_COLOR: Record<Exclude<ProjectionPlane, 'all'>, Rgb> = {
  xy: [160, 205, 255],
  xz: [164, 225, 176],
  yz: [198, 166, 235],
};

/** 三個坐標平面畫成半透明方塊，讓「影子落在平面上」看得出來 */
function drawCoordinatePlanes(
  p: p5,
  layout: Scene3dLayout,
  view: ReturnType<typeof viewFromParams>,
  focus: ProjectionPlane,
): void {
  const L = AXIS_LIMIT;
  const quads: Array<{ plane: Exclude<ProjectionPlane, 'all'>; corners: Vec3[] }> = [
    { plane: 'xy', corners: [vec3(0, 0, 0), vec3(L, 0, 0), vec3(L, L, 0), vec3(0, L, 0)] },
    { plane: 'xz', corners: [vec3(0, 0, 0), vec3(L, 0, 0), vec3(L, 0, L), vec3(0, 0, L)] },
    { plane: 'yz', corners: [vec3(0, 0, 0), vec3(0, L, 0), vec3(0, L, L), vec3(0, 0, L)] },
  ];

  p.push();
  p.noStroke();
  for (const quad of quads) {
    const visible = focus === 'all' || focus === quad.plane;
    const color = PLANE_COLOR[quad.plane];
    p.fill(color[0], color[1], color[2], visible ? 16 : 5);
    p.beginShape();
    for (const corner of quad.corners) {
      const point = screenOf(layout, corner, view);
      p.vertex(point.x, point.y);
    }
    p.endShape(p.CLOSE);
  }
  p.pop();
}

export function renderSpaceVectorThreePlaneProjectionScene(p: p5, snap: Snap): void {
  const { width, height, params } = snap;
  p.background(BG[0], BG[1], BG[2]);

  const layout = createScene3dLayout(width, height, { scaleDivisor: 8.6, verticalOffset: 0.03 });
  const view = viewFromParams(params);
  const v = vectorFromParams(params);
  const origin = screenOf(layout, vec3(0, 0, 0), view);
  const tip = screenOf(layout, v, view);
  const projections = visibleProjections(v, params.plane);

  drawCoordinatePlanes(p, layout, view, params.plane);
  drawAxes(p, layout, view, AXIS_LIMIT + 0.9);

  // 由 v 的端點垂下到各影子端點的輔助線：說明影子是怎麼落下去的
  p.push();
  setDash(p, [5, 6]);
  for (const item of projections) {
    const shadow = screenOf(layout, item.vector, view);
    const color = PLANE_COLOR[item.plane];
    p.stroke(color[0], color[1], color[2], 110);
    p.strokeWeight(1.5);
    p.line(tip.x, tip.y, shadow.x, shadow.y);
  }
  setDash(p, []);
  p.pop();

  for (const item of projections) {
    const shadow = screenOf(layout, item.vector, view);
    const color = PLANE_COLOR[item.plane];
    drawArrow(p, origin, shadow, color, 2.8, 225);
    drawLabel(p, shadow, item.plane, color);
  }

  drawArrow(p, origin, tip, GOLD, 4);
  drawLabel(p, tip, 'v', GOLD);

  const norm = Math.hypot(v.x, v.y, v.z);
  drawReadout(
    p,
    width,
    params.plane === 'all'
      ? ['三個影子兩兩共用一個分量，可互相校驗同一支 v', `‖v‖ = ${norm.toFixed(3)}`]
      : [`聚焦 ${params.plane} 平面：把不屬於它的分量設為 0`, `‖v‖ = ${norm.toFixed(3)}`],
  );

  if (snap.rotating) drawRotatingHint(p, width, height);
}
