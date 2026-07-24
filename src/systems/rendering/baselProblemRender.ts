import type p5 from 'p5';
import type { ParamValues } from '../../curve/types';
import {
  BASEL_VIEW,
  PI2_OVER_6,
  baselModeFromValue,
  buildAreaSquares,
  buildCompareSeries,
  buildPartialSeries,
  buildSincCurve,
  chartBounds,
  estimateLimit,
  mapRange,
  normalizeN,
} from '../../curve/modules/basel-problem/geometry';

type BaselProblemSnap = {
  width: number;
  height: number;
  params: ParamValues;
  revealProgress: number;
};

const PRIMARY = { r: 212, g: 184, b: 122 };
const GUIDE = { r: 255, g: 255, b: 255 };
const HARMONIC = { r: 120, g: 170, b: 255 };
const GEOMETRIC = { r: 120, g: 255, b: 168 };
const PARAM = { r: 255, g: 140, b: 180 };

export function renderBaselProblemScene(p: p5, snap: BaselProblemSnap): void {
  p.background(10, 10, 10);
  const designScale = Math.min(snap.width / BASEL_VIEW.width, snap.height / BASEL_VIEW.height);
  const offsetX = (snap.width - BASEL_VIEW.width * designScale) / 2;
  const offsetY = (snap.height - BASEL_VIEW.height * designScale) / 2;

  p.push();
  p.translate(offsetX, offsetY);
  p.scale(designScale);

  drawModeTitle(p, snap.params);
  const mode = baselModeFromValue(snap.params.mode);
  if (mode === 'area') drawArea(p, snap.params, snap.revealProgress);
  else if (mode === 'compare') drawCompare(p, snap.params, snap.revealProgress);
  else if (mode === 'euler') drawEuler(p, snap.params, snap.revealProgress);
  else if (mode === 'pseries') drawPSeries(p, snap.params, snap.revealProgress);
  else if (mode === 'param') drawParam(p, snap.params, snap.revealProgress);
  else drawPartial(p, snap.params, snap.revealProgress);

  p.pop();
}

function drawPartial(p: p5, params: ParamValues, revealProgress: number): void {
  const bounds = chartBounds();
  const series = buildPartialSeries(params, revealProgress);
  drawAxes(p, bounds);
  drawSeriesArea(p, series.points, bounds, PRIMARY);
  drawTermStems(p, series.points, bounds, PRIMARY);
  if ((params.p ?? 2) > 1) {
    const y = bounds.y + mapRange(series.limit, 0, series.limit, bounds.height, 0);
    drawLimitLine(p, y, PRIMARY, Math.abs((params.p ?? 2) - 2) < 1e-6 ? 'π²/6' : 'limit');
    const last = series.points.at(-1);
    if (last && Math.abs((params.p ?? 2) - 2) < 1e-6) {
      drawGapLine(p, last.x, last.y, y);
    }
  }
  drawGlowPolyline(p, [{ x: bounds.x, y: bounds.y + bounds.height }, ...series.points], PRIMARY);
  for (const point of series.points) {
    if (point.n % Math.max(1, Math.ceil(series.points.length / 18)) === 0) {
      drawGlowPoint(p, point.x, point.y, PRIMARY, 6);
    }
  }
  drawBaselGauge(p, series.sum, BASEL_VIEW.height - 70);
}

function drawArea(p: p5, params: ParamValues, revealProgress: number): void {
  const { squares, sum } = buildAreaSquares(params, revealProgress);
  for (const square of squares) {
    if (square.size <= 0.1) continue;
    const alpha = Math.max(0.08, 0.22 - square.n * 0.004);
    drawGlowRect(p, square.x, square.y, square.size, square.size, PRIMARY, alpha);
    if (square.size > 34 && square.n <= 16) {
      drawText(p, `1/${square.n}²`, square.x + square.size / 2, square.y + square.size / 2 + 4, 10, GUIDE, 90, p.CENTER);
    }
  }
  drawBaselGauge(p, sum, BASEL_VIEW.height - 70);
}

