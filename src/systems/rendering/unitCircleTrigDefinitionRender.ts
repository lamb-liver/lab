import { canvas2d } from './canvas2d';
import type p5 from 'p5';
import {
  circleGeometry,
  clamp,
  EPS,
  getTrigValues,
  getVisualCaption,
  nearestSpecialAngle,
  normalizeAngle,
  polarPoint,
  SPECIAL_ANGLES,
  TANGENT_LIMIT,
  TAU,
  unitToScreen,
  type CircleGeometry,
  type UnitCircleSmoothState,
  type UnitCircleTrigDefinitionParams,
} from '../../curve/modules/unit-circle-trig-definition/geometry';

const BG = [10, 10, 10] as const;
const ACCENT = [212, 184, 122] as const;
const GUIDE = [255, 255, 255] as const;
const TEXT = [232, 232, 232] as const;
const MUTED = [136, 136, 136] as const;

type UnitCircleRenderSnap = {
  width: number;
  height: number;
  params: UnitCircleTrigDefinitionParams;
  smooth: UnitCircleSmoothState;
};

function mid(a: number, b: number) {
  return (a + b) / 2;
}

function withDash(p: p5, pattern: number[], fn: () => void) {
  p.push();
  try {
    canvas2d(p).setLineDash(pattern);
    fn();
  } finally {
    canvas2d(p).setLineDash([]);
    p.pop();
  }
}

function glowLine(
  p: p5,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  intensity = 1,
) {
  const layers = [
    { w: 7, a: 16 * intensity },
    { w: 3.5, a: 42 * intensity },
    { w: 1.5, a: 230 * intensity },
  ];

  for (const layer of layers) {
    p.stroke(ACCENT[0], ACCENT[1], ACCENT[2], layer.a);
    p.strokeWeight(layer.w);
    p.line(x1, y1, x2, y2);
  }
}

function drawPointGlow(p: p5, x: number, y: number, r = 6, intensity = 1) {
  p.noStroke();
  p.fill(ACCENT[0], ACCENT[1], ACCENT[2], 34 * intensity);
  p.circle(x, y, r * 4.2);
  p.fill(ACCENT[0], ACCENT[1], ACCENT[2], 210 * intensity);
  p.circle(x, y, r * 1.55);
  p.fill(255, 255, 255, 180 * intensity);
  p.circle(x, y, Math.max(2, r * 0.45));
}

function drawTinyLabel(p: p5, label: string, x: number, y: number, alpha = 180) {
  p.noStroke();
  p.fill(TEXT[0], TEXT[1], TEXT[2], alpha);
  p.textSize(11);
  p.text(label, x, y);
}

function drawSector(
  p: p5,
  geo: CircleGeometry,
  a0: number,
  a1: number,
  rgba: readonly [number, number, number, number],
) {
  const steps = Math.max(8, Math.ceil(Math.abs(a1 - a0) / 0.05));
  p.noFill();
  p.fill(rgba[0], rgba[1], rgba[2], rgba[3]);
  p.beginShape();
  p.vertex(geo.cx, geo.cy);
  for (let i = 0; i <= steps; i++) {
    const a = a0 + (a1 - a0) * (i / steps);
    p.vertex(geo.cx + Math.cos(a) * geo.r, geo.cy - Math.sin(a) * geo.r);
  }
  p.endShape(p.CLOSE);
}

function drawQuadrantHints(p: p5, geo: CircleGeometry, mixValue: number) {
  if (mixValue < 0.01) return;

  const labels = [
    { text: 'I  + + +', x: 0.52, y: 0.52 },
    { text: 'II  − + −', x: -0.78, y: 0.52 },
    { text: 'III  − − +', x: -0.84, y: -0.58 },
    { text: 'IV  + − −', x: 0.52, y: -0.58 },
  ];

  drawSector(p, geo, 0, Math.PI / 2, [255, 255, 255, 4 * mixValue]);
  drawSector(p, geo, Math.PI / 2, Math.PI, [255, 255, 255, 4 * mixValue]);
  drawSector(p, geo, Math.PI, (3 * Math.PI) / 2, [ACCENT[0], ACCENT[1], ACCENT[2], 10 * mixValue]);
  drawSector(p, geo, (3 * Math.PI) / 2, TAU, [ACCENT[0], ACCENT[1], ACCENT[2], 10 * mixValue]);

  for (const item of labels) {
    const pt = unitToScreen(item.x, item.y, geo);
    p.noStroke();
    p.fill(MUTED[0], MUTED[1], MUTED[2], 130 * mixValue);
    p.textSize(10);
    p.text(item.text, pt.x, pt.y);
  }
}

