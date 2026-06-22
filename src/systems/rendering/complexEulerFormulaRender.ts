import type p5 from 'p5';
import {
  DEMOIVRE_R,
  HINT_Y_OFFSET,
  TAU,
  UNIT_CIRCLE_R,
  WAVE_AMP_RATIO,
  WAVE_COS_Y_RATIO,
  WAVE_SIN_Y_RATIO,
  WAVE_W_RATIO,
} from '../../curve/modules/complex-euler-formula/constants';
import {
  argC,
  computeOperation,
  formatAngle,
  formatComplex,
  formatNum,
  getOperationHint,
  magC,
  normalizeAngle,
} from '../../curve/modules/complex-euler-formula/complex';
import {
  circleRadius,
  complexToScreen,
  computePlotRect,
  getCircleCenter,
  getPlaneTransform,
} from '../../curve/modules/complex-euler-formula/layout';
import type {
  Complex,
  ComplexEulerParams,
  PlotRect,
} from '../../curve/modules/complex-euler-formula/types';

type ComplexEulerSnap = {
  width: number;
  height: number;
} & ComplexEulerParams;

const GOLD: [number, number, number] = [212, 184, 122];
const BLUE: [number, number, number] = [130, 185, 230];
const GREEN: [number, number, number] = [130, 215, 160];

function drawVisualTitle(p: p5, plot: PlotRect): void {
  p.push();
  p.noStroke();
  p.fill(...GOLD);
  p.textSize(14);
  p.textStyle(p.BOLD);
  p.text('複數 · Euler 公式', plot.x, 56);

  p.fill(155);
  p.textSize(12);
  p.textStyle(p.NORMAL);
  p.text('複數乘法是旋轉加縮放；eⁱᶿ 是單位圓上的旋轉', plot.x, 76);
  p.pop();
}

function drawVisualHint(p: p5, plot: PlotRect, label: string): void {
  p.push();
  p.noStroke();
  p.fill(165);
  p.textSize(13);
  p.text(label, plot.x, plot.y + plot.h + HINT_Y_OFFSET);
  p.pop();
}

function withPlotClip(p: p5, plot: PlotRect, draw: () => void): void {
  p.push();
  p.drawingContext.beginPath();
  p.drawingContext.rect(plot.x, plot.y, plot.w, plot.h);
  p.drawingContext.clip();
  draw();
  p.pop();
}

function clampLabelPoint(
  p: p5,
  x: number,
  y: number,
  label: string,
  plot: PlotRect,
): { x: number; y: number } {
  const margin = 8;
  const labelW = p.textWidth(label);
  return {
    x: Math.max(plot.x + margin, Math.min(plot.x + plot.w - labelW - margin, x)),
    y: Math.max(plot.y + 16, Math.min(plot.y + plot.h - margin, y)),
  };
}

function drawComplexPlane(p: p5, plot: PlotRect): void {
  const { cx, cy, unit } = getPlaneTransform(plot);

  p.push();
  p.noFill();
  p.stroke(255, 255, 255, 20);
  p.strokeWeight(1);
  p.rect(plot.x, plot.y, plot.w, plot.h);

  p.stroke(255, 255, 255, 8);
  for (let i = -3; i <= 3; i++) {
    p.line(cx + i * unit, plot.y, cx + i * unit, plot.y + plot.h);
    p.line(plot.x, cy + i * unit, plot.x + plot.w, cy + i * unit);
  }

  p.stroke(255, 255, 255, 32);
  p.line(plot.x, cy, plot.x + plot.w, cy);
  p.line(cx, plot.y, cx, plot.y + plot.h);

  p.noStroke();
  p.fill(145);
  p.textSize(11);
  p.text('Re', plot.x + plot.w + 8, cy + 4);
  p.text('Im', cx + 8, plot.y - 10);
  p.pop();
}

function drawUnitCircle(p: p5, cx: number, cy: number, r: number): void {
  p.push();
  p.noFill();
  p.stroke(255, 255, 255, 16);
  p.strokeWeight(1);
  p.circle(cx, cy, r * 2);

  p.stroke(255, 255, 255, 9);
  for (let i = 1; i <= 3; i++) {
    p.circle(cx, cy, (r * 2 * i) / 3);
  }

  p.stroke(255, 255, 255, 28);
  p.line(cx - r - 28, cy, cx + r + 28, cy);
  p.line(cx, cy - r - 28, cx, cy + r + 28);

  p.noStroke();
  p.fill(145);
  p.textSize(11);
  p.text('Re', cx + r + 34, cy + 4);
  p.text('Im', cx + 8, cy - r - 34);
  p.pop();
}

