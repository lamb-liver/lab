import type p5 from 'p5';
import { BUFFON_VIEW, deriveBuffonData, estimatePi, getFieldRect, percent } from '../../curve/modules/buffon-needle/geometry';
import type { ParamValues } from '../../curve/types';

type Needle = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  cx: number;
  cy: number;
  hit: boolean;
};

export type BuffonSnap = {
  width: number;
  height: number;
  params: ParamValues;
  needles: Needle[];
  estimateHistory: Array<number | null>;
  totalThrows: number;
  hitCount: number;
};

const GOLD = { r: 212, g: 184, b: 122 };
const BLUE = { r: 130, g: 170, b: 220 };
const RED = { r: 220, g: 110, b: 100 };

export function renderBuffonNeedleScene(p: p5, snap: BuffonSnap): void {
  const data = deriveBuffonData(snap.params);
  const estimate = estimatePi(data.l, data.d, snap.totalThrows, snap.hitCount);
  p.background(10, 10, 10);
  const scale = Math.min(snap.width / BUFFON_VIEW.width, snap.height / BUFFON_VIEW.height);
  const ox = (snap.width - BUFFON_VIEW.width * scale) / 2;
  const oy = (snap.height - BUFFON_VIEW.height * scale) / 2;
  p.push();
  p.translate(ox, oy);
  p.scale(scale);

  drawHeader(p);
  drawField(p, data, snap.needles);
  drawEstimateChart(p, snap.estimateHistory);
  drawStats(p, data, snap.totalThrows, snap.hitCount, estimate);
  drawFormula(p);

  p.pop();
}

function drawHeader(p: p5): void {
  p.noStroke();
  p.fill(GOLD.r, GOLD.g, GOLD.b, 220);
  p.textSize(18);
  p.text('BUFFON NEEDLE EXPERIMENT', 30, 300);
}

function drawField(p: p5, data: ReturnType<typeof deriveBuffonData>, needles: Needle[]): void {
  const field = getFieldRect();
  p.fill(18, 18, 18, 190);
  p.stroke(255, 255, 255, 22);
  p.rect(field.x - 18, field.y - 18, field.w + 36, field.h + 36, 12);
  p.noFill();
  p.stroke(255, 255, 255, 28);
  p.rect(field.x, field.y, field.w, field.h);
  const usablePeriods = Math.floor(field.h / data.d);
  for (let i = 0; i <= usablePeriods; i += 1) {
    const y = field.y + i * data.d;
    p.stroke(255, 255, 255, 38);
    p.strokeWeight(1);
    p.line(field.x, y, field.x + field.w, y);
  }
  for (let i = 0; i < needles.length; i += 1) {
    const needle = needles[i]!;
    const age = p.map(i, 0, Math.max(1, needles.length - 1), 30, 210);
    if (needle.hit) {
      p.stroke(RED.r, RED.g, RED.b, age);
      p.strokeWeight(2.2);
    } else {
      p.stroke(GOLD.r, GOLD.g, GOLD.b, age * 0.75);
      p.strokeWeight(1.4);
    }
    p.line(needle.x1, needle.y1, needle.x2, needle.y2);
  }
}

function drawEstimateChart(p: p5, history: Array<number | null>): void {
  const chart = { x: 520, y: 720, w: 280, h: 250 };
  p.noFill();
  p.stroke(255, 255, 255, 26);
  p.rect(chart.x, chart.y - chart.h, chart.w, chart.h);
  p.stroke(BLUE.r, BLUE.g, BLUE.b, 110);
  const piY = p.map(Math.PI, 2, 4.4, chart.y, chart.y - chart.h);
  p.line(chart.x, piY, chart.x + chart.w, piY);
  if (history.length < 2) return;
  p.noFill();
  p.stroke(GOLD.r, GOLD.g, GOLD.b, 220);
  p.strokeWeight(1.5);
  p.beginShape();
  for (let i = 0; i < history.length; i += 1) {
    const v = history[i];
    if (v === null || !Number.isFinite(v)) continue;
    const clipped = Math.max(2, Math.min(4.4, v));
    const x = p.map(i, 0, Math.max(1, 520 - 1), chart.x, chart.x + chart.w);
    const y = p.map(clipped, 2, 4.4, chart.y, chart.y - chart.h);
    p.vertex(x, y);
  }
  p.endShape();
}

function drawStats(
  p: p5,
  data: ReturnType<typeof deriveBuffonData>,
  totalThrows: number,
  hitCount: number,
  estimate: number,
): void {
  const x = 820;
  const y = 300;
  p.fill(18, 18, 18, 190);
  p.stroke(255, 255, 255, 22);
  p.rect(x, y, 470, 260, 12);
  p.noStroke();
  p.fill(220, 220, 220, 180);
  p.textSize(12);
  p.text(`N=${totalThrows}`, x + 14, y + 36);
  p.text(`n=${hitCount}`, x + 14, y + 58);
  p.text(`P(hit)=${percent(totalThrows > 0 ? hitCount / totalThrows : 0)}`, x + 14, y + 82);
  p.text(`theory=${percent(data.theoreticalP)}`, x + 14, y + 104);
  p.fill(BLUE.r, BLUE.g, BLUE.b, 220);
  p.text(`pi=${Math.PI.toFixed(5)}`, x + 14, y + 134);
  p.fill(GOLD.r, GOLD.g, GOLD.b, 220);
  p.text(`est=${estimate > 0 ? estimate.toFixed(5) : '—'}`, x + 14, y + 156);
}

function drawFormula(p: p5): void {
  p.fill(18, 18, 18, 190);
  p.stroke(255, 255, 255, 22);
  p.rect(30, 760, 650, 105, 12);
  p.noStroke();
  p.fill(210, 210, 210, 180);
  p.textSize(12);
  p.text('P(hit)=2l/(pi d)', 46, 790);
  p.text('pi ~ 2lN/(d*n)', 46, 816);
}
