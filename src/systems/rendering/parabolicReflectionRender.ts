import type p5 from 'p5';
import {
  buildParabolaCurve,
  buildReflectionRays,
  focusPoint,
  ORIGIN_OFFSET_X,
  type Point2,
  type RaySegment,
} from '../../curve/modules/parabolic-reflection/geometry';
import type { CurveStyle } from './types';

export type ParabolicReflectionSnap = {
  width: number;
  height: number;
  currentFocalLength: number;
  rayCount: number;
  time: number;
  revealProgress: number;
};

const GHOST_STYLE = { r: 212, g: 184, b: 122, a: 16 };

const RAY_GLOW: CurveStyle['reveal']['layers'] = [
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

function renderRayGlow(
  p: p5,
  rays: ReadonlyArray<RaySegment>,
  layers: CurveStyle['reveal']['layers'],
): void {
  for (const layer of layers) {
    p.stroke(layer.stroke.r, layer.stroke.g, layer.stroke.b, layer.stroke.a);
    p.strokeWeight(layer.weight);
    for (const ray of rays) {
      p.line(ray.x1, ray.y1, ray.x2, ray.y2);
    }
  }
}

export function renderParabolicReflectionScene(
  p: p5,
  snap: ParabolicReflectionSnap,
): void {
  p.background(10, 10, 10);

  const cx = snap.width / 2 - ORIGIN_OFFSET_X;
  const cy = snap.height / 2;
  const focus = focusPoint(snap.currentFocalLength);

  p.push();
  p.translate(cx, cy);

  p.noFill();
  p.stroke(255, 255, 255, 12);
  p.strokeWeight(1);
  p.line(-snap.width / 2 + ORIGIN_OFFSET_X, 0, snap.width / 2 + ORIGIN_OFFSET_X, 0);
  p.line(0, -snap.height / 2, 0, snap.height / 2);

  p.stroke(212, 184, 122, 80);
  p.circle(focus.x, focus.y, 4);

  const parabola = buildParabolaCurve(snap.height, snap.currentFocalLength);
  p.stroke(GHOST_STYLE.r, GHOST_STYLE.g, GHOST_STYLE.b, GHOST_STYLE.a);
  p.strokeWeight(1);
  drawPolyline(p, parabola);

  const rays = buildReflectionRays({
    canvasWidth: snap.width,
    canvasHeight: snap.height,
    currentFocalLength: snap.currentFocalLength,
    rayCount: snap.rayCount,
    time: snap.time,
    revealProgress: snap.revealProgress,
  });

  renderRayGlow(p, rays, RAY_GLOW);

  p.pop();
}