function drawCompare(p: p5, params: ParamValues, revealProgress: number): void {
  const bounds = chartBounds();
  const series = buildCompareSeries(params, revealProgress);
  drawAxes(p, bounds);
  drawLimitLine(p, bounds.y + mapRange(PI2_OVER_6, 0, series.bMax, bounds.height, 0), PRIMARY, 'π²/6');
  drawLimitLine(p, bounds.y + mapRange(2, 0, series.gMax, bounds.height, 0), GEOMETRIC, '2');
  drawGlowPolyline(p, [{ x: bounds.x, y: bounds.y + bounds.height }, ...series.harmonic], HARMONIC);
  drawGlowPolyline(p, [{ x: bounds.x, y: bounds.y + bounds.height }, ...series.basel], PRIMARY);
  drawGlowPolyline(p, [{ x: bounds.x, y: bounds.y + bounds.height }, ...series.geometric], GEOMETRIC);
  drawLegend(p, bounds.x + 8, bounds.y + bounds.height + 46);
}

function drawEuler(p: p5, params: ParamValues, revealProgress: number): void {
  const factors = Math.min(normalizeN(params.N), 12);
  const centerX = BASEL_VIEW.width * 0.5;
  const centerY = BASEL_VIEW.height * 0.35;
  const radius = 160;
  const progress = Math.max(0, Math.min(1, revealProgress));

  p.push();
  p.noFill();
  p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 18);
  p.strokeWeight(1);
  p.circle(centerX, centerY, radius * 2);

  for (let n = 1; n <= factors; n += 1) {
    const local = Math.max(0, Math.min(1, revealProgress * factors - (n - 1)));
    const angle = (Math.PI * 2 * n) / factors - Math.PI / 2;
    const x = centerX + Math.cos(angle) * radius * progress;
    const y = centerY + Math.sin(angle) * radius * progress;
    p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 18);
    p.line(centerX, centerY, x, y);
    drawGlowPoint(p, x, y, PARAM, 7 * local);
  }
  p.pop();

  const boxCount = Math.min(factors, 8);
  const boxW = Math.min(100, (BASEL_VIEW.width - 190) / boxCount);
  const startX = centerX - (boxW * boxCount) / 2;
  for (let n = 1; n <= boxCount; n += 1) {
    const local = Math.max(0, Math.min(1, revealProgress * factors - (n - 1)));
    drawGlowRect(p, startX + (n - 1) * boxW, BASEL_VIEW.height * 0.55, boxW - 5, 34, PRIMARY, 0.05 * local);
  }

  drawText(p, 'sin(x)/x = Π(1 - x² / n²π²)', centerX, BASEL_VIEW.height * 0.68, 14, GUIDE, 120, p.CENTER);
  drawText(p, 'coefficient of x²  →  Σ 1/n² = π²/6', centerX, BASEL_VIEW.height * 0.74, 14, PRIMARY, 220, p.CENTER);
}

function drawPSeries(p: p5, params: ParamValues, revealProgress: number): void {
  const bounds = chartBounds();
  const pValue = params.p ?? 2;
  const limit = estimateLimit(pValue, normalizeN(params.N));
  if (limit === null) {
    p.push();
    p.noStroke();
    p.fill(255, 80, 80, 18);
    p.rect(bounds.x, bounds.y, bounds.width, bounds.height);
    p.pop();
    drawText(p, 'DIVERGES  (p ≤ 1)', BASEL_VIEW.width / 2, BASEL_VIEW.height / 2, 18, { r: 255, g: 110, b: 110 }, 160, p.CENTER);
  }
  drawPartial(p, params, revealProgress);
}

