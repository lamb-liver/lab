import type p5 from 'p5';
import { SIDE_V, apex, type Point2 } from '../../exam/amc12b-2025-21-supplementary-triangles/geometry';

const GOLD = [212, 184, 122] as const;
const WHITE = [232, 232, 232] as const;

type Color = readonly [number, number, number];

export type SupplementaryScene = {
  width: number;
  height: number;
  theta: number;
  both: boolean;
};

function strokeOf(p: p5, color: Color, alpha: number, weight: number): void {
  p.stroke(color[0], color[1], color[2], alpha);
  p.strokeWeight(weight);
}

export function renderSupplementaryTrianglesExam(p: p5, scene: SupplementaryScene): void {
  p.background(10, 10, 10);
  const partner = Math.PI - scene.theta;
  const angles = scene.both ? [partner, scene.theta] : [scene.theta];
  let minX = 0;
  let maxX = SIDE_V;
  let maxY = 0.01;
  for (const angle of angles) {
    const point = apex(angle);
    minX = Math.min(minX, point.x);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  }
  const pad = 36;
  const scale = Math.min((scene.width - pad * 2) / (maxX - minX), (scene.height - pad * 2) / maxY);
  const ox = (scene.width - (maxX + minX) * scale) / 2;
  const oy = scene.height - pad;
  const to = (point: Point2) => ({ x: ox + point.x * scale, y: oy - point.y * scale });
  const origin = to({ x: 0, y: 0 });
  const base = to({ x: SIDE_V, y: 0 });

  angles.forEach((angle, index) => {
    const tip = to(apex(angle));
    const color = scene.both && index === 0 ? WHITE : GOLD;
    p.push();
    p.noFill();
    strokeOf(p, color, 230, scene.both && index === 0 ? 1.6 : 2.2);
    p.line(origin.x, origin.y, tip.x, tip.y);
    p.line(tip.x, tip.y, base.x, base.y);
    p.pop();
    p.push();
    p.noFill();
    strokeOf(p, color, 200, 1.5);
    const radius = angle > Math.PI / 2 ? 36 : 22;
    p.arc(origin.x, origin.y, radius * 2, radius * 2, -angle, -0.02);
    p.pop();
    p.push();
    p.noStroke();
    p.fill(color[0], color[1], color[2], 245);
    p.circle(tip.x, tip.y, 7);
    p.pop();
  });

  p.push();
  strokeOf(p, WHITE, 210, 1.8);
  p.line(origin.x, origin.y, base.x, base.y);
  p.noStroke();
  p.fill(WHITE[0], WHITE[1], WHITE[2], 245);
  p.circle(origin.x, origin.y, 6);
  p.circle(base.x, base.y, 6);
  p.pop();
}
