import type p5 from 'p5';
import {
  buildEnvelopePoints,
  buildStandingWavePoints,
} from '../../curve/modules/standing-wave/geometry';
import { renderGlowStroke } from './polyline';
import type { CurveStyle } from './types';

type StandingWaveSnap = {
  width: number;
  height: number;
  currentAmplitude: number;
  spatialFrequency: number;
  time: number;
  revealProgress: number;
};

const ENVELOPE_STYLE = { r: 212, g: 184, b: 122, a: 16 };

const WAVE_GLOW: CurveStyle['reveal']['layers'] = [
  { stroke: { r: 212, g: 184, b: 122, a: 16 }, weight: 7 },
  { stroke: { r: 212, g: 184, b: 122, a: 42 }, weight: 3.5 },
  { stroke: { r: 212, g: 184, b: 122, a: 230 }, weight: 1.5 },
];

function drawPolyline(p: p5, points: ReadonlyArray<{ x: number; y: number }>): void {
  if (points.length === 0) return;
  p.beginShape();
  for (const pt of points) {
    p.vertex(pt.x, pt.y);
  }
  p.endShape();
}

function renderEnvelope(
  p: p5,
  snap: StandingWaveSnap,
): void {
  const base = {
    canvasWidth: snap.width,
    currentAmplitude: snap.currentAmplitude,
    spatialFrequency: snap.spatialFrequency,
  };

  p.noFill();
  p.stroke(ENVELOPE_STYLE.r, ENVELOPE_STYLE.g, ENVELOPE_STYLE.b, ENVELOPE_STYLE.a);
  p.strokeWeight(1);

  drawPolyline(p, buildEnvelopePoints(base, 1));
  drawPolyline(p, buildEnvelopePoints(base, -1));
}

export function renderStandingWaveScene(p: p5, snap: StandingWaveSnap): void {
  p.background(10, 10, 10);

  const cx = snap.width / 2;
  const cy = snap.height / 2;

  p.push();
  p.translate(cx, cy);

  p.noFill();
  p.stroke(255, 255, 255, 12);
  p.strokeWeight(1);
  p.line(-snap.width / 2, 0, snap.width / 2, 0);
  p.line(0, -snap.height / 2, 0, snap.height / 2);

  renderEnvelope(p, snap);

  const wavePoints = buildStandingWavePoints({
    canvasWidth: snap.width,
    currentAmplitude: snap.currentAmplitude,
    spatialFrequency: snap.spatialFrequency,
    time: snap.time,
    revealProgress: snap.revealProgress,
  });

  renderGlowStroke(p, wavePoints, WAVE_GLOW);

  p.pop();
}
