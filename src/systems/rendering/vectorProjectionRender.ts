import { canvas2d } from './canvas2d';
import type p5 from 'p5';
import {
  add,
  createVectorProjectionLayout,
  getProjectionData,
  lerpVec,
  scaleVec,
  screenUnitFromWorldVec,
  vectorFromParams,
  worldToScreen,
  type ProjectionData,
  type Vec2,
  type VectorProjectionParams,
} from '../../curve/modules/vector-projection/geometry';

type VectorProjectionSnap = {
  width: number;
  height: number;
  params: VectorProjectionParams;
  showDrop: boolean;
  showError: boolean;
  activeDrag: 'a' | 'b' | null;
  timeMs: number;
};

const BG: [number, number, number] = [10, 10, 10];
const ACCENT: [number, number, number] = [212, 184, 122];
const GUIDE: [number, number, number] = [255, 255, 255];
const A_COLOR: [number, number, number] = [160, 205, 255];
const B_COLOR: [number, number, number] = [164, 225, 176];
const PROJ_COLOR: [number, number, number] = [255, 187, 122];
const PERP_COLOR: [number, number, number] = [245, 215, 132];
const RIGHT_ANGLE_PX = 11;
const BASE_LINE_EXTEND = 1.5;

function setDash(p: p5, pattern: number[]): void {
  const ctx = canvas2d(p);
  ctx.setLineDash(pattern);
}

function withPlotClip(p: p5, plotMin: number, plotMax: number, draw: () => void): void {
  const ctx = canvas2d(p);
  p.push();
  ctx.save();
  ctx.beginPath();
  ctx.rect(plotMin, plotMin, plotMax - plotMin, plotMax - plotMin);
  ctx.clip();
  draw();
  ctx.restore();
  p.pop();
}

function drawLine(
  p: p5,
  a: Vec2,
  b: Vec2,
  color: readonly [number, number, number],
  alpha: number,
  weight: number,
  dashed = false,
): void {
  p.push();
  p.stroke(...color, alpha);
  p.strokeWeight(weight);
  p.strokeCap(p.ROUND);
  setDash(p, dashed ? [5, 8] : []);
  p.line(a.x, a.y, b.x, b.y);
  setDash(p, []);
  p.pop();
}

function drawArrow(
  p: p5,
  from: Vec2,
  to: Vec2,
  color: readonly [number, number, number],
  alpha: number,
  active = false,
): void {
  const len = Math.hypot(to.x - from.x, to.y - from.y);
  if (len < 0.001) return;
  const angle = Math.atan2(to.y - from.y, to.x - from.x);

  drawLine(p, from, to, color, active ? 48 : 22, active ? 8 : 6);
  drawLine(p, from, to, color, alpha, active ? 2.6 : 2);

  const head = active ? 14 : 12;
  const wing = 0.7;
  p.push();
  p.noStroke();
  p.fill(...color, alpha);
  p.triangle(
    to.x,
    to.y,
    to.x - Math.cos(angle - wing) * head,
    to.y - Math.sin(angle - wing) * head,
    to.x - Math.cos(angle + wing) * head,
    to.y - Math.sin(angle + wing) * head,
  );
  p.pop();
}

function drawGrid(p: p5, width: number, height: number, origin: Vec2, scale: number, extent: number): void {
  const min = Math.floor(-extent);
  const max = Math.ceil(extent);

  p.push();
  p.noFill();
  p.strokeWeight(1);
  for (let i = min; i <= max; i++) {
    const alpha = i === 0 ? 30 : 8;
    p.stroke(...GUIDE, alpha);
    const x = origin.x + i * scale;
    const y = origin.y - i * scale;
    p.line(x, 0, x, height);
    p.line(0, y, width, y);
  }
  p.pop();
}

