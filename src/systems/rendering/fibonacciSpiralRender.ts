import type p5 from 'p5';
import type { ParamValues } from '../../curve/types';
import {
  FIBONACCI_VIEW,
  PHI,
  buildFibonacci,
  buildSpiralGeometry,
  fibonacciRatio,
  getTileRevealProgress,
  sampleArcPoints,
  sampleLogSpiralReference,
  type FibonacciGeometry,
  type FibonacciTile,
} from '../../curve/modules/fibonacci-spiral/geometry';

export type FibonacciSpiralSnap = {
  width: number;
  height: number;
  params: ParamValues;
  revealProgress: number;
};

const PRIMARY = { r: 212, g: 184, b: 122 };
const GUIDE = { r: 255, g: 255, b: 255 };
const COMPARE = { r: 120, g: 180, b: 255 };

const RECT_GLOW = [
  { weight: 4, alpha: 12 },
  { weight: 1.4, alpha: 34 },
];

const ARC_GLOW = [
  { weight: 7, alpha: 16 },
  { weight: 3, alpha: 42 },
  { weight: 1.2, alpha: 230 },
];

export function renderFibonacciSpiralScene(p: p5, snap: FibonacciSpiralSnap): void {
  p.background(10, 10, 10);

  const designScale = Math.min(snap.width / FIBONACCI_VIEW.width, snap.height / FIBONACCI_VIEW.height);
  const designOffsetX = (snap.width - FIBONACCI_VIEW.width * designScale) / 2;
  const designOffsetY = (snap.height - FIBONACCI_VIEW.height * designScale) / 2;

  p.push();
  p.translate(designOffsetX, designOffsetY);
  p.scale(designScale);

  drawGuide(p);

  const fib = buildFibonacci(snap.params.n ?? 10);
  const geometry = buildSpiralGeometry(fib);
  const worldScale = Math.min(
    (FIBONACCI_VIEW.width * FIBONACCI_VIEW.viewScale) / geometry.worldWidth,
    (FIBONACCI_VIEW.height * FIBONACCI_VIEW.viewScale) / geometry.worldHeight,
  );

  p.push();
  p.translate(FIBONACCI_VIEW.width * FIBONACCI_VIEW.originX, FIBONACCI_VIEW.height * FIBONACCI_VIEW.originY);
  p.scale(worldScale);
  p.translate(-geometry.center.x, -geometry.center.y);

  drawGoldenRectangleOverlay(p, geometry, worldScale);
  drawTiles(p, geometry, fib, snap.revealProgress, worldScale);
  drawFibonacciSpiral(p, geometry, snap.revealProgress, worldScale);
  drawTrueLogSpiral(p, geometry, worldScale);

  p.pop();

  drawRatioConvergence(p, fib);
  drawCanvasLabel(p, fib, snap.params.n ?? 10);
  p.pop();
}

function drawGuide(p: p5): void {
  p.push();
  p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 14);
  p.strokeWeight(1);
  p.line(FIBONACCI_VIEW.width * FIBONACCI_VIEW.originX, 0, FIBONACCI_VIEW.width * FIBONACCI_VIEW.originX, FIBONACCI_VIEW.height);
  p.line(0, FIBONACCI_VIEW.height * FIBONACCI_VIEW.originY, FIBONACCI_VIEW.width, FIBONACCI_VIEW.height * FIBONACCI_VIEW.originY);
  p.pop();
}

function drawTiles(
  p: p5,
  geometry: FibonacciGeometry,
  fib: number[],
  revealProgress: number,
  worldScale: number,
): void {
  const scaleFix = 1 / worldScale;
  for (let i = 0; i < geometry.tiles.length; i += 1) {
    const tile = geometry.tiles[i]!;
    const progress = getTileRevealProgress(revealProgress, i, geometry.tiles.length);
    if (progress <= 0) continue;

    drawGlowRect(p, tile.x, tile.y, tile.s, tile.s, scaleFix, progress);

    p.push();
    p.noStroke();
    p.fill(GUIDE.r, GUIDE.g, GUIDE.b, 110 * progress);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(Math.max(0.55, Math.min(tile.s * 0.16, 18)) * scaleFix);
    p.text(String(fib[i]), tile.x + tile.s * 0.08, tile.y + tile.s * 0.08);
    p.pop();
  }
}

function drawFibonacciSpiral(
  p: p5,
  geometry: FibonacciGeometry,
  revealProgress: number,
  worldScale: number,
): void {
  const scaleFix = 1 / worldScale;
  for (let i = 0; i < geometry.tiles.length; i += 1) {
    const tile = geometry.tiles[i]!;
    const progress = getTileRevealProgress(revealProgress, i, geometry.tiles.length);
    if (progress <= 0) continue;
    const points = sampleArcPoints(tile.arc, progress, 0.035);
    drawGlowPolyline(p, points, ARC_GLOW, scaleFix);
  }
}

