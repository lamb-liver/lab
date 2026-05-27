import type p5 from 'p5';
import type { ParamValues } from '../../curve/types';
import {
  SIERPINSKI_VIEW,
  buildChaosSteps,
  buildRecursiveTopology,
  buildRootTriangle,
  chaosPointCountForDepth,
  sierpinskiModeFromValue,
  type ChaosStep,
  type TopologyTriangle,
  type Triangle,
} from '../../curve/modules/sierpinski-triangle/geometry';

export type SierpinskiTriangleSnap = {
  width: number;
  height: number;
  params: ParamValues;
  revealProgress: number;
};

const PRIMARY = { r: 212, g: 184, b: 122 };
const GUIDE = { r: 255, g: 255, b: 255 };

export function renderSierpinskiTriangleScene(p: p5, snap: SierpinskiTriangleSnap): void {
  p.background(10, 10, 10);

  const designScale = Math.min(snap.width / SIERPINSKI_VIEW.width, snap.height / SIERPINSKI_VIEW.height);
  const designOffsetX = (snap.width - SIERPINSKI_VIEW.width * designScale) / 2;
  const designOffsetY = (snap.height - SIERPINSKI_VIEW.height * designScale) / 2;

  p.push();
  p.translate(designOffsetX, designOffsetY);
  p.scale(designScale);

  const mode = sierpinskiModeFromValue(snap.params.mode);
  if (mode === 'recursive') {
    drawRecursivePanel(p, 0, SIERPINSKI_VIEW.width, snap);
  } else if (mode === 'chaos') {
    drawChaosPanel(p, 0, SIERPINSKI_VIEW.width, snap);
  } else {
    drawRecursivePanel(p, 0, SIERPINSKI_VIEW.width * 0.5, snap);
    drawChaosPanel(p, SIERPINSKI_VIEW.width * 0.5, SIERPINSKI_VIEW.width * 0.5, snap);
    drawDivider(p);
  }

  p.pop();
}

function drawRecursivePanel(
  p: p5,
  offsetX: number,
  panelWidth: number,
  snap: SierpinskiTriangleSnap,
): void {
  const root = buildRootTriangle(offsetX, panelWidth);
  const topology = buildRecursiveTopology(root, snap.params.depth ?? 6);
  const maxSpawn = Math.max(1, Math.round(snap.params.depth ?? 6));
  const activeSpawn = snap.revealProgress * (maxSpawn + 1);

  drawGuide(p, root);
  for (const tri of topology) {
    if (tri.spawn > activeSpawn) continue;
    if (tri.type === 'solid') drawSolidTriangle(p, tri);
    else drawVoidTriangle(p, tri);
  }
}

function drawChaosPanel(
  p: p5,
  offsetX: number,
  panelWidth: number,
  snap: SierpinskiTriangleSnap,
): void {
  const root = buildRootTriangle(offsetX, panelWidth);
  const depth = Math.round(snap.params.depth ?? 6);
  const targetCount = Math.floor(chaosPointCountForDepth(depth) * snap.revealProgress);
  const steps = buildChaosSteps(root, targetCount, 20260528 + depth);

  drawGuide(p, root);
  drawChaosPoints(p, steps);
  drawAffineMaps(p, steps.slice(-4));
}

function drawSolidTriangle(p: p5, tri: TopologyTriangle): void {
  const alpha = 18 / (tri.depth + 1);
  p.push();
  p.noStroke();
  p.fill(PRIMARY.r, PRIMARY.g, PRIMARY.b, alpha);
  drawTriangle(p, tri);
  p.pop();
}

function drawVoidTriangle(p: p5, tri: TopologyTriangle): void {
  const attenuation = 1 / (tri.depth + 1);
  p.push();
  p.noStroke();
  p.fill(10, 10, 10);
  drawTriangle(p, tri);

  p.noFill();
  p.stroke(PRIMARY.r, PRIMARY.g, PRIMARY.b, 52 * attenuation);
  p.strokeWeight(1);
  drawTriangle(p, tri);
  p.pop();
}

function drawChaosPoints(p: p5, steps: ChaosStep[]): void {
  p.push();
  p.stroke(PRIMARY.r, PRIMARY.g, PRIMARY.b, 48);
  p.strokeWeight(1);
  for (const step of steps) {
    p.point(step.point.x, step.point.y);
  }
  p.pop();
}

function drawAffineMaps(p: p5, steps: ChaosStep[]): void {
  p.push();
  p.strokeWeight(1);
  for (const step of steps) {
    p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 16);
    p.line(step.from.x, step.from.y, step.target.x, step.target.y);
    p.stroke(PRIMARY.r, PRIMARY.g, PRIMARY.b, 55);
    p.line(step.from.x, step.from.y, step.point.x, step.point.y);
    p.noStroke();
    p.fill(GUIDE.r, GUIDE.g, GUIDE.b, 70);
    p.circle(step.target.x, step.target.y, 5);
  }
  p.pop();
}

function drawGuide(p: p5, root: Triangle): void {
  p.push();
  p.noFill();
  p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 22);
  p.strokeWeight(1);
  drawTriangle(p, root);
  p.pop();
}

function drawDivider(p: p5): void {
  p.push();
  p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 24);
  p.line(SIERPINSKI_VIEW.width * 0.5, 0, SIERPINSKI_VIEW.width * 0.5, SIERPINSKI_VIEW.height);
  p.pop();
}

function drawTriangle(p: p5, tri: Triangle): void {
  p.triangle(tri.a.x, tri.a.y, tri.b.x, tri.b.y, tri.c.x, tri.c.y);
}
