import type p5 from 'p5';
import { readBend } from '../../exam/gaokao-2024-i-log-symmetry-center/geometry';

const GOLD = [212, 184, 122] as const;
const WHITE = [232, 232, 232] as const;
const X0 = 0.06;
const X1 = 1.94;
const Y0 = -4.4;
const Y1 = 5.6;

type Scene = { width: number; height: number; n: number };
type Rect = { x: number; y: number; w: number; h: number };
type Point = { x: number; y: number };

function frame(width: number, height: number): Rect {
  const pad = 28;
  return { x: pad, y: pad, w: width - pad * 2, h: height - pad * 2 };
}

function fit(rect: Rect) {
  const scale = Math.min(rect.w / (X1 - X0), rect.h / (Y1 - Y0));
  const ox = rect.x + (rect.w - (X1 - X0) * scale) / 2;
  const oy = rect.y + (rect.h - (Y1 - Y0) * scale) / 2;
  return {
    point(x: number, y: number): Point {
      return { x: ox + (x - X0) * scale, y: oy + (Y1 - y) * scale };
    },
  };
}

export function renderLogSymmetryCenterExam(p: p5, scene: Scene): void {
  const reading = readBend(scene.n);
  const rect = frame(scene.width, scene.height);
  const map = fit(rect);
  p.background(10, 10, 10);
  p.textFont('system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans TC CJK", sans-serif');

  const originY = map.point(1, 0).y;
  const axisX = map.point(1, 0).x;
  p.stroke(...WHITE, 40);
  p.strokeWeight(1);
  p.line(map.point(X0, 0).x, originY, map.point(X1, 0).x, originY);
  p.line(axisX, map.point(1, Y0).y, axisX, map.point(1, Y1).y);

  const tangentA = map.point(0.62, reading.a + reading.slope * (0.62 - 1));
  const tangentB = map.point(1.38, reading.a + reading.slope * (1.38 - 1));
  p.stroke(...GOLD, 180);
  p.strokeWeight(1.6);
  p.line(tangentA.x, tangentA.y, tangentB.x, tangentB.y);

  p.noFill();
  p.stroke(...GOLD, 230);
  p.strokeWeight(2);
  let pen = false;
  for (let i = 0; i <= 240; i += 1) {
    const x = 0.12 + (1.76 * i) / 240;
    const y = Math.log(x / (2 - x)) + reading.a * x + reading.b * (x - 1) ** 3;
    if (y < Y0 + 0.15 || y > Y1 - 0.15) {
      if (pen) p.endShape();
      pen = false;
      continue;
    }
    const point = map.point(x, y);
    if (!pen) {
      p.beginShape();
      pen = true;
    }
    p.vertex(point.x, point.y);
  }
  if (pen) p.endShape();

  const left = map.point(reading.leftX, reading.leftY);
  const right = map.point(reading.rightX, reading.rightY);
  const center = map.point(1, reading.a);
  p.stroke(...WHITE, 210);
  p.strokeWeight(1.6);
  p.line(left.x, left.y, right.x, right.y);

  p.noStroke();
  p.fill(...WHITE);
  p.circle(left.x, left.y, 8);
  p.circle(right.x, right.y, 8);
  p.fill(...GOLD);
  p.circle(center.x, center.y, 11);

  p.noFill();
  p.stroke(...WHITE, 160);
  p.strokeWeight(1.4);
  p.circle(map.point(1, 0).x, map.point(1, 0).y, 8);

  p.noStroke();
  p.fill(...GOLD, 230);
  p.textSize(14);
  p.textAlign(p.LEFT, p.BOTTOM);
  p.text('C', center.x + 8, center.y - 6);
  p.fill(...WHITE, 210);
  p.textAlign(p.RIGHT, p.TOP);
  p.text('P', left.x - 6, left.y + 4);
  p.textAlign(p.LEFT, p.BOTTOM);
  p.text('Q', right.x + 6, right.y - 4);
}