function drawParam(p: p5, params: ParamValues, revealProgress: number): void {
  const data = buildSincCurve(params, revealProgress);
  const midY = BASEL_VIEW.height * 0.39;
  const fillY = BASEL_VIEW.height - 132;
  const fillHeight = 54;

  drawAxesLine(p, 74, midY, BASEL_VIEW.width - 74, midY);
  drawGlowPolyline(p, data.curve, PRIMARY);

  for (const zero of data.zeros) {
    p.push();
    p.stroke(PARAM.r, PARAM.g, PARAM.b, 80);
    p.line(zero.x, midY - 8, zero.x, midY + 26);
    p.pop();
    drawGlowPoint(p, zero.x, midY, PARAM, 6);
  }

  p.push();
  p.noFill();
  p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 18);
  p.rect(92, fillY - fillHeight, BASEL_VIEW.width - 184, fillHeight);
  p.pop();

  for (const seg of data.partialFill) {
    p.push();
    p.noStroke();
    p.fill(PRIMARY.r, PRIMARY.g, PRIMARY.b, Math.max(24, 142 - seg.n * 8));
    p.rect(seg.x, fillY - fillHeight, seg.width, fillHeight);
    p.pop();
  }

  drawText(p, 'sin(x)/x zeros at ±nπ', 92, midY - 145, 12, GUIDE, 100, p.LEFT);
  drawText(p, `${data.sum.toFixed(5)} / ${PI2_OVER_6.toFixed(5)}`, BASEL_VIEW.width - 92, fillY + 18, 11, PRIMARY, 220, p.RIGHT);
}

function drawModeTitle(p: p5, params: ParamValues): void {
  const titles = {
    partial: 'Partial Sum',
    area: 'Area Decomposition',
    compare: 'Series Comparison',
    euler: 'Euler Product',
    pseries: 'p-Series',
    param: 'Parametric · sin(x)/x Zeros',
  } satisfies Record<string, string>;
  drawText(p, titles[baselModeFromValue(params.mode)], 74, 52, 13, GUIDE, 55, p.LEFT);
}

function drawAxes(p: p5, bounds: ReturnType<typeof chartBounds>): void {
  p.push();
  p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 18);
  p.strokeWeight(1);
  p.line(bounds.x, bounds.y, bounds.x, bounds.y + bounds.height);
  p.line(bounds.x, bounds.y + bounds.height, bounds.x + bounds.width, bounds.y + bounds.height);
  p.pop();
}

function drawAxesLine(p: p5, x1: number, y1: number, x2: number, y2: number): void {
  p.push();
  p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 18);
  p.strokeWeight(1);
  p.line(x1, y1, x2, y2);
  p.pop();
}

function drawSeriesArea(
  p: p5,
  points: Array<{ x: number; y: number }>,
  bounds: ReturnType<typeof chartBounds>,
  col: typeof PRIMARY,
): void {
  if (points.length < 2) return;
  const baseline = bounds.y + bounds.height;
  p.push();
  p.noStroke();
  p.fill(col.r, col.g, col.b, 18);
  p.beginShape();
  p.vertex(bounds.x, baseline);
  for (const point of points) p.vertex(point.x, point.y);
  p.vertex(bounds.x + bounds.width, baseline);
  p.endShape(p.CLOSE);
  p.pop();
}

function drawTermStems(
  p: p5,
  points: Array<{ n: number; x: number; y: number }>,
  bounds: ReturnType<typeof chartBounds>,
  col: typeof PRIMARY,
): void {
  const baseline = bounds.y + bounds.height;
  const stride = Math.max(1, Math.ceil(points.length / 14));
  p.push();
  p.stroke(col.r, col.g, col.b, 42);
  p.strokeWeight(1);
  for (const point of points) {
    if (point.n === 1 || point.n === 2 || point.n % stride === 0) {
      p.line(point.x, baseline, point.x, point.y);
    }
  }
  p.pop();
}

function drawGapLine(p: p5, x: number, sumY: number, limitY: number): void {
  p.push();
  p.stroke(255, 255, 255, 46);
  p.strokeWeight(1);
  p.line(x, sumY, x, limitY);
  p.pop();
  drawText(p, '剩餘差距', x - 8, (sumY + limitY) / 2, 9, GUIDE, 82, p.RIGHT);
}

