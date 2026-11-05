import type p5 from 'p5';
import {
  ARROW_A_Y,
  ARROW_B_Y,
  BAR,
  arrowReach,
  mapX,
  mapY,
  plotRect,
  readShare,
  type ShareParams,
} from '../../curve/modules/stationary-share/geometry';

const GOLD = [212, 184, 122] as const;
const WHITE = [255, 255, 255] as const;

function drawArrow(
  p: p5,
  x0: number,
  y: number,
  x1: number,
  color: readonly [number, number, number],
  label: string,
): void {
  const dir = x1 >= x0 ? 1 : -1;
  const head = 9;
  p.stroke(...color, 210);
  p.strokeWeight(2.2);
  p.line(x0, y, x1 - dir * head, y);
  p.noStroke();
  p.fill(...color, 230);
  p.triangle(x1, y, x1 - dir * head, y - 5, x1 - dir * head, y + 5);
  p.textSize(13);
  p.textAlign(dir > 0 ? p.RIGHT : p.LEFT, p.CENTER);
  p.text(label, x0 - dir * 10, y);
}

export function renderStationaryShare(p: p5, params: ShareParams): void {
  const plot = plotRect(p.width, p.height);
  const reading = readShare(params);
  const left = mapX(plot, BAR.x0);
  const right = mapX(plot, BAR.x1);
  const midY = mapY(plot, BAR.y);
  const split = left + (right - left) * reading.shareA;
  const thick = 36;

  p.background(10, 10, 10);

  p.noStroke();
  p.fill(...GOLD, 200);
  p.rect(left, midY - thick / 2, Math.max(1, split - left), thick);
  p.fill(...WHITE, 36);
  p.rect(split, midY - thick / 2, Math.max(1, right - split), thick);

  p.noFill();
  p.stroke(...WHITE, 150);
  p.strokeWeight(1.3);
  p.rect(left, midY - thick / 2, right - left, thick);

  p.noStroke();
  p.fill(...GOLD, 240);
  p.circle(split, midY, 9);

  p.textSize(14);
  p.textAlign(p.LEFT, p.BOTTOM);
  p.fill(...GOLD, 230);
  p.text('A', left, midY - thick / 2 - 6);
  p.textAlign(p.RIGHT, p.BOTTOM);
  p.fill(...WHITE, 220);
  p.text('B', right, midY - thick / 2 - 6);

  const span = right - left;
  drawArrow(p, left, mapY(plot, ARROW_A_Y), left + arrowReach(reading.a, span), GOLD, 'a');
  drawArrow(p, right, mapY(plot, ARROW_B_Y), right - arrowReach(reading.b, span), WHITE, 'b');
}
