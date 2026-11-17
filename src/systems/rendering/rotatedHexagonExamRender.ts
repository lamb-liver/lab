import type p5 from 'p5';
import {
  circumradius,
  hexVertices,
  officialTheta,
  triangleVertices,
  type Point2,
} from '../../exam/amc12b-2024-19-rotated-hexagon/geometry';

const GOLD = [212, 184, 122] as const;
const CYAN = [128, 196, 210] as const;
const WHITE = [232, 232, 232] as const;

type Color = readonly [number, number, number];

const START = Math.PI / 2;
const LABELS = ['A', 'D', 'B', 'E', 'C', 'F'] as const;

export type HexagonScene = {
  width: number;
  height: number;
  theta: number;
};

type Plot = { cx: number; cy: number; scale: number };

function plotOf(width: number, height: number): Plot {
  const usable = Math.min(width - 28, height - 20);
  const radius = circumradius();
  return {
    cx: width / 2,
    cy: height / 2,
    scale: usable / (2 * radius * 1.22),
  };
}

function toScreen(plot: Plot, point: Point2): Point2 {
  return { x: plot.cx + point.x * plot.scale, y: plot.cy - point.y * plot.scale };
}

function strokeOf(p: p5, color: Color, alpha: number, weight: number): void {
  p.stroke(color[0], color[1], color[2], alpha);
  p.strokeWeight(weight);
}

function polygon(p: p5, plot: Plot, points: Point2[], color: Color, fillAlpha: number, weight: number): void {
  p.push();
  if (fillAlpha > 0) p.fill(color[0], color[1], color[2], fillAlpha);
  else p.noFill();
  strokeOf(p, color, 230, weight);
  p.strokeJoin(p.ROUND);
  p.beginShape();
  for (const point of points) {
    const s = toScreen(plot, point);
    p.vertex(s.x, s.y);
  }
  p.endShape(p.CLOSE);
  p.pop();
}

export function renderRotatedHexagonExam(p: p5, scene: HexagonScene): void {
  p.background(10, 10, 10);
  const plot = plotOf(scene.width, scene.height);
  const radius = circumradius();
  const atTarget = Math.abs(scene.theta - officialTheta()) < 1e-6;

  p.push();
  p.noFill();
  strokeOf(p, WHITE, 50, 1.2);
  p.circle(plot.cx, plot.cy, 2 * radius * plot.scale);
  p.pop();

  polygon(p, plot, hexVertices(scene.theta, START), CYAN, atTarget ? 48 : 28, atTarget ? 2.6 : 1.8);
  polygon(p, plot, triangleVertices(0, scene.theta, START), WHITE, 0, 1.5);
  polygon(p, plot, triangleVertices(1, scene.theta, START), GOLD, 0, 2);

  p.push();
  p.noFill();
  strokeOf(p, GOLD, 220, 1.6);
  p.beginShape();
  p.vertex(plot.cx, plot.cy);
  const steps = 14;
  for (let i = 0; i <= steps; i += 1) {
    const angle = START + (scene.theta * i) / steps;
    const s = toScreen(plot, {
      x: radius * 0.22 * Math.cos(angle),
      y: radius * 0.22 * Math.sin(angle),
    });
    p.vertex(s.x, s.y);
  }
  p.vertex(plot.cx, plot.cy);
  p.endShape();
  p.pop();

  const verts = hexVertices(scene.theta, START);
  p.push();
  p.noStroke();
  p.textSize(13);
  p.textAlign(p.CENTER, p.CENTER);
  verts.forEach((point, index) => {
    const s = toScreen(plot, point);
    const prev = index > 0 ? toScreen(plot, verts[index - 1]) : null;
    if (prev && Math.hypot(s.x - prev.x, s.y - prev.y) < 16) return;
    const ink = index % 2 === 0 ? WHITE : GOLD;
    p.fill(ink[0], ink[1], ink[2], 245);
    p.circle(s.x, s.y, 7);
    const outward = toScreen(plot, {
      x: point.x * 1.14,
      y: point.y * 1.14,
    });
    p.text(LABELS[index], outward.x, outward.y);
  });
  p.fill(WHITE[0], WHITE[1], WHITE[2], 180);
  p.circle(plot.cx, plot.cy, 4);
  p.pop();
}
