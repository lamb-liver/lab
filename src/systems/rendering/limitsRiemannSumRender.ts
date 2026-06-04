import type p5 from 'p5';
import { HINT_Y_OFFSET } from '../../curve/modules/limits-riemann-sum/constants';
import {
  computeForwardSecant,
  computeRiemann,
  formatNum,
  getFunctionDef,
  scaleToForwardH,
  scaleToPartitionCount,
} from '../../curve/modules/limits-riemann-sum/functions';
import { computePlotRect, sx, sy } from '../../curve/modules/limits-riemann-sum/layout';
import type {
  FnKey,
  FunctionDef,
  LimitsMode,
  LimitsRiemannParams,
  PlotRect,
  RiemannMethod,
} from '../../curve/modules/limits-riemann-sum/types';

export type LimitsRiemannSumSnap = {
  width: number;
  height: number;
  mode: LimitsMode;
  fnKey: FnKey;
  method: RiemannMethod;
  n: number;
  tangentT: number;
  localH: number;
  scale: number;
};

const GOLD: [number, number, number] = [212, 184, 122];
const BLUE: [number, number, number] = [125, 178, 255];

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function withPlotClip(p: p5, plot: PlotRect, draw: () => void): void {
  p.push();
  p.drawingContext.beginPath();
  p.drawingContext.rect(plot.x, plot.y, plot.w, plot.h);
  p.drawingContext.clip();
  draw();
  p.pop();
}

function drawAxes(p: p5, fn: FunctionDef, plot: PlotRect): void {
  p.push();

  p.noFill();
  p.stroke(255, 255, 255, 20);
  p.strokeWeight(1);
  p.rect(plot.x, plot.y, plot.w, plot.h);

  const y0 = sy(0, fn, plot);

  p.stroke(255, 255, 255, 32);
  p.line(plot.x, y0, plot.x + plot.w, y0);
  p.line(plot.x, plot.y, plot.x, plot.y + plot.h);

  p.noStroke();
  p.fill(145);
  p.textSize(11);
  p.text('x', plot.x + plot.w + 8, y0 + 4);
  p.text('f(x)', plot.x - 32, plot.y - 10);

  p.pop();
}

function drawGrid(p: p5, plot: PlotRect): void {
  p.push();

  p.stroke(255, 255, 255, 8);
  p.strokeWeight(1);

  for (let i = 1; i < 8; i++) {
    const x = plot.x + (plot.w * i) / 8;
    p.line(x, plot.y, x, plot.y + plot.h);
  }

  for (let i = 1; i < 5; i++) {
    const y = plot.y + (plot.h * i) / 5;
    p.line(plot.x, y, plot.x + plot.w, y);
  }

  p.pop();
}

function drawAreaUnderCurve(p: p5, fn: FunctionDef, plot: PlotRect): void {
  p.push();

  p.noStroke();
  p.fill(GOLD[0], GOLD[1], GOLD[2], 10);

  p.beginShape();
  p.vertex(sx(fn.a, fn, plot), sy(0, fn, plot));
  for (let i = 0; i <= 280; i++) {
    const x = lerp(fn.a, fn.b, i / 280);
    p.vertex(sx(x, fn, plot), sy(fn.f(x), fn, plot));
  }
  p.vertex(sx(fn.b, fn, plot), sy(0, fn, plot));
  p.endShape(p.CLOSE);

  p.pop();
}

function drawCurveLayer(
  p: p5,
  fn: FunctionDef,
  plot: PlotRect,
  weight: number,
  alphaValue: number,
): void {
  p.noFill();
  p.stroke(GOLD[0], GOLD[1], GOLD[2], alphaValue);
  p.strokeWeight(weight);

  p.beginShape();
  for (let i = 0; i <= 420; i++) {
    const x = lerp(fn.a, fn.b, i / 420);
    p.vertex(sx(x, fn, plot), sy(fn.f(x), fn, plot));
  }
  p.endShape();
}

function drawFunctionCurve(p: p5, fn: FunctionDef, plot: PlotRect): void {
  p.push();
  drawCurveLayer(p, fn, plot, 8, 14);
  drawCurveLayer(p, fn, plot, 4, 42);
  drawCurveLayer(p, fn, plot, 1.8, 235);
  p.pop();
}

