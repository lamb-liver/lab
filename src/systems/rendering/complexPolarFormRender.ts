import type p5 from 'p5';
import { computePolarScale } from '../../curve/modules/complex-polar-form/geometry';

const TAU = Math.PI * 2;

export type ComplexPolarFormSnap = {
  width: number;
  height: number;
  smoothR: number;
  smoothTheta: number;
};

const T = {
  BG: [10, 10, 10] as const,
  ACCENT: [212, 184, 122] as const,
  GUIDE: [255, 255, 255] as const,
  GLOW: [
    { w: 7.0, a: 16 },
    { w: 3.5, a: 42 },
    { w: 1.5, a: 230 },
  ],
  GHOST_W: 1.0,
  GHOST_A: 16,
  GUIDE_A: { grid: 8, axis: 14, arc: 18, proj: 10 },
};

const CFG = {
  ARC_RATIO: 0.22,
  ARC_STEPS: 96,
  UNIT_STEPS: 180,
};

type Vec2 = { x: number; y: number };

const unitCircle: Vec2[] = [];

function ensureUnitCircle(): void {
  if (unitCircle.length > 0) return;
  const step = TAU / CFG.UNIT_STEPS;
  for (let a = 0; a <= TAU + step; a += step) {
    unitCircle.push({ x: Math.cos(a), y: Math.sin(a) });
  }
}

function px(scale: number, x: number): number {
  return x * scale;
}

function py(scale: number, y: number): number {
  return -y * scale;
}

function glowStroke(p: p5, pts: Vec2[], layers: Array<{ w: number; a: number }>): void {
  if (pts.length < 2) return;
  for (const layer of layers) {
    p.stroke(T.ACCENT[0], T.ACCENT[1], T.ACCENT[2], layer.a);
    p.strokeWeight(layer.w);
    p.noFill();
    p.beginShape();
    for (const pt of pts) p.vertex(pt.x, pt.y);
    p.endShape();
  }
}

function ghostPath(p: p5, pts: Vec2[]): void {
  p.stroke(T.ACCENT[0], T.ACCENT[1], T.ACCENT[2], T.GHOST_A);
  p.strokeWeight(T.GHOST_W);
  p.noFill();
  p.beginShape();
  for (const pt of pts) p.vertex(pt.x, pt.y);
  p.endShape();
}

function guideLine(
  p: p5,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  alpha: number,
  dashed: boolean,
): void {
  p.stroke(T.GUIDE[0], T.GUIDE[1], T.GUIDE[2], alpha);
  p.strokeWeight(0.7);
  p.noFill();
  if (dashed) p.drawingContext.setLineDash([4, 5]);
  p.line(x1, y1, x2, y2);
  p.drawingContext.setLineDash([]);
}

function buildArc(scale: number, r: number, theta: number, steps: number): Vec2[] {
  const pts: Vec2[] = [];
  const n = Math.max(2, Math.min(steps, Math.floor(Math.abs(theta) / 0.03) + 2));
  for (let i = 0; i < n; i++) {
    const a = (theta / (n - 1)) * i;
    pts.push({
      x: px(scale, Math.cos(a) * r),
      y: py(scale, Math.sin(a) * r),
    });
  }
  return pts;
}

function buildVector(scale: number, r: number, theta: number, steps: number): Vec2[] {
  const pts: Vec2[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    pts.push({
      x: px(scale, Math.cos(theta) * r * t),
      y: py(scale, Math.sin(theta) * r * t),
    });
  }
  return pts;
}

function uiText(
  p: p5,
  str: string,
  x: number,
  y: number,
  size: number,
  alpha: number,
  muted = false,
): void {
  p.push();
  p.noStroke();
  if (muted) p.fill(160, 160, 160, alpha);
  else p.fill(T.ACCENT[0], T.ACCENT[1], T.ACCENT[2], alpha);
  p.textFont('Courier New');
  p.textSize(size);
  p.text(str, x, y);
  p.pop();
}