function drawVectorFrom(
  p: p5,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  rgb: [number, number, number],
  label: string,
  showLabel = true,
): void {
  p.push();

  p.stroke(rgb[0], rgb[1], rgb[2], 34);
  p.strokeWeight(8);
  p.line(x1, y1, x2, y2);

  p.stroke(rgb[0], rgb[1], rgb[2], 225);
  p.strokeWeight(2);
  p.line(x1, y1, x2, y2);

  const a = Math.atan2(y2 - y1, x2 - x1);
  const arrow = 9;

  p.push();
  p.translate(x2, y2);
  p.rotate(a);
  p.noStroke();
  p.fill(rgb[0], rgb[1], rgb[2], 225);
  p.triangle(0, 0, -arrow, -arrow * 0.45, -arrow, arrow * 0.45);
  p.pop();

  if (showLabel) {
    p.noStroke();
    p.fill(200);
    p.textSize(12);
    p.text(label, x2 + 10, y2 - 10);
  }

  p.pop();
}

function drawVector(
  p: p5,
  z: Complex,
  plot: PlotRect,
  rgb: [number, number, number],
  label: string,
  showLabel = true,
): void {
  const origin = complexToScreen({ re: 0, im: 0 }, plot);
  const end = complexToScreen(z, plot);
  drawVectorFrom(p, origin.x, origin.y, end.x, end.y, rgb, label, showLabel);
  drawDot(p, end.x, end.y, rgb);
}

function drawVectorLabel(
  p: p5,
  z: Complex,
  plot: PlotRect,
  rgb: [number, number, number],
  label: string,
): void {
  const end = complexToScreen(z, plot);
  p.push();
  p.noStroke();
  p.fill(rgb[0], rgb[1], rgb[2], 220);
  p.textSize(12);
  const pos = clampLabelPoint(p, end.x + 10, end.y - 10, label, plot);
  p.text(label, pos.x, pos.y);
  p.pop();
}

function drawDot(
  p: p5,
  x: number,
  y: number,
  rgb: [number, number, number],
): void {
  p.push();
  p.noStroke();
  p.fill(rgb[0], rgb[1], rgb[2], 28);
  p.circle(x, y, 22);
  p.fill(rgb[0], rgb[1], rgb[2], 235);
  p.circle(x, y, 7);
  p.pop();
}

function drawParallelogram(p: p5, a: Complex, b: Complex, plot: PlotRect): void {
  const o = complexToScreen({ re: 0, im: 0 }, plot);
  const pa = complexToScreen(a, plot);
  const pb = complexToScreen(b, plot);
  const ps = complexToScreen({ re: a.re + b.re, im: a.im + b.im }, plot);

  p.push();
  p.noFill();
  p.stroke(255, 255, 255, 24);
  p.strokeWeight(1);
  p.drawingContext.setLineDash([5, 7]);
  p.line(pa.x, pa.y, ps.x, ps.y);
  p.line(pb.x, pb.y, ps.x, ps.y);
  p.drawingContext.setLineDash([]);
  p.pop();
}

function drawSubGuide(p: p5, a: Complex, b: Complex, plot: PlotRect): void {
  const pa = complexToScreen(a, plot);
  const pb = complexToScreen(b, plot);

  p.push();
  p.stroke(255, 255, 255, 28);
  p.strokeWeight(1);
  p.drawingContext.setLineDash([5, 7]);
  p.line(pb.x, pb.y, pa.x, pa.y);
  p.drawingContext.setLineDash([]);

  p.pop();
}

function drawSubGuideLabel(p: p5, a: Complex, b: Complex, plot: PlotRect): void {
  const pa = complexToScreen(a, plot);
  const pb = complexToScreen(b, plot);
  const label = 'z₁ − z₂';

  p.push();
  p.noStroke();
  p.fill(145);
  p.textSize(11);
  const pos = clampLabelPoint(p, (pa.x + pb.x) / 2 + 8, (pa.y + pb.y) / 2 - 8, label, plot);
  p.text(label, pos.x, pos.y);
  p.pop();
}

