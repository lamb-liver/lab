import type p5 from 'p5';
import {
  CUBIC_SYMMETRY_CENTER,
  cubicValue,
  DIVISOR_ROOT,
  quotientValue,
  symmetrySample,
} from '../../exam/gsat-114-cubic-symmetry-center/geometry';
import { clipRect, withDash, type PlotRectLike } from './p5PlotHelpers';

type Plot = PlotRectLike & {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
};

type CubicSymmetryCenterExamSnap = {
  width: number;
  height: number;
  distance: number;
};

const GOLD = [212, 184, 122] as const;
const BLUE = [93, 173, 226] as const;
const WHITE = [232, 232, 232] as const;

function sx(x: number, plot: Plot): number {
  return plot.x + ((x - plot.xMin) / (plot.xMax - plot.xMin)) * plot.w;
}

function sy(y: number, plot: Plot): number {
  return plot.y + plot.h - ((y - plot.yMin) / (plot.yMax - plot.yMin)) * plot.h;
}

function drawFrame(p: p5, plot: Plot, title: string): void {
  p.noFill();
  p.stroke(...WHITE, 20);
  p.strokeWeight(1);
  p.rect(plot.x, plot.y, plot.w, plot.h, 8);

  p.stroke(...WHITE, 10);
  for (let i = 1; i < 4; i += 1) {
    const x = plot.x + (plot.w * i) / 4;
    const y = plot.y + (plot.h * i) / 4;
    p.line(x, plot.y, x, plot.y + plot.h);
    p.line(plot.x, y, plot.x + plot.w, y);
  }

  const zeroY = sy(0, plot);
  if (zeroY >= plot.y && zeroY <= plot.y + plot.h) {
    p.stroke(...WHITE, 38);
    p.line(plot.x, zeroY, plot.x + plot.w, zeroY);
  }

  withDash(p, [5, 6], () => {
    p.stroke(...WHITE, 55);
    p.line(sx(DIVISOR_ROOT, plot), plot.y, sx(DIVISOR_ROOT, plot), plot.y + plot.h);
  });

  p.noStroke();
  p.fill(...WHITE, 205);
  p.textSize(12);
  p.textStyle(p.BOLD);
  p.text(title, plot.x + 10, plot.y + 18);
  p.textStyle(p.NORMAL);

  p.fill(...WHITE, 110);
  p.textSize(10.5);
  p.textAlign(p.CENTER, p.TOP);
  for (const x of [-10, -6, -2]) {
    p.text(String(x), sx(x, plot), plot.y + plot.h + 7);
  }
  p.textAlign(p.LEFT, p.BASELINE);
}

function drawCurve(
  p: p5,
  plot: Plot,
  valueAt: (x: number) => number,
  color: readonly [number, number, number],
  weight: number,
  alpha: number,
): void {
  clipRect(p, plot, () => {
    p.noFill();
    p.stroke(color[0], color[1], color[2], alpha);
    p.strokeWeight(weight);
    p.beginShape();
    for (let i = 0; i <= 240; i += 1) {
      const x = plot.xMin + ((plot.xMax - plot.xMin) * i) / 240;
      p.vertex(sx(x, plot), sy(valueAt(x), plot));
    }
    p.endShape();
  });
}

function drawPoint(
  p: p5,
  plot: Plot,
  x: number,
  y: number,
  color: readonly [number, number, number],
  label?: string,
): void {
  const px = sx(x, plot);
  const py = sy(y, plot);
  p.noStroke();
  p.fill(color[0], color[1], color[2], 35);
  p.circle(px, py, 22);
  p.fill(color[0], color[1], color[2], 245);
  p.circle(px, py, 8);

  if (label) {
    p.textSize(10.5);
    p.text(label, Math.min(plot.x + plot.w - 24, px + 8), Math.max(plot.y + 16, py - 8));
  }
}

function plotsFor(width: number, height: number): [Plot, Plot] {
  const marginX = width < 620 ? 28 : 34;
  const top = 34;
  const bottom = 30;
  const gap = width < 620 ? 42 : 30;

  if (width < 620) {
    const h = (height - top - bottom - gap) / 2;
    return [
      { x: marginX, y: top, w: width - marginX * 2, h, xMin: -10.5, xMax: -1.5, yMin: 0, yMax: 9.5 },
      { x: marginX, y: top + h + gap, w: width - marginX * 2, h, xMin: -10.5, xMax: -1.5, yMin: -18, yMax: 24 },
    ];
  }

  const w = (width - marginX * 2 - gap) / 2;
  const h = height - top - bottom;
  return [
    { x: marginX, y: top, w, h, xMin: -10.5, xMax: -1.5, yMin: 0, yMax: 9.5 },
    { x: marginX + w + gap, y: top, w, h, xMin: -10.5, xMax: -1.5, yMin: -18, yMax: 24 },
  ];
}

export function renderCubicSymmetryCenterExamScene(
  p: p5,
  snap: CubicSymmetryCenterExamSnap,
): void {
  p.background(10, 10, 10);
  p.textFont("system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif");

  const [quotientPlot, cubicPlot] = plotsFor(snap.width, snap.height);
  const sample = symmetrySample(snap.distance);

  drawFrame(p, quotientPlot, '商式 q(x)：左右等高');
  drawCurve(p, quotientPlot, quotientValue, WHITE, 1.8, 135);
  p.stroke(...GOLD, 110);
  p.strokeWeight(1.2);
  p.line(
    sx(sample.left.x, quotientPlot),
    sy(sample.quotientY, quotientPlot),
    sx(sample.right.x, quotientPlot),
    sy(sample.quotientY, quotientPlot),
  );
  drawPoint(p, quotientPlot, sample.left.x, sample.quotientY, GOLD);
  drawPoint(p, quotientPlot, sample.right.x, sample.quotientY, GOLD);
  drawPoint(p, quotientPlot, DIVISOR_ROOT, 8, BLUE, '(-6, 8)');

  drawFrame(p, cubicPlot, '原式 f(x)：兩點中點固定');
  drawCurve(p, cubicPlot, cubicValue, GOLD, 7, 18);
  drawCurve(p, cubicPlot, cubicValue, GOLD, 2.4, 235);
  withDash(p, [5, 6], () => {
    p.stroke(...WHITE, 85);
    p.strokeWeight(1.2);
    p.line(
      sx(sample.left.x, cubicPlot),
      sy(sample.left.y, cubicPlot),
      sx(sample.right.x, cubicPlot),
      sy(sample.right.y, cubicPlot),
    );
  });
  drawPoint(p, cubicPlot, sample.left.x, sample.left.y, GOLD, 'P');
  drawPoint(p, cubicPlot, sample.right.x, sample.right.y, GOLD, 'Q');
  drawPoint(
    p,
    cubicPlot,
    CUBIC_SYMMETRY_CENTER.x,
    CUBIC_SYMMETRY_CENTER.y,
    BLUE,
    'M',
  );
}
