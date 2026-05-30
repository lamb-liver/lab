import type p5 from 'p5';
import {
  LOGISTIC_CHART,
  LOGISTIC_VIEW,
  T_MAX,
  T_MIN,
  type LogisticParams,
  logisticY,
  mapLogisticT,
  mapLogisticY,
  safeTAtFraction,
} from '../../curve/modules/logistic-curve/geometry';

export type LogisticCurveSnap = {
  width: number;
  height: number;
  smooth: LogisticParams;
  reveal: number;
  showDyDt: boolean;
  showExpCompare: boolean;
};

const GOLD = { r: 212, g: 184, b: 122 };
const GUIDE = { r: 255, g: 255, b: 255 };
const TEXT = { r: 232, g: 232, b: 232 };

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function renderLogisticCurveScene(p: p5, snap: LogisticCurveSnap): void {
  p.background(10, 10, 10);

  const scale = Math.min(snap.width / LOGISTIC_VIEW.width, snap.height / LOGISTIC_VIEW.height);
  const ox = (snap.width - LOGISTIC_VIEW.width * scale) / 2;
  const oy = (snap.height - LOGISTIC_VIEW.height * scale) / 2;

  p.push();
  p.translate(ox, oy);
  p.scale(scale);

  withChartClip(p, () => {
    drawPhaseBands(p, snap.smooth);
    drawGrid(p, snap.smooth);

    if (snap.showExpCompare) {
      drawExponentialComparison(p, snap.smooth);
    }

    drawGhostLogistic(p, snap.smooth);
    drawRevealedLogistic(p, snap.smooth, snap.reveal);

    if (snap.showDyDt) {
      drawDerivativeCurve(p, snap.smooth);
    }
  });

  drawInflection(p, snap.smooth);
  drawCurveFrontPoint(p, snap.smooth, snap.reveal);
  drawAxisLabels(p, snap.smooth);

  p.pop();
}

function withChartClip(p: p5, drawFn: () => void): void {
  const c = LOGISTIC_CHART;
  p.drawingContext.save();
  p.drawingContext.beginPath();
  p.drawingContext.rect(c.x, c.y, c.w, c.h);
  p.drawingContext.clip();
  drawFn();
  p.drawingContext.restore();
}

function drawGrid(p: p5, params: LogisticParams): void {
  const c = LOGISTIC_CHART;

  p.noFill();
  p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 9);
  p.strokeWeight(1);

  for (let i = 0; i <= 4; i += 1) {
    const yVal = (params.L / 4) * i;
    const y = mapLogisticY(yVal, params.L);
    p.line(c.x, y, c.x + c.w, y);
  }

  for (let i = 0; i <= 4; i += 1) {
    const t = lerp(T_MIN, T_MAX, i / 4);
    const x = mapLogisticT(t);
    p.line(x, c.y, x, c.y + c.h);
  }

  p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 20);
  p.line(c.x, c.y + c.h, c.x + c.w, c.y + c.h);
  p.line(c.x, c.y, c.x, c.y + c.h);
}

function drawPhaseBands(p: p5, params: LogisticParams): void {
  const t20 = safeTAtFraction(0.2, params);
  const t80 = safeTAtFraction(0.8, params);

  drawBand(p, T_MIN, t20, '緩增', 5, 0);
  drawBand(p, t20, t80, '急增', 8, 1);
  drawBand(p, t80, T_MAX, '飽和', 5, 2);

  drawPhaseBoundary(p, t20);
  drawPhaseBoundary(p, t80);
}

function drawPhaseBoundary(p: p5, t: number): void {
  if (!Number.isFinite(t)) return;

  const c = LOGISTIC_CHART;
  const x = mapLogisticT(t);
  if (x < c.x || x > c.x + c.w) return;

  p.push();
  p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 16);
  p.strokeWeight(1);
  p.drawingContext.setLineDash([4, 8]);
  p.line(x, c.y, x, c.y + c.h);
  p.drawingContext.setLineDash([]);
  p.pop();
}