function drawAngleArc(
  p: p5,
  z: Complex,
  plot: PlotRect,
  radius: number,
  rgb: [number, number, number],
  label: string,
): void {
  const origin = complexToScreen({ re: 0, im: 0 }, plot);
  const a = -argC(z);

  p.push();
  p.noFill();
  p.stroke(rgb[0], rgb[1], rgb[2], 120);
  p.strokeWeight(1.2);
  p.arc(origin.x, origin.y, radius * 2, radius * 2, 0, a);

  p.noStroke();
  p.fill(rgb[0], rgb[1], rgb[2], 160);
  p.textSize(11);
  p.text(
    label,
    origin.x + Math.cos(a * 0.5) * (radius + 10),
    origin.y + Math.sin(a * 0.5) * (radius + 10),
  );
  p.pop();
}

function drawAngleAt(
  p: p5,
  cx: number,
  cy: number,
  angleValue: number,
  radius: number,
  label: string,
): void {
  p.push();
  p.noFill();
  p.stroke(GOLD[0], GOLD[1], GOLD[2], 130);
  p.strokeWeight(1.2);
  p.arc(cx, cy, radius * 2, radius * 2, -angleValue, 0);

  p.noStroke();
  p.fill(GOLD[0], GOLD[1], GOLD[2], 180);
  p.textSize(12);
  const mid = -angleValue * 0.5;
  p.text(
    label,
    cx + Math.cos(mid) * (radius + 12),
    cy + Math.sin(mid) * (radius + 12),
  );
  p.pop();
}

function drawOperationScene(p: p5, snap: ComplexEulerSnap, plot: PlotRect): void {
  const result = computeOperation(snap.z1, snap.z2, snap.opKey);

  drawComplexPlane(p, plot);

  withPlotClip(p, plot, () => {
    if (snap.opKey === 'add') {
      drawParallelogram(p, snap.z1, snap.z2, plot);
    }
    if (snap.opKey === 'sub') {
      drawSubGuide(p, snap.z1, snap.z2, plot);
    }

    drawVector(p, snap.z1, plot, BLUE, 'z₁', false);
    drawVector(p, snap.z2, plot, GREEN, 'z₂', false);
    drawVector(p, result, plot, GOLD, 'result', false);

    if (snap.opKey === 'mul' || snap.opKey === 'div') {
      drawAngleArc(p, snap.z1, plot, 44, BLUE, 'θ₁');
      drawAngleArc(p, snap.z2, plot, 64, GREEN, 'θ₂');
      drawAngleArc(
        p,
        result,
        plot,
        86,
        GOLD,
        snap.opKey === 'mul' ? 'θ₁+θ₂' : 'θ₁−θ₂',
      );
    }
  });

  drawVectorLabel(p, snap.z1, plot, BLUE, 'z₁');
  drawVectorLabel(p, snap.z2, plot, GREEN, 'z₂');
  drawVectorLabel(p, result, plot, GOLD, 'result');
  if (snap.opKey === 'sub') {
    drawSubGuideLabel(p, snap.z1, snap.z2, plot);
  }

  drawVisualHint(p, plot, getOperationHint(snap.opKey));
}

function drawWave(
  p: p5,
  x0: number,
  y0: number,
  w: number,
  amp: number,
  isCos: boolean,
): void {
  p.push();
  p.noFill();

  p.stroke(GOLD[0], GOLD[1], GOLD[2], 32);
  p.strokeWeight(6);
  p.beginShape();
  for (let i = 0; i <= 220; i++) {
    const t = (i / 220) * TAU;
    const v = isCos ? Math.cos(t) : Math.sin(t);
    p.vertex(x0 + (i / 220) * w, y0 - v * amp);
  }
  p.endShape();

  p.stroke(GOLD[0], GOLD[1], GOLD[2], 210);
  p.strokeWeight(1.5);
  p.beginShape();
  for (let i = 0; i <= 220; i++) {
    const t = (i / 220) * TAU;
    const v = isCos ? Math.cos(t) : Math.sin(t);
    p.vertex(x0 + (i / 220) * w, y0 - v * amp);
  }
  p.endShape();

  p.pop();
}

