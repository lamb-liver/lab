import type p5 from 'p5';
import {
  CAMERA_SCALE,
  type WorldPoint,
} from '../../curve/modules/vector-field-streamlines/geometry';

export type VectorFieldSnap = {
  width: number;
  height: number;
  streamlines: ReadonlyArray<ReadonlyArray<WorldPoint>>;
};

const PRIMARY = { r: 212, g: 184, b: 122 };
const GUIDE = { r: 255, g: 255, b: 255 };

const MAIN_GLOW: Array<{ weight: number; alpha: number }> = [
  { weight: 3.5, alpha: 32 },
  { weight: 1.2, alpha: 220 },
];

function mapPoint(pt: WorldPoint): { x: number; y: number } {
  return {
    x: pt.x * CAMERA_SCALE,
    y: -pt.y * CAMERA_SCALE,
  };
}

function mapPath(points: ReadonlyArray<WorldPoint>): Array<{ x: number; y: number }> {
  return points.map(mapPoint);
}

function drawGlowPolyline(
  p: p5,
  points: ReadonlyArray<{ x: number; y: number }>,
  layers: typeof MAIN_GLOW,
): void {
  if (points.length < 2) return;
  p.noFill();
  for (const layer of layers) {
    p.stroke(PRIMARY.r, PRIMARY.g, PRIMARY.b, layer.alpha);
    p.strokeWeight(layer.weight);
    p.beginShape();
    for (const pt of points) {
      p.vertex(pt.x, pt.y);
    }
    p.endShape();
  }
}

function drawNode(
  p: p5,
  pt: { x: number; y: number },
  size: number,
  alpha: number,
): void {
  p.stroke(PRIMARY.r, PRIMARY.g, PRIMARY.b, alpha);
  p.strokeWeight(size);
  p.point(pt.x, pt.y);
}

export function renderVectorFieldStreamlinesScene(
  p: p5,
  snap: VectorFieldSnap,
): void {
  p.background(10, 10, 10);

  const cx = snap.width / 2;
  const cy = snap.height / 2;

  p.push();
  p.translate(cx, cy);

  p.noFill();
  p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 12);
  p.strokeWeight(1);
  p.line(-snap.width / 2, 0, snap.width / 2, 0);
  p.line(0, -snap.height / 2, 0, snap.height / 2);

  for (const path of snap.streamlines) {
    const screenPath = mapPath(path);
    drawGlowPolyline(p, screenPath, MAIN_GLOW);
    if (screenPath.length > 0) {
      drawNode(p, screenPath[0]!, 3, 180);
    }
  }

  p.pop();
}
