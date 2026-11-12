import type p5 from 'p5';
import { readSumDifference } from '../../exam/gaokao-2024-i-sum-difference-cosine/geometry';
import { withDash } from './p5PlotHelpers';

const GOLD = [212, 184, 122] as const;
const WHITE = [232, 232, 232] as const;

type Scene = {
  width: number;
  height: number;
  product: number;
};

type Point = { x: number; y: number };

function layout(width: number, height: number) {
  const margin = 36;
  const room = Math.min(width, height) - margin * 2;
  const r = Math.max(72, room * 0.4);
  return { cx: width / 2, cy: height / 2, r };
}

function polar(cx: number, cy: number, radius: number, angle: number): Point {
  return { x: cx + Math.cos(angle) * radius, y: cy - Math.sin(angle) * radius };
}

function drawLabel(p: p5, text: string, point: Point, color: readonly [number, number, number]) {
  p.noStroke();
  p.fill(...color, 230);
  p.textSize(15);
  p.textAlign(p.CENTER, p.CENTER);
  const half = Math.max(12, p.textWidth(text) / 2 + 4);
  const x = Math.min(p.width - half, Math.max(half, point.x));
  const y = Math.min(p.height - 12, Math.max(12, point.y));
  p.text(text, x, y);
}

export function renderSumDifferenceExam(p: p5, scene: Scene): void {
  const reading = readSumDifference(scene.product);
  const { cx, cy, r } = layout(scene.width, scene.height);
  const sum = reading.alpha + reading.beta;
  const diff = reading.alpha - reading.beta;
  const raysApart = Math.abs(reading.alpha - reading.beta) > 0.22;

  p.background(10, 10, 10);
  p.textFont('system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans TC CJK", sans-serif');

  p.stroke(...WHITE, 28);
  p.strokeWeight(1);
  p.line(cx - r - 16, cy, cx + r + 16, cy);
  p.line(cx, cy - r - 12, cx, cy + r + 12);

  p.noFill();
  p.stroke(...WHITE, 70);
  p.strokeWeight(1.4);
  p.circle(cx, cy, r * 2);

  const sumFoot = polar(cx, cy, r * reading.sumCos, 0);
  const diffFoot = polar(cx, cy, r * reading.diffCos, 0);
  const sumPoint = polar(cx, cy, r, sum);
  const diffPoint = polar(cx, cy, r, diff);

  withDash(p, [4, 5], () => {
    p.stroke(...WHITE, 90);
    p.strokeWeight(1.1);
    p.line(sumPoint.x, sumPoint.y, sumFoot.x, cy - 4);
    p.stroke(...GOLD, 90);
    p.line(diffPoint.x, diffPoint.y, diffFoot.x, cy + 4);
  });

  const thick = reading.atGiven ? 3.2 : 2.2;
  p.stroke(...WHITE, 210);
  p.strokeWeight(thick);
  p.line(cx, cy - 4, sumFoot.x, cy - 4);
  p.stroke(...GOLD, reading.atGiven ? 240 : 210);
  p.strokeWeight(thick);
  p.line(cx, cy + 4, diffFoot.x, cy + 4);

  const alphaTip = polar(cx, cy, r, reading.alpha);
  const betaTip = polar(cx, cy, r, reading.beta);
  p.stroke(...WHITE, 200);
  p.strokeWeight(1.8);
  p.line(cx, cy, alphaTip.x, alphaTip.y);
  p.stroke(...GOLD, 220);
  p.strokeWeight(1.8);
  p.line(cx, cy, betaTip.x, betaTip.y);

  p.noStroke();
  p.fill(...WHITE, 230);
  p.circle(cx, cy, 5);
  p.fill(...WHITE, 230);
  p.circle(sumPoint.x, sumPoint.y, 9);
  p.fill(...GOLD, 235);
  p.circle(diffPoint.x, diffPoint.y, 9);

  const diffApart = Math.abs(diff - reading.beta) > 0.22 && Math.abs(diff - reading.alpha) > 0.22;
  drawLabel(p, 'α', polar(cx, cy, r + 20, reading.alpha), WHITE);
  drawLabel(p, 'β', polar(cx, cy, raysApart ? r + 20 : r + 40, reading.beta), GOLD);
  drawLabel(p, 'α+β', polar(cx, cy, r + 22, sum), WHITE);
  drawLabel(p, 'α−β', polar(cx, cy, diffApart ? r + 22 : r + 44, diff), GOLD);
}