function drawPlotLabels(p: p5, origin: Vec2, width: number, height: number, plotMin: number, plotMax: number): void {
  p.push();
  p.noStroke();
  p.fill(232, 232, 232, 58);
  p.textSize(11);
  p.textAlign(p.CENTER, p.CENTER);
  p.text('x', Math.min(plotMax - 12, width - 18), Math.max(plotMin + 14, Math.min(plotMax - 14, origin.y - 10)));
  p.text('y', Math.max(plotMin + 12, Math.min(plotMax - 12, origin.x + 10)), Math.max(plotMin + 14, 18));
  p.pop();
}

function drawBaseLine(p: p5, data: ProjectionData, toScreen: (point: Vec2) => Vec2): void {
  if (!data.valid) return;
  const p1 = toScreen(scaleVec(data.e1, -6 * BASE_LINE_EXTEND));
  const p2 = toScreen(scaleVec(data.e1, 6 * BASE_LINE_EXTEND));
  drawLine(p, p1, p2, GUIDE, 22, 1, true);
}

function drawRightAngleMarker(
  p: p5,
  data: ProjectionData,
  projection: Vec2,
  baseDir: Vec2,
  perpDir: Vec2,
): void {
  if (!data.valid || data.perpLen < 1e-6) return;
  const a = {
    x: projection.x + baseDir.x * RIGHT_ANGLE_PX,
    y: projection.y + baseDir.y * RIGHT_ANGLE_PX,
  };
  const b = {
    x: a.x + perpDir.x * RIGHT_ANGLE_PX,
    y: a.y + perpDir.y * RIGHT_ANGLE_PX,
  };
  const c = {
    x: projection.x + perpDir.x * RIGHT_ANGLE_PX,
    y: projection.y + perpDir.y * RIGHT_ANGLE_PX,
  };

  p.push();
  p.noFill();
  p.stroke(...GUIDE, 48);
  p.strokeWeight(1);
  p.beginShape();
  p.vertex(a.x, a.y);
  p.vertex(b.x, b.y);
  p.vertex(c.x, c.y);
  p.endShape();
  p.pop();
}

function drawNode(
  p: p5,
  point: Vec2,
  label: string,
  color: readonly [number, number, number],
  active: boolean,
): void {
  p.push();
  p.noStroke();
  p.fill(...color, active ? 56 : 30);
  p.circle(point.x, point.y, active ? 28 : 22);
  p.fill(...color, 230);
  p.circle(point.x, point.y, active ? 9 : 7);
  p.fill(BG[0], BG[1], BG[2], 190);
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(9);
  p.text(label, point.x, point.y - 1);
  p.pop();
}

function clampLabel(point: Vec2, width: number, height: number): Vec2 {
  return {
    x: Math.max(24, Math.min(width - 24, point.x)),
    y: Math.max(22, Math.min(height - 18, point.y)),
  };
}

function drawLabel(
  p: p5,
  label: string,
  point: Vec2,
  color: readonly [number, number, number],
  width: number,
  height: number,
): void {
  const clamped = clampLabel(point, width, height);
  p.push();
  p.noStroke();
  p.fill(...color, 210);
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(12);
  p.text(label, clamped.x, clamped.y);
  p.pop();
}

function drawBadge(p: p5, label: string): void {
  p.push();
  p.noStroke();
  p.fill(...ACCENT, 34);
  p.rect(24, 24, 148, 30, 999);
  p.fill(235, 235, 235, 154);
  p.textAlign(p.LEFT, p.CENTER);
  p.textSize(12);
  p.text(label, 38, 39);
  p.pop();
}