function drawGrid(p: p5, width: number, height: number): void {
  p.stroke(T.GUIDE[0], T.GUIDE[1], T.GUIDE[2], T.GUIDE_A.grid);
  p.strokeWeight(0.5);
  p.noFill();
  p.line(-width, 0, width, 0);
  p.line(0, -height, 0, height);
}

function drawLabels(
  p: p5,
  scale: number,
  r: number,
  theta: number,
  zx: number,
  zy: number,
  szx: number,
  szy: number,
  arcR: number,
): void {
  const re = zx.toFixed(3);
  const im = (zy >= 0 ? '+' : '') + zy.toFixed(3);

  p.push();
  p.textAlign(zx >= 0 ? p.LEFT : p.RIGHT);
  uiText(p, `z = ${re}${im}i`, szx + (zx >= 0 ? 10 : -10), szy + (zy >= 0 ? -10 : 16), 10, 140);
  p.pop();

  const mx = px(scale, zx * 0.52);
  const my = py(scale, zy * 0.52);
  const ox = -Math.sin(theta) * 12;
  const oy = -Math.cos(theta) * 12;
  p.push();
  p.textAlign(p.CENTER);
  uiText(p, `r = ${r.toFixed(2)}`, mx + ox, my + oy, 10, 130);
  p.pop();

  const midA = theta / 2;
  p.push();
  p.textAlign(p.CENTER);
  uiText(
    p,
    'θ',
    px(scale, Math.cos(midA) * (arcR + 0.18)),
    py(scale, Math.sin(midA) * (arcR + 0.18)),
    10,
    140,
  );
  p.pop();

  p.push();
  p.textAlign(p.CENTER);
  uiText(p, re, szx * 0.5, 12, 9, 90, true);
  p.textAlign(p.RIGHT);
  uiText(p, `${zy.toFixed(3)}i`, -7, szy * 0.5 + 4, 9, 90, true);
  p.pop();
}

export function renderComplexPolarFormScene(p: p5, snap: ComplexPolarFormSnap): void {
  p.background(...T.BG);

  const scale = computePolarScale(snap.width, snap.height, snap.smoothR);
  const r = snap.smoothR;
  const theta = snap.smoothTheta;
  const zx = r * Math.cos(theta);
  const zy = r * Math.sin(theta);
  const szx = px(scale, zx);
  const szy = py(scale, zy);

  ensureUnitCircle();
  const unitPts = unitCircle.map((pt) => ({
    x: px(scale, pt.x),
    y: py(scale, pt.y),
  }));

  p.push();
  p.translate(snap.width / 2, snap.height / 2);

  drawGrid(p, snap.width, snap.height);
  ghostPath(p, unitPts);

  guideLine(p, szx, szy, szx, 0, T.GUIDE_A.proj, true);
  guideLine(p, szx, szy, 0, szy, T.GUIDE_A.proj, true);
  guideLine(p, 0, 0, szx, 0, T.GUIDE_A.axis, false);
  guideLine(p, 0, 0, 0, szy, T.GUIDE_A.axis, false);

  const arcR = Math.max(0.16, r * CFG.ARC_RATIO);
  const arcPts = buildArc(scale, arcR, theta, CFG.ARC_STEPS);
  glowStroke(p, arcPts, [
    { w: 3, a: 10 },
    { w: 1.2, a: T.GUIDE_A.arc },
  ]);

  const vecPts = buildVector(scale, r, theta, 64);
  glowStroke(p, vecPts, T.GLOW);

  p.stroke(T.ACCENT[0], T.ACCENT[1], T.ACCENT[2], 55);
  p.strokeWeight(3.5);
  p.point(szx, 0);
  p.point(0, szy);
  p.strokeWeight(7);
  p.stroke(T.ACCENT[0], T.ACCENT[1], T.ACCENT[2], 255);
  p.point(szx, szy);

  drawLabels(p, scale, r, theta, zx, zy, szx, szy, arcR);

  p.pop();
}
