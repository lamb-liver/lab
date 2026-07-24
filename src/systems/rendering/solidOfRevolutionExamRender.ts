import type p5 from 'p5';
import { degToRad, vec3, type Vec3 } from '../../curve/projection3d';
import {
  exactVolume,
  midpointDiskVolume,
  profileY,
} from '../../exam/ast-114-solid-of-revolution/geometry';
import {
  createScene3dLayout,
  drawLabel,
  drawReadout,
  screenOf,
  type Rgb,
} from './scene3d';

type Snap = {
  width: number;
  height: number;
  a: number;
  slices: number;
  sweep: number;
};

const BG: Rgb = [10, 10, 10];
const GOLD: Rgb = [212, 184, 122];
const BLUE: Rgb = [160, 205, 255];
const GUIDE: Rgb = [255, 255, 255];

function surfacePoint(x: number, radius: number, theta: number): Vec3 {
  return vec3(x, radius * Math.cos(theta), radius * Math.sin(theta));
}

export function renderSolidOfRevolutionExamScene(p: p5, snap: Snap): void {
  p.background(BG[0], BG[1], BG[2]);

  const view = { yaw: degToRad(16), pitch: degToRad(22) };
  const layout = createScene3dLayout(snap.width, snap.height, {
    scaleDivisor: 6.5,
    verticalOffset: 0.1,
  });
  const thetaMax = Math.PI * 2 * snap.sweep;
  const screen = (point: Vec3) => screenOf(layout, point, view);
  const axisFrom = screen(vec3(-1.25, 0, 0));
  const axisTo = screen(vec3(1.25, 0, 0));

  p.push();
  p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 70);
  p.strokeWeight(1.4);
  p.line(axisFrom.x, axisFrom.y, axisTo.x, axisTo.y);
  p.pop();
  drawLabel(p, axisTo, 'x', GUIDE, 100);

  const longitudeCount = 6;
  for (let line = 0; line <= longitudeCount; line += 1) {
    const theta = (thetaMax * line) / longitudeCount;
    p.push();
    p.noFill();
    p.stroke(BLUE[0], BLUE[1], BLUE[2], line === 0 ? 220 : 95);
    p.strokeWeight(line === 0 ? 2.8 : 1.2);
    p.beginShape();
    for (let step = 0; step <= 48; step += 1) {
      const x = -1 + (step * 2) / 48;
      const at = screen(surfacePoint(x, profileY(x, snap.a), theta));
      p.vertex(at.x, at.y);
    }
    p.endShape();
    p.pop();
  }

  const arcSteps = Math.max(2, Math.ceil(32 * snap.sweep));
  for (let disk = 0; disk < snap.slices; disk += 1) {
    const x = -1 + ((disk + 0.5) * 2) / snap.slices;
    const radius = profileY(x, snap.a);
    p.push();
    p.noFill();
    p.stroke(GOLD[0], GOLD[1], GOLD[2], 115);
    p.strokeWeight(1.15);
    p.beginShape();
    for (let step = 0; step <= arcSteps; step += 1) {
      const theta = (thetaMax * step) / arcSteps;
      const at = screen(surfacePoint(x, radius, theta));
      p.vertex(at.x, at.y);
    }
    p.endShape();
    p.pop();
  }

  const profileStart = screen(surfacePoint(-1, profileY(-1, snap.a), 0));
  const profileEnd = screen(surfacePoint(1, profileY(1, snap.a), 0));
  drawLabel(p, profileStart, 'x=−1', GOLD, 175);
  drawLabel(p, profileEnd, 'x=1', GOLD, 175);

  drawReadout(
    p,
    snap.width,
    [
      `f(x)=3(${snap.a.toFixed(1)})x²+1−(${snap.a.toFixed(1)})`,
      `圓盤中點和（n=${snap.slices}）≈ ${midpointDiskVolume(snap.a, snap.slices).toFixed(3)}`,
      `精確體積 V ≈ ${exactVolume(snap.a).toFixed(3)}`,
    ],
    { highlightIndex: 2, highlightColor: GOLD },
  );
}
