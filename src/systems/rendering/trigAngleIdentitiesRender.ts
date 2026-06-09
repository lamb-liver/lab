import type p5 from 'p5';
import {
  circleGeometry,
  clamp,
  formulaDisplayLine,
  getVisualCaption,
  makeCompositionSnap,
  normalizeAngle,
  polarPoint,
  reverseFormulaLine,
  unitToScreen,
  VALUE_SCALE,
  type CircleGeometry,
  type CompositionSnap,
  type TrigAngleIdentitiesParams,
  type TrigAngleIdentitiesSmoothState,
} from '../../curve/modules/trig-angle-identities/geometry';

const BG = [10, 10, 10] as const;
const ACCENT = [212, 184, 122] as const;
const GUIDE = [255, 255, 255] as const;
const TEXT = [232, 232, 232] as const;
const MUTED = [136, 136, 136] as const;

export type TrigAngleIdentitiesRenderSnap = {
  width: number;
  height: number;
  params: TrigAngleIdentitiesParams;
  smooth: TrigAngleIdentitiesSmoothState;
};

function withDash(p: p5, pattern: number[], fn: () => void) {
  p.push();
  try {
    p.drawingContext.setLineDash(pattern);
    fn();
  } finally {
    p.drawingContext.setLineDash([]);
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

function drawSignedArc(
  p: p5,
  geo: CircleGeometry,
  radius: number,
  a0: number,
  a1: number,
  rgba: readonly [number, number, number, number],
  sw: number,
) {
  const delta = a1 - a0;
  const steps = Math.max(8, Math.ceil(Math.abs(delta) / 0.035));

  p.noFill();
  p.stroke(rgba[0], rgba[1], rgba[2], rgba[3]);
  p.strokeWeight(sw);
  p.beginShape();
  for (let i = 0; i <= steps; i++) {
    const a = a0 + delta * (i / steps);
    p.vertex(geo.cx + Math.cos(a) * radius, geo.cy - Math.sin(a) * radius);
  }
  p.endShape();
}

function drawOffsetArc(
  p: p5,
  geo: CircleGeometry,
  radius: number,
  centerAngle: number,
  signedOffset: number,
  rgba: readonly [number, number, number, number],
  sw: number,
) {
  drawSignedArc(p, geo, radius, centerAngle - signedOffset, centerAngle + signedOffset, rgba, sw);
}

function drawAxesAndCircle(p: p5, geo: CircleGeometry) {
  p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 16);
  p.strokeWeight(1);
  p.line(geo.cx - geo.r * 1.18, geo.cy, geo.cx + geo.r * 1.18, geo.cy);
  p.line(geo.cx, geo.cy - geo.r * 1.18, geo.cx, geo.cy + geo.r * 1.18);

  p.noFill();
  p.stroke(ACCENT[0], ACCENT[1], ACCENT[2], 22);
  p.strokeWeight(1.1);
  p.circle(geo.cx, geo.cy, geo.r * 2);
}

function drawAngleGuides(
  p: p5,
  geo: CircleGeometry,
  snap: CompositionSnap,
  mixValue: number,
) {
  if (mixValue < 0.01) return;

  drawSignedArc(p, geo, geo.r * 0.22, 0, snap.alpha, [ACCENT[0], ACCENT[1], ACCENT[2], 70 * mixValue], 1.2);
  drawSignedArc(p, geo, geo.r * 0.29, 0, snap.beta, [255, 255, 255, 34 * mixValue], 1.1);
  drawSignedArc(p, geo, geo.r * 0.39, 0, snap.visualM, [ACCENT[0], ACCENT[1], ACCENT[2], 115 * mixValue], 1.6);
  drawOffsetArc(p, geo, geo.r * 0.48, snap.visualM, snap.visualD, [255, 255, 255, 34 * mixValue], 1.1);

  const mLabel = polarPoint(geo.cx, geo.cy, geo.r * 0.44, normalizeAngle(snap.visualM));
  drawTinyLabel(p, 'm', mLabel.x + 4, mLabel.y - 4, 170 * mixValue);

  const dLabelAngle = normalizeAngle(snap.visualM + snap.visualD * 0.5);
  const dLabel = polarPoint(geo.cx, geo.cy, geo.r * 0.54, dLabelAngle);
  drawTinyLabel(p, 'd', dLabel.x + 4, dLabel.y - 4, 150 * mixValue);
}

function drawChordAndMean(
  p: p5,
  geo: CircleGeometry,
  A: { x: number; y: number },
  B: { x: number; y: number },
  M: { x: number; y: number },
  V: { x: number; y: number },
  W: { x: number; y: number },
  snap: CompositionSnap,
  mixValue: number,
) {
  withDash(p, [4, 6], () => {
    p.stroke(255, 255, 255, 20 * mixValue);
    p.strokeWeight(1);
    p.line(A.x, A.y, B.x, B.y);
    p.line(geo.cx, geo.cy, M.x, M.y);
  });

  if (snap.formula.type === 'sum') {
    glowLine(p, geo.cx, geo.cy, V.x, V.y, 0.46);
    drawPointGlow(p, V.x, V.y, 4.5, 0.58);
    drawTinyLabel(p, '平均方向', V.x + 8, V.y - 8);
  } else {
    glowLine(p, geo.cx, geo.cy, W.x, W.y, 0.46);
    drawPointGlow(p, W.x, W.y, 4.5, 0.58);
    drawTinyLabel(p, '半差向量', W.x + 8, W.y - 8);
  }
}

function drawVectorsAndPoints(
  p: p5,
  geo: CircleGeometry,
  A: { x: number; y: number },
  B: { x: number; y: number },
  M: { x: number; y: number },
  showGuides: boolean,
) {
  glowLine(p, geo.cx, geo.cy, A.x, A.y, 0.88);
  glowLine(p, geo.cx, geo.cy, B.x, B.y, 0.62);

  drawPointGlow(p, A.x, A.y, 7);
  drawPointGlow(p, B.x, B.y, 6, 0.75);

  p.noStroke();
  p.fill(TEXT[0], TEXT[1], TEXT[2], 185);
  p.textSize(11);
  p.text('α', A.x + 10, A.y - 8);
  p.text('β', B.x + 10, B.y + 14);

  if (showGuides) {
    drawPointGlow(p, M.x, M.y, 4.5, 0.46);
    drawTinyLabel(p, 'm=(α+β)/2', M.x + 10, M.y - 8);
  }
}

function drawFormulaMeasurement(
  p: p5,
  geo: CircleGeometry,
  snap: CompositionSnap,
) {
  const value = clamp(snap.lhs, -2.15, 2.15);
  const scale = geo.r * VALUE_SCALE;

  if (snap.formula.axis === 'sin') {
    const x = clamp(geo.cx + geo.r * 1.22, geo.x + 22, geo.x + geo.w - 36);
    const y0 = geo.cy;
    const y1 = geo.cy - value * scale;

    p.stroke(255, 255, 255, 18);
    p.strokeWeight(1);
    p.line(x, geo.cy - 2 * scale, x, geo.cy + 2 * scale);
    p.line(x - 7, y0, x + 7, y0);

    glowLine(p, x, y0, x, y1, 0.75);
    drawTinyLabel(p, snap.formula.line1, x - 52, clamp(y1, geo.y + 30, geo.y + geo.h - 44));
  } else {
    const y = clamp(geo.cy + geo.r * 1.12, geo.y + 38, geo.y + geo.h - 54);
    const x0 = geo.cx;
    const x1 = geo.cx + value * scale;

    p.stroke(255, 255, 255, 18);
    p.strokeWeight(1);
    p.line(geo.cx - 2 * scale, y, geo.cx + 2 * scale, y);
    p.line(x0, y - 7, x0, y + 7);

    glowLine(p, x0, y, x1, y, 0.75);
    drawTinyLabel(p, snap.formula.line1, clamp(x1 + 10, geo.x + 22, geo.x + geo.w - 98), y - 10);
  }
}

function drawSmallFormulaHint(
  p: p5,
  geo: CircleGeometry,
  snap: CompositionSnap,
  reverseRead: boolean,
) {
  const textValue = reverseRead ? reverseFormulaLine(snap.formula) : formulaDisplayLine(snap.formula);
  const boxW = Math.min(260, geo.w - 32);
  const boxH = 34;
  const x = geo.x + 16;
  const y = geo.y + geo.h - 72;

  p.noStroke();
  p.fill(BG[0], BG[1], BG[2], 110);
  p.rect(x, y, boxW, boxH, 12);

  p.stroke(ACCENT[0], ACCENT[1], ACCENT[2], 28);
  p.strokeWeight(1);
  p.noFill();
  p.rect(x, y, boxW, boxH, 12);

  p.noStroke();
  p.fill(TEXT[0], TEXT[1], TEXT[2], 180);
  p.textSize(11);
  p.text(textValue, x + 12, y + 21);

  if (snap.sameAngle) {
    p.fill(MUTED[0], MUTED[1], MUTED[2], 185);
    p.text('α≈β', x + boxW - 42, y + 21);
  }
}

function drawCompositionScene(
  p: p5,
  geo: CircleGeometry,
  snap: CompositionSnap,
  params: TrigAngleIdentitiesParams,
  guideMix: number,
) {
  const A = polarPoint(geo.cx, geo.cy, geo.r, snap.alphaNorm);
  const B = polarPoint(geo.cx, geo.cy, geo.r, snap.betaNorm);
  const M = polarPoint(geo.cx, geo.cy, geo.r, normalizeAngle(snap.visualM));

  const unitA = { x: Math.cos(snap.alphaNorm), y: Math.sin(snap.alphaNorm) };
  const unitB = { x: Math.cos(snap.betaNorm), y: Math.sin(snap.betaNorm) };
  const halfSum = { x: (unitA.x + unitB.x) / 2, y: (unitA.y + unitB.y) / 2 };
  const halfDiff = { x: (unitA.x - unitB.x) / 2, y: (unitA.y - unitB.y) / 2 };
  const V = unitToScreen(halfSum.x, halfSum.y, geo);
  const W = unitToScreen(halfDiff.x, halfDiff.y, geo);

  drawAxesAndCircle(p, geo);
  drawAngleGuides(p, geo, snap, guideMix);
  drawChordAndMean(p, geo, A, B, M, V, W, snap, guideMix);
  drawVectorsAndPoints(p, geo, A, B, M, params.showGuides);
  drawFormulaMeasurement(p, geo, snap);
  drawSmallFormulaHint(p, geo, snap, params.reverseRead);
}

export function renderTrigAngleIdentitiesScene(p: p5, snap: TrigAngleIdentitiesRenderSnap) {
  p.background(BG[0], BG[1], BG[2]);
  p.textFont('system-ui, -apple-system, BlinkMacSystemFont, sans-serif');
  p.strokeCap(p.ROUND);
  p.strokeJoin(p.ROUND);

  const geo = circleGeometry(snap.width, snap.height);
  const composition = makeCompositionSnap(snap.params, snap.smooth);

  p.noFill();
  p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 12);
  p.strokeWeight(1);
  p.rect(geo.x - 8, geo.y - 8, geo.w + 16, geo.h + 16, 14);

  drawCompositionScene(p, geo, composition, snap.params, snap.smooth.guideMix);

  p.noStroke();
  p.fill(MUTED[0], MUTED[1], MUTED[2], 210);
  p.textSize(12);
  p.textAlign(p.CENTER, p.BASELINE);
  p.text(getVisualCaption(snap.params.reverseRead), geo.x + geo.w / 2, geo.y + geo.h - 10);
  p.textAlign(p.LEFT, p.BASELINE);
}

export type AngleDragKey = 'alpha' | 'beta';

export function pickAngleDrag(
  mx: number,
  my: number,
  width: number,
  height: number,
  smoothAlpha: number,
  smoothBeta: number,
  dragRadius = 34,
): AngleDragKey | null {
  const geo = circleGeometry(width, height);
  const alphaP = polarPoint(geo.cx, geo.cy, geo.r, normalizeAngle(smoothAlpha));
  const betaP = polarPoint(geo.cx, geo.cy, geo.r, normalizeAngle(smoothBeta));

  const dAlpha = Math.hypot(mx - alphaP.x, my - alphaP.y);
  const dBeta = Math.hypot(mx - betaP.x, my - betaP.y);
  const bestKey: AngleDragKey = dAlpha <= dBeta ? 'alpha' : 'beta';
  const bestDistance = Math.min(dAlpha, dBeta);

  return bestDistance < dragRadius ? bestKey : null;
}

export function angleFromDrag(mx: number, my: number, width: number, height: number) {
  const geo = circleGeometry(width, height);
  return normalizeAngle(Math.atan2(geo.cy - my, mx - geo.cx));
}
