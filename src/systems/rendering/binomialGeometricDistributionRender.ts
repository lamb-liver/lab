import type p5 from 'p5';
import {
  BINOMIAL_GEOMETRIC_VIEW,
  deriveDistributionData,
  formatNum,
  type DistributionData,
  type DistributionRow,
} from '../../curve/modules/binomial-geometric-distribution/geometry';
import type { ParamValues } from '../../curve/types';

type BinomialGeometricSnap = {
  width: number;
  height: number;
  params: ParamValues;
};

type PlotRect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

const BG = [10, 10, 10] as const;
const ACCENT = [212, 184, 122] as const;
const WHITE = [255, 255, 255] as const;

export function renderBinomialGeometricDistributionScene(
  p: p5,
  snap: BinomialGeometricSnap,
): void {
  const data = deriveDistributionData(snap.params);

  p.background(...BG);
  p.textFont("system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif");

  const scale = Math.min(
    snap.width / BINOMIAL_GEOMETRIC_VIEW.width,
    snap.height / BINOMIAL_GEOMETRIC_VIEW.height,
  );
  const ox = (snap.width - BINOMIAL_GEOMETRIC_VIEW.width * scale) / 2;
  const oy = (snap.height - BINOMIAL_GEOMETRIC_VIEW.height * scale) / 2;

  p.push();
  p.translate(ox, oy);
  p.scale(scale);
  drawChart(p, data);
  p.pop();
}

function drawChart(p: p5, data: DistributionData): void {
  const plot = { x: 88, y: 132, w: 724, h: 560 };

  drawPanel(p, plot);
  drawGrid(p, plot);
  drawSigmaBand(p, plot, data);
  drawBars(p, plot, data);
  drawMeanLine(p, plot, data);
  drawAxes(p, plot, data);
  drawBottomLabel(p, plot, data);
  drawHud(p, data);
}

function drawPanel(p: p5, plot: PlotRect): void {
  p.noFill();
  p.stroke(...WHITE, 16);
  p.strokeWeight(1);
  p.rect(56, 74, 788, 724, 18);

  p.stroke(...WHITE, 28);
  p.rect(plot.x, plot.y, plot.w, plot.h);
}

function drawGrid(p: p5, plot: PlotRect): void {
  p.stroke(...WHITE, 10);
  p.strokeWeight(1);

  for (let i = 0; i <= 4; i += 1) {
    const y = mapValue(i, 0, 4, plot.y + plot.h, plot.y);
    p.line(plot.x, y, plot.x + plot.w, y);
  }

  p.stroke(...WHITE, 7);
  for (let i = 0; i <= 6; i += 1) {
    const x = mapValue(i, 0, 6, plot.x, plot.x + plot.w);
    p.line(x, plot.y, x, plot.y + plot.h);
  }
}

function drawSigmaBand(p: p5, plot: PlotRect, data: DistributionData): void {
  const minK = data.rows[0].k;
  const maxK = data.rows[data.rows.length - 1].k;
  const left = data.mean - data.sigma;
  const right = data.mean + data.sigma;

  if (right < minK || left > maxK) return;

  const x1 = kToScreen(clamp(left, minK, maxK), plot, data.rows);
  const x2 = kToScreen(clamp(right, minK, maxK), plot, data.rows);

  p.noStroke();
  p.fill(...ACCENT, 16);
  p.rect(x1, plot.y, Math.max(1, x2 - x1), plot.h);
}

function drawBars(p: p5, plot: PlotRect, data: DistributionData): void {
  const slot = plot.w / data.rows.length;
  const barW = Math.max(3, slot * 0.62);

  data.rows.forEach((row, i) => {
    const cx = plot.x + slot * (i + 0.5);
    const h = mapValue(row.prob, 0, data.yMax, 0, plot.h);
    const x = cx - barW / 2;
    const y = plot.y + plot.h - h;
    const nearMean = Math.abs(row.k - data.mean) <= 0.5;

    if (row.bucket) p.fill(...ACCENT, 120);
    else if (nearMean) p.fill(...ACCENT, 210);
    else p.fill(...ACCENT, 88);

    p.noStroke();
    p.rect(x, y, barW, h, 4, 4, 1, 1);

    p.stroke(...ACCENT, row.bucket || nearMean ? 210 : 82);
    p.strokeWeight(row.bucket || nearMean ? 1.4 : 1);
    p.noFill();
    p.rect(x, y, barW, h, 4, 4, 1, 1);

    if (row.bucket) drawBucketArrow(p, cx, y - 9);
  });
}