function drawAxesAndCircle(p: p5, geo: CircleGeometry) {
  p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 16);
  p.strokeWeight(1);
  p.line(geo.cx - geo.r * 1.2, geo.cy, geo.cx + geo.r * 1.2, geo.cy);
  p.line(geo.cx, geo.cy - geo.r * 1.2, geo.cx, geo.cy + geo.r * 1.2);

  p.noFill();
  p.stroke(ACCENT[0], ACCENT[1], ACCENT[2], 22);
  p.strokeWeight(1.1);
  p.circle(geo.cx, geo.cy, geo.r * 2);

  drawTinyLabel(p, '1', geo.cx + geo.r + 8, geo.cy - 8);
  drawTinyLabel(p, '-1', geo.cx - geo.r - 22, geo.cy - 8);
}

function drawSpecialAngleMarks(p: p5, geo: CircleGeometry, mixValue: number) {
  if (mixValue < 0.01) return;

  for (const item of SPECIAL_ANGLES) {
    p.stroke(ACCENT[0], ACCENT[1], ACCENT[2], 80 * mixValue);
    p.strokeWeight(1);
    p.line(
      geo.cx + Math.cos(item.angle) * geo.r * 0.96,
      geo.cy - Math.sin(item.angle) * geo.r * 0.96,
      geo.cx + Math.cos(item.angle) * geo.r * 1.04,
      geo.cy - Math.sin(item.angle) * geo.r * 1.04,
    );

    p.noStroke();
    p.fill(TEXT[0], TEXT[1], TEXT[2], 95 * mixValue);
    p.textSize(10);
    const lx = geo.cx + Math.cos(item.angle) * geo.r * 1.14;
    const ly = geo.cy - Math.sin(item.angle) * geo.r * 1.14;
    p.text(item.label, lx - 10, ly + 4);
  }
}

function drawProjectionLines(
  p: p5,
  P: { x: number; y: number },
  X: { x: number; y: number },
  Y: { x: number; y: number },
  geo: CircleGeometry,
) {
  withDash(p, [4, 6], () => {
    p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 32);
    p.strokeWeight(1);
    p.line(P.x, P.y, X.x, X.y);
    p.line(P.x, P.y, Y.x, Y.y);
  });

  glowLine(p, geo.cx, geo.cy, X.x, X.y, 0.48);
  glowLine(p, geo.cx, geo.cy, Y.x, Y.y, 0.42);
}

function drawAngleArc(p: p5, geo: CircleGeometry, signedTheta: number) {
  const arcR = geo.r * 0.27;
  const steps = Math.max(12, Math.ceil(Math.abs(signedTheta) / 0.035));

  p.noFill();
  p.stroke(ACCENT[0], ACCENT[1], ACCENT[2], 170);
  p.strokeWeight(1.8);
  p.beginShape();
  for (let i = 0; i <= steps; i++) {
    const a = signedTheta * (i / steps);
    p.vertex(geo.cx + Math.cos(a) * arcR, geo.cy - Math.sin(a) * arcR);
  }
  p.endShape();

  const labelAngle = signedTheta * 0.5;
  drawTinyLabel(
    p,
    'θ',
    geo.cx + Math.cos(labelAngle) * (arcR + 16),
    geo.cy - Math.sin(labelAngle) * (arcR + 16),
  );
}

function drawTangentGuide(
  p: p5,
  geo: CircleGeometry,
  tanValue: number,
  mixValue: number,
) {
  if (mixValue < 0.01 || !Number.isFinite(tanValue)) return;
  if (Math.abs(tanValue) > TANGENT_LIMIT) return;

  const x = geo.cx + geo.r;
  const y = geo.cy - geo.r * tanValue;

  p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 16 * mixValue);
  p.strokeWeight(1);
  p.line(x, geo.cy - geo.r * 1.18, x, geo.cy + geo.r * 1.18);

  withDash(p, [3, 7], () => {
    p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 25 * mixValue);
    p.strokeWeight(1);
    p.line(geo.cx, geo.cy, x, y);
  });

  glowLine(p, x, geo.cy, x, y, 0.32 * mixValue);
  drawTinyLabel(p, 'tan θ', x + 10, y, 175 * mixValue);
}

