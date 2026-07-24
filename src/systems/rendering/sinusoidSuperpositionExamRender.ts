import type p5 from 'p5';
import { canvas2d } from './canvas2d';
import {
  shiftedSineValue,
  sinusoidValue,
  symmetryAxes,
  type SinusoidCoefficients,
} from '../../exam/gsat-112-sinusoid-superposition/geometry';

type SinusoidSuperpositionExamSnap = SinusoidCoefficients & {
  width: number;
  height: number;
  progress: number;
};

type Plot = {
  x: number;
  y: number;
  w: number;
  h: number;
  ySpan: number;
};

const ACCENT = [212, 184, 122] as const;
const WHITE = [235, 235, 235] as const;
const TAU = Math.PI * 2;

function px(x: number, plot: Plot): number {
  return plot.x + (x / TAU) * plot.w;
}

function py(y: number, plot: Plot): number {
  return plot.y + plot.h / 2 - (y / plot.ySpan) * (plot.h / 2);
}

function drawCurve(
  p: p5,
  plot: Plot,
  valueAt: (x: number) => number,
  color: readonly [number, number, number],
  alpha: number,
  weight: number,
): void {
  p.noFill();
  p.stroke(color[0], color[1], color[2], alpha);
  p.strokeWeight(weight);
  p.beginShape();
  for (let i = 0; i <= 240; i += 1) {
    const x = (TAU * i) / 240;
    p.vertex(px(x, plot), py(valueAt(x), plot));
  }
  p.endShape();
}

export function renderSinusoidSuperpositionExamScene(
  p: p5,
  snap: SinusoidSuperpositionExamSnap,
): void {
  p.background(10, 10, 10);
  p.textFont("system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif");

  const plot: Plot = {
    x: 44,
    y: 48,
    w: Math.max(220, snap.width - 72),
    h: Math.max(180, snap.height - 88),
    ySpan: Math.max(2.2, Math.abs(snap.a) + Math.abs(snap.b) + 0.35),
  };

  const legend = [
    { label: 'a sin x', color: WHITE, alpha: 62 },
    { label: 'b cos x', color: WHITE, alpha: 92 },
    { label: '合成波', color: ACCENT, alpha: 230 },
  ] as const;
  p.textSize(12);
  p.textAlign(p.LEFT, p.CENTER);
  legend.forEach((item, index) => {
    const x = plot.x + index * Math.min(112, plot.w / 3);
    p.stroke(item.color[0], item.color[1], item.color[2], item.alpha);
    p.strokeWeight(item.label === '合成波' ? 2.4 : 1.2);
    p.line(x, 24, x + 18, 24);
    p.noStroke();
    p.fill(item.color[0], item.color[1], item.color[2], Math.max(120, item.alpha));
    p.text(item.label, x + 24, 24);
  });

  p.noFill();
  p.stroke(...WHITE, 22);
  p.strokeWeight(1);
  p.rect(plot.x, plot.y, plot.w, plot.h);

  p.stroke(...WHITE, 16);
  for (let i = 0; i <= 4; i += 1) {
    const x = px((TAU * i) / 4, plot);
    p.line(x, plot.y, x, plot.y + plot.h);
  }
  for (let y = -Math.floor(plot.ySpan); y <= Math.floor(plot.ySpan); y += 1) {
    p.line(plot.x, py(y, plot), plot.x + plot.w, py(y, plot));
  }

  p.stroke(...WHITE, 44);
  p.line(plot.x, py(0, plot), plot.x + plot.w, py(0, plot));

  const coefficients = { a: snap.a, b: snap.b };
  const ctx = canvas2d(p);
  ctx.save();
  ctx.setLineDash([5, 7]);
  for (const axis of symmetryAxes(coefficients)) {
    const x = px(axis, plot);
    p.stroke(...ACCENT, 82);
    p.line(x, plot.y, x, plot.y + plot.h);
  }
  ctx.restore();

  drawCurve(p, plot, (x) => snap.a * Math.sin(x), WHITE, 62, 1.2);
  drawCurve(p, plot, (x) => snap.b * Math.cos(x), WHITE, 92, 1.2);
  if (snap.progress < 1) {
    drawCurve(p, plot, (x) => sinusoidValue(x, coefficients), ACCENT, 55, 1.5);
  }
  drawCurve(
    p,
    plot,
    (x) => shiftedSineValue(x, coefficients, snap.progress),
    ACCENT,
    230,
    2.4,
  );

  p.noStroke();
  p.fill(...WHITE, 105);
  p.textSize(12);
  p.textAlign(p.CENTER, p.TOP);
  for (const [x, label] of [
    [0, '0'],
    [Math.PI / 2, 'π/2'],
    [Math.PI, 'π'],
    [(3 * Math.PI) / 2, '3π/2'],
    [TAU, '2π'],
  ] as const) {
    p.text(label, px(x, plot), plot.y + plot.h + 8);
  }
}