export function renderVectorProjectionScene(
  p: p5,
  snap: VectorProjectionSnap,
): void {
  p.background(...BG);

  const layout = createVectorProjectionLayout(snap.width, snap.height, snap.params);
  const data = getProjectionData(snap.params);
  const { a, b } = vectorFromParams(snap.params);
  const toScreen = (point: Vec2) => worldToScreen(layout, point);
  const origin = toScreen({ x: 0, y: 0 });
  const screenA = toScreen(a);
  const screenB = toScreen(b);
  const screenTarget = toScreen(data.target);
  const screenProj = toScreen(data.proj);

  withPlotClip(p, layout.plotMin, layout.plotMax, () => {
    drawGrid(p, snap.width, snap.height, origin, layout.scale, layout.extent);
    drawBaseLine(p, data, toScreen);

    if (data.valid) {
      drawLine(p, screenTarget, screenProj, GUIDE, 34, 1.2, true);

      if (snap.showDrop) {
        const t = 0.5 + 0.5 * Math.sin(snap.timeMs * 0.0027);
        const q = toScreen(lerpVec(data.target, data.proj, t));
        p.noStroke();
        p.fill(...ACCENT, 38);
        p.circle(q.x, q.y, 22);
        p.fill(...ACCENT, 220);
        p.circle(q.x, q.y, 6);
      }

      drawArrow(p, origin, screenProj, PROJ_COLOR, 230);
      drawArrow(p, screenProj, screenTarget, PERP_COLOR, 138);

      const baseDir = screenUnitFromWorldVec(layout, data.e1);
      const perpDir = screenUnitFromWorldVec(layout, data.perp);
      drawRightAngleMarker(p, data, screenProj, baseDir, perpDir);

      if (snap.params.viewMode === 'basis') {
        const part1 = scaleVec(data.e1, data.c1);
        const part2 = scaleVec(data.e2, data.c2);
        const corner = add(part1, part2);
        const screenPart1 = toScreen(part1);
        const screenPart2 = toScreen(part2);
        const screenCorner = toScreen(corner);

        drawArrow(p, origin, toScreen(scaleVec(data.e1, 1.4)), ACCENT, 120);
        drawArrow(p, origin, toScreen(scaleVec(data.e2, 1.4)), GUIDE, 78);
        drawLine(p, screenPart1, screenCorner, GUIDE, 24, 1, true);
        drawLine(p, screenPart2, screenCorner, GUIDE, 24, 1, true);
      }
    }

    drawArrow(p, origin, screenA, A_COLOR, 210, snap.activeDrag === 'a');
    drawArrow(p, origin, screenB, B_COLOR, 188, snap.activeDrag === 'b');
    drawNode(p, screenA, 'a', A_COLOR, snap.activeDrag === 'a');
    drawNode(p, screenB, 'b', B_COLOR, snap.activeDrag === 'b');

    p.noStroke();
    p.fill(255, 255, 255, 92);
    p.circle(origin.x, origin.y, 4);
  });

  drawPlotLabels(p, origin, snap.width, snap.height, layout.plotMin, layout.plotMax);

  if (!data.valid) {
    drawBadge(p, `${data.baseLabel} = 0，投影未定義`);
  }

  drawLabel(p, 'a', { x: screenA.x + 18, y: screenA.y - 14 }, A_COLOR, snap.width, snap.height);
  drawLabel(p, 'b', { x: screenB.x + 18, y: screenB.y - 14 }, B_COLOR, snap.width, snap.height);

  if (data.valid) {
    drawLabel(p, data.projLabel, { x: screenProj.x + 24, y: screenProj.y + 16 }, PROJ_COLOR, snap.width, snap.height);
    drawLabel(p, data.perpLabel, { x: screenTarget.x + 30, y: screenTarget.y + 16 }, PERP_COLOR, snap.width, snap.height);

    if (snap.showError) {
      const mid = toScreen(lerpVec(data.proj, data.target, 0.5));
      drawLabel(
        p,
        `|${data.perpLabel}| = ${data.perpLen.toFixed(2)}`,
        { x: mid.x + 44, y: mid.y - 10 },
        GUIDE,
        snap.width,
        snap.height,
      );
    }

    if (snap.params.viewMode === 'basis') {
      drawLabel(p, 'e1', toScreen(scaleVec(data.e1, 1.62)), ACCENT, snap.width, snap.height);
      drawLabel(p, 'e2', toScreen(scaleVec(data.e2, 1.62)), GUIDE, snap.width, snap.height);
    }
  }
}
