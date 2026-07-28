import type p5 from 'p5';
import type { ComplexUnitCircleScene } from '../../exam/ast-111-complex-unit-circle/geometry';
import { FIXED_POINT } from '../../exam/ast-111-complex-unit-circle/geometry';
import {
  circleGeometry,
  unitToScreen,
  type CircleGeometry,
} from '../../curve/modules/unit-circle-trig-definition/geometry';
import { canvas2d } from './canvas2d';

type ComplexUnitCircleExamSnap = {
  width: number;
  height: number;
  scene: ComplexUnitCircleScene;
};

const GOLD = [212, 184, 122] as const;
const WHITE = [232, 232, 232] as const;
const BLUE = [93, 173, 226] as const;

export function renderComplexUnitCircleExamScene(
  p: p5,
  { width, height, scene }: ComplexUnitCircleExamSnap,
): void {
  p.background(10, 10, 10);
  p.textFont("system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif");

  const geo = circleGeometry(width, height, false);
  const origin = unitToScreen(0, 0, geo);
  const w = unitToScreen(FIXED_POINT.x, FIXED_POINT.y, geo);
  const z = unitToScreen(scene.z.x, scene.z.y, geo);
  const zSquared = unitToScreen(scene.zSquared.x, scene.zSquared.y, geo);
  const zCubed = unitToScreen(scene.zCubed.x, scene.zCubed.y, geo);

  drawAxesAndCircle(p, geo);
  drawSegment(p, z, zCubed, WHITE, 1.2, 75, [5, 6]);
  drawSegment(
    p,
    unitToScreen(-scene.zSquared.x * 1.22, -scene.zSquared.y * 1.22, geo),
    unitToScreen(scene.zSquared.x * 1.22, scene.zSquared.y * 1.22, geo),
    GOLD,
    1.4,
    130,
    [7, 6],
  );
  drawSegment(p, w, z, GOLD, 2, 210);
  drawSegment(p, w, zCubed, BLUE, 2, 210);
  drawSegment(p, origin, w, BLUE, 1.2, 105);

  drawPoint(p, origin, WHITE, 5);
  drawPoint(p, z, GOLD, 9);
  drawPoint(p, zCubed, BLUE, 9);
  drawPoint(p, zSquared, GOLD, 6);
  drawPoint(p, w, BLUE, 12, false);

  drawLabel(p, 'O', origin.x + 9, origin.y + 8, WHITE);
  drawLabel(p, 'z', z.x + 10, z.y - 18, GOLD);
  drawLabel(p, 'z³', zCubed.x - 28, zCubed.y + 9, BLUE);
  drawLabel(
    p,
    scene.distanceGap < 0.001 ? 'w = z²' : 'w',
    w.x - 46,
    w.y - 22,
    BLUE,
  );
  if (scene.distanceGap >= 0.001) {
    drawLabel(p, 'z²', zSquared.x + 10, zSquared.y + 8, GOLD);
  }
}

function drawAxesAndCircle(p: p5, geo: CircleGeometry): void {
  p.stroke(...WHITE, 24);
  p.strokeWeight(1);
  p.line(geo.x, geo.cy, geo.x + geo.w, geo.cy);
  p.line(geo.cx, geo.y, geo.cx, geo.y + geo.h);
  p.noFill();
  p.stroke(...WHITE, 58);
  p.circle(geo.cx, geo.cy, geo.r * 2);
}

function drawSegment(
  p: p5,
  a: { x: number; y: number },
  b: { x: number; y: number },
  color: readonly [number, number, number],
  weight: number,
  alpha: number,
  dash: number[] = [],
): void {
  const context = canvas2d(p);
  context.setLineDash(dash);
  p.stroke(...color, alpha);
  p.strokeWeight(weight);
  p.line(a.x, a.y, b.x, b.y);
  context.setLineDash([]);
}

function drawPoint(
  p: p5,
  point: { x: number; y: number },
  color: readonly [number, number, number],
  size: number,
  fill = true,
): void {
  p.stroke(...color, 230);
  p.strokeWeight(2);
  if (fill) p.fill(...color, 210);
  else p.noFill();
  p.circle(point.x, point.y, size);
}

function drawLabel(
  p: p5,
  label: string,
  x: number,
  y: number,
  color: readonly [number, number, number],
): void {
  p.noStroke();
  p.fill(...color, 220);
  p.textSize(13);
  p.textStyle(p.BOLD);
  p.textAlign(p.LEFT, p.TOP);
  p.text(label, x, y);
  p.textStyle(p.NORMAL);
}