function drawRectangles(
  p: p5,
  fn: FunctionDef,
  plot: PlotRect,
  n: number,
  method: RiemannMethod,
): void {
  const dx = (fn.b - fn.a) / n;

  p.push();

  p.stroke(GOLD[0], GOLD[1], GOLD[2], n > 90 ? 36 : 70);
  p.strokeWeight(1);
  p.fill(GOLD[0], GOLD[1], GOLD[2], n > 90 ? 12 : 24);

  for (let i = 0; i < n; i++) {
    const x0 = fn.a + i * dx;
    const x1 = x0 + dx;

    let sampleX = x0;
    if (method === 'right') sampleX = x1;
    if (method === 'mid') sampleX = (x0 + x1) / 2;

    const h = fn.f(sampleX);

    const px0 = sx(x0, fn, plot);
    const px1 = sx(x1, fn, plot);
    const py0 = sy(0, fn, plot);
    const pyH = sy(h, fn, plot);

    p.rect(px0, pyH, px1 - px0, py0 - pyH);
  }

  p.pop();
}

function drawDeltaXMarker(p: p5, fn: FunctionDef, plot: PlotRect, n: number): void {
  const dx = (fn.b - fn.a) / n;
  const x0 = fn.a;
  const x1 = fn.a + dx;
  const y = Math.min(plot.y + plot.h - 10, sy(0, fn, plot) + 18);
  const px0 = sx(x0, fn, plot);
  const px1 = sx(x1, fn, plot);

  p.push();
  p.stroke(255, 255, 255, 70);
  p.strokeWeight(1);
  p.line(px0, y, px1, y);
  p.line(px0, y - 4, px0, y + 4);
  p.line(px1, y - 4, px1, y + 4);
  p.noStroke();
  p.fill(160);
  p.textSize(11);
  p.text('Δx', (px0 + px1) / 2 - 8, y + 16);
  p.pop();
}

function drawTangentLine(
  p: p5,
  fn: FunctionDef,
  plot: PlotRect,
  x: number,
  y: number,
  slope: number,
  alphaValue = 230,
): void {
  const span = (fn.b - fn.a) * 0.34;
  const xA = Math.max(fn.a, Math.min(fn.b, x - span));
  const xB = Math.max(fn.a, Math.min(fn.b, x + span));

  const yA = y + slope * (xA - x);
  const yB = y + slope * (xB - x);

  p.push();

  p.stroke(GOLD[0], GOLD[1], GOLD[2], Math.min(42, alphaValue * 0.22));
  p.strokeWeight(8);
  p.line(sx(xA, fn, plot), sy(yA, fn, plot), sx(xB, fn, plot), sy(yB, fn, plot));

  p.stroke(GOLD[0], GOLD[1], GOLD[2], alphaValue);
  p.strokeWeight(2);
  p.line(sx(xA, fn, plot), sy(yA, fn, plot), sx(xB, fn, plot), sy(yB, fn, plot));

  p.pop();
}

function drawPointLabel(
  p: p5,
  fn: FunctionDef,
  plot: PlotRect,
  x: number,
  label: string,
  color: [number, number, number],
): void {
  const y = fn.f(x);
  const px = sx(x, fn, plot);
  const py = sy(y, fn, plot);

  p.push();
  p.noStroke();
  p.fill(color[0], color[1], color[2], 30);
  p.circle(px, py, 22);
  p.fill(...color);
  p.circle(px, py, 6);
  p.fill(210);
  p.textSize(12);
  p.text(label, px + 9, py - 9);
  p.pop();
}

function drawForwardSecant(
  p: p5,
  fn: FunctionDef,
  plot: PlotRect,
  x: number,
  h: number,
): ReturnType<typeof computeForwardSecant> {
  const y = fn.f(x);
  const secant = computeForwardSecant(fn, x, h);

  drawTangentLine(p, fn, plot, x, y, fn.df(x), 70);
  drawPointLabel(p, fn, plot, x, 'P', GOLD);

  if (!secant.viable) return secant;

  const px = sx(x, fn, plot);
  const py = sy(y, fn, plot);
  const px2 = sx(secant.x2, fn, plot);
  const py2 = sy(secant.y2, fn, plot);

  p.push();
  p.stroke(BLUE[0], BLUE[1], BLUE[2], 215);
  p.strokeWeight(2);
  p.line(px, py, px2, py2);

  p.stroke(255, 255, 255, 42);
  p.strokeWeight(1);
  p.line(px, py, px2, py);
  p.line(px2, py, px2, py2);

  p.noStroke();
  p.fill(145);
  p.textSize(11);
  p.text('h', (px + px2) / 2 - 4, py + 16);
  p.text('Δy', px2 + 8, (py + py2) / 2);
  p.pop();

  drawPointLabel(p, fn, plot, secant.x2, 'P+h', BLUE);

  return secant;
}

function drawVisualHint(p: p5, plot: PlotRect, label: string): void {
  p.push();
  p.noStroke();
  p.fill(165);
  p.textSize(13);
  p.text(label, plot.x, plot.y + plot.h + HINT_Y_OFFSET);
  p.pop();
}