function drawTrueLogSpiral(p: p5, geometry: FibonacciGeometry, worldScale: number): void {
  const scaleFix = 1 / worldScale;
  const points = sampleLogSpiralReference(geometry, 0.03);
  p.push();
  p.noFill();
  p.stroke(COMPARE.r, COMPARE.g, COMPARE.b, 70);
  p.strokeWeight(1.3 * scaleFix);
  drawPolylineShape(p, points);
  p.pop();
}

function drawGoldenRectangleOverlay(p: p5, geometry: FibonacciGeometry, worldScale: number): void {
  const scaleFix = 1 / worldScale;
  const { bounds } = geometry;
  const width = bounds.maxX - bounds.minX;
  const height = bounds.maxY - bounds.minY;
  const ratio = Math.max(width, height) / Math.min(width, height);

  p.push();
  p.noFill();
  p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 30);
  p.strokeWeight(1 * scaleFix);
  p.rect(bounds.minX, bounds.minY, width, height);

  p.fill(GUIDE.r, GUIDE.g, GUIDE.b, 120);
  p.noStroke();
  p.textSize(14 * scaleFix);
  p.text(`w/h ≈ ${ratio.toFixed(5)}`, bounds.minX, bounds.minY - 10 * scaleFix);
  p.pop();
}

function drawRatioConvergence(p: p5, fib: number[]): void {
  p.push();
  p.noStroke();
  p.fill(GUIDE.r, GUIDE.g, GUIDE.b, 120);
  p.textSize(12);
  p.text('Fₙ₊₁ / Fₙ → φ', 920, 80);

  for (let i = 1; i < fib.length - 1; i += 1) {
    const ratio = fib[i + 1]! / fib[i]!;
    const y = 110 + i * 22;
    p.fill(PRIMARY.r, PRIMARY.g, PRIMARY.b, 180);
    p.circle(920 + ratio * 38, y, 4);
    p.fill(GUIDE.r, GUIDE.g, GUIDE.b, 90);
    p.text(ratio.toFixed(5), 960, y + 4);
  }

  p.stroke(COMPARE.r, COMPARE.g, COMPARE.b, 80);
  p.line(920 + PHI * 38, 96, 920 + PHI * 38, 110 + fib.length * 22);
  p.pop();
}

function drawCanvasLabel(p: p5, fib: number[], n: number): void {
  p.push();
  p.noStroke();
  p.fill(PRIMARY.r, PRIMARY.g, PRIMARY.b, 220);
  p.textSize(16);
  p.text('FIBONACCI SPIRAL', 36, 42);

  p.fill(GUIDE.r, GUIDE.g, GUIDE.b, 110);
  p.textSize(12);
  p.text(`n = ${Math.round(n)}`, 36, 76);
  p.text(`Fₙ / Fₙ₋₁ = ${fibonacciRatio(fib).toFixed(6)}`, 36, 102);
  p.text(`φ = ${PHI.toFixed(6)}`, 36, 128);
  p.text('Fibonacci approximation vs logarithmic spiral', 36, 154);
  p.pop();
}

function drawGlowRect(
  p: p5,
  x: number,
  y: number,
  width: number,
  height: number,
  scaleFix: number,
  alpha: number,
): void {
  p.push();
  p.noStroke();
  p.fill(PRIMARY.r, PRIMARY.g, PRIMARY.b, 16 * alpha);
  p.rect(x, y, width, height);
  p.noFill();
  for (const layer of RECT_GLOW) {
    p.stroke(PRIMARY.r, PRIMARY.g, PRIMARY.b, layer.alpha);
    p.strokeWeight(layer.weight * scaleFix);
    p.rect(x, y, width, height);
  }
  p.pop();
}

function drawGlowPolyline(
  p: p5,
  points: Array<{ x: number; y: number }>,
  layers: typeof ARC_GLOW,
  scaleFix: number,
): void {
  if (points.length === 0) return;
  p.push();
  p.noFill();
  for (const layer of layers) {
    p.stroke(PRIMARY.r, PRIMARY.g, PRIMARY.b, layer.alpha);
    p.strokeWeight(layer.weight * scaleFix);
    drawPolylineShape(p, points);
  }
  p.pop();
}

function drawPolylineShape(p: p5, points: Array<{ x: number; y: number }>): void {
  p.beginShape();
  for (const point of points) {
    p.vertex(point.x, point.y);
  }
  p.endShape();
}