function drawEulerWavePanel(p: p5, plot: PlotRect, theta: number): void {
  const x0 = plot.x;
  const yCos = plot.y + plot.h * WAVE_COS_Y_RATIO;
  const ySin = plot.y + plot.h * WAVE_SIN_Y_RATIO;
  const w = plot.w * WAVE_W_RATIO;
  const amp = plot.h * WAVE_AMP_RATIO;

  p.push();

  p.stroke(255, 255, 255, 12);
  p.strokeWeight(1);
  p.line(x0, yCos, x0 + w, yCos);
  p.line(x0, ySin, x0 + w, ySin);

  p.noStroke();
  p.fill(150);
  p.textSize(12);
  p.text('cosθ', x0, yCos - 52);
  p.text('sinθ', x0, ySin - 52);

  drawWave(p, x0, yCos, w, amp, true);
  drawWave(p, x0, ySin, w, amp, false);

  const tx = x0 + (theta / TAU) * w;
  p.stroke(GOLD[0], GOLD[1], GOLD[2], 70);
  p.line(tx, yCos - amp - 14, tx, ySin + amp + 14);

  p.noStroke();
  p.fill(...GOLD);
  p.circle(tx, yCos - Math.cos(theta) * amp, 6);
  p.circle(tx, ySin - Math.sin(theta) * amp, 6);

  p.pop();
}

function drawProjectionToWaves(
  p: p5,
  plot: PlotRect,
  theta: number,
  px: number,
  py: number,
): void {
  const x0 = plot.x;
  const yCos = plot.y + plot.h * WAVE_COS_Y_RATIO;
  const ySin = plot.y + plot.h * WAVE_SIN_Y_RATIO;
  const w = plot.w * WAVE_W_RATIO;
  const amp = plot.h * WAVE_AMP_RATIO;

  const tx = x0 + (theta / TAU) * w;
  const cosY = yCos - Math.cos(theta) * amp;
  const sinY = ySin - Math.sin(theta) * amp;

  p.push();
  p.stroke(255, 255, 255, 24);
  p.strokeWeight(1);
  p.drawingContext.setLineDash([5, 7]);
  p.line(px, py, tx, cosY);
  p.line(px, py, tx, sinY);
  p.drawingContext.setLineDash([]);
  p.pop();
}

function drawEulerIdentity(p: p5, x: number, y: number): void {
  p.push();
  p.noStroke();
  p.fill(...GOLD);
  p.textSize(18);
  p.textStyle(p.BOLD);
  p.textAlign(p.CENTER);
  p.text('eⁱπ + 1 = 0', x, y);
  p.textAlign(p.LEFT);
  p.pop();
}

function drawEulerScene(p: p5, snap: ComplexEulerSnap, plot: PlotRect): void {
  drawEulerWavePanel(p, plot, snap.theta);

  const center = getCircleCenter(plot);
  const r = circleRadius(plot, UNIT_CIRCLE_R);
  const c = Math.cos(snap.theta);
  const s = Math.sin(snap.theta);
  const px = center.x + c * r;
  const py = center.y - s * r;

  drawUnitCircle(p, center.x, center.y, r);
  drawProjectionToWaves(p, plot, snap.theta, px, py);
  drawVectorFrom(p, center.x, center.y, px, py, GOLD, 'eⁱᶿ');
  drawDot(p, px, py, GOLD);
  drawAngleAt(p, center.x, center.y, snap.theta, 44, 'θ');

  if (Math.abs(snap.theta - Math.PI) < 0.035) {
    drawEulerIdentity(p, center.x, center.y + r + 42);
  }

  drawVisualHint(
    p,
    plot,
    'eⁱᶿ = cosθ + isinθ；水平投影是 cosθ，垂直投影是 sinθ',
  );
}

function drawDeMoivreSteps(
  p: p5,
  cx: number,
  cy: number,
  r: number,
  angle: number,
  n: number,
): void {
  p.push();
  p.noFill();
  p.stroke(GOLD[0], GOLD[1], GOLD[2], 80);
  p.strokeWeight(1);

  for (let k = 1; k <= n; k++) {
    const a = normalizeAngle(k * angle);
    const px = cx + Math.cos(a) * r;
    const py = cy - Math.sin(a) * r;

    p.fill(GOLD[0], GOLD[1], GOLD[2], k === n ? 230 : 95);
    p.noStroke();
    p.circle(px, py, k === n ? 7 : 4);

    if (k < n) {
      p.fill(130);
      p.textSize(10);
      p.text(String(k), px + 7, py - 5);
    }
  }

  p.pop();
}