function drawBaselGauge(p: p5, sum: number, y: number): void {
  const x = BASEL_VIEW.width - 390;
  const w = 300;
  const h = 24;
  const ratio = Math.max(0, Math.min(1, sum / PI2_OVER_6));
  p.push();
  p.noFill();
  p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 34);
  p.strokeWeight(1);
  p.rect(x, y, w, h, 3);
  p.noStroke();
  p.fill(PRIMARY.r, PRIMARY.g, PRIMARY.b, 120);
  p.rect(x, y, w * ratio, h, 3);
  p.pop();
  drawText(p, `Sₙ ${sum.toFixed(4)}`, x, y - 8, 10, GUIDE, 95, p.LEFT);
  drawText(p, `π²/6 ${PI2_OVER_6.toFixed(4)}`, x + w, y - 8, 10, PRIMARY, 140, p.RIGHT);
}

function drawLimitLine(p: p5, y: number, col: typeof PRIMARY, label: string): void {
  p.push();
  p.stroke(col.r, col.g, col.b, 58);
  p.strokeWeight(1);
  for (let x = 74; x < BASEL_VIEW.width - 70; x += 8) {
    p.line(x, y, x + 4, y);
  }
  p.pop();
  drawText(p, label, BASEL_VIEW.width - 74, y - 5, 10, GUIDE, 90, p.RIGHT);
}

function drawGlowPolyline(p: p5, points: Array<{ x: number; y: number }>, col: typeof PRIMARY): void {
  if (points.length < 2) return;
  p.push();
  p.noFill();
  p.stroke(col.r, col.g, col.b, 28);
  p.strokeWeight(6);
  drawShape(p, points);
  p.stroke(col.r, col.g, col.b, 220);
  p.strokeWeight(1.5);
  drawShape(p, points);
  p.pop();
}

function drawShape(p: p5, points: Array<{ x: number; y: number }>): void {
  p.beginShape();
  for (const point of points) p.vertex(point.x, point.y);
  p.endShape();
}

function drawGlowPoint(p: p5, x: number, y: number, col: typeof PRIMARY, radius = 8): void {
  p.push();
  p.noStroke();
  p.fill(col.r, col.g, col.b, 36);
  p.circle(x, y, radius * 2);
  p.fill(col.r, col.g, col.b, 220);
  p.circle(x, y, Math.max(2, radius * 0.42));
  p.pop();
}

function drawGlowRect(
  p: p5,
  x: number,
  y: number,
  width: number,
  height: number,
  col: typeof PRIMARY,
  fillAlpha: number,
): void {
  p.push();
  p.fill(col.r, col.g, col.b, fillAlpha * 255);
  p.stroke(col.r, col.g, col.b, 120);
  p.strokeWeight(1);
  p.rect(x, y, width, height);
  p.pop();
}

function drawText(
  p: p5,
  text: string,
  x: number,
  y: number,
  size: number,
  col: typeof PRIMARY,
  alpha: number,
  align: typeof p.LEFT | typeof p.CENTER | typeof p.RIGHT,
): void {
  p.push();
  p.noStroke();
  p.fill(col.r, col.g, col.b, alpha);
  p.textAlign(align);
  p.textSize(size);
  p.text(text, x, y);
  p.pop();
}

function drawLegend(p: p5, x: number, y: number): void {
  const items = [
    { col: HARMONIC, text: 'Σ 1/n' },
    { col: PRIMARY, text: 'Σ 1/n²' },
    { col: GEOMETRIC, text: 'Σ 1/2ⁿ⁻¹' },
  ];
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i]!;
    p.push();
    p.noStroke();
    p.fill(item.col.r, item.col.g, item.col.b, 180);
    p.circle(x, y + i * 18, 7);
    p.pop();
    drawText(p, item.text, x + 16, y + i * 18 + 4, 10, GUIDE, 90, p.LEFT);
  }
}
