import type p5 from 'p5';
import {
  addVec3,
  degToRad,
  normalizeVec3,
  scaleVec3,
  subVec3,
  type Vec3,
} from '../../curve/projection3d';
import {
  LINE_1,
  LINE_2,
  SKEW_LINE_METRICS,
  offsetPoints,
} from '../../exam/gsat-112-skew-line-distance/geometry';
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
  offset: number;
  rotating: boolean;
};

const BG: Rgb = [10, 10, 10];
const GOLD: Rgb = [212, 184, 122];
const BLUE: Rgb = [160, 205, 255];
const PURPLE: Rgb = [198, 166, 235];
const GUIDE: Rgb = [255, 255, 255];

function pointAlong(point: Vec3, direction: Vec3, distance: number): Vec3 {
  return addVec3(point, scaleVec3(normalizeVec3(direction), distance));
}

function drawPoint(p: p5, at: { x: number; y: number }, color: Rgb, label: string): void {
  p.push();
  p.noStroke();
  p.fill(color[0], color[1], color[2], 240);
  p.circle(at.x, at.y, 8);
  p.pop();
  drawLabel(p, at, label, color);
}

export function renderSkewLineDistanceExamScene(p: p5, snap: Snap): void {
  p.background(BG[0], BG[1], BG[2]);

  const view = { yaw: degToRad(snap.yaw), pitch: degToRad(snap.pitch) };
  const layout = createScene3dLayout(snap.width, snap.height, {
    scaleDivisor: 9.5,
    verticalOffset: 0.12,
  });
  const center = scaleVec3(addVec3(SKEW_LINE_METRICS.foot1, SKEW_LINE_METRICS.foot2), 0.5);
  const screen = (point: Vec3) => screenOf(layout, subVec3(point, center), view);
  const { p: pointP, q: pointQ, distance } = offsetPoints(snap.offset);

  drawAxes(p, layout, view, 2.2);

  for (const [line, foot, color, label] of [
    [LINE_1, SKEW_LINE_METRICS.foot1, BLUE, 'L₁'],
    [LINE_2, SKEW_LINE_METRICS.foot2, PURPLE, 'L₂'],
  ] as const) {
    const from = screen(pointAlong(foot, line.direction, -4));
    const to = screen(pointAlong(foot, line.direction, 4));
    p.push();
    p.stroke(color[0], color[1], color[2], 210);
    p.strokeWeight(2.6);
    p.line(from.x, from.y, to.x, to.y);
    p.pop();
    drawLabel(p, screen(pointAlong(foot, line.direction, -2.7)), label, color);
  }

  const foot1 = screen(SKEW_LINE_METRICS.foot1);
  const foot2 = screen(SKEW_LINE_METRICS.foot2);
  const pScreen = screen(pointP);
  const qScreen = screen(pointQ);

  p.push();
  p.stroke(GOLD[0], GOLD[1], GOLD[2], 245);
  p.strokeWeight(4);
  p.line(foot1.x, foot1.y, foot2.x, foot2.y);

  p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 100);
  p.strokeWeight(1.8);
  p.line(foot1.x, foot1.y, pScreen.x, pScreen.y);
  p.line(foot2.x, foot2.y, qScreen.x, qScreen.y);
  setDash(p, [6, 5]);
  p.stroke(GOLD[0], GOLD[1], GOLD[2], 150);
  p.line(pScreen.x, pScreen.y, qScreen.x, qScreen.y);
  setDash(p, []);
  p.pop();

  drawPoint(p, foot1, GOLD, 'A');
  drawPoint(p, foot2, GOLD, 'B');
  if (snap.offset > 0.02) {
    drawPoint(p, pScreen, BLUE, 'P');
    drawPoint(p, qScreen, PURPLE, 'Q');
  }

  drawReadout(
    p,
    snap.width,
    [
      '金線 AB 同時垂直 L₁、L₂',
      '兩直線距離 |AB| = 4√2',
      `|AP|=|BQ|=${snap.offset.toFixed(1)}，|PQ|≈${distance.toFixed(3)}`,
    ],
    { highlightIndex: 1, highlightColor: GOLD },
  );

  if (snap.rotating) drawRotatingHint(p, snap.width, snap.height);
}
