import type p5 from 'p5';
import {
  buildEllipseCurve,
  buildFocusConnections,
  ellipseParameters,
  focusPoints,
  orbitPoint,
  type LineSegment,
  type Point2,
} from '../../curve/modules/conic-focus-locus/geometry';
import type { CurveStyle } from './types';

type ConicFocusLocusSnap = {
  width: number;
  height: number;
  currentSemiMajorAxis: number;
  currentEccentricity: number;
  time: number;
  revealProgress: number;
};

const GHOST_STYLE = { r: 212, g: 184, b: 122, a: 16 };

const CONNECTION_GLOW: Array<{
  layers: CurveStyle['reveal']['layers'];
  pointSize: number;
}> = [
  {
    layers: [{ stroke: { r: 212, g: 184, b: 122, a: 16 }, weight: 7 }],
    pointSize: 8,
  },
  {
    layers: [{ stroke: { r: 212, g: 184, b: 122, a: 42 }, weight: 3.5 }],
    pointSize: 6,
  },
  {
    layers: [{ stroke: { r: 212, g: 184, b: 122, a: 230 }, weight: 1.5 }],
    pointSize: 3,
  },
];

function drawPolyline(p: p5, points: ReadonlyArray<Point2>): void {
  if (points.length === 0) return;
  p.beginShape();
  for (const pt of points) {
    p.vertex(pt.x, pt.y);
  }
  p.endShape();
}

function renderConnectionGlow(
  p: p5,
  connections: ReadonlyArray<LineSegment>,
  orbit: Point2,
  layer: CurveStyle['reveal']['layers'],
  pointSize: number,
): void {
  const stroke = layer[0]!.stroke;
  p.stroke(stroke.r, stroke.g, stroke.b, stroke.a);
  p.strokeWeight(layer[0]!.weight);
  for (const seg of connections) {
    p.line(seg.x1, seg.y1, seg.x2, seg.y2);
  }
  p.circle(orbit.x, orbit.y, pointSize);
}

export function renderConicFocusLocusScene(p: p5, snap: ConicFocusLocusSnap): void {
  p.background(10, 10, 10);

  const cx = snap.width / 2;
  const cy = snap.height / 2;
  const { a, b, c } = ellipseParameters(
    snap.currentSemiMajorAxis,
    snap.currentEccentricity,
  );
  const focuses = focusPoints(c);
  const orbit = orbitPoint(a, b, snap.time);
  const connections = buildFocusConnections(focuses, orbit, snap.revealProgress);

  p.push();
  p.translate(cx, cy);

  p.noFill();
  p.stroke(255, 255, 255, 12);
  p.strokeWeight(1);
  p.line(-snap.width / 2, 0, snap.width / 2, 0);
  p.line(0, -snap.height / 2, 0, snap.height / 2);

  p.stroke(212, 184, 122, 80);
  for (const focus of focuses) {
    p.circle(focus.x, focus.y, 4);
  }

  const ellipseCurve = buildEllipseCurve(a, b);
  p.stroke(GHOST_STYLE.r, GHOST_STYLE.g, GHOST_STYLE.b, GHOST_STYLE.a);
  p.strokeWeight(1);
  drawPolyline(p, ellipseCurve);

  for (const pass of CONNECTION_GLOW) {
    renderConnectionGlow(p, connections, orbit, pass.layers, pass.pointSize);
  }

  p.pop();
}
