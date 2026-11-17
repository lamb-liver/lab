import type p5 from 'p5';
import { trianglePoints, type Point2 } from '../../exam/amc12a-2025-16-bisector-altitude/geometry';

const GOLD = [212, 184, 122] as const;
const CYAN = [128, 196, 210] as const;
const WHITE = [232, 232, 232] as const;

type Color = readonly [number, number, number];

export type BisectorMode = 'bd' | 'pd' | 'bp';

export type BisectorScene = {
  width: number;
  height: number;
  mode: BisectorMode;
};

function strokeOf(p: p5, color: Color, alpha: number, weight: number): void {
  p.stroke(color[0], color[1], color[2], alpha);
  p.strokeWeight(weight);
}

export function renderBisectorAltitudeExam(p: p5, scene: BisectorScene): void {
  p.background(10, 10, 10);
  const { A, B, C, D, H, P } = trianglePoints();
  const pad = 28;
  const scale = Math.min((scene.width - pad * 2) / B.x, (scene.height - pad * 2) / C.y);
  const ox = (scene.width - B.x * scale) / 2;
  const oy = scene.height - pad * 0.8;
  const to = (point: Point2) => ({ x: ox + point.x * scale, y: oy - point.y * scale });
  const a = to(A);
  const b = to(B);
  const c = to(C);
  const d = to(D);
  const h = to(H);
  const point = to(P);

  p.push();
  p.noFill();
  strokeOf(p, WHITE, 220, 1.8);
  p.line(a.x, a.y, b.x, b.y);
  p.line(b.x, b.y, c.x, c.y);
  p.line(c.x, c.y, a.x, a.y);
  p.pop();

  if (scene.mode !== 'bd') {
    p.push();
    strokeOf(p, CYAN, 180, 1.5);
    p.line(c.x, c.y, h.x, h.y);
    p.pop();
  }

  if (scene.mode !== 'bd') {
    p.push();
    strokeOf(p, WHITE, 90, 1.2);
    p.line(b.x, b.y, d.x, d.y);
    p.pop();
  }
  const goldFrom = scene.mode === 'pd' ? point : b;
  const goldTo = scene.mode === 'bp' ? point : d;
  p.push();
  strokeOf(p, GOLD, 235, 2.4);
  p.line(goldFrom.x, goldFrom.y, goldTo.x, goldTo.y);
  p.pop();

  p.push();
  p.noStroke();
  p.fill(WHITE[0], WHITE[1], WHITE[2], 245);
  p.circle(a.x, a.y, 6);
  p.circle(b.x, b.y, 6);
  p.circle(c.x, c.y, 6);
  p.fill(GOLD[0], GOLD[1], GOLD[2], 245);
  p.circle(d.x, d.y, 7);
  if (scene.mode !== 'bd') p.circle(point.x, point.y, 8);
  p.pop();
}
