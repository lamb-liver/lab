import type p5 from 'p5';
import type { BeatParams, SuperpositionParams, WaveMode } from '../../explore/wave-superposition/geometry';
import {
  beatEnvelopeY,
  beatWaveY,
  beatXSpan,
  waveA,
  waveB,
  waveSum,
} from '../../explore/wave-superposition/geometry';

const ACCENT: [number, number, number] = [212, 184, 122];
const BLUE: [number, number, number] = [100, 160, 220];
const GREEN: [number, number, number] = [80, 200, 140];
const GUIDE: [number, number, number] = [255, 255, 255];

type Point = [number, number];

export type WaveSuperpositionSnap = {
  mode: WaveMode;
  time: number;
  superposition: SuperpositionParams;
  beat: BeatParams;
};

function marginX(width: number): number {
  return width * (30 / 680);
}

function drawGlowCurve(p: p5, pts: Point[], col: [number, number, number]): void {
  if (pts.length < 2) return;
  p.noFill();

  p.strokeWeight(7);
  p.stroke(col[0], col[1], col[2], 16);
  p.beginShape();
  for (const [x, y] of pts) p.vertex(x, y);
  p.endShape();

  p.strokeWeight(3.5);
  p.stroke(col[0], col[1], col[2], 42);
  p.beginShape();
  for (const [x, y] of pts) p.vertex(x, y);
  p.endShape();

  p.strokeWeight(1.5);
  p.stroke(col[0], col[1], col[2], 230);
  p.beginShape();
  for (const [x, y] of pts) p.vertex(x, y);
  p.endShape();
}

function buildPts(
  p: p5,
  mid: number,
  ampPx: number,
  yFn: (nx: number) => number,
): Point[] {
  const mx = marginX(p.width);
  const pts: Point[] = [];
  const span = p.width - 2 * mx;
  for (let x = mx; x <= p.width - mx; x += 2) {
    const nx = (x - mx) / span;
    pts.push([x, mid - yFn(nx) * ampPx]);
  }
  return pts;
}

function drawPanel(
  p: p5,
  py: number,
  rowH: number,
  label: string,
  col: [number, number, number],
  yFn: (nx: number) => number,
): void {
  const mid = py + rowH / 2;
  const mx = marginX(p.width);

  p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 8);
  p.strokeWeight(0.5);
  p.noFill();
  p.line(mx, mid, p.width - mx, mid);

  p.noStroke();
  p.fill(col[0], col[1], col[2], 150);
  p.textSize(11);
  p.textAlign(p.LEFT, p.TOP);
  p.text(label, 10, py + 6);

  drawGlowCurve(p, buildPts(p, mid, rowH * 0.4, yFn), col);
}

function drawSuperposition(p: p5, snap: WaveSuperpositionSnap): void {
  const { superposition: params, time: t } = snap;
  const rowH = p.height / 3;

  p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 6);
  p.strokeWeight(0.5);
  p.line(0, rowH, p.width, rowH);
  p.line(0, rowH * 2, p.width, rowH * 2);

  drawPanel(p, 0, rowH, '波 A', BLUE, (nx) => waveA(nx, t, params));
  drawPanel(p, rowH, rowH, '波 B', GREEN, (nx) => waveB(nx, t, params));
  drawPanel(p, rowH * 2, rowH, '合成波', ACCENT, (nx) => waveSum(nx, t, params));
}

function drawBeat(p: p5, snap: WaveSuperpositionSnap): void {
  const { beat: params, time: t } = snap;
  const mid = p.height / 2;
  const mx = marginX(p.width);
  const xSpan = beatXSpan(params);

  p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 8);
  p.strokeWeight(0.5);
  p.noFill();
  p.line(mx, mid, p.width - mx, mid);

  const envY = (nx: number) => beatEnvelopeY(nx, t, params, xSpan);
  const beatY = (nx: number) => beatWaveY(nx, t, params, xSpan);

  const N = 400;
  p.strokeWeight(1);
  for (let i = 0; i < N; i++) {
    if (i % 10 < 5) continue;
    const nx = i / N;
    const x = mx + nx * (p.width - 2 * mx);
    const ey = envY(nx) * p.height * 0.42;
    p.stroke(ACCENT[0], ACCENT[1], ACCENT[2], 70);
    p.point(x, mid - ey);
    p.point(x, mid + ey);
  }

  drawGlowCurve(p, buildPts(p, mid, p.height * 0.85, beatY), ACCENT);

  p.noStroke();
  p.fill(ACCENT[0], ACCENT[1], ACCENT[2], 180);
  p.textSize(11);
  p.textAlign(p.LEFT, p.TOP);
  p.text('合成波', 10, 8);
  p.fill(ACCENT[0], ACCENT[1], ACCENT[2], 90);
  p.text('- - 包絡線', 10, 22);
}

export function renderWaveSuperpositionScene(p: p5, snap: WaveSuperpositionSnap): void {
  p.background(10, 10, 10);
  if (snap.mode === 'superposition') {
    drawSuperposition(p, snap);
  } else {
    drawBeat(p, snap);
  }
}

export { canvasHeightForWidth as targetCanvasHeight } from '../../explore/wave-superposition/canvasSize';
