import type p5 from 'p5';
import {
  add,
  computeViewportRadius,
  multiply,
  polar,
  type Vec2,
} from '../../curve/modules/complex-arithmetic-geometry/geometry';

const TAU = Math.PI * 2;

export type ComplexArithmeticGeometrySnap = {
  width: number;
  height: number;
  r1: number;
  r2: number;
  smoothR1: number;
  smoothR2: number;
  smoothTheta1: number;
  smoothTheta2: number;
};

const SAFE_VIEWPORT_RATIO = 0.72;
const UNIT_CIRCLE_SAMPLES = 160;
const PARALLELOGRAM_ALPHA = 32;

const COLORS = {
  BG: [10, 10, 10] as const,
  GOLD: [212, 184, 122] as const,
  GUIDE: [255, 255, 255] as const,
  ADD: [245, 210, 120] as const,
  MUL: [120, 200, 255] as const,
};

const GLOW = {
  INPUT: { CORE_WIDTH: 1.4, GLOW_WIDTH: 4, CORE_ALPHA: 135, GLOW_ALPHA: 18 },
  ADD: { CORE_WIDTH: 2.2, GLOW_WIDTH: 7, CORE_ALPHA: 255, GLOW_ALPHA: 55 },
  MUL: { CORE_WIDTH: 2.0, GLOW_WIDTH: 6, CORE_ALPHA: 230, GLOW_ALPHA: 40 },
};

type GlowProfile = {
  CORE_WIDTH: number;
  GLOW_WIDTH: number;
  CORE_ALPHA: number;
  GLOW_ALPHA: number;
};

const unitCircle: Vec2[] = [];
const unitCircleScreen: Vec2[] = [];
let cachedScale = -1;

function setLineDash(p: p5, dashed: boolean): void {
  const ctx = p.drawingContext as CanvasRenderingContext2D;
  ctx.setLineDash(dashed ? [5, 5] : []);
}

function ensureUnitCircleCache(): void {
  if (unitCircle.length > 0) return;
  const step = TAU / UNIT_CIRCLE_SAMPLES;
  for (let t = 0; t <= TAU + step; t += step) {
    unitCircle.push({ x: Math.cos(t), y: Math.sin(t) });
    unitCircleScreen.push({ x: 0, y: 0 });
  }
}

function updateScreenSpace(scale: number): void {
  ensureUnitCircleCache();
  if (scale === cachedScale) return;
  cachedScale = scale;
  for (let i = 0; i < unitCircle.length; i++) {
    unitCircleScreen[i].x = unitCircle[i].x * scale;
    unitCircleScreen[i].y = -unitCircle[i].y * scale;
  }
}

function computeScale(width: number, height: number, r1: number, r2: number): number {
  const span = computeViewportRadius(r1, r2) * 2;
  return (Math.min(width, height) * SAFE_VIEWPORT_RATIO) / Math.max(span, 0.001);
}

function project(scale: number, x: number, y: number): Vec2 {
  return { x: x * scale, y: -y * scale };
}

function setStroke(
  p: p5,
  color: readonly [number, number, number],
  widthValue: number,
  alpha: number,
): void {
  p.stroke(color[0], color[1], color[2], alpha);
  p.strokeWeight(widthValue);
  p.noFill();
}

function path(
  p: p5,
  points: Vec2[],
  widthValue: number,
  alpha: number,
  color: readonly [number, number, number],
  dashed = false,
): void {
  if (points.length < 2) return;
  setStroke(p, color, widthValue, alpha);
  setLineDash(p, dashed);
  p.beginShape();
  for (const pt of points) p.vertex(pt.x, pt.y);
  p.endShape();
  setLineDash(p, false);
}

function glowLine(
  p: p5,
  a: Vec2,
  b: Vec2,
  profile: GlowProfile,
  color: readonly [number, number, number],
  dashed = false,
): void {
  path(p, [a, b], profile.GLOW_WIDTH, profile.GLOW_ALPHA, color, dashed);
  path(p, [a, b], profile.CORE_WIDTH, profile.CORE_ALPHA, color, dashed);
}

function node(
  p: p5,
  point: Vec2,
  size: number,
  alpha: number,
  color: readonly [number, number, number],
): void {
  p.stroke(color[0], color[1], color[2], alpha);
  p.strokeWeight(size);
  p.point(point.x, point.y);
}

function drawAxis(p: p5, width: number, height: number): void {
  p.stroke(COLORS.GUIDE[0], COLORS.GUIDE[1], COLORS.GUIDE[2], 10);
  p.strokeWeight(1);
  p.line(-width, 0, width, 0);
  p.line(0, -height, 0, height);
}

export function renderComplexArithmeticGeometryScene(
  p: p5,
  snap: ComplexArithmeticGeometrySnap,
): void {
  p.background(...COLORS.BG);

  const scale = computeScale(snap.width, snap.height, snap.smoothR1, snap.smoothR2);
  updateScreenSpace(scale);

  const z1 = polar(snap.smoothR1, snap.smoothTheta1);
  const z2 = polar(snap.smoothR2, snap.smoothTheta2);
  const sum = add(z1, z2);
  const prod = multiply(z1, z2);

  const origin = { x: 0, y: 0 };
  const screenZ1 = project(scale, z1.x, z1.y);
  const screenZ2 = project(scale, z2.x, z2.y);
  const screenAdd = project(scale, sum.x, sum.y);
  const screenMul = project(scale, prod.x, prod.y);

  p.push();
  p.translate(snap.width / 2, snap.height / 2);

  drawAxis(p, snap.width, snap.height);

  path(p, unitCircleScreen, 1, 14, COLORS.GOLD);
  path(p, [screenZ1, screenAdd], 1, PARALLELOGRAM_ALPHA, COLORS.GOLD, true);
  path(p, [screenZ2, screenAdd], 1, PARALLELOGRAM_ALPHA, COLORS.GOLD, true);

  glowLine(p, origin, screenZ1, GLOW.INPUT, COLORS.GOLD);
  glowLine(p, origin, screenZ2, GLOW.INPUT, COLORS.GOLD);
  glowLine(p, origin, screenAdd, GLOW.ADD, COLORS.ADD);
  glowLine(p, origin, screenMul, GLOW.MUL, COLORS.MUL);

  node(p, screenZ1, 4, 120, COLORS.GOLD);
  node(p, screenZ2, 4, 120, COLORS.GOLD);
  node(p, screenAdd, 7, 255, COLORS.ADD);
  node(p, screenMul, 7, 240, COLORS.MUL);

  p.pop();
}