function drawVisualTitle(p: p5, plot: PlotRect): void {
  p.push();
  p.noStroke();
  p.fill(...GOLD);
  p.textSize(14);
  p.textStyle(p.BOLD);
  p.text('極限 · 面積與斜率', plot.x, 56);

  p.fill(155);
  p.textSize(12);
  p.textStyle(p.NORMAL);
  p.text('同一個尺度縮小：面積看累積，斜率看局部', plot.x, 76);
  p.pop();
}

function drawSubplotTitle(p: p5, plot: PlotRect, title: string): void {
  p.push();
  p.noStroke();
  p.fill(190);
  p.textSize(12);
  p.textStyle(p.BOLD);
  p.text(title, plot.x, plot.y - 10);
  p.textStyle(p.NORMAL);
  p.pop();
}

function drawRiemannPlot(
  p: p5,
  fn: FunctionDef,
  plot: PlotRect,
  n: number,
  method: RiemannMethod,
): void {
  drawAxes(p, fn, plot);
  drawGrid(p, plot);
  withPlotClip(p, plot, () => {
    drawAreaUnderCurve(p, fn, plot);
    drawRectangles(p, fn, plot, n, method);
    drawFunctionCurve(p, fn, plot);
  });
  drawDeltaXMarker(p, fn, plot, n);
}

function drawTangentPlot(
  p: p5,
  fn: FunctionDef,
  plot: PlotRect,
  tangentT: number,
  h: number,
): ReturnType<typeof computeForwardSecant> {
  drawAxes(p, fn, plot);
  drawGrid(p, plot);
  withPlotClip(p, plot, () => {
    drawFunctionCurve(p, fn, plot);
  });

  const x = lerp(fn.a, fn.b, tangentT);
  return withTangentClip(p, fn, plot, x, h);
}

function withTangentClip(
  p: p5,
  fn: FunctionDef,
  plot: PlotRect,
  x: number,
  h: number,
): ReturnType<typeof computeForwardSecant> {
  let secant: ReturnType<typeof computeForwardSecant> | null = null;
  withPlotClip(p, plot, () => {
    secant = drawForwardSecant(p, fn, plot, x, h);
  });
  return secant ?? computeForwardSecant(fn, x, h);
}

function computeComparePlots(plot: PlotRect): { left: PlotRect; right: PlotRect } {
  if (plot.w < 420) {
    const gap = 46;
    const y = plot.y + 42;
    const h = Math.max(112, (plot.h - gap - 54) / 2);
    return {
      left: { x: plot.x, y, w: plot.w, h },
      right: { x: plot.x, y: y + h + gap, w: plot.w, h },
    };
  }

  const gap = Math.max(26, plot.w * 0.06);
  const w = (plot.w - gap) / 2;
  const y = plot.y + 30;
  const h = Math.max(120, plot.h - 34);

  return {
    left: { x: plot.x, y, w, h },
    right: { x: plot.x + w + gap, y, w, h },
  };
}

function drawCompareScene(p: p5, snap: LimitsRiemannSumSnap, plot: PlotRect): void {
  const fn = getFunctionDef(snap.fnKey);
  const n = scaleToPartitionCount(snap.scale);
  const h = scaleToForwardH(fn, snap.scale);
  const x = lerp(fn.a, fn.b, fn.comparisonT);
  const plots = computeComparePlots(plot);

  drawSubplotTitle(p, plots.left, '全域累積：Σ f(xᵢ)Δx');
  drawRiemannPlot(p, fn, plots.left, n, 'mid');

  drawSubplotTitle(p, plots.right, '局部比值：[f(P+h)-f(P)] / h');
  const secant = drawTangentPlot(p, fn, plots.right, fn.comparisonT, h);

  const r = computeRiemann(fn, n, 'mid');
  const areaErr = Math.abs(r.area - fn.exact);
  const slopeErr = secant.viable ? Math.abs(secant.slope - fn.df(x)) : Number.NaN;
  const hint =
    plot.w < 420
      ? `Δx=${formatNum((fn.b - fn.a) / n)}   h=${formatNum(secant.h)}\n|E_area|=${formatNum(areaErr)}   |m_h−f′(P)|=${formatNum(slopeErr)}`
      : `Δx=${formatNum((fn.b - fn.a) / n)}   h=${formatNum(secant.h)}   |E_area|=${formatNum(areaErr)}   |m_h−f′(P)|=${formatNum(slopeErr)}`;

  drawVisualHint(p, plot, hint);
}

