import type p5 from 'p5';
import type { CurvePoint } from '../../curve/types';
import type { CurveStyle, StrokeRGBA } from './types';

/** 折線繪製只需要座標；接受缺 theta/arcLength 的點列 */
type XYPoint = Pick<CurvePoint, 'x' | 'y'>;

function strokeRGBA(p: p5, c: StrokeRGBA): void {
  p.stroke(c.r, c.g, c.b, c.a);
}

export function drawPolyline(
  p: p5,
  points: ReadonlyArray<XYPoint>,
  stroke: StrokeRGBA,
  weight: number,
): void {
  if (points.length === 0) return;

  p.noFill();
  strokeRGBA(p, stroke);
  p.strokeWeight(weight);
  p.beginShape();
  for (const pt of points) {
    p.vertex(pt.x, pt.y);
  }
  p.endShape();
}

export function renderGlowStroke(
  p: p5,
  points: ReadonlyArray<XYPoint>,
  layers: CurveStyle['reveal']['layers'],
): void {
  for (const layer of layers) {
    drawPolyline(p, points, layer.stroke, layer.weight);
  }
}

export function renderGhostCurve(
  p: p5,
  points: ReadonlyArray<XYPoint>,
  style: CurveStyle,
): void {
  const { stroke, weight } = style.ghost;
  drawPolyline(p, points, stroke, weight);
}
