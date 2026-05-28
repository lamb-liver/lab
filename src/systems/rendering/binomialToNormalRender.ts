import type p5 from 'p5';
import {
  BINORMAL_VIEW,
  type BinormalMode,
  deriveBinormalData,
  normalPDF,
  percent,
} from '../../curve/modules/binomial-to-normal/geometry';
import type { ParamValues } from '../../curve/types';

export type BinormalSnap = {
  width: number;
  height: number;
  params: ParamValues;
  mode: BinormalMode;
  reveal: number;
  trialSequence: number[];
  trialIndex: number;
  successCount: number;
};

const GOLD = { r: 212, g: 184, b: 122 };
const BLUE = { r: 130, g: 170, b: 220 };

export function renderBinomialToNormalScene(p: p5, snap: BinormalSnap): void {
  const data = deriveBinormalData(snap.params);
  p.background(10, 10, 10);
  const scale = Math.min(snap.width / BINORMAL_VIEW.width, snap.height / BINORMAL_VIEW.height);
  const ox = (snap.width - BINORMAL_VIEW.width * scale) / 2;
  const oy = (snap.height - BINORMAL_VIEW.height * scale) / 2;
  p.push();
  p.translate(ox, oy);
  p.scale(scale);

  if (snap.mode === 'x') drawX(p, data, snap.reveal);
  else if (snap.mode === 'z') drawZ(p, data, snap.reveal);
  else drawSim(p, data, snap);
  p.pop();
}

function drawX(p: p5, data: ReturnType<typeof deriveBinormalData>, reveal: number): void {
  const chart = { x: 80, y: 700, w: 680, h: 360 };
  drawFrame(p, chart, `X ~ B(${data.n}, ${data.p.toFixed(2)})`);
  const maxProb = Math.max(...data.probs) * 1.18;
  const barW = chart.w / (data.n + 1);
  for (let k = 0; k <= data.n; k += 1) {
    const bh = p.map(data.probs[k]!, 0, maxProb, 0, chart.h) * reveal;
    p.noStroke();
    p.fill(GOLD.r, GOLD.g, GOLD.b, Math.abs(k - data.mu) < data.sigma ? 190 : 90);
    p.rect(chart.x + k * barW + 1, chart.y - bh, Math.max(1, barW - 2), bh);
  }
  p.noFill();
  p.stroke(BLUE.r, BLUE.g, BLUE.b, 200);
  p.strokeWeight(2);
  p.beginShape();
  for (let i = 0; i <= 260; i += 1) {
    const xValue = p.map(i, 0, 260, 0, data.n);
    const d = normalPDF(xValue, data.mu, data.sigma);
    const x = p.map(xValue, 0, data.n, chart.x, chart.x + chart.w);
    const y = chart.y - p.map(d, 0, maxProb, 0, chart.h) * reveal;
    p.vertex(x, y);
  }
  p.endShape();
}

function drawZ(p: p5, data: ReturnType<typeof deriveBinormalData>, reveal: number): void {
  const chart = { x: 80, y: 700, w: 680, h: 360 };
  const zMin = -4;
  const zMax = 4;
  const maxDensity = normalPDF(0, 0, 1) * 1.15;
  drawFrame(p, chart, '標準化視圖');
  for (let k = 0; k <= data.n; k += 1) {
    const z = data.sigma > 0 ? (k - data.mu) / data.sigma : 0;
    if (z < zMin || z > zMax) continue;
    const nextZ = data.sigma > 0 ? (k + 1 - data.mu) / data.sigma : z;
    const x1 = p.map(z, zMin, zMax, chart.x, chart.x + chart.w);
    const x2 = p.map(nextZ, zMin, zMax, chart.x, chart.x + chart.w);
    const densityH = data.probs[k]! * data.sigma;
    const bh = p.map(densityH, 0, maxDensity, 0, chart.h) * reveal;
    p.noStroke();
    p.fill(GOLD.r, GOLD.g, GOLD.b, 130);
    p.rect(x1, chart.y - bh, Math.max(1, x2 - x1 - 1), bh);
  }
  p.noFill();
  p.stroke(BLUE.r, BLUE.g, BLUE.b, 220);
  p.strokeWeight(2);
  p.beginShape();
  for (let i = 0; i <= 320; i += 1) {
    const z = p.map(i, 0, 320, zMin, zMax);
    const d = normalPDF(z, 0, 1);
    const x = p.map(z, zMin, zMax, chart.x, chart.x + chart.w);
    const y = chart.y - p.map(d, 0, maxDensity, 0, chart.h) * reveal;
    p.vertex(x, y);
  }
  p.endShape();
}

function drawSim(p: p5, data: ReturnType<typeof deriveBinormalData>, snap: BinormalSnap): void {
  const seqX = 80;
  const seqY = 260;
  const seqW = 680;
  p.fill(18, 18, 18, 180);
  p.stroke(255, 255, 255, 22);
  p.rect(seqX, seqY, seqW, 90, 12);
  const gap = 3;
  const cellW = Math.min(12, (seqW - 40) / data.n - gap);
  for (let i = 0; i < data.n; i += 1) {
    const x = seqX + 18 + i * (cellW + gap);
    if (i < snap.trialIndex) p.fill(snap.trialSequence[i] === 1 ? GOLD.r : 255, snap.trialSequence[i] === 1 ? GOLD.g : 255, snap.trialSequence[i] === 1 ? GOLD.b : 255, snap.trialSequence[i] === 1 ? 190 : 30);
    else p.fill(255, 255, 255, 12);
    p.noStroke();
    p.rect(x, seqY + 44, cellW, 20, 4);
  }
  drawX(p, data, 1);
  const chart = { x: 80, y: 700, w: 680, h: 360 };
  const barW = chart.w / (data.n + 1);
  const x = chart.x + snap.successCount * barW + barW / 2;
  p.stroke(BLUE.r, BLUE.g, BLUE.b, 220);
  p.strokeWeight(2);
  p.line(x, chart.y, x, chart.y - chart.h);
}

function drawFrame(p: p5, chart: { x: number; y: number; w: number; h: number }, _title: string): void {
  p.noFill();
  p.stroke(255, 255, 255, 24);
  p.rect(chart.x, chart.y - chart.h, chart.w, chart.h);
}
