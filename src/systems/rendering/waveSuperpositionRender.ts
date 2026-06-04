import type p5 from 'p5';
import type {
  BeatParams,
  GuideParams,
  SuperpositionParams,
  WaveMode,
} from '../../explore/wave-superposition/geometry';
import {
  beatEnvelopeY,
  beatWaveY,
  beatXSpan,
  getGuideState,
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
  guide: GuideParams;
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

function drawPanelFrame(
  p: p5,
  py: number,
  rowH: number,
  title: string,
  label: string,
): void {
  p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 7);
  p.strokeWeight(0.5);
  p.noFill();
  p.line(0, py + rowH, p.width, py + rowH);

  p.noStroke();
  p.textAlign(p.LEFT, p.TOP);
  p.fill(180);
  p.textSize(11);
  p.textStyle(p.BOLD);
  p.text(title, 10, py + 8);
  p.textStyle(p.NORMAL);
  p.fill(145);
  p.textSize(10);
  p.text(label, 10, py + 24);
}

function buildGuidePts(
  p: p5,
  py: number,
  rowH: number,
  yFn: (nx: number) => number,
  amp = 0.34,
): Point[] {
  return buildPts(p, py + rowH * 0.58, rowH * amp, yFn);
}

function drawGuideDisplacement(
  p: p5,
  py: number,
  rowH: number,
  phase: number,
  label: string,
): void {
  drawPanelFrame(p, py, rowH, '位移疊加', label);
  const t = 0;
  const base = (nx: number) => Math.sin(2 * Math.PI * (nx * 2 - t));
  const shifted = (nx: number) => Math.sin(2 * Math.PI * (nx * 2 - t) + phase * Math.PI);
  const sum = (nx: number) => (base(nx) + shifted(nx)) / 2;

  drawGlowCurve(p, buildGuidePts(p, py, rowH, base, 0.22), BLUE);
  drawGlowCurve(p, buildGuidePts(p, py, rowH, shifted, 0.22), GREEN);
  drawGlowCurve(p, buildGuidePts(p, py, rowH, sum, 0.34), ACCENT);
}

function drawGuideStanding(
  p: p5,
  py: number,
  rowH: number,
  phase: number,
  time: number,
  label: string,
): void {
  drawPanelFrame(p, py, rowH, '駐波節點', label);

  const mid = py + rowH * 0.58;
  const ampPx = rowH * 0.35;
  const kCycles = 2.5;
  const phaseRad = phase * Math.PI;
  const envelope = (nx: number) => Math.cos(2 * Math.PI * kCycles * nx + phaseRad / 2);
  const wave = (nx: number) => envelope(nx) * Math.cos(time * 1.2);

  p.push();
  p.stroke(GUIDE[0], GUIDE[1], GUIDE[2], 20);
  p.strokeWeight(1);
  for (let m = -1; m <= 6; m += 1) {
    const nodeNx = (0.25 + 0.5 * m - phase / 4) / kCycles;
    if (nodeNx < 0 || nodeNx > 1) continue;
    const x = marginX(p.width) + nodeNx * (p.width - 2 * marginX(p.width));
    p.line(x, mid - ampPx * 0.82, x, mid + ampPx * 0.82);
  }
  p.pop();

  drawGlowCurve(p, buildGuidePts(p, py, rowH, (nx) => envelope(nx), 0.27), [160, 160, 160]);
  drawGlowCurve(p, buildGuidePts(p, py, rowH, wave, 0.35), ACCENT);
}

function drawGuideFringes(
  p: p5,
  py: number,
  rowH: number,
  phase: number,
  label: string,
): void {
  drawPanelFrame(p, py, rowH, '雙源條紋', label);

  const mx = marginX(p.width);
  const x0 = mx;
  const y0 = py + rowH * 0.34;
  const w = p.width - 2 * mx;
  const h = rowH * 0.52;
  const cx = x0 + w / 2;
  const cy = y0 + h / 2;
  const s1 = { x: cx - w * 0.18, y: cy };
  const s2 = { x: cx + w * 0.18, y: cy };

  p.push();
  p.noStroke();
  for (let ix = 0; ix < 92; ix += 1) {
    for (let iy = 0; iy < 34; iy += 1) {
      const x = x0 + (ix / 91) * w;
      const y = y0 + (iy / 33) * h;
      const d1 = Math.hypot(x - s1.x, y - s1.y);
      const d2 = Math.hypot(x - s2.x, y - s2.y);
      const intensity = 0.5 + 0.5 * Math.cos((d1 - d2) * 0.12 + phase * Math.PI);
      if (intensity < 0.62) continue;
      p.fill(ACCENT[0], ACCENT[1], ACCENT[2], 12 + intensity * 70);
      p.rect(x, y, w / 88, h / 30);
    }
  }

  p.fill(GUIDE[0], GUIDE[1], GUIDE[2], 55);
  p.circle(s1.x, s1.y, 5);
  p.circle(s2.x, s2.y, 5);
  p.pop();
}

function drawGuide(p: p5, snap: WaveSuperpositionSnap): void {
  const { phase } = snap.guide;
  const state = getGuideState(snap.guide);
  const rowH = p.height / 3;

  drawGuideDisplacement(p, 0, rowH, phase, state.displacementLabel);
  drawGuideStanding(p, rowH, rowH, phase, snap.time, state.standingLabel);
  drawGuideFringes(p, rowH * 2, rowH, phase, state.fringeLabel);
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
  if (snap.mode === 'guide') {
    drawGuide(p, snap);
  } else if (snap.mode === 'superposition') {
    drawSuperposition(p, snap);
  } else {
    drawBeat(p, snap);
  }
}

export { canvasHeightForWidth as targetCanvasHeight } from '../../explore/wave-superposition/canvasSize';
