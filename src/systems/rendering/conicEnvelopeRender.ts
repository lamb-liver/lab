import type p5 from 'p5';
import {
  buildEnvelopeGeometry,
  type LineSegment,
} from '../../curve/modules/conic-envelope/geometry';
import type { CurveStyle } from './types';

type ConicEnvelopeSnap = {
  width: number;
  height: number;
  lineDensity: number;
  currentRatio: number;
  time: number;
  revealProgress: number;
};

const GHOST_STYLE = { r: 212, g: 184, b: 122, a: 16 };

const LINE_GLOW: CurveStyle['reveal']['layers'] = [
  { stroke: { r: 212, g: 184, b: 122, a: 16 }, weight: 7 },
  { stroke: { r: 212, g: 184, b: 122, a: 42 }, weight: 3.5 },
  { stroke: { r: 212, g: 184, b: 122, a: 230 }, weight: 1.5 },
];

function renderLineGlow(
  p: p5,
  lines: ReadonlyArray<LineSegment>,
  layers: CurveStyle['reveal']['layers'],
): void {
  for (const layer of layers) {
    p.stroke(layer.stroke.r, layer.stroke.g, layer.stroke.b, layer.stroke.a);
    p.strokeWeight(layer.weight);
    for (const seg of lines) {
      p.line(seg.x1, seg.y1, seg.x2, seg.y2);
    }
  }
}

export function renderConicEnvelopeScene(p: p5, snap: ConicEnvelopeSnap): void {
  p.background(10, 10, 10);

  const cx = snap.width / 2;
  const cy = snap.height / 2;

  const geometry = buildEnvelopeGeometry({
    canvasWidth: snap.width,
    lineDensity: snap.lineDensity,
    currentRatio: snap.currentRatio,
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

  p.stroke(GHOST_STYLE.r, GHOST_STYLE.g, GHOST_STYLE.b, GHOST_STYLE.a);
  p.strokeWeight(1);
  for (const seg of geometry.fullLines) {
    p.line(seg.x1, seg.y1, seg.x2, seg.y2);
  }

  renderLineGlow(p, geometry.visibleLines, LINE_GLOW);

  p.pop();
}
