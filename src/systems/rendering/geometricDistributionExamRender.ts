import type p5 from 'p5';
import { canvas2d } from './canvas2d';
import {
  geometricProbability,
  summarizeGeometricSamples,
} from '../../exam/ast-113-geometric-distribution/geometry';

type GeometricDistributionExamSnap = {
  width: number;
  height: number;
  samples: readonly number[];
  count: number;
  p: number;
};

type Rect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

const ACCENT = [212, 184, 122] as const;
const WHITE = [235, 235, 235] as const;
const MAX_TRIAL = 24;

export function renderGeometricDistributionExamScene(
  p: p5,
  snap: GeometricDistributionExamSnap,
): void {
  p.background(10, 10, 10);
  p.textFont("system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif");

  const histogram: Rect = {
    x: 46,
    y: 42,
    w: Math.max(220, snap.width - 76),
    h: Math.max(145, snap.height * 0.47),
  };
  const convergence: Rect = {
    x: histogram.x,
    y: histogram.y + histogram.h + 62,
    w: histogram.w,
    h: Math.max(72, snap.height - histogram.y - histogram.h - 92),
  };
  const summary = summarizeGeometricSamples(snap.samples, snap.count, MAX_TRIAL);

  drawHistogram(p, histogram, summary.bins, summary.count, snap.p);
  drawConvergence(p, convergence, snap.samples, summary.count, 1 / snap.p);

  p.noStroke();
  p.fill(...ACCENT, 205);
  p.textSize(12);
  p.textAlign(p.LEFT, p.TOP);
  p.text(
    `模擬次數=${summary.count.toLocaleString()}　樣本平均=${summary.mean.toFixed(2)}`,
    histogram.x,
    16,
  );
}

function drawHistogram(
  p: p5,
  rect: Rect,
  bins: readonly number[],
  count: number,
  successProbability: number,
): void {
  const slot = rect.w / bins.length;
  const maxProbability = Math.max(0.12, successProbability * 1.2);

  p.noFill();
  p.stroke(...WHITE, 22);
  p.strokeWeight(1);
  p.rect(rect.x, rect.y, rect.w, rect.h);

  p.stroke(...WHITE, 13);
  for (let i = 1; i <= 3; i += 1) {
    const y = rect.y + (rect.h * i) / 4;
    p.line(rect.x, y, rect.x + rect.w, y);
  }

  for (let i = 0; i < bins.length; i += 1) {
    const observed = count === 0 ? 0 : bins[i] / count;
    const theoretical =
      i === bins.length - 1
        ? (1 - successProbability) ** (MAX_TRIAL - 1)
        : geometricProbability(i + 1, successProbability);
    const barHeight = (observed / maxProbability) * rect.h;
    const x = rect.x + slot * i + slot * 0.18;

    p.noStroke();
    p.fill(...ACCENT, i === bins.length - 1 ? 62 : 105);
    p.rect(x, rect.y + rect.h - barHeight, slot * 0.64, barHeight);

    p.noFill();
    p.stroke(...ACCENT, 220);
    p.strokeWeight(1.5);
    const markerY = rect.y + rect.h - (theoretical / maxProbability) * rect.h;
    p.line(x, markerY, x + slot * 0.64, markerY);
  }

  const tailX = rect.x + slot * (bins.length - 1);
  const ctx = canvas2d(p);
  ctx.save();
  ctx.setLineDash([3, 5]);
  p.stroke(...WHITE, 55);
  p.line(tailX, rect.y, tailX, rect.y + rect.h);
  ctx.restore();

  p.noStroke();
  p.fill(...WHITE, 100);
  p.textSize(11);
  p.textAlign(p.CENTER, p.TOP);
  for (const trial of [1, 5, 10, 15, 20, 24]) {
    const x = rect.x + slot * (trial - 0.5);
    p.text(trial === 24 ? '≥24' : String(trial), x, rect.y + rect.h + 8);
  }
  p.textAlign(p.LEFT, p.BOTTOM);
  p.text('第一次中獎所需次數 X（最右格為合計）', rect.x, rect.y - 7);
}

function drawConvergence(
  p: p5,
  rect: Rect,
  samples: readonly number[],
  count: number,
  expected: number,
): void {
  p.noFill();
  p.stroke(...WHITE, 22);
  p.strokeWeight(1);
  p.rect(rect.x, rect.y, rect.w, rect.h);

  const yFor = (value: number) => {
    const clamped = Math.min(16, Math.max(4, value));
    return rect.y + rect.h - ((clamped - 4) / 12) * rect.h;
  };
  const ctx = canvas2d(p);
  ctx.save();
  ctx.setLineDash([5, 7]);
  p.stroke(...WHITE, 72);
  p.line(rect.x, yFor(expected), rect.x + rect.w, yFor(expected));
  ctx.restore();

  if (count > 0) {
    const step = Math.max(1, Math.floor(count / 180));
    let total = 0;
    p.noFill();
    p.stroke(...ACCENT, 220);
    p.strokeWeight(1.8);
    p.beginShape();
    for (let i = 0; i < count; i += 1) {
      total += samples[i];
      if (i % step !== 0 && i !== count - 1) continue;
      p.vertex(rect.x + ((i + 1) / count) * rect.w, yFor(total / (i + 1)));
    }
    p.endShape();
  }

  p.noStroke();
  p.fill(...WHITE, 100);
  p.textSize(11);
  p.textAlign(p.LEFT, p.BOTTOM);
  p.text('樣本平均 → E(X)=10', rect.x, rect.y - 7);
}