function drawDeMoivreScene(p: p5, snap: ComplexEulerSnap, plot: PlotRect): void {
  const center = getCircleCenter(plot);
  const r = circleRadius(plot, DEMOIVRE_R);

  const base = {
    re: Math.cos(snap.deTheta),
    im: Math.sin(snap.deTheta),
  };

  const outAngle = normalizeAngle(snap.n * snap.deTheta);
  const result = {
    re: Math.cos(outAngle),
    im: Math.sin(outAngle),
  };

  drawUnitCircle(p, center.x, center.y, r);
  drawDeMoivreSteps(p, center.x, center.y, r, snap.deTheta, snap.n);

  const basePx = center.x + base.re * r;
  const basePy = center.y - base.im * r;
  const outPx = center.x + result.re * r;
  const outPy = center.y - result.im * r;

  drawVectorFrom(p, center.x, center.y, basePx, basePy, GREEN, 'θ');
  drawVectorFrom(p, center.x, center.y, outPx, outPy, GOLD, 'nθ');
  drawDot(p, basePx, basePy, GREEN);
  drawDot(p, outPx, outPy, GOLD);

  drawAngleAt(p, center.x, center.y, snap.deTheta, 48, 'θ');
  drawAngleAt(p, center.x, center.y, outAngle, 78, 'nθ');

  drawVisualHint(p, plot, '(cosθ + isinθ)ⁿ = cos(nθ) + isin(nθ)');
}

export function renderComplexEulerFormulaScene(
  p: p5,
  snap: ComplexEulerSnap,
): void {
  p.background(10, 10, 10);

  const plot = computePlotRect(snap.width, snap.height);
  drawVisualTitle(p, plot);

  if (snap.mode === 'operation') {
    drawOperationScene(p, snap, plot);
  } else if (snap.mode === 'euler') {
    drawEulerScene(p, snap, plot);
  } else {
    drawDeMoivreScene(p, snap, plot);
  }
}

export type ComplexEulerSidebarState = {
  statsLines: string[];
  hintLine: string;
};

export function buildComplexEulerSidebarState(
  params: ComplexEulerParams,
): ComplexEulerSidebarState {
  if (params.mode === 'operation') {
    const result = computeOperation(params.z1, params.z2, params.opKey);
    const r1 = magC(params.z1);
    const r2 = magC(params.z2);
    const resultR = magC(result);
    const polar = (z: Complex) => `${formatNum(magC(z))}∠${formatAngle(argC(z))}`;

    const lines = [
      `z₁：${polar(params.z1)}`,
      `z₂：${polar(params.z2)}`,
      `結果：${polar(result)}`,
    ];

    if (params.opKey === 'mul') {
      lines.push(`極式：|z|=${formatNum(r1 * r2)}，arg=θ₁+θ₂`);
    } else if (params.opKey === 'div') {
      lines.push(
        `極式：|z|=${formatNum(r1 / Math.max(r2, 0.0001))}，arg=θ₁−θ₂`,
      );
    } else {
      lines.push(`直角式：${formatComplex(result)}，|z|=${formatNum(resultR)}`);
    }

    return {
      statsLines: lines,
      hintLine: '乘法的本質是旋轉與縮放',
    };
  }

  if (params.mode === 'euler') {
    const c = Math.cos(params.theta);
    const s = Math.sin(params.theta);

    return {
      statsLines: [
        `eⁱᶿ：${formatComplex({ re: c, im: s })}`,
        `cosθ：${formatNum(c)}`,
        `sinθ：${formatNum(s)}`,
        '|eⁱᶿ|：1',
      ],
      hintLine:
        Math.abs(params.theta - Math.PI) < 0.035
          ? 'eⁱπ + 1 = 0'
          : 'eⁱᶿ 在單位圓上旋轉',
    };
  }

  const outAngle = normalizeAngle(params.n * params.deTheta);
  const z = { re: Math.cos(outAngle), im: Math.sin(outAngle) };

  return {
    statsLines: [
      '公式：(cosθ+isinθ)ⁿ',
      `nθ：${formatAngle(outAngle)}`,
      `結果：${formatComplex(z)}`,
      '|z|：1',
    ],
    hintLine: 'n 次方對應 n 倍角',
  };
}
