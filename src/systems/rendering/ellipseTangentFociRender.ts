import type p5 from 'p5';
import {
  ellipsePoints,
  mapX,
  mapY,
  plotSquare,
  readEllipseTangent,
  type EllipseTangentParams,
  type PlotRect,
  type Vec,
} from '../../curve/modules/ellipse-tangent-foci/geometry';

const GOLD = [212, 184, 122] as const;
const WHITE = [255, 255, 255] as const;

function screenAngle(plot: PlotRect, from: Vec, toward: Vec): number {
  return Math.atan2(mapY(plot, toward.y) - mapY(plot, from.y), mapX(plot, toward.x) - mapX(plot, from.x));
}

function signedDelta(from: number, to: number): number {
  return Math.atan2(Math.sin(to - from), Math.cos(to - from));
}

/** 焦半徑方向轉到較近的那一側切線方向，弧長就是畫面上的夾角。 */
function acuteSweep(from: number, lineDir: number): number {
  const forward = signedDelta(from, lineDir);
  const back = signedDelta(from, lineDir + Math.PI);
  return Math.abs(forward) <= Math.abs(back) ? forward : back;
}

function drawEllipse(p: p5, plot: PlotRect, e: number): void {
  const points = ellipsePoints(e, 160);
  p.noFill();
  p.stroke(...GOLD, 220);
  p.strokeWeight(1.5);
  p.beginShape();
  for (const point of points) p.vertex(mapX(plot, point.x), mapY(plot, point.y));
  p.endShape();
}

function drawSegment(p: p5, plot: PlotRect, a: Vec, b: Vec): void {
  p.line(mapX(plot, a.x), mapY(plot, a.y), mapX(plot, b.x), mapY(plot, b.y));
}

function drawAngle(p: p5, plot: PlotRect, origin: Vec, toward: Vec, tangent: Vec): void {
  const dir = screenAngle(plot, origin, toward);
  const sweep = acuteSweep(dir, screenAngle(plot, origin, {
    x: origin.x + tangent.x,
    y: origin.y + tangent.y,
  }));
  const sx = mapX(plot, origin.x);
  const sy = mapY(plot, origin.y);
  const mark = 22;
  if (sweep >= 0) p.arc(sx, sy, mark * 2, mark * 2, dir, dir + sweep);
  else p.arc(sx, sy, mark * 2, mark * 2, dir + sweep, dir);
}

export function renderEllipseTangentFoci(p: p5, params: EllipseTangentParams): void {
  const plot = plotSquare(p.width, p.height);
  const reading = readEllipseTangent(params);
  const half = 1.15;
  const tangentA = {
    x: reading.p.x - half * reading.tangent.x,
    y: reading.p.y - half * reading.tangent.y,
  };
  const tangentB = {
    x: reading.p.x + half * reading.tangent.x,
    y: reading.p.y + half * reading.tangent.y,
  };

  p.background(10, 10, 10);

  p.stroke(...WHITE, 36);
  p.strokeWeight(1);
  drawSegment(p, plot, { x: -1, y: 0 }, { x: 1, y: 0 });

  drawEllipse(p, plot, params.e);

  p.stroke(...GOLD, 150);
  p.strokeWeight(1.25);
  drawSegment(p, plot, reading.f1, reading.p);
  drawSegment(p, plot, reading.f2, reading.p);

  p.stroke(...WHITE, 210);
  p.strokeWeight(1.25);
  drawSegment(p, plot, tangentA, tangentB);

  p.noFill();
  p.stroke(...WHITE, 170);
  p.strokeWeight(1);
  drawAngle(p, plot, reading.p, reading.f1, reading.tangent);
  drawAngle(p, plot, reading.p, reading.f2, reading.tangent);

  p.noStroke();
  p.fill(...GOLD, 230);
  p.circle(mapX(plot, reading.f1.x), mapY(plot, reading.f1.y), 6);
  p.circle(mapX(plot, reading.f2.x), mapY(plot, reading.f2.y), 6);
  p.fill(...WHITE, 230);
  p.circle(mapX(plot, reading.p.x), mapY(plot, reading.p.y), 6);

  p.noStroke();
  p.fill(...WHITE, 180);
  p.textSize(13);
  // t 只走上半部，焦點字放在長軸下方才不會蓋住切點。
  p.textAlign(p.CENTER, p.TOP);
  p.text('F₁', mapX(plot, reading.f1.x), mapY(plot, -0.1));
  p.text('F₂', mapX(plot, reading.f2.x), mapY(plot, -0.1));
  p.textAlign(p.LEFT, p.CENTER);
  p.text('P', mapX(plot, reading.p.x) + 8, mapY(plot, reading.p.y) - 8);
}
