import type p5 from 'p5';
import type {
  ParabolaFocalChordScene,
  Point,
} from '../../exam/ast-111-parabola-focal-chord-directrix-projection/geometry';
import { withDash } from './p5PlotHelpers';

type Snap = {
  width: number;
  height: number;
  scene: ParabolaFocalChordScene;
};

type ScreenPoint = Point;

const GOLD = [212, 184, 122] as const;
const BLUE = [93, 173, 226] as const;
const WHITE = [232, 232, 232] as const;

export function renderParabolaFocalChordDirectrixProjectionExamScene(
  p: p5,
  snap: Snap,
): void {
  p.background(10, 10, 10);
  p.textFont("system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif");

  const { scene } = snap;
  const { A, B, F, AProjection, FProjection, BProjection } = scene.points;
  const worldYMin = B.y - 0.65;
  const worldYMax = A.y + 0.55;
  const worldXMax = Math.max(A.x, (worldYMax * worldYMax) / 4) + 0.5;
  const project = createProjector(snap, -1.45, worldXMax, worldYMin, worldYMax);
  const points = {
    A: project(A),
    B: project(B),
    F: project(F),
    AProjection: project(AProjection),
    FProjection: project(FProjection),
    BProjection: project(BProjection),
  };

  drawParabola(p, project, worldYMin, worldYMax);
  drawSegment(p, project({ x: scene.directrixX, y: worldYMin }), project({ x: scene.directrixX, y: worldYMax }), WHITE, 80, 1.5);
  drawDashedSegment(p, points.AProjection, points.A, WHITE, 115);
  drawDashedSegment(p, points.FProjection, points.F, WHITE, 90);
  drawDashedSegment(p, points.BProjection, points.B, WHITE, 115);
  drawSegment(p, points.A, points.B, GOLD, 225, 2.8);
  drawSegment(p, points.FProjection, points.B, BLUE, 185, 1.8);
  drawSegment(p, points.AProjection, points.FProjection, GOLD, 225, 3.2);

  drawPoint(p, points.AProjection, 'A′', -25, -12);
  drawPoint(p, points.FProjection, 'F′', -25, 3);
  drawPoint(p, points.BProjection, 'B′', -25, 15);
  drawPoint(p, points.A, 'A', 10, -10);
  drawPoint(p, points.F, 'F', 11, 2);
  drawPoint(p, points.B, 'B', 10, 16);

  p.noStroke();
  p.textSize(13);
  p.textAlign(p.CENTER, p.CENTER);
  p.fill(...GOLD, 235);
  p.text('③', points.A.x - 19, points.A.y + 23);
  p.fill(...BLUE, 235);
  p.text('⑤', points.FProjection.x + 28, points.FProjection.y + 22);
  p.fill(...WHITE, 125);
  p.textAlign(p.LEFT, p.CENTER);
  p.text('準線', points.AProjection.x + 8, 22);
}

function drawParabola(
  p: p5,
  project: (point: Point) => ScreenPoint,
  yMin: number,
  yMax: number,
): void {
  p.noFill();
  p.stroke(...GOLD, 130);
  p.strokeWeight(1.7);
  p.beginShape();
  for (let i = 0; i <= 160; i++) {
    const y = yMin + (i / 160) * (yMax - yMin);
    const point = project({ x: (y * y) / 4, y });
    p.vertex(point.x, point.y);
  }
  p.endShape();
}

function createProjector(
  snap: Snap,
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
): (point: Point) => ScreenPoint {
  const padding = snap.width < 520 ? 44 : 58;
  const scale = Math.min(
    (snap.width - padding * 2) / (xMax - xMin),
    (snap.height - padding * 2) / (yMax - yMin),
  );
  const offsetX = (snap.width - (xMax - xMin) * scale) / 2 - xMin * scale;
  const offsetY = (snap.height + (yMax - yMin) * scale) / 2 + yMin * scale;

  return (point) => ({ x: offsetX + point.x * scale, y: offsetY - point.y * scale });
}

function drawDashedSegment(
  p: p5,
  a: ScreenPoint,
  b: ScreenPoint,
  color: readonly [number, number, number],
  alpha: number,
): void {
  withDash(p, [6, 6], () => drawSegment(p, a, b, color, alpha, 1.2));
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
