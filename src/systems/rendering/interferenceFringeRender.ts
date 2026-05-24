import type p5 from 'p5';
import {
  buildInterferenceGeometry,
  type Point2,
} from '../../curve/modules/interference-fringes/geometry';
import type { CurveStyle } from './types';

export type InterferenceFringesSnap = {
  width: number;
  height: number;
  currentSourceDistance: number;
  wavelength: number;
  time: number;
  revealProgress: number;
};

const ENVELOPE_STYLE = { r: 212, g: 184, b: 122, a: 16 };

const FRINGE_GLOW: CurveStyle['reveal']['layers'] = [
  { stroke: { r: 212, g: 184, b: 122, a: 16 }, weight: 7 },
  { stroke: { r: 212, g: 184, b: 122, a: 42 }, weight: 3.5 },
  { stroke: { r: 212, g: 184, b: 122, a: 230 }, weight: 1.5 },
];

function drawPolyline(p: p5, points: ReadonlyArray<Point2>): void {
  if (points.length === 0) return;
  p.beginShape();
  for (const pt of points) {
    p.vertex(pt.x, pt.y);
  }
  p.endShape();
}

function renderFringeGlow(
  p: p5,
  curves: ReadonlyArray<ReadonlyArray<Point2>>,
  layers: CurveStyle['reveal']['layers'],
): void {
  for (const layer of layers) {
    p.noFill();
    p.stroke(layer.stroke.r, layer.stroke.g, layer.stroke.b, layer.stroke.a);
    p.strokeWeight(layer.weight);
    for (const curve of curves) {
      drawPolyline(p, curve);
    }
  }
}

export function renderInterferenceFringesScene(
  p: p5,
  snap: InterferenceFringesSnap,
): void {
  p.background(10, 10, 10);

  const cx = snap.width / 2;
  const cy = snap.height / 2;

  const geometry = buildInterferenceGeometry({
    canvasWidth: snap.width,
    canvasHeight: snap.height,
    currentSourceDistance: snap.currentSourceDistance,
    wavelength: snap.wavelength,
    time: snap.time,
    revealProgress: snap.revealProgress,
  });

  p.push();
  p.translate(cx, cy);

  p.noFill();
  p.stroke(255, 255, 255, 12);
  p.strokeWeight(1);
  p.line(-snap.width / 2, 0, snap.width / 2, 0);
  p.line(0, -snap.height / 2, 0, snap.height / 2);

  const sourceOffset = snap.currentSourceDistance / 2;
  p.stroke(212, 184, 122, 80);
  p.strokeWeight(1);
  p.circle(-sourceOffset, 0, 4);
  p.circle(sourceOffset, 0, 4);

  p.stroke(ENVELOPE_STYLE.r, ENVELOPE_STYLE.g, ENVELOPE_STYLE.b, ENVELOPE_STYLE.a);
  p.strokeWeight(1);
  for (const envelope of geometry.envelopes) {
    drawPolyline(p, envelope);
  }

  renderFringeGlow(p, geometry.fringes, FRINGE_GLOW);

  p.pop();
}