function drawBand(
  p: p5,
  t0: number,
  t1: number,
  label: string,
  alphaValue: number,
  index: number,
): void {
  const c = LOGISTIC_CHART;
  if (!Number.isFinite(t0) || !Number.isFinite(t1)) return;

  const rawX0 = mapLogisticT(t0);
  const rawX1 = mapLogisticT(t1);
  const x0 = clamp(rawX0, c.x, c.x + c.w);
  const x1 = clamp(rawX1, c.x, c.x + c.w);
  const w = x1 - x0;
  if (w <= 1) return;

  p.noStroke();
  p.fill(GOLD.r, GOLD.g, GOLD.b, alphaValue);
  p.rect(x0, c.y, w, c.h);

  if (w < 64) return;

  const labelX = clamp((x0 + x1) / 2, c.x + 28, c.x + c.w - 28);
  const labelY = c.y + 12 + index * 14;

  p.fill(TEXT.r, TEXT.g, TEXT.b, 42);
  p.noStroke();
  p.textSize(11);
  p.textAlign(p.CENTER, p.TOP);
  p.text(label, labelX, labelY);
  p.textAlign(p.LEFT, p.BASELINE);
}

function drawGhostLogistic(p: p5, params: LogisticParams): void {
  p.stroke(GOLD.r, GOLD.g, GOLD.b, 18);
  p.strokeWeight(1);
  p.strokeJoin(p.ROUND);
  p.strokeCap(p.ROUND);
  p.noFill();
  p.beginShape();
  for (let i = 0; i <= 420; i += 1) {
    const t = lerp(T_MIN, T_MAX, i / 420);
    const y = logisticY(t, params);
    p.vertex(mapLogisticT(t), mapLogisticY(y, params.L));
  }
  p.endShape();
}

function drawRevealedLogistic(p: p5, params: LogisticParams, reveal: number): void {
  const endIndex = Math.floor(420 * reveal);
  drawGlowPolyline(p, params, 7, 15, endIndex);
  drawGlowPolyline(p, params, 3.5, 42, endIndex);
  drawGlowPolyline(p, params, 1.5, 230, endIndex);
}

function drawGlowPolyline(
  p: p5,
  params: LogisticParams,
  weight: number,
  alphaValue: number,
  endIndex: number,
): void {
  p.stroke(GOLD.r, GOLD.g, GOLD.b, alphaValue);
  p.strokeWeight(weight);
  p.strokeJoin(p.ROUND);
  p.strokeCap(p.ROUND);
  p.noFill();
  p.beginShape();
  for (let i = 0; i <= endIndex; i += 1) {
    const t = lerp(T_MIN, T_MAX, i / 420);
    const y = logisticY(t, params);
    p.vertex(mapLogisticT(t), mapLogisticY(y, params.L));
  }
  p.endShape();
}

function drawDerivativeCurve(p: p5, params: LogisticParams): void {
  const c = LOGISTIC_CHART;
  const maxD = Math.max(0.0001, params.k * params.L * 0.25);
  const baseY = c.y + c.h - 36;
  const scaleH = c.h * 0.18;

  p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 14);
  p.strokeWeight(1);
  p.line(c.x, baseY, c.x + c.w, baseY);

  p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 42);
  p.strokeWeight(1.3);
  p.noFill();
  p.beginShape();
  for (let i = 0; i <= 420; i += 1) {
    const t = lerp(T_MIN, T_MAX, i / 420);
    const y = logisticY(t, params);
    const dy = params.k * y * (1 - y / params.L);
    const px = mapLogisticT(t);
    const py = baseY - clamp(dy / maxD, 0, 1) * scaleH;
    p.vertex(px, py);
  }
  p.endShape();

  p.fill(TEXT.r, TEXT.g, TEXT.b, 62);
  p.noStroke();
  p.textSize(11);
  p.text('dy/dt', c.x + c.w - 42, baseY - scaleH - 8);
}

