import type p5 from 'p5';
import {
  ORIGIN_Y_OFFSET,
  buildRiemannCurvePoints,
  buildRiemannRectangles,
} from '../../curve/modules/riemann-sum/geometry';

type RiemannSumSnap = {
  width: number;
  height: number;
  currentPartitionCount: number;
  waveFrequency: number;
  time: number;
  activeDomain: number;
};

const PRIMARY = { r: 212, g: 184, b: 122 };
const GUIDE = { r: 255, g: 255, b: 255 };

const CURVE_GLOW: Array<{ weight: number; alpha: number }> = [
  { weight: 3.5, alpha: 42 },
  { weight: 1.5, alpha: 230 },
];

function drawGlowPolyline(
  p: p5,
  points: Array<{ x: number; y: number }>,
  layers: typeof CURVE_GLOW,
): void {
  if (points.length === 0) return;
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

function renderRectangles(
  p: p5,
  rects: ReturnType<typeof buildRiemannRectangles>,
): void {
  p.stroke(PRIMARY.r, PRIMARY.g, PRIMARY.b, 40);
  p.strokeWeight(1);
  for (const rect of rects) {
    p.line(rect.leftX, 0, rect.leftX, rect.topY);
    p.line(rect.leftX, rect.topY, rect.rightX, rect.topY);
    p.line(rect.rightX, 0, rect.rightX, rect.topY);
  }
}

export function renderRiemannSumScene(p: p5, snap: RiemannSumSnap): void {
  p.background(10, 10, 10);

  const cx = snap.width / 2;
  const cy = snap.height / 2 + ORIGIN_Y_OFFSET;

  p.push();
  p.translate(cx, cy);

  p.noFill();
  p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 12);
  p.strokeWeight(1);
  p.line(-snap.width / 2, 0, snap.width / 2, 0);
  p.line(0, -snap.height / 2 - ORIGIN_Y_OFFSET, 0, snap.height / 2);

  const rects = buildRiemannRectangles(
    snap.width,
    snap.currentPartitionCount,
    snap.waveFrequency,
    snap.time,
    snap.activeDomain,
  );
  renderRectangles(p, rects);

  const curvePoints = buildRiemannCurvePoints(
    snap.width,
    snap.waveFrequency,
    snap.time,
    snap.activeDomain,
  );
  drawGlowPolyline(p, curvePoints, CURVE_GLOW);

  p.pop();
}
