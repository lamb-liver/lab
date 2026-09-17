import type p5 from 'p5';
import {
  addVec3,
  degToRad,
  scaleVec3,
  subVec3,
  type Vec3,
} from '../../curve/projection3d';
import {
  LINE_1,
  LINE_2,
  PARALLEL_METRICS,
  pointOnLine,
} from '../../exam/ast-114-plane-parallel-line-distance/geometry';
import {
  createScene3dLayout,
  drawAxes,
  drawLabel,
  drawReadout,
  drawRotatingHint,
  screenOf,
  setDash,
  type Rgb,
} from './scene3d';

type Snap = {
  width: number;
  height: number;
  yaw: number;
  pitch: number;
  rotating: boolean;
};

const BG: Rgb = [10, 10, 10];
const GOLD: Rgb = [212, 184, 122];
const BLUE: Rgb = [160, 205, 255];
const PURPLE: Rgb = [198, 166, 235];
const GUIDE: Rgb = [255, 255, 255];

function drawPoint(p: p5, at: { x: number; y: number }, color: Rgb, label: string): void {
  p.push();
  p.noStroke();
  p.fill(color[0], color[1], color[2], 240);
  p.circle(at.x, at.y, 8);
  p.pop();
  drawLabel(p, at, label, color);
}

function planeQuad(normalAxis: 'x' | 'z', half = 3.2): Vec3[] {
  if (normalAxis === 'x') {
    return [
      { x: 0, y: -half, z: -half },
      { x: 0, y: half, z: -half },
      { x: 0, y: half, z: half },
      { x: 0, y: -half, z: half },
    ];
  }
  return [
    { x: -half, y: -half, z: 0 },
    { x: half, y: -half, z: 0 },
    { x: half, y: half, z: 0 },
    { x: -half, y: half, z: 0 },
  ];
}

export function renderPlaneParallelLineDistanceExamScene(p: p5, snap: Snap): void {
  p.background(BG[0], BG[1], BG[2]);

  const view = { yaw: degToRad(snap.yaw), pitch: degToRad(snap.pitch) };
  const layout = createScene3dLayout(snap.width, snap.height, {
    scaleDivisor: 11,
    verticalOffset: 0.08,
  });
  const center = scaleVec3(addVec3(PARALLEL_METRICS.foot1, PARALLEL_METRICS.foot2), 0.5);
  const screen = (point: Vec3) => screenOf(layout, subVec3(point, center), view);

  drawAxes(p, layout, view, 2.4);

  for (const [axis, color, alpha] of [
    ['x', BLUE, 28],
    ['z', PURPLE, 28],
  ] as const) {
    const quad = planeQuad(axis).map(screen);
    p.push();
    p.noStroke();
    p.fill(color[0], color[1], color[2], alpha);
    p.beginShape();
    for (const q of quad) p.vertex(q.x, q.y);
    p.endShape(p.CLOSE);
    p.pop();
  }

  for (const [line, color, label] of [
    [LINE_1, BLUE, 'L₁'],
    [LINE_2, PURPLE, 'L₂'],
  ] as const) {
    const from = screen(pointOnLine(line, -5));
    const to = screen(pointOnLine(line, 5));
    p.push();
    p.stroke(color[0], color[1], color[2], 220);
    p.strokeWeight(2.6);
    p.line(from.x, from.y, to.x, to.y);
    p.pop();
    drawLabel(p, screen(pointOnLine(line, -3.2)), label, color);
  }

  const foot1 = screen(PARALLEL_METRICS.foot1);
  const foot2 = screen(PARALLEL_METRICS.foot2);
  p.push();
  p.stroke(GOLD[0], GOLD[1], GOLD[2], 245);
  p.strokeWeight(4);
  p.line(foot1.x, foot1.y, foot2.x, foot2.y);
  setDash(p, [6, 5]);
  p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 90);
  p.strokeWeight(1.4);
  p.line(foot1.x, foot1.y, screen(LINE_1.point).x, screen(LINE_1.point).y);
  p.line(foot2.x, foot2.y, screen(LINE_2.point).x, screen(LINE_2.point).y);
  setDash(p, []);
  p.pop();

  drawPoint(p, foot1, GOLD, 'A');
  drawPoint(p, foot2, GOLD, 'B');
  drawPoint(p, screen(LINE_1.point), BLUE, '(0,2,−11)');
  drawPoint(p, screen(LINE_2.point), PURPLE, '(8,21,0)');

  drawReadout(
    p,
    snap.width,
    [
      'L₁ ⊂ {x=0}，L₂ ⊂ {z=0}，平行 ⇒ 方向 (0,1,0)',
      '金線是共同垂線段',
      `|AB|=√185≈${PARALLEL_METRICS.distance.toFixed(3)}`,
    ],
    { highlightIndex: 2, highlightColor: GOLD },
  );

  if (snap.rotating) drawRotatingHint(p, snap.width, snap.height);
}