function drawExactValueHint(
  p: p5,
  item: (typeof SPECIAL_ANGLES)[number],
  geo: CircleGeometry,
) {
  const boxW = 160;
  const boxH = 48;
  const x = clamp(geo.cx - boxW / 2, geo.x + 12, geo.x + geo.w - boxW - 12);
  const y = geo.y + geo.h - 82;

  p.noStroke();
  p.fill(10, 10, 10, 120);
  p.rect(x, y, boxW, boxH, 12);

  p.stroke(ACCENT[0], ACCENT[1], ACCENT[2], 35);
  p.strokeWeight(1);
  p.noFill();
  p.rect(x, y, boxW, boxH, 12);

  p.noStroke();
  p.fill(TEXT[0], TEXT[1], TEXT[2], 185);
  p.textSize(11);
  p.text(`${item.label}：cos=${item.cos}，sin=${item.sin}`, x + 12, y + 20);
  p.fill(MUTED[0], MUTED[1], MUTED[2], 190);
  p.text('特殊角精確值', x + 12, y + 37);
}

function drawUnitCircleScene(p: p5, geo: CircleGeometry, snap: UnitCircleRenderSnap) {
  const theta = snap.smooth.theta;
  const thetaNorm = normalizeAngle(theta);
  const { cosValue, sinValue, tanValue } = getTrigValues(thetaNorm);

  const O = { x: geo.cx, y: geo.cy };
  const P = unitToScreen(cosValue, sinValue, geo);
  const X = unitToScreen(cosValue, 0, geo);
  const Y = unitToScreen(0, sinValue, geo);

  drawQuadrantHints(p, geo, snap.smooth.quadrantMix);
  drawAxesAndCircle(p, geo);
  drawSpecialAngleMarks(p, geo, snap.smooth.specialMix);
  drawProjectionLines(p, P, X, Y, geo);
  drawAngleArc(p, geo, theta);
  glowLine(p, O.x, O.y, P.x, P.y, 0.95);
  drawTangentGuide(p, geo, tanValue, snap.smooth.tangentMix);

  drawPointGlow(p, P.x, P.y, 7);
  drawTinyLabel(p, 'P', P.x + 10, P.y - 8);
  drawTinyLabel(
    p,
    'cos θ',
    clamp(mid(geo.cx, X.x) - 18, geo.x + 14, geo.x + geo.w - 64),
    geo.cy + 20,
  );
  drawTinyLabel(
    p,
    'sin θ',
    geo.cx + 12,
    clamp(mid(geo.cy, Y.y), geo.y + 24, geo.y + geo.h - 38),
  );

  if (snap.params.showSpecialAngles) {
    const exact = nearestSpecialAngle(thetaNorm);
    if (exact && exact.distance < (Math.PI / 180) * 2) {
      drawExactValueHint(p, exact.item, geo);
    }
  }
}

export function renderUnitCircleTrigDefinitionScene(p: p5, snap: UnitCircleRenderSnap) {
  p.background(BG[0], BG[1], BG[2]);
  p.textFont('system-ui, -apple-system, BlinkMacSystemFont, sans-serif');
  p.strokeCap(p.ROUND);
  p.strokeJoin(p.ROUND);

  const geo = circleGeometry(snap.width, snap.height, snap.params.showSpecialAngles);

  p.noFill();
  p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 12);
  p.strokeWeight(1);
  p.rect(geo.x - 8, geo.y - 8, geo.w + 16, geo.h + 16, 14);

  drawUnitCircleScene(p, geo, snap);

  const thetaNorm = normalizeAngle(snap.smooth.theta);
  p.noStroke();
  p.fill(MUTED[0], MUTED[1], MUTED[2], 210);
  p.textSize(12);
  p.textAlign(p.CENTER, p.BASELINE);
  p.text(getVisualCaption(thetaNorm), geo.x + geo.w / 2, geo.y + geo.h - 10);
  p.textAlign(p.LEFT, p.BASELINE);
}

export function pickThetaDrag(
  mx: number,
  my: number,
  width: number,
  height: number,
  smoothTheta: number,
): boolean {
  const geo = circleGeometry(width, height, true);
  const thetaNorm = normalizeAngle(smoothTheta);
  const P = polarPoint(geo.cx, geo.cy, geo.r, thetaNorm);
  const nearPoint = Math.hypot(mx - P.x, my - P.y) < 34;
  const nearCircle = Math.hypot(mx - geo.cx, my - geo.cy) < geo.r * 1.25;
  return nearPoint || nearCircle;
}

export function thetaFromDrag(mx: number, my: number, width: number, height: number) {
  const geo = circleGeometry(width, height, true);
  return normalizeAngle(Math.atan2(geo.cy - my, mx - geo.cx));
}
