import type p5 from 'p5';
import {
  exteriorPoint,
  format3,
  horizontalSecant,
  mapX,
  mapY,
  plotFrame,
  slantedSecant,
  upperTangent,
  type PlotRect,
  type Point,
  type SegmentPair,
} from '../../curve/circlePower';

const GOLD = [212, 184, 122] as const;
const WHITE = [255, 255, 255] as const;

export type CirclePowerKind = 'two-secants' | 'tangent-secant' | 'explore-secants' | 'explore-tangent';

export type CirclePowerFigure = {
  kind: CirclePowerKind;
  p: number;
  thetaDeg: number;
};

function screen(plot: PlotRect, point: Point): Point {
  return { x: mapX(plot, point.x), y: mapY(plot, point.y) };
}

function drawCircle(p: p5, plot: PlotRect): void {
  const span = 2.7 - -1.4;
  const scale = plot.width / span;
  p.noFill();
  p.stroke(...WHITE, 48);
  p.strokeWeight(1);
  p.circle(mapX(plot, 0), mapY(plot, 0), scale * 2);
}

function drawSegment(p: p5, plot: PlotRect, from: Point, to: Point): void {
  const a = screen(plot, from);
  const b = screen(plot, to);
  p.stroke(...GOLD, 230);
  p.strokeWeight(1.5);
  p.line(a.x, a.y, b.x, b.y);
}

function extend(from: Point, through: Point, extra: number): Point {
  const dx = through.x - from.x;
  const dy = through.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  return { x: through.x + (dx / len) * extra, y: through.y + (dy / len) * extra };
}

function drawDot(p: p5, plot: PlotRect, point: Point, gold: boolean, diameter: number): void {
  const at = screen(plot, point);
  p.noStroke();
  if (gold) p.fill(...GOLD, 230);
  else p.fill(...WHITE, 220);
  p.circle(at.x, at.y, diameter);
}

function drawLabel(p: p5, plot: PlotRect, point: Point, text: string): void {
  const at = screen(plot, point);
  p.noStroke();
  p.fill(...WHITE, 210);
  p.textSize(Math.max(11, Math.min(14, plot.width / 34)));
  p.textAlign(p.CENTER, p.CENTER);
  p.text(text, at.x, at.y);
}

/** 水平交點的字母留在點上方。斜線交點往左上挪，最近的角度才不會壓到 A、B。 */
function letterAt(point: Point): Point {
  if (Math.abs(point.y) < 0.05) return { x: point.x, y: point.y + 0.16 };
  return { x: point.x - 0.2, y: point.y + 0.2 };
}

/** 近段標在 P 與近交點之間；遠段標在兩交點之間，數字是整段距離。 */
function lengthAnchors(origin: Point, pair: SegmentPair): { near: Point; far: Point } {
  const nearMid = {
    x: (origin.x + pair.nearPoint.x) / 2,
    y: (origin.y + pair.nearPoint.y) / 2,
  };
  const farMid = {
    x: (pair.nearPoint.x + pair.farPoint.x) / 2,
    y: (pair.nearPoint.y + pair.farPoint.y) / 2,
  };
  const dx = pair.farPoint.x - origin.x;
  const dy = pair.farPoint.y - origin.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  // 水平近段留在線下。斜線近段改到線上，兩個短數字才不會疊在 P 旁邊。
  const liftNear = pair.nearPoint.y > 0.04 && ny < 0;
  const nearSign = liftNear ? -1 : 1;
  return {
    near: {
      x: nearMid.x + nearSign * nx * 0.22,
      y: nearMid.y + nearSign * ny * 0.22,
    },
    far: { x: farMid.x - nx * 0.24, y: farMid.y - ny * 0.24 },
  };
}

function drawSecant(
  p: p5,
  plot: PlotRect,
  origin: Point,
  pair: SegmentPair,
  nearName: string,
  farName: string,
): void {
  drawSegment(p, plot, origin, extend(origin, pair.farPoint, 0.18));
  drawDot(p, plot, pair.nearPoint, false, 5);
  drawDot(p, plot, pair.farPoint, false, 5);
  drawLabel(p, plot, letterAt(pair.nearPoint), nearName);
  drawLabel(p, plot, letterAt(pair.farPoint), farName);
  const anchors = lengthAnchors(origin, pair);
  drawLabel(p, plot, anchors.near, format3(pair.near));
  drawLabel(p, plot, anchors.far, format3(pair.far));
}

function drawTangent(p: p5, plot: PlotRect, origin: Point): void {
  const tangent = upperTangent(origin.x);
  drawSegment(p, plot, origin, extend(origin, tangent.point, 0.22));
  drawDot(p, plot, tangent.point, true, 6);
  drawLabel(p, plot, { x: tangent.point.x, y: tangent.point.y + 0.16 }, 'T');
  const mid = {
    x: (origin.x + tangent.point.x) / 2,
    y: (origin.y + tangent.point.y) / 2 + 0.16,
  };
  drawLabel(p, plot, mid, format3(tangent.length));
}

export function renderCirclePower(p: p5, figure: CirclePowerFigure): void {
  const plot = plotFrame(p.width, p.height);
  const origin = exteriorPoint(figure.p);
  const horizontal = horizontalSecant(figure.p);
  const slanted = slantedSecant(figure.p, figure.thetaDeg);
  p.background(10, 10, 10);
  drawCircle(p, plot);

  if (figure.kind === 'two-secants' || figure.kind === 'explore-secants') {
    drawSecant(p, plot, origin, horizontal, 'A', 'B');
    drawSecant(p, plot, origin, slanted, 'C', 'D');
  } else if (figure.kind === 'tangent-secant') {
    drawSecant(p, plot, origin, slanted, 'A', 'B');
    drawTangent(p, plot, origin);
  } else {
    drawSecant(p, plot, origin, horizontal, 'A', 'B');
    drawTangent(p, plot, origin);
  }

  drawDot(p, plot, origin, true, 7);
  drawLabel(p, plot, { x: origin.x + 0.16, y: origin.y - 0.16 }, 'P');
}
