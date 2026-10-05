import type p5 from 'p5';
import {
  presetLabel,
  sceneFromParams,
  VIEW,
  type RowOpParams,
} from '../../curve/modules/row-op-solution-space/geometry';
import {
  createScene3dLayout,
  drawLabel,
  drawAxes,
  drawReadout,
  screenOf,
  setDash,
  type Rgb,
} from './scene3d';

const BG: Rgb = [10, 10, 10];
const GOLD: Rgb = [212, 184, 122];
const WHITE: Rgb = [255, 255, 255];
const AXIS_LIMIT = 2.5;

export function renderRowOpSolutionSpace(p: p5, params: RowOpParams): void {
  const width = p.width;
  const height = p.height;
  p.background(BG[0], BG[1], BG[2]);

  const layout = createScene3dLayout(width, height, { scaleDivisor: 8 });
  const scene = sceneFromParams(params);
  drawAxes(p, layout, VIEW, AXIS_LIMIT);

  for (const patch of scene.planes) {
    const moved = patch.role === 'moved';
    const color = moved ? GOLD : WHITE;
    const corners = patch.corners.map((corner) => screenOf(layout, corner, VIEW));
    p.push();
    p.noStroke();
    p.fill(color[0], color[1], color[2], moved ? 28 : 16);
    p.beginShape();
    for (const corner of corners) p.vertex(corner.x, corner.y);
    p.endShape(p.CLOSE);
    p.noFill();
    p.stroke(color[0], color[1], color[2], moved ? 230 : 150);
    p.strokeWeight(moved ? 2.2 : 1.35);
    p.beginShape();
    for (const corner of corners) p.vertex(corner.x, corner.y);
    p.endShape(p.CLOSE);
    p.pop();
  }

  const guide = scene.guide.map((point) => screenOf(layout, point, VIEW));
  p.push();
  setDash(p, [6, 6]);
  p.stroke(WHITE[0], WHITE[1], WHITE[2], 210);
  p.strokeWeight(1.6);
  p.line(guide[0].x, guide[0].y, guide[1].x, guide[1].y);
  setDash(p, []);
  p.pop();

  if (scene.solution.kind !== 'line' && scene.hinge) {
    const hinge = scene.hinge.map((point) => screenOf(layout, point, VIEW));
    p.push();
    setDash(p, [2, 7]);
    p.stroke(GOLD[0], GOLD[1], GOLD[2], 220);
    p.strokeWeight(1.7);
    p.line(hinge[0].x, hinge[0].y, hinge[1].x, hinge[1].y);
    setDash(p, []);
    p.pop();
  }

  if (scene.solution.kind === 'line') {
    const ends = [
      screenOf(layout, scene.guide[0], VIEW),
      screenOf(layout, scene.guide[1], VIEW),
    ];
    p.push();
    p.stroke(GOLD[0], GOLD[1], GOLD[2], 240);
    p.strokeWeight(3.2);
    p.line(ends[0].x, ends[0].y, ends[1].x, ends[1].y);
    p.pop();
  }

  if (scene.solution.kind === 'point') {
    const at = screenOf(layout, scene.solution.point, VIEW);
    p.push();
    p.stroke(BG[0], BG[1], BG[2]);
    p.strokeWeight(3);
    p.fill(GOLD[0], GOLD[1], GOLD[2], 245);
    p.circle(at.x, at.y, 12);
    p.pop();
    drawLabel(p, at, '解', GOLD);
  }

  drawReadout(p, width, [presetLabel(params.preset)]);
}
