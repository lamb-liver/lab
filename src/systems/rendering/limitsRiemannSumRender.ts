import type p5 from 'p5';
import { HINT_Y_OFFSET } from '../../curve/modules/limits-riemann-sum/constants';
import {
  computeRiemann,
  formatNum,
  getFunctionDef,
} from '../../curve/modules/limits-riemann-sum/functions';
import { computePlotRect, sx, sy } from '../../curve/modules/limits-riemann-sum/layout';
import type {
  FnKey,
  LimitsMode,
  LimitsRiemannParams,
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
};

const GOLD: [number, number, number] = [212, 184, 122];

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function drawAxes(p: p5, fn: ReturnType<typeof getFunctionDef>, plot: ReturnType<typeof computePlotRect>): void {
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
  p.text('x', plot.x + plot.w + 10, y0 + 4);
  p.text('f(x)', plot.x - 32, plot.y - 12);

  p.pop();
}

function drawGrid(p: p5, plot: ReturnType<typeof computePlotRect>): void {
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

function drawAreaUnderCurve(
  p: p5,
  fn: ReturnType<typeof getFunctionDef>,
  plot: ReturnType<typeof computePlotRect>,
): void {
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
  fn: ReturnType<typeof getFunctionDef>,
  plot: ReturnType<typeof computePlotRect>,
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

function drawFunctionCurve(
  p: p5,
  fn: ReturnType<typeof getFunctionDef>,
  plot: ReturnType<typeof computePlotRect>,
): void {
  p.push();
  drawCurveLayer(p, fn, plot, 8, 14);
  drawCurveLayer(p, fn, plot, 4, 42);
  drawCurveLayer(p, fn, plot, 1.8, 235);
  p.pop();
}

function drawRectangles(
  p: p5,
  fn: ReturnType<typeof getFunctionDef>,
  plot: ReturnType<typeof computePlotRect>,
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

function drawTangentLine(
  p: p5,
  fn: ReturnType<typeof getFunctionDef>,
  plot: ReturnType<typeof computePlotRect>,
  x: number,
  y: number,
  slope: number,
): void {
  const span = (fn.b - fn.a) * 0.34;
  const xA = Math.max(fn.a, Math.min(fn.b, x - span));
  const xB = Math.max(fn.a, Math.min(fn.b, x + span));

  const yA = y + slope * (xA - x);
  const yB = y + slope * (xB - x);

  p.push();

  p.stroke(GOLD[0], GOLD[1], GOLD[2], 42);
  p.strokeWeight(8);
  p.line(sx(xA, fn, plot), sy(yA, fn, plot), sx(xB, fn, plot), sy(yB, fn, plot));

  p.stroke(GOLD[0], GOLD[1], GOLD[2], 230);
  p.strokeWeight(2);
  p.line(sx(xA, fn, plot), sy(yA, fn, plot), sx(xB, fn, plot), sy(yB, fn, plot));

  p.pop();
}

function drawPointP(
  p: p5,
  fn: ReturnType<typeof getFunctionDef>,
  plot: ReturnType<typeof computePlotRect>,
  x: number,
  y: number,
): void {
  const px = sx(x, fn, plot);
  const py = sy(y, fn, plot);

  p.push();

  p.noStroke();
  p.fill(GOLD[0], GOLD[1], GOLD[2], 28);
  p.circle(px, py, 24);

  p.fill(...GOLD);
  p.circle(px, py, 7);

  p.fill(210);
  p.textSize(12);
  p.text('P', px + 10, py - 10);

  p.pop();
}

function drawSlopeTriangle(
  p: p5,
  fn: ReturnType<typeof getFunctionDef>,
  plot: ReturnType<typeof computePlotRect>,
  x: number,
  y: number,
  slope: number,
): void {
  let dx = (fn.b - fn.a) * 0.12;
  if (x + dx > fn.b) dx *= -1;

  const x2 = x + dx;
  const y2 = y + slope * dx;

  const px = sx(x, fn, plot);
  const py = sy(y, fn, plot);
  const px2 = sx(x2, fn, plot);
  const py2 = sy(y2, fn, plot);

  p.push();

  p.stroke(255, 255, 255, 34);
  p.strokeWeight(1);
  p.line(px, py, px2, py);
  p.line(px2, py, px2, py2);

  p.noStroke();
  p.fill(140);
  p.textSize(11);
  p.text('Δx', (px + px2) / 2 - 8, py + 16);
  p.text('Δy', px2 + 8, (py + py2) / 2);

  p.pop();
}

function drawVisualHint(
  p: p5,
  plot: ReturnType<typeof computePlotRect>,
  label: string,
): void {
  p.push();
  p.noStroke();
  p.fill(165);
  p.textSize(13);
  p.text(label, plot.x, plot.y + plot.h + HINT_Y_OFFSET);
  p.pop();
}

function drawVisualTitle(p: p5, plot: ReturnType<typeof computePlotRect>): void {
  p.push();
  p.noStroke();
  p.fill(...GOLD);
  p.textSize(14);
  p.textStyle(p.BOLD);
  p.text('LIMIT · RIEMANN SUM', plot.x, 56);

  p.fill(155);
  p.textSize(12);
  p.textStyle(p.NORMAL);
  p.text('黎曼和逼近面積；切線顯示瞬時斜率', plot.x, 76);
  p.pop();
}

function drawRiemannScene(p: p5, snap: LimitsRiemannSumSnap, plot: ReturnType<typeof computePlotRect>): void {
  const fn = getFunctionDef(snap.fnKey);

  drawAxes(p, fn, plot);
  drawGrid(p, plot);
  drawAreaUnderCurve(p, fn, plot);
  drawRectangles(p, fn, plot, snap.n, snap.method);
  drawFunctionCurve(p, fn, plot);

  const r = computeRiemann(fn, snap.n, snap.method);
  const err = Math.abs(r.area - fn.exact);

  drawVisualHint(
    p,
    plot,
    `Σ f(xᵢ)Δx = ${formatNum(r.area)}    |E| = ${formatNum(err)}`,
  );
}

function drawTangentScene(p: p5, snap: LimitsRiemannSumSnap, plot: ReturnType<typeof computePlotRect>): void {
  const fn = getFunctionDef(snap.fnKey);

  drawAxes(p, fn, plot);
  drawGrid(p, plot);
  drawAreaUnderCurve(p, fn, plot);
  drawFunctionCurve(p, fn, plot);

  const x = lerp(fn.a, fn.b, snap.tangentT);
  const y = fn.f(x);
  const slope = fn.df(x);

  drawTangentLine(p, fn, plot, x, y, slope);
  drawSlopeTriangle(p, fn, plot, x, y, slope);
  drawPointP(p, fn, plot, x, y);

  drawVisualHint(p, plot, `切線斜率 f′(x) = ${formatNum(slope)}`);
}

export function renderLimitsRiemannSumScene(
  p: p5,
  snap: LimitsRiemannSumSnap,
): void {
  p.background(10, 10, 10);

  const plot = computePlotRect(snap.width, snap.height);
  drawVisualTitle(p, plot);

  if (snap.mode === 'riemann') {
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

  if (params.mode === 'riemann') {
    const r = computeRiemann(fn, params.n, params.method);
    const err = Math.abs(r.area - fn.exact);

    return {
      statsLines: [
        `函數：${fn.formula}`,
        `∫ 精確值：${fn.exactLabel}`,
        `Σ 面積：${formatNum(r.area)}`,
        `|E|：${formatNum(err)}`,
      ],
      hintLine:
        params.method === 'mid'
          ? '中點法通常收斂較快'
          : '左右點受函數單調性影響',
      visualHint: `Σ = ${formatNum(r.area)}  |E| = ${formatNum(err)}`,
    };
  }

  const px = lerp(fn.a, fn.b, params.tangentT);
  const py = fn.f(px);
  const slope = fn.df(px);

  let hint = '斜率為正，函數上升';
  if (Math.abs(slope) < 0.04) {
    hint = '斜率接近 0，可能是極值點';
  } else if (slope < 0) {
    hint = '斜率為負，函數下降';
  }

  return {
    statsLines: [
      `函數：${fn.formula}`,
      `x：${formatNum(px)}`,
      `f(x)：${formatNum(py)}`,
      `f′(x)：${formatNum(slope)}`,
    ],
    hintLine: hint,
    visualHint: `f′(x) = ${formatNum(slope)}`,
  };
}
