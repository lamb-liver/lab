import type p5 from 'p5';
import {
  mapX,
  mapY,
  plotSquare,
  readDominant,
  type DominantParams,
  type PlotRect,
  type Vec,
} from '../../curve/modules/dominant-direction/geometry';

const GOLD = [212, 184, 122] as const;
const WHITE = [255, 255, 255] as const;

function drawThrough(p: p5, plot: PlotRect, dir: Vec, length: number): void {
  p.line(
    mapX(plot, -length * dir.x),
    mapY(plot, -length * dir.y),
    mapX(plot, length * dir.x),
    mapY(plot, length * dir.y),
  );
}

function drawArrow(p: p5, plot: PlotRect, tip: Vec): void {
  const x1 = mapX(plot, 0);
  const y1 = mapY(plot, 0);
  const x2 = mapX(plot, tip.x);
  const y2 = mapY(plot, tip.y);
  p.line(x1, y1, x2, y2);
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const head = 9;
  p.push();
  p.translate(x2, y2);
  p.rotate(angle);
  p.noStroke();
  p.triangle(0, 0, -head, head * 0.42, -head, -head * 0.42);
  p.pop();
}

export function renderDominantDirection(p: p5, params: DominantParams): void {
  const plot = plotSquare(p.width, p.height);
  const reading = readDominant(params);
  const radius = mapX(plot, 1) - mapX(plot, 0);

  p.background(10, 10, 10);

  p.noFill();
  p.stroke(...WHITE, 42);
  p.strokeWeight(1);
  p.circle(mapX(plot, 0), mapY(plot, 0), radius * 2);

  p.stroke(...WHITE, 70);
  p.strokeWeight(1.15);
  drawThrough(p, plot, reading.minor, 1.5);

  p.stroke(...GOLD, 210);
  p.strokeWeight(1.6);
  drawThrough(p, plot, reading.major, 1.5);

  p.noStroke();
  p.fill(...GOLD, 180);
  for (const mark of reading.trail.slice(0, -1)) {
    p.circle(mapX(plot, mark.x), mapY(plot, mark.y), 7);
  }

  p.stroke(...GOLD, 200);
  p.fill(...GOLD, 200);
  p.strokeWeight(1.35);
  drawArrow(p, plot, reading.stretched);

  p.stroke(...WHITE, 230);
  p.fill(...WHITE, 230);
  p.strokeWeight(2);
  drawArrow(p, plot, reading.u);

  p.noStroke();
  p.fill(...GOLD, 230);
  p.circle(mapX(plot, reading.stretched.x), mapY(plot, reading.stretched.y), 8);

  p.noStroke();
  p.textSize(13);
  p.textAlign(p.CENTER, p.CENTER);
  // 字放在直線末端外面。箭頭最長 1.4，不會蓋到標籤。
  p.fill(...GOLD, 210);
  p.text('λ1', mapX(plot, 1.74 * reading.major.x), mapY(plot, 1.74 * reading.major.y));
  p.fill(...WHITE, 170);
  p.text('λ2', mapX(plot, 1.74 * reading.minor.x), mapY(plot, 1.74 * reading.minor.y));
}
