import type p5 from 'p5';
import { transformPoint } from '../../curve/modules/matrix-linear-transform/matrix';
import type { Matrix2, Point2 } from '../../curve/modules/matrix-linear-transform/types';

type RotationCompositionExamSnap = {
  width: number;
  height: number;
  leftLabel: string;
  rightLabel: string;
  leftFirstLabel: string;
  leftSecondLabel: string;
  rightFirstLabel: string;
  rightSecondLabel: string;
  leftFirstMatrix: Matrix2;
  rightFirstMatrix: Matrix2;
  leftMatrix: Matrix2;
  rightMatrix: Matrix2;
  progress: number;
};

const ACCENT: [number, number, number] = [212, 184, 122];
const GUIDE: [number, number, number] = [232, 232, 232];
const SOURCE_SHAPE: Point2[] = [
  { x: -0.8, y: -0.65 },
  { x: 0.75, y: -0.65 },
  { x: 0.75, y: -0.05 },
  { x: 0.15, y: -0.05 },
  { x: 0.15, y: 0.85 },
  { x: -0.8, y: 0.85 },
];

function lerpMatrix(from: Matrix2, target: Matrix2, t: number): Matrix2 {
  return {
    a: from.a + (target.a - from.a) * t,
    b: from.b + (target.b - from.b) * t,
    c: from.c + (target.c - from.c) * t,
    d: from.d + (target.d - from.d) * t,
  };
}

function sequenceMatrix(first: Matrix2, target: Matrix2, progress: number): Matrix2 {
  const identity = { a: 1, b: 0, c: 0, d: 1 };
  const phase = Math.min(1, Math.max(0, progress * 2 - (progress >= 0.5 ? 1 : 0)));
  const eased = 1 - (1 - phase) ** 3;
  return progress < 0.5
    ? lerpMatrix(identity, first, eased)
    : lerpMatrix(first, target, eased);
}

function drawShape(
  p: p5,
  matrix: Matrix2,
  rgb: [number, number, number],
  alpha: number,
  fillAlpha: number,
): void {
  p.stroke(rgb[0], rgb[1], rgb[2], alpha);
  p.strokeWeight(0.025);
  p.fill(rgb[0], rgb[1], rgb[2], fillAlpha);
  p.beginShape();
  for (const point of SOURCE_SHAPE) {
    const mapped = transformPoint(matrix, point.x, point.y);
    p.vertex(mapped.x, mapped.y);
  }
  p.endShape(p.CLOSE);
}

function drawPanel(
  p: p5,
  cx: number,
  cy: number,
  scale: number,
  label: string,
  firstLabel: string,
  secondLabel: string,
  firstMatrix: Matrix2,
  target: Matrix2,
  progress: number,
): void {
  p.push();
  p.translate(cx, cy);
  p.scale(scale, -scale);

  p.stroke(...GUIDE, 24);
  p.strokeWeight(1 / scale);
  p.line(-1.35, 0, 1.35, 0);
  p.line(0, -1.25, 0, 1.25);

  drawShape(p, { a: 1, b: 0, c: 0, d: 1 }, GUIDE, 35, 0);
  const current = sequenceMatrix(firstMatrix, target, progress);
  drawShape(p, current, ACCENT, 220, 28);

  const point = transformPoint(current, 1, 0);
  p.noStroke();
  p.fill(...ACCENT, 230);
  p.circle(point.x, point.y, 0.12);
  p.pop();

  p.push();
  p.noStroke();
  p.fill(...ACCENT, 190);
  p.textAlign(p.CENTER, p.TOP);
  p.textSize(13);
  p.textStyle(p.BOLD);
  p.text(label, cx, 24);
  p.textStyle(p.NORMAL);
  p.textSize(11);
  p.fill(...GUIDE, 125);
  p.text(`先 ${firstLabel} → 再 ${secondLabel}`, cx, 43);
  p.pop();
}

export function renderRotationCompositionExamScene(
  p: p5,
  snap: RotationCompositionExamSnap,
): void {
  p.background(10, 10, 10);
  const scale = Math.min(snap.width * 0.19, snap.height * 0.31);
  const cy = snap.height * 0.55;

  drawPanel(
    p,
    snap.width * 0.28,
    cy,
    scale,
    snap.leftLabel,
    snap.leftFirstLabel,
    snap.leftSecondLabel,
    snap.leftFirstMatrix,
    snap.leftMatrix,
    snap.progress,
  );
  drawPanel(
    p,
    snap.width * 0.72,
    cy,
    scale,
    snap.rightLabel,
    snap.rightFirstLabel,
    snap.rightSecondLabel,
    snap.rightFirstMatrix,
    snap.rightMatrix,
    snap.progress,
  );
}
