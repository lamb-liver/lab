import type p5 from 'p5';
import {
  VIEW,
  arcPoints,
  geodesicCircle,
  mapX,
  mapY,
  outgoingTangent,
  plotSquare,
  vertices,
  type DiskTriangleParams,
  type Vec,
} from '../../curve/modules/poincare-triangle/geometry';

const GOLD = [212, 184, 122] as const;
const WHITE = [255, 255, 255] as const;

function drawBoundary(p: p5, plot: ReturnType<typeof plotSquare>): void {
  const scale = plot.width / (VIEW.x1 - VIEW.x0);
  p.noFill();
  p.stroke(...WHITE, 48);
  p.strokeWeight(1);
  p.circle(mapX(plot, 0), mapY(plot, 0), scale * 2);
}

function drawTriangle(p: p5, plot: ReturnType<typeof plotSquare>, r: number): void {
  const verts = vertices(r);
  const arcs = [0, 1, 2].map((i) => {
    const a = verts[i]!;
    const b = verts[(i + 1) % 3]!;
    return arcPoints(geodesicCircle(a, b), a, b, 48);
  });

  p.noStroke();
  p.fill(...GOLD, 42);
  p.beginShape();
  for (const arc of arcs) {
    for (const point of arc) {
      p.vertex(mapX(plot, point.x), mapY(plot, point.y));
    }
  }
  p.endShape(p.CLOSE);

  p.noFill();
  p.stroke(...GOLD, 230);
  p.strokeWeight(1.5);
  for (const arc of arcs) {
    p.beginShape();
    for (const point of arc) {
      p.vertex(mapX(plot, point.x), mapY(plot, point.y));
    }
    p.endShape();
  }
}

function screenAngle(plot: ReturnType<typeof plotSquare>, from: Vec, toward: Vec): number {
  const x0 = mapX(plot, from.x);
  const y0 = mapY(plot, from.y);
  return Math.atan2(mapY(plot, toward.y) - y0, mapX(plot, toward.x) - x0);
}

function drawAngleMarks(p: p5, plot: ReturnType<typeof plotSquare>, r: number): void {
  const verts = vertices(r);
  const origin = { x: mapX(plot, 0), y: mapY(plot, 0) };
  p.noFill();
  p.stroke(...WHITE, 150);
  p.strokeWeight(1);
  for (let i = 0; i < 3; i += 1) {
    const here = verts[i]!;
    const prev = verts[(i + 2) % 3]!;
    const next = verts[(i + 1) % 3]!;
    const tNext = outgoingTangent(geodesicCircle(here, next), here, next);
    const tPrev = outgoingTangent(geodesicCircle(prev, here), here, prev);
    const a0 = screenAngle(plot, here, { x: here.x + tNext.x, y: here.y + tNext.y });
    const a1 = screenAngle(plot, here, { x: here.x + tPrev.x, y: here.y + tPrev.y });
    let sweep = a1 - a0;
    while (sweep > Math.PI) sweep -= 2 * Math.PI;
    while (sweep < -Math.PI) sweep += 2 * Math.PI;
    const sx = mapX(plot, here.x);
    const sy = mapY(plot, here.y);
    const mark = Math.min(22, Math.hypot(sx - origin.x, sy - origin.y) * 0.38);
    if (sweep >= 0) p.arc(sx, sy, mark * 2, mark * 2, a0, a0 + sweep);
    else p.arc(sx, sy, mark * 2, mark * 2, a1, a1 - sweep);
  }
}

function drawVertices(p: p5, plot: ReturnType<typeof plotSquare>, r: number): void {
  p.noStroke();
  p.fill(...GOLD, 230);
  for (const point of vertices(r)) {
    p.circle(mapX(plot, point.x), mapY(plot, point.y), 5);
  }
}

export function renderPoincareTriangle(p: p5, params: DiskTriangleParams): void {
  const plot = plotSquare(p.width, p.height);
  p.background(10, 10, 10);
  drawBoundary(p, plot);
  drawTriangle(p, plot, params.r);
  drawAngleMarks(p, plot, params.r);
  drawVertices(p, plot, params.r);
}
