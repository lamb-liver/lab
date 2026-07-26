import type p5 from 'p5';
import {
  FIXED_POINT,
  ORIGINAL_VERTEX,
  parabolaValue,
  translatedVertex,
} from '../../exam/gsat-115-parabola-restricted-translation/geometry';
import { clipRect, withDash, type PlotRectLike } from './p5PlotHelpers';

type Plot = PlotRectLike & {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
};

type ParabolaRestrictedTranslationExamSnap = {
  width: number;
  height: number;
  selectedH: number | null;
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

function drawCurve(
  p: p5,
  plot: Plot,
  h: number,
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
      p.vertex(sx(x, plot), sy(parabolaValue(x, h), plot));
    }
    p.endShape();
  });
}

function drawPoint(
  p: p5,
  plot: Plot,
  point: { x: number; y: number },
  color: readonly [number, number, number],
  label: string,
): void {
  const x = sx(point.x, plot);
  const y = sy(point.y, plot);
  p.noStroke();
  p.fill(color[0], color[1], color[2], 38);
  p.circle(x, y, 22);
  p.fill(color[0], color[1], color[2], 245);
  p.circle(x, y, 8);
  p.textSize(11);
  p.text(label, x + 9, y - 9);
}

export function renderParabolaRestrictedTranslationExamScene(
  p: p5,
  snap: ParabolaRestrictedTranslationExamSnap,
): void {
  p.background(10, 10, 10);
  p.textFont("system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif");

  const plot: Plot = {
    x: 42,
    y: 28,
    w: snap.width - 76,
    h: snap.height - 66,
    xMin: -1.25,
    xMax: 2.25,
    yMin: -2,
    yMax: 5.5,
  };

  p.noFill();
  p.stroke(...WHITE, 18);
  p.rect(plot.x, plot.y, plot.w, plot.h, 8);

  p.stroke(...WHITE, 12);
  for (let i = 1; i < 5; i += 1) {
    const x = plot.x + (plot.w * i) / 5;
    const y = plot.y + (plot.h * i) / 5;
    p.line(x, plot.y, x, plot.y + plot.h);
    p.line(plot.x, y, plot.x + plot.w, y);
  }

  p.stroke(...WHITE, 42);
  p.line(plot.x, sy(0, plot), plot.x + plot.w, sy(0, plot));
  p.line(sx(0, plot), plot.y, sx(0, plot), plot.y + plot.h);

  withDash(p, [6, 7], () => {
    p.stroke(...WHITE, 80);
    p.strokeWeight(1.2);
    p.line(sx(plot.xMin, plot), sy(1 + 2 * plot.xMin, plot), sx(plot.xMax, plot), sy(1 + 2 * plot.xMax, plot));
  });

  drawCurve(p, plot, 0, GOLD, 7, 18);
  drawCurve(p, plot, 0, GOLD, 2.5, 235);

  if (snap.selectedH !== null && snap.selectedH !== 0) {
    drawCurve(p, plot, snap.selectedH, BLUE, 7, 16);
    drawCurve(p, plot, snap.selectedH, BLUE, 2.5, 235);
  }

  const q = snap.selectedH === null ? null : translatedVertex(snap.selectedH);
  if (q && snap.selectedH !== 0) {
    p.stroke(...WHITE, 75);
    p.strokeWeight(1.4);
    p.line(sx(ORIGINAL_VERTEX.x, plot), sy(ORIGINAL_VERTEX.y, plot), sx(q.x, plot), sy(q.y, plot));
  }

  drawPoint(p, plot, ORIGINAL_VERTEX, GOLD, q && snap.selectedH === 0 ? 'P=Q' : 'P');
  if (q && snap.selectedH !== 0) drawPoint(p, plot, q, BLUE, 'Q');
  drawPoint(p, plot, FIXED_POINT, WHITE, 'B');

  p.noStroke();
  p.fill(...WHITE, 120);
  p.textSize(10.5);
  p.text('ℓ: y=1+2x', sx(1.45, plot), sy(4.85, plot));
  p.textAlign(p.CENTER, p.TOP);
  for (const [x, label] of [
    [-0.5, '−1/2'],
    [0, '0'],
    [0.5, '1/2'],
    [1.5, '3/2'],
  ] as const) {
    p.text(label, sx(x, plot), sy(0, plot) + 7);
  }
  p.textAlign(p.LEFT, p.BASELINE);
}