function drawExponentialComparison(p: p5, params: LogisticParams): void {
  const c = LOGISTIC_CHART;
  const C = params.L / params.a;
  const yCap = params.L * 0.68;
  const tCap = Math.log(yCap / C) / params.k;
  const tEnd = clamp(tCap, T_MIN, T_MAX);

  if (!Number.isFinite(tCap) || tEnd <= T_MIN + 0.05 || params.a < 1) {
    drawExpOutOfRangeHint(p);
    return;
  }

  p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 46);
  p.strokeWeight(1);
  p.noFill();
  p.drawingContext.setLineDash([7, 9]);
  p.beginShape();
  for (let i = 0; i <= 220; i += 1) {
    const t = lerp(T_MIN, tEnd, i / 220);
    const y = C * Math.exp(params.k * t);
    p.vertex(mapLogisticT(t), mapLogisticY(y, params.L));
  }
  p.endShape();
  p.drawingContext.setLineDash([]);

  p.fill(TEXT.r, TEXT.g, TEXT.b, 70);
  p.noStroke();
  p.textSize(11);
  p.text('Ce^kt', c.x + 22, c.y + 36);
}

function drawExpOutOfRangeHint(p: p5): void {
  const c = LOGISTIC_CHART;
  p.noStroke();
  p.fill(TEXT.r, TEXT.g, TEXT.b, 38);
  p.textSize(11);
  p.text('Ce^kt 超出可比區間', c.x + 22, c.y + 36);
}

function drawInflection(p: p5, params: LogisticParams): void {
  const tStar = Math.log(params.a) / params.k;
  const yStar = params.L / 2;
  if (!Number.isFinite(tStar)) return;

  const x = mapLogisticT(tStar);
  const y = mapLogisticY(yStar, params.L);
  const c = LOGISTIC_CHART;
  if (x < c.x || x > c.x + c.w) return;

  p.push();
  p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 24);
  p.strokeWeight(1);
  p.drawingContext.setLineDash([4, 8]);
  p.line(x, c.y, x, c.y + c.h);
  p.line(c.x, y, c.x + c.w, y);
  p.drawingContext.setLineDash([]);

  p.noStroke();
  p.fill(GOLD.r, GOLD.g, GOLD.b, 38);
  p.circle(x, y, 22);
  p.fill(GOLD.r, GOLD.g, GOLD.b, 240);
  p.circle(x, y, 6);

  p.fill(TEXT.r, TEXT.g, TEXT.b, 86);
  p.textSize(11);
  const labelX = clamp(x + 10, c.x + 8, c.x + c.w - 92);
  const labelY = clamp(y - 10, c.y + 18, c.y + c.h - 12);
  p.text('拐點  y = L/2', labelX, labelY);
  p.pop();
}

function drawCurveFrontPoint(p: p5, params: LogisticParams, reveal: number): void {
  const t = lerp(T_MIN, T_MAX, reveal);
  const y = logisticY(t, params);
  const px = mapLogisticT(t);
  const py = mapLogisticY(y, params.L);

  p.noStroke();
  p.fill(GOLD.r, GOLD.g, GOLD.b, 26);
  p.circle(px, py, 28);
  p.fill(GOLD.r, GOLD.g, GOLD.b, 220);
  p.circle(px, py, 7);
}

function drawAxisLabels(p: p5, params: LogisticParams): void {
  const c = LOGISTIC_CHART;

  p.noStroke();
  p.fill(TEXT.r, TEXT.g, TEXT.b, 70);
  p.textSize(11);
  p.text('t', c.x + c.w - 8, c.y + c.h + 28);
  p.text('y', c.x - 28, c.y + 8);
  p.text('0', c.x - 22, c.y + c.h + 4);
  p.text('L', c.x - 22, mapLogisticY(params.L, params.L) + 4);

  p.fill(TEXT.r, TEXT.g, TEXT.b, 52);
  p.textSize(12);
  p.text('y(t) = L / (1 + a·e^(-kt))', c.x, c.y + c.h + 48);
}
