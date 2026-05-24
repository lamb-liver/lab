import type p5 from 'p5';
import type { CanvasPoint } from '../../curve/modules/tangent-approximation/geometry';
import {
  ORIGIN_Y_OFFSET,
  buildSecantExtension,
  buildSecantSegment,
  evaluateTangentFn,
  mapRenderX,
  mapRenderY,
  tangentPointX,
} from '../../curve/modules/tangent-approximation/geometry';

export type TangentApproximationSnap = {
  width: number;
  height: number;
  waveFrequency: number;
  time: number;
  smoothDx: number;
  ghostCurve: ReadonlyArray<CanvasPoint>;
};

const PRIMARY = { r: 212, g: 184, b: 122 };
const GUIDE = { r: 255, g: 255, b: 255 };

const MAIN_GLOW: Array<{ weight: number; alpha: number }> = [
  { weight: 3.5, alpha: 42 },
  { weight: 1.5, alpha: 230 },
];

const SECANT_GLOW: Array<{ weight: number; alpha: number }> = [
  { weight: 5, alpha: 30 },
  { weight: 2, alpha: 160 },
];

function drawGlowPolyline(
  p: p5,
  points: ReadonlyArray<CanvasPoint>,
  layers: Array<{ weight: number; alpha: number }>,
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

function renderMarkerPoint(p: p5, pt: CanvasPoint, size: number, alpha: number): void {
  p.stroke(PRIMARY.r, PRIMARY.g, PRIMARY.b, alpha);
  p.strokeWeight(size);
  p.point(pt.x, pt.y);
}

export function renderTangentApproximationScene(
  p: p5,
  snap: TangentApproximationSnap,
): void {
  p.background(10, 10, 10);

  const cx = snap.width / 2;
  const cy = snap.height / 2 + ORIGIN_Y_OFFSET;

  p.push();
  p.translate(cx, cy);

  p.noFill();
  p.stroke(GUIDE.r, GUIDE.g, GUIDE.b, 12);
  p.strokeWeight(1);
  p.line(-snap.width / 2, 0, snap.width / 2, 0);
  p.line(0, -snap.height / 2, 0, snap.height / 2);

  p.stroke(PRIMARY.r, PRIMARY.g, PRIMARY.b, 60);
  p.strokeWeight(1);
  p.beginShape();
  for (const pt of snap.ghostCurve) {
    p.vertex(pt.x, pt.y);
  }
  p.endShape();

  const tangentX = tangentPointX(snap.time);
  const secant = buildSecantSegment(
    snap.width,
    snap.waveFrequency,
    snap.time,
    tangentX,
    snap.smoothDx,
  );
  const extension = buildSecantExtension(
    snap.width,
    snap.waveFrequency,
    snap.time,
    tangentX,
    snap.smoothDx,
  );

  drawGlowPolyline(p, secant, SECANT_GLOW);
  drawGlowPolyline(p, extension, MAIN_GLOW);

  const pCanvas = {
    x: mapRenderX(tangentX, snap.width),
    y: mapRenderY(evaluateTangentFn(tangentX, snap.waveFrequency, snap.time)),
  };
  const qCanvas = {
    x: mapRenderX(tangentX + snap.smoothDx, snap.width),
    y: mapRenderY(
      evaluateTangentFn(tangentX + snap.smoothDx, snap.waveFrequency, snap.time),
    ),
  };

  renderMarkerPoint(p, pCanvas, 6, 42);
  renderMarkerPoint(p, qCanvas, 6, 42);
  renderMarkerPoint(p, pCanvas, 1.5, 230);
  renderMarkerPoint(p, qCanvas, 1.5, 230);

  p.pop();
}
