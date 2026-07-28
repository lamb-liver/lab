import type p5 from 'p5';
import type {
  IsoscelesConstruction,
  Point,
} from '../../exam/ast-112-isosceles-120-construction/geometry';

type Isosceles120ConstructionExamSnap = {
  width: number;
  height: number;
  construction: IsoscelesConstruction;
};

type ScreenPoint = Point;

const GOLD = [212, 184, 122] as const;
const BLUE = [93, 173, 226] as const;
const WHITE = [232, 232, 232] as const;

export function renderIsosceles120ConstructionExamScene(
  p: p5,
  snap: Isosceles120ConstructionExamSnap,
): void {
  p.background(10, 10, 10);
  p.textFont("system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif");

  const points = toScreenPoints(snap);
  drawTriangle(p, points.A, points.B, points.C, WHITE, 0);
  drawTriangle(p, points.M, points.A, points.B, GOLD, 22);
  drawTriangle(p, points.N, points.A, points.C, BLUE, 18);
  drawSegment(p, points.M, points.N, WHITE, 210, 2.4);

  drawPoint(p, points.A, 'A', -18, 17);
  drawPoint(p, points.B, 'B', 12, 17);
  drawPoint(p, points.C, 'C', 10, -12);
  drawPoint(p, points.M, 'M', -20, 18);
  drawPoint(p, points.N, 'N', 10, -13);

  p.noStroke();
  p.textSize(12);
  p.textAlign(p.CENTER, p.CENTER);
  p.fill(...GOLD, 230);
  p.text(
    `φ=${snap.construction.apexAngle}°`,
    points.M.x,
    points.M.y + (points.M.y > points.A.y ? 30 : -30),
  );
  p.fill(...BLUE, 220);
  p.text(
    `底角 ${snap.construction.baseAngle.toFixed(1)}°`,
    (points.A.x + points.N.x) / 2 + 25,
    (points.A.y + points.N.y) / 2 - 10,
  );
  p.fill(...WHITE, 175);
  p.text(
    `∠MAN ${snap.construction.angleMAN.toFixed(1)}°`,
    points.A.x + 58,
    points.A.y - 18,
  );
  p.fill(...WHITE, 120);
  p.text(
    'MN',
    points.N.x * 0.3 + points.M.x * 0.7 + 12,
    points.N.y * 0.3 + points.M.y * 0.7,
  );
}

function toScreenPoints(
  snap: Isosceles120ConstructionExamSnap,
): Record<'A' | 'B' | 'C' | 'M' | 'N', ScreenPoint> {
  const values = Object.values(snap.construction.points);
  const minX = Math.min(...values.map((point) => point.x));
  const maxX = Math.max(...values.map((point) => point.x));
  const minY = Math.min(...values.map((point) => point.y));
  const maxY = Math.max(...values.map((point) => point.y));
  const padding = snap.width < 520 ? 48 : 66;
  const scale = Math.min(
    (snap.width - padding * 2) / Math.max(1, maxX - minX),
    (snap.height - padding * 2) / Math.max(1, maxY - minY),
  );
  const offsetX = (snap.width - (maxX - minX) * scale) / 2 - minX * scale;
  const offsetY = (snap.height + (maxY - minY) * scale) / 2 + minY * scale;
  const project = (point: Point): ScreenPoint => ({
    x: offsetX + point.x * scale,
    y: offsetY - point.y * scale,
  });

  return {
    A: project(snap.construction.points.A),
    B: project(snap.construction.points.B),
    C: project(snap.construction.points.C),
    M: project(snap.construction.points.M),
    N: project(snap.construction.points.N),
  };
}

function drawTriangle(
  p: p5,
  a: ScreenPoint,
  b: ScreenPoint,
  c: ScreenPoint,
  color: readonly [number, number, number],
  fillAlpha: number,
): void {
  p.fill(...color, fillAlpha);
  p.stroke(...color, fillAlpha === 0 ? 85 : 190);
  p.strokeWeight(fillAlpha === 0 ? 1.2 : 2);
  p.triangle(a.x, a.y, b.x, b.y, c.x, c.y);
}

function drawSegment(
  p: p5,
  a: ScreenPoint,
  b: ScreenPoint,
  color: readonly [number, number, number],
  alpha: number,
  weight: number,
): void {
  p.stroke(...color, alpha);
  p.strokeWeight(weight);
  p.line(a.x, a.y, b.x, b.y);
}

function drawPoint(
  p: p5,
  point: ScreenPoint,
  label: string,
  offsetX: number,
  offsetY: number,
): void {
  p.noStroke();
  p.fill(...WHITE, 235);
  p.circle(point.x, point.y, 7);
  p.textAlign(p.LEFT, p.CENTER);
  p.textSize(13);
  p.text(label, point.x + offsetX, point.y + offsetY);
}