function drawBucketArrow(p: p5, x: number, y: number): void {
  p.stroke(...WHITE, 105);
  p.strokeWeight(1);
  p.noFill();
  p.line(x - 7, y, x + 7, y);
  p.line(x + 7, y, x + 2, y - 4);
  p.line(x + 7, y, x + 2, y + 4);
}

function drawMeanLine(p: p5, plot: PlotRect, data: DistributionData): void {
  const minK = data.rows[0].k;
  const maxK = data.rows[data.rows.length - 1].k;
  if (data.mean < minK || data.mean > maxK) return;

  const x = kToScreen(data.mean, plot, data.rows);
  const ctx = p.drawingContext as CanvasRenderingContext2D;

  p.stroke(...WHITE, 82);
  p.strokeWeight(1);
  ctx.setLineDash([4, 6]);
  p.line(x, plot.y, x, plot.y + plot.h);
  ctx.setLineDash([]);

  p.noStroke();
  p.fill(...WHITE, 165);
  p.textSize(12);
  p.textAlign(p.CENTER, p.BOTTOM);
  p.text('E(X)', x, plot.y - 7);
}

function drawAxes(p: p5, plot: PlotRect, data: DistributionData): void {
  p.stroke(...WHITE, 34);
  p.strokeWeight(1);
  p.line(plot.x, plot.y + plot.h, plot.x + plot.w, plot.y + plot.h);
  p.line(plot.x, plot.y, plot.x, plot.y + plot.h);

  p.fill(...WHITE, 92);
  p.noStroke();
  p.textSize(11);
  p.textAlign(p.RIGHT, p.CENTER);
  p.text(formatNum(data.yMax, 3), plot.x - 8, plot.y);
  p.text('0', plot.x - 8, plot.y + plot.h);

  const slot = plot.w / data.rows.length;
  const step = data.rows.length > 36 ? 6 : data.rows.length > 24 ? 4 : data.rows.length > 14 ? 2 : 1;
  p.textAlign(p.CENTER, p.TOP);

  data.rows.forEach((row, i) => {
    if (i % step !== 0 && i !== data.rows.length - 1) return;
    const x = plot.x + slot * (i + 0.5);
    p.text(row.label, x, plot.y + plot.h + 10);
  });
}

function drawBottomLabel(p: p5, plot: PlotRect, data: DistributionData): void {
  const label =
    data.dist === 'binomial'
      ? '固定 n 次試驗：X 計數成功次數'
      : `第一次成功前的失敗次數；${data.rows[data.rows.length - 1].label} 為右尾收納桶`;

  p.noStroke();
  p.fill(...WHITE, 95);
  p.textSize(12);
  p.textAlign(p.CENTER, p.CENTER);
  p.text(label, plot.x + plot.w / 2, plot.y + plot.h + 40);
}

function drawHud(p: p5, data: DistributionData): void {
  p.noStroke();
  p.fill(...ACCENT, 220);
  p.textSize(13);
  p.textAlign(p.LEFT, p.TOP);
  p.text(data.dist === 'binomial' ? `X ~ B(${data.n}, ${data.p.toFixed(2)})` : `X ~ Geo(${data.p.toFixed(2)})`, 88, 86);

  p.fill(...WHITE, 102);
  p.textSize(12);
  p.text(`E(X) = ${formatNum(data.mean, 3)}    Var(X) = ${formatNum(data.variance, 3)}`, 88, 108);
}

function kToScreen(value: number, plot: PlotRect, rows: DistributionRow[]): number {
  const minK = rows[0].k;
  const maxK = rows[rows.length - 1].k;
  const slot = plot.w / rows.length;

  if (maxK === minK) return plot.x + plot.w / 2;

  const t = (value - minK) / (maxK - minK);
  return plot.x + slot / 2 + t * (plot.w - slot);
}

function mapValue(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  if (Math.abs(inMax - inMin) < 1e-9) return outMin;
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
