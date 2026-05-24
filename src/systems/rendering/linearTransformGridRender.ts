import type p5 from 'p5';
import {
  GRID_DENSITY,
  REGION_RATIO,
  buildGridLines,
  calculateMatrix,
  calculateTransformBounds,
  type Matrix2x2,
} from '../../curve/modules/linear-transform-grid/geometry';

export type LinearTransformGridSnap = {
  width: number;
  height: number;
  currentShearX: number;
  currentScaleY: number;
  time: number;
  revealProgress: number;
};

const PRIMARY = { r: 212, g: 184, b: 122 };
const GUIDE = { r: 255, g: 255, b: 255 };

const GLOW_LAYERS: Array<{ weight: number; alpha: number }> = [
  { weight: 7, alpha: 16 },
  { weight: 3.5, alpha: 42 },
  { weight: 1.5, alpha: 230 },
];

function renderGuideLayer(p: p5, width: number, height: number): void {
  p.noFill();
  p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 12);
  p.strokeWeight(1);
  p.line(-width / 2, 0, width / 2, 0);
  p.line(0, -height / 2, 0, height / 2);
}

function renderGhostGrid(p: p5, width: number): void {
  const size = width * REGION_RATIO;
  const halfSize = size / 2;
  const spacing = size / GRID_DENSITY;

  p.stroke(PRIMARY.r, PRIMARY.g, PRIMARY.b, 14);
  p.strokeWeight(1);

  for (let i = -GRID_DENSITY / 2; i <= GRID_DENSITY / 2; i++) {
    const offset = i * spacing;
    p.line(offset, -halfSize, offset, halfSize);
    p.line(-halfSize, offset, halfSize, offset);
  }
}

function renderGlowPass(
  p: p5,
  lines: ReturnType<typeof buildGridLines>,
  weight: number,
  alpha: number,
): void {
  p.stroke(PRIMARY.r, PRIMARY.g, PRIMARY.b, alpha);
  p.strokeWeight(weight);
  for (const lineData of lines) {
    p.line(lineData.x1, lineData.y1, lineData.x2, lineData.y2);
  }
}

function renderTransformedGrid(p: p5, width: number, matrix: Matrix2x2, revealProgress: number): void {
  const lines = buildGridLines(width, matrix, revealProgress);
  for (const layer of GLOW_LAYERS) {
    renderGlowPass(p, lines, layer.weight, layer.alpha);
  }
}

export function renderLinearTransformGridScene(
  p: p5,
  snap: LinearTransformGridSnap,
): void {
  p.background(10, 10, 10);

  const cx = snap.width / 2;
  const cy = snap.height / 2;

  p.push();
  p.translate(cx, cy);

  const matrix = calculateMatrix(
    snap.currentShearX,
    snap.currentScaleY,
    snap.time,
  );
  const { scaleFactor } = calculateTransformBounds(
    snap.width,
    snap.height,
    matrix,
  );

  p.scale(scaleFactor);

  renderGuideLayer(p, snap.width, snap.height);
  renderGhostGrid(p, snap.width);
  renderTransformedGrid(p, snap.width, matrix, snap.revealProgress);

  p.pop();
}