function drawRiemannScene(p: p5, snap: LimitsRiemannSumSnap, plot: PlotRect): void {
  const fn = getFunctionDef(snap.fnKey);

  drawRiemannPlot(p, fn, plot, snap.n, snap.method);

  const r = computeRiemann(fn, snap.n, snap.method);
  const err = Math.abs(r.area - fn.exact);

  drawVisualHint(
    p,
    plot,
    `全域累積：Σ f(xᵢ)Δx = ${formatNum(r.area)}    |E_area| = ${formatNum(err)}`,
  );
}

function drawTangentScene(p: p5, snap: LimitsRiemannSumSnap, plot: PlotRect): void {
  const fn = getFunctionDef(snap.fnKey);

  const secant = drawTangentPlot(p, fn, plot, snap.tangentT, snap.localH);
  const x = lerp(fn.a, fn.b, snap.tangentT);
  const slopeErr = secant.viable ? Math.abs(secant.slope - fn.df(x)) : Number.NaN;

  drawVisualHint(
    p,
    plot,
    secant.viable
      ? `局部比值：m_h = ${formatNum(secant.slope)}    |m_h−f′(P)| = ${formatNum(slopeErr)}`
      : '局部跨度 h 超出定義域',
  );
}

export function renderLimitsRiemannSumScene(
  p: p5,
  snap: LimitsRiemannSumSnap,
): void {
  p.background(10, 10, 10);

  const plot = computePlotRect(snap.width, snap.height);
  drawVisualTitle(p, plot);

  if (snap.mode === 'compare') {
    drawCompareScene(p, snap, plot);
  } else if (snap.mode === 'riemann') {
    drawRiemannScene(p, snap, plot);
  } else {
    drawTangentScene(p, snap, plot);
  }
}

export type LimitsSidebarState = {
  statsLines: string[];
  hintLine: string;
  visualHint: string;
};

export function buildLimitsSidebarState(
  params: LimitsRiemannParams,
): LimitsSidebarState {
  const fn = getFunctionDef(params.fnKey);

  if (params.mode === 'compare') {
    const n = scaleToPartitionCount(params.scale);
    const h = scaleToForwardH(fn, params.scale);
    const x = lerp(fn.a, fn.b, fn.comparisonT);
    const r = computeRiemann(fn, n, 'mid');
    const secant = computeForwardSecant(fn, x, h);
    const areaErr = Math.abs(r.area - fn.exact);
    const slopeErr = secant.viable ? Math.abs(secant.slope - fn.df(x)) : Number.NaN;

    return {
      statsLines: [
        `函數：${fn.formula}`,
        `Δx：${formatNum((fn.b - fn.a) / n)}`,
        `h：${formatNum(secant.h)}`,
        `|E_area|：${formatNum(areaErr)}`,
        `|m_h−f′(P)|：${formatNum(slopeErr)}`,
      ],
      hintLine: secant.viable
        ? '左圖累積小矩形；右圖放大單一點附近的比值'
        : 'h 超出定義域',
      visualHint: `Δx=${formatNum((fn.b - fn.a) / n)} h=${formatNum(secant.h)}`,
    };
  }

  if (params.mode === 'riemann') {
    const r = computeRiemann(fn, params.n, params.method);
    const err = Math.abs(r.area - fn.exact);

    return {
      statsLines: [
        `函數：${fn.formula}`,
        `∫ 精確值：${fn.exactLabel}`,
        `Σ 面積：${formatNum(r.area)}`,
        `|E_area|：${formatNum(err)}`,
      ],
      hintLine:
        params.method === 'mid'
          ? '中點法通常收斂較快'
          : '左右點受函數單調性影響',
      visualHint: `Σ = ${formatNum(r.area)}  |E_area| = ${formatNum(err)}`,
    };
  }

  const px = lerp(fn.a, fn.b, params.tangentT);
  const py = fn.f(px);
  const secant = computeForwardSecant(fn, px, params.localH);
  const exactSlope = fn.df(px);
  const slopeErr = secant.viable ? Math.abs(secant.slope - exactSlope) : Number.NaN;

  let hint = '斜率為正，函數上升';
  if (!secant.viable) {
    hint = 'h 超出定義域';
  } else if (Math.abs(exactSlope) < 0.04) {
    hint = '斜率接近 0，可能是極值點';
  } else if (exactSlope < 0) {
    hint = '斜率為負，函數下降';
  }

  return {
    statsLines: [
      `函數：${fn.formula}`,
      `x：${formatNum(px)}`,
      `f(x)：${formatNum(py)}`,
      `h：${formatNum(secant.h)}`,
      `m_h：${formatNum(secant.slope)}`,
      `f′(x)：${formatNum(exactSlope)}`,
      `|m_h−f′(x)|：${formatNum(slopeErr)}`,
    ],
    hintLine: hint,
    visualHint: secant.viable
      ? `m_h = ${formatNum(secant.slope)}`
      : 'h 超出定義域',
  };
}
