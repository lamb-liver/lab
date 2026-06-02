import type p5 from 'p5';
import type { ParamValues } from '../../curve/types';
import {
  FIBONACCI_VIEW,
  buildFibonacci,
  buildSpiralGeometry,
  getTileRevealProgress,
  sampleArcPoints,
  sampleLogSpiralReference,
  type FibonacciGeometry,
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

const SCENE_ORIGIN = { x: 0.5, y: 0.52 };
const SCENE_VIEW_SCALE = 0.9;
const TILE_LABEL_MIN_SIZE = 46;

const RECT_STRUCTURE = [
  { weight: 1.1, alpha: 24 },
  { weight: 0.45, alpha: 42 },
];

const ARC_GLOW = [
  { weight: 8.5, alpha: 18 },
  { weight: 3.8, alpha: 46 },
  { weight: 1.35, alpha: 235 },
];

export function renderFibonacciSpiralScene(p: p5, snap: FibonacciSpiralSnap): void {
  p.background(10, 10, 10);

  const designScale = Math.min(snap.width / FIBONACCI_VIEW.width, snap.height / FIBONACCI_VIEW.height);
  const designOffsetX = (snap.width - FIBONACCI_VIEW.width * designScale) / 2;
  const designOffsetY = (snap.height - FIBONACCI_VIEW.height * designScale) / 2;

  p.push();
  p.translate(designOffsetX, designOffsetY);
  p.scale(designScale);

  const fib = buildFibonacci(snap.params.n ?? 10);
  const geometry = buildSpiralGeometry(fib);
  const worldScale = Math.min(
    (FIBONACCI_VIEW.width * SCENE_VIEW_SCALE) / geometry.worldWidth,
    (FIBONACCI_VIEW.height * SCENE_VIEW_SCALE) / geometry.worldHeight,
  );

  p.push();
  p.translate(FIBONACCI_VIEW.width * SCENE_ORIGIN.x, FIBONACCI_VIEW.height * SCENE_ORIGIN.y);
  p.scale(worldScale);
  p.translate(-geometry.center.x, -geometry.center.y);

  drawTrueLogSpiral(p, geometry, worldScale);
  drawGoldenRectangleOverlay(p, geometry, worldScale);
  drawTiles(p, geometry, fib, snap.revealProgress, worldScale);
  drawFibonacciSpiral(p, geometry, snap.revealProgress, worldScale);

  p.pop();
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

    drawStructureRect(p, tile.x, tile.y, tile.s, tile.s, scaleFix, progress);
    if (tile.s * worldScale < TILE_LABEL_MIN_SIZE) continue;

    p.push();
    p.noStroke();
    p.fill(GUIDE.r, GUIDE.g, GUIDE.b, 82 * progress);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(Math.max(0.55, Math.min(tile.s * 0.12, 13)) * scaleFix);
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
  p.stroke(COMPARE.r, COMPARE.g, COMPARE.b, 34);
  p.strokeWeight(0.95 * scaleFix);
  drawPolylineShape(p, points);
  p.pop();
}

function drawGoldenRectangleOverlay(p: p5, geometry: FibonacciGeometry, worldScale: number): void {
  const scaleFix = 1 / worldScale;
  const { bounds } = geometry;
  const width = bounds.maxX - bounds.minX;
  const height = bounds.maxY - bounds.minY;

  p.push();
  p.noFill();
  p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 18);
  p.strokeWeight(0.7 * scaleFix);
  p.rect(bounds.minX, bounds.minY, width, height);
  p.pop();
}

function drawStructureRect(
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
  p.fill(PRIMARY.r, PRIMARY.g, PRIMARY.b, 6 * alpha);
  p.rect(x, y, width, height);
  p.noFill();
  for (const layer of RECT_STRUCTURE) {
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
