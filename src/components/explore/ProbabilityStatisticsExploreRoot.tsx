import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type p5 from 'p5';
import { isP5RendererReady } from '../curve/p5RendererReady';
import '../../styles/components/explore/probability-statistics-explore.css';

type Mode = 'conditional' | 'clt' | 'monty';
type MontyPhase = 'choose' | 'revealed' | 'result';

type ConditionalState = {
  pA: number;
  pB: number;
  pAB: number;
};

type CltParticle = {
  bin: number;
  stackIndex: number;
  x: number;
  y: number;
};

type CltState = {
  n: number;
  speed: number;
  running: boolean;
  accumulator: number;
  counts: number[];
  particles: CltParticle[];
  total: number;
  maxParticles: number;
};

type MontyState = {
  carDoor: number;
  playerChoice: number | null;
  openedDoor: number | null;
  finalChoice: number | null;
  phase: MontyPhase;
  result: boolean | null;
  trials: number;
  stayWins: number;
  switchWins: number;
  status: string;
  invalidDoor: number | null;
  invalidUntil: number;
};

type Rect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

const GOLD = [212, 184, 122] as const;
const RED = [231, 111, 81] as const;
const WHITE = [255, 255, 255] as const;

const DEFAULT_CONDITIONAL: ConditionalState = {
  pA: 0.55,
  pB: 0.46,
  pAB: 0.28,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function safeDiv(a: number, b: number) {
  return Math.abs(b) < 1e-9 ? 0 : a / b;
}

function fmtPct(value: number) {
  return `${Math.round(value * 1000) / 10}%`;
}

function fmtNum(value: number, digits = 2) {
  if (value === 0 || Object.is(value, -0)) return '0';
  return value.toFixed(digits).replace(/\.?0+$/, '');
}

function normalizeConditional(input: ConditionalState): ConditionalState {
  const pA = clamp(input.pA, 0.05, 0.95);
  const pB = clamp(input.pB, 0.05, 0.95);
  const minAB = Math.max(0, pA + pB - 1);
  const maxAB = Math.min(pA, pB);

  return {
    pA,
    pB,
    pAB: clamp(input.pAB, minAB, maxAB),
  };
}

function abRange(input: ConditionalState) {
  const pA = clamp(input.pA, 0.05, 0.95);
  const pB = clamp(input.pB, 0.05, 0.95);

  return {
    minAB: Math.max(0, pA + pB - 1),
    maxAB: Math.min(pA, pB),
  };
}

function createCltState(n = 12, running = true, speed = 8): CltState {
  return {
    n,
    speed,
    running,
    accumulator: 0,
    counts: Array.from({ length: n + 1 }, () => 0),
    particles: [],
    total: 0,
    maxParticles: 2200,
  };
}

function makeMontyState(overrides: Partial<MontyState> = {}): MontyState {
  return {
    carDoor: Math.floor(Math.random() * 3),
    playerChoice: null,
    openedDoor: null,
    finalChoice: null,
    phase: 'choose',
    result: null,
    trials: 0,
    stayWins: 0,
    switchWins: 0,
    status: '請先選一扇門',
    invalidDoor: null,
    invalidUntil: 0,
    ...overrides,
  };
}

function weightedMean(counts: number[]) {
  let total = 0;
  let sum = 0;

  for (let i = 0; i < counts.length; i += 1) {
    total += counts[i];
    sum += counts[i] * i;
  }

  return total === 0 ? 0 : sum / total;
}

function weightedSD(counts: number[], mean: number) {
  let total = 0;
  let sum = 0;

  for (let i = 0; i < counts.length; i += 1) {
    total += counts[i];
    sum += counts[i] * (i - mean) ** 2;
  }

  return total === 0 ? 0 : Math.sqrt(sum / total);
}

function normalPDF(x: number, mean: number, sd: number) {
  if (sd <= 0) return 0;
  const z = (x - mean) / sd;
  return Math.exp(-0.5 * z * z) / (sd * Math.sqrt(Math.PI * 2));
}

function measureProbabilityCanvas(host: HTMLElement) {
  const width = Math.max(320, Math.floor(host.clientWidth || 640));
  const height =
    width < 520
      ? Math.round(clamp(width * 1.2, 400, 460))
      : Math.round(clamp(width * 0.66, 380, 560));
  return { width, height };
}

function stageRect(p: p5): Rect {
  return {
    x: 22,
    y: 22,
    w: Math.max(260, p.width - 44),
    h: Math.max(300, p.height - 44),
  };
}

function drawFrame(p: p5, title: string, subtitle: string) {
  const stage = stageRect(p);

  p.background(10, 10, 10);
  p.noFill();
  p.stroke(...WHITE, 18);
  p.strokeWeight(1);
  p.rect(stage.x, stage.y, stage.w, stage.h, 14);

  p.noStroke();
  p.fill(...GOLD);
  p.textStyle(p.BOLD);
  p.textSize(14);
  p.textAlign(p.LEFT, p.BASELINE);
  p.text(title, stage.x + 22, stage.y + 32);

  p.fill(150);
  p.textStyle(p.NORMAL);
  p.textSize(12);
  p.text(subtitle, stage.x + 22, stage.y + 54);

  return stage;
}

function drawGlowRect(
  p: p5,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number,
  alphaCore = 120,
) {
  if (w <= 0 || h <= 0) return;

  p.noStroke();
  p.fill(...GOLD, 16);
  p.rect(x - 4, y - 4, w + 8, h + 8, radius + 4);
  p.fill(...GOLD, 40);
  p.rect(x - 1.5, y - 1.5, w + 3, h + 3, radius + 2);
  p.fill(...GOLD, alphaCore);
  p.rect(x, y, w, h, radius);
}

function drawConditionalScene(p: p5, conditional: ConditionalState) {
  const stage = drawFrame(
    p,
    '條件機率',
    '已知 B 發生後，只看 B 這一塊樣本空間',
  );
  const s = normalizeConditional(conditional);
  const pAgivenB = safeDiv(s.pAB, s.pB);
  const compact = p.width < 520;
  const pad = p.width >= 640 ? 52 : 26;
  const mainH = compact ? clamp(stage.h * 0.24, 90, 122) : clamp(stage.h * 0.32, 126, 190);
  const condH = compact ? clamp(stage.h * 0.13, 48, 64) : clamp(stage.h * 0.15, 58, 82);
  const gap = compact ? clamp(stage.h * 0.07, 22, 34) : clamp(stage.h * 0.12, 34, 62);
  const bayesGap = compact ? 34 : 52;
  const main = {
    x: stage.x + pad,
    y: stage.y + 82,
    w: stage.w - pad * 2,
    h: mainH,
  };
  const conditioned = {
    x: main.x,
    y: main.y + main.h + gap,
    w: main.w,
    h: condH,
  };

  drawSampleSpace(p, main, s);
  drawConditionedSpace(p, conditioned, pAgivenB);
  drawBayesBalance(
    p,
    conditioned.x,
    conditioned.y + conditioned.h + bayesGap,
    conditioned.w,
    s,
    compact,
  );

  p.noStroke();
  p.fill(160);
  p.textSize(12);
  p.textAlign(p.LEFT, p.BASELINE);
  p.text('全集 Ω', main.x, main.y - 14);
  p.text('縮小後的樣本空間 B', conditioned.x, conditioned.y - 14);
}

function drawSampleSpace(p: p5, r: Rect, s: ConditionalState) {
  const bW = r.w * s.pB;
  const abW = r.w * s.pAB;
  const aOutsideW = r.w * Math.max(0, s.pA - s.pAB);

  p.noStroke();
  p.fill(...WHITE, 6);
  p.rect(r.x, r.y, r.w, r.h, 14);

  p.stroke(...WHITE, 32);
  p.noFill();
  p.rect(r.x, r.y, r.w, r.h, 14);

  p.noStroke();
  p.fill(...WHITE, 16);
  p.rect(r.x, r.y, bW, r.h, 14, 0, 0, 14);

  p.stroke(...WHITE, 42);
  p.line(r.x + bW, r.y, r.x + bW, r.y + r.h);

  drawGlowRect(p, r.x, r.y, abW, r.h, 14, 115);

  if (aOutsideW > 1) {
    p.noStroke();
    p.fill(...GOLD, 30);
    p.rect(r.x + bW, r.y, aOutsideW, r.h, 0, 14, 14, 0);
  }

  p.noStroke();
  p.textStyle(p.BOLD);
  p.textSize(12);
  p.textAlign(p.CENTER, p.CENTER);

  if (abW > 46) {
    p.fill(...GOLD, 230);
    p.text('A∩B', r.x + abW / 2, r.y + r.h / 2);
  }

  if (bW - abW > 54) {
    p.fill(210);
    p.text('B', r.x + abW + (bW - abW) / 2, r.y + r.h / 2);
  }

  if (aOutsideW > 54) {
    p.fill(...GOLD, 95);
    p.text('A', r.x + bW + aOutsideW / 2, r.y + r.h / 2);
  }
}

function drawConditionedSpace(p: p5, r: Rect, ratio: number) {
  const wA = r.w * ratio;

  p.noStroke();
  p.fill(...WHITE, 7);
  p.rect(r.x, r.y, r.w, r.h, 12);

  p.stroke(...WHITE, 28);
  p.noFill();
  p.rect(r.x, r.y, r.w, r.h, 12);

  drawGlowRect(p, r.x, r.y, wA, r.h, 12, 130);

  p.stroke(...WHITE, 38);
  p.line(r.x + wA, r.y, r.x + wA, r.y + r.h);

  p.noStroke();
  p.textStyle(p.BOLD);
  p.textSize(13);

  if (wA >= 70) {
    p.fill(...GOLD);
    p.textAlign(p.CENTER, p.CENTER);
    p.text('P(A|B)', r.x + wA / 2, r.y + r.h / 2);
  } else if (wA >= 2) {
    p.fill(...GOLD);
    p.textAlign(p.LEFT, p.CENTER);
    p.text('P(A|B)', Math.min(r.x + wA + 10, r.x + r.w - 58), r.y + r.h / 2);
  }

  p.fill(165);
  p.textStyle(p.NORMAL);
  p.textSize(12);
  p.textAlign(p.LEFT, p.BASELINE);
  p.text('B 被視為新的 100%', r.x, r.y + r.h + 22);
}

function drawBayesBalance(
  p: p5,
  x: number,
  y: number,
  w: number,
  s: ConditionalState,
  compact = false,
) {
  const p1 = safeDiv(s.pAB, s.pA) * s.pA;
  const p2 = safeDiv(s.pAB, s.pB) * s.pB;
  const maxV = Math.max(0.01, s.pAB, p1, p2);

  p.noStroke();
  p.fill(150);
  p.textStyle(p.NORMAL);
  p.textSize(11);
  p.textAlign(p.LEFT, p.BASELINE);
  p.text(compact ? '同一個交集 A∩B' : '兩種條件機率最後都回到同一個交集 A∩B', x, y - 12);

  drawBayesBar(p, x, y + 4, w, `P(B|A)·P(A) = ${fmtPct(p1)}`, p1 / maxV);
  drawBayesBar(p, x, y + 30, w, `P(A|B)·P(B) = ${fmtPct(p2)}`, p2 / maxV);
}

function drawBayesBar(p: p5, x: number, y: number, w: number, label: string, ratio: number) {
  const labelW = Math.min(150, w * 0.46);
  const barX = x + labelW;
  const barW = Math.max(56, w - labelW);

  p.noStroke();
  p.fill(155);
  p.textSize(11);
  p.textAlign(p.LEFT, p.CENTER);
  p.text(label, x, y + 8);

  p.fill(...WHITE, 8);
  p.rect(barX, y, barW, 16, 8);

  p.fill(...GOLD, 105);
  p.rect(barX, y, barW * clamp(ratio, 0, 1), 16, 8);
}

function drawCltScene(p: p5, clt: CltState) {
  const stage = drawFrame(
    p,
    '中央極限定理',
    '樣本一次一次落下，累積成分佈形狀',
  );
  const plot = {
    x: stage.x + (p.width >= 640 ? 48 : 24),
    y: stage.y + 82,
    w: stage.w - (p.width >= 640 ? 96 : 48),
    h: stage.h - 146,
  };

  drawCltPlot(p, plot, clt);
  drawCltCaption(p, plot, clt);

  if (clt.total >= clt.maxParticles) {
    drawStageBanner(p, plot, '已達粒子上限，可按「清除」重新觀察');
  } else if (!clt.running && clt.total > 0) {
    drawStageBanner(p, plot, '已暫停，可按右側「繼續」恢復生成');
  }
}

function drawCltPlot(p: p5, plot: Rect, clt: CltState) {
  const bins = clt.n + 1;
  const binW = plot.w / bins;
  const baseY = plot.y + plot.h - 28;
  const maxCount = Math.max(1, ...clt.counts);
  const ampMax = plot.h - 92;
  const radius = clamp(Math.min((ampMax / maxCount) * 0.45, binW * 0.28), 1.15, 4.8);

  p.noStroke();
  p.fill(...WHITE, 5);
  p.rect(plot.x, plot.y, plot.w, plot.h, 14);

  p.stroke(...WHITE, 16);
  p.line(plot.x, baseY, plot.x + plot.w, baseY);

  for (let i = 0; i <= bins; i += 1) {
    const bx = plot.x + i * binW;
    p.stroke(...WHITE, i === 0 || i === bins ? 20 : 8);
    p.line(bx, baseY, bx, baseY + 6);
  }

  p.noStroke();
  for (let i = 0; i < clt.counts.length; i += 1) {
    const h = (clt.counts[i] / maxCount) * ampMax;
    const x = plot.x + i * binW + binW * 0.18;
    const w = Math.max(2, binW * 0.64);

    p.fill(...GOLD, 20);
    p.rect(x, baseY - h, w, h, 6, 6, 0, 0);
  }

  if (clt.total > 200 && clt.n >= 8) {
    drawNormalGuide(p, plot, baseY, binW, ampMax, clt.n);
  }

  p.noStroke();
  for (const particle of clt.particles) {
    const tx = plot.x + (particle.bin + 0.5) * binW;
    const ty = baseY - ((particle.stackIndex + 0.5) / maxCount) * ampMax;

    if (clt.running) {
      particle.x += (tx - particle.x) * 0.13;
      particle.y += (ty - particle.y) * 0.16;
    }

    p.fill(...GOLD, 178);
    p.circle(particle.x, particle.y, radius * 2);
  }

  p.fill(155);
  p.textSize(11);
  p.textStyle(p.NORMAL);
  p.textAlign(p.CENTER, p.BASELINE);
  p.text('0', plot.x + binW * 0.5, baseY + 23);
  p.text('n/2', plot.x + binW * (clt.n / 2 + 0.5), baseY + 23);
  p.text('n', plot.x + binW * (clt.n + 0.5), baseY + 23);

  p.fill(130);
  p.textAlign(p.LEFT, p.BASELINE);
  p.text('成功次數 k', plot.x, baseY + 46);
}

function drawNormalGuide(
  p: p5,
  plot: Rect,
  baseY: number,
  binW: number,
  ampMax: number,
  n: number,
) {
  const mean = n / 2;
  const sd = Math.sqrt(n * 0.25);
  const maxDensity = normalPDF(mean, mean, sd);

  p.noFill();
  p.stroke(...GOLD, 48);
  p.strokeWeight(1.4);
  p.beginShape();
  for (let t = 0; t <= n; t += 0.12) {
    const d = normalPDF(t, mean, sd);
    const x = plot.x + (t + 0.5) * binW;
    const y = baseY - (d / maxDensity) * ampMax;
    p.vertex(x, y);
  }
  p.endShape();
  p.strokeWeight(1);
}

function drawCltCaption(p: p5, plot: Rect, clt: CltState) {
  const msg =
    clt.total >= clt.maxParticles
      ? '已達粒子上限'
      : clt.running
        ? '粒子持續生成中'
        : clt.total > 0
          ? '已暫停'
          : '等待生成';

  p.noStroke();
  p.fill(155);
  p.textStyle(p.NORMAL);
  p.textSize(12);
  p.textAlign(p.LEFT, p.BASELINE);
  p.text(msg, plot.x, plot.y + plot.h + 58);
}

function drawStageBanner(p: p5, plot: Rect, label: string) {
  const bw = Math.min(290, plot.w * 0.76);
  const bh = 42;
  const bx = plot.x + (plot.w - bw) / 2;
  const by = plot.y + 20;

  p.noStroke();
  p.fill(10, 10, 10, 210);
  p.rect(bx, by, bw, bh, 12);

  p.stroke(...GOLD, 70);
  p.noFill();
  p.rect(bx, by, bw, bh, 12);

  p.noStroke();
  p.fill(...GOLD);
  p.textStyle(p.BOLD);
  p.textSize(12);
  p.textAlign(p.CENTER, p.CENTER);
  p.text(label, bx + bw / 2, by + bh / 2);
}

function updateClt(p: p5, clt: CltState) {
  if (!clt.running) return false;
  if (clt.total >= clt.maxParticles) {
    clt.running = false;
    return true;
  }

  const rawDt = Number.isFinite(p.deltaTime) ? p.deltaTime : 16.67;
  const dt = clamp(rawDt, 1, 33) / 1000;
  const rate = clt.speed * 7;
  let changed = false;

  clt.accumulator += rate * dt;

  while (clt.accumulator >= 1 && clt.total < clt.maxParticles) {
    generateCltParticle(p, clt);
    clt.accumulator -= 1;
    changed = true;
  }

  return changed;
}

function generateCltParticle(p: p5, clt: CltState) {
  let bin = 0;
  for (let i = 0; i < clt.n; i += 1) {
    if (p.random() < 0.5) bin += 1;
  }

  const stackIndex = clt.counts[bin];
  const stage = stageRect(p);

  clt.counts[bin] += 1;
  clt.total += 1;
  clt.particles.push({
    bin,
    stackIndex,
    x: stage.x + stage.w / 2 + p.random(-90, 90),
    y: stage.y + 54 + p.random(-16, 16),
  });
}

function montyDoorArea(p: p5) {
  const stage = stageRect(p);
  const availableW = stage.w - 60;
  const gap = clamp(availableW * 0.07, 18, 42);
  const doorW = clamp((availableW - gap * 2) / 3, 70, 126);
  const doorH = clamp(stage.h * 0.35, 132, 194);
  const totalW = doorW * 3 + gap * 2;

  return {
    x: stage.x + (stage.w - totalW) / 2,
    y: stage.y + clamp(stage.h * 0.23, 98, 136),
    w: totalW,
    h: doorH,
    doorW,
    doorH,
    gap,
  };
}

function montyDoorRects(p: p5) {
  const area = montyDoorArea(p);
  return [0, 1, 2].map((index) => ({
    index,
    x: area.x + index * (area.doorW + area.gap),
    y: area.y,
    w: area.doorW,
    h: area.doorH,
  }));
}

function drawMontyScene(p: p5, monty: MontyState) {
  const stage = drawFrame(
    p,
    '蒙提霍爾模擬',
    '主持人打開羊門後，剩下那扇門承接了資訊',
  );
  const doorArea = montyDoorArea(p);

  for (const rect of montyDoorRects(p)) {
    drawDoor(p, rect, monty);
  }

  p.noStroke();
  p.fill(155);
  p.textStyle(p.NORMAL);
  p.textSize(13);
  p.textAlign(p.CENTER, p.BASELINE);
  p.text(monty.status, stage.x + stage.w / 2, doorArea.y + doorArea.h + 38);

  const rateH = 74;
  const rateY = Math.min(doorArea.y + doorArea.h + 76, stage.y + stage.h - rateH - 16);
  drawMontyRateBars(
    p,
    stage.x + Math.max(28, stage.w * 0.1),
    rateY,
    stage.w - Math.max(56, stage.w * 0.2),
    rateH,
    monty,
  );
}

function drawDoor(p: p5, rect: Rect & { index: number }, monty: MontyState) {
  const selected = monty.playerChoice === rect.index;
  const opened = monty.openedDoor === rect.index;
  const final = monty.finalChoice === rect.index;
  const revealAll = monty.phase === 'result';
  const hasCar = monty.carDoor === rect.index;
  const now = p.millis();
  const invalidFlash = monty.invalidDoor === rect.index && now < monty.invalidUntil;
  const labelY = rect.y + Math.min(34, rect.h * 0.22);
  const pulse = invalidFlash ? 0.5 + Math.sin(now * 0.035) * 0.5 : 0;

  drawDoorProbabilityHint(p, rect.x, rect.y - 34, rect.w, rect.index, monty);

  p.noStroke();
  p.fill(...WHITE, opened || revealAll ? 10 : 7);
  p.rect(rect.x, rect.y, rect.w, rect.h, 14);

  p.stroke(
    ...(invalidFlash ? RED : GOLD),
    invalidFlash ? 170 + pulse * 60 : selected || final ? 170 : 34,
  );
  p.strokeWeight(selected || final || invalidFlash ? 2 : 1);
  p.noFill();
  p.rect(rect.x, rect.y, rect.w, rect.h, 14);
  p.strokeWeight(1);

  p.stroke(...WHITE, opened || revealAll ? 16 : 22);
  p.rect(rect.x + 14, rect.y + 18, rect.w - 28, rect.h - 36, 10);

  p.noStroke();
  p.fill(selected ? GOLD[0] : 175, selected ? GOLD[1] : 175, selected ? GOLD[2] : 175);
  p.textStyle(p.BOLD);
  p.textSize(16);
  p.textAlign(p.CENTER, p.BASELINE);
  p.text(`${rect.index + 1}`, rect.x + rect.w / 2, labelY);

  if (opened || revealAll) {
    if (hasCar) p.fill(...GOLD);
    else p.fill(165);
    p.textSize(30);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(hasCar ? '車' : '羊', rect.x + rect.w / 2, rect.y + rect.h / 2 + 10);
  } else {
    p.fill(...WHITE, 22);
    p.circle(rect.x + rect.w - 28, rect.y + rect.h / 2, 8);
  }

  if (final && monty.phase === 'result') {
    if (monty.result) p.fill(...GOLD);
    else p.fill(150);
    p.textSize(11);
    p.textAlign(p.CENTER, p.BASELINE);
    p.text(monty.result ? 'WIN' : 'LOSE', rect.x + rect.w / 2, rect.y + rect.h + 22);
  }
}

function drawDoorProbabilityHint(
  p: p5,
  x: number,
  y: number,
  w: number,
  index: number,
  monty: MontyState,
) {
  if (monty.phase === 'choose') return;

  let label = '';
  let active = false;

  if (monty.openedDoor === index) {
    label = '0';
  } else if (monty.playerChoice === index) {
    label = '1/3';
  } else {
    label = '2/3';
    active = true;
  }

  p.noStroke();
  if (active) p.fill(...GOLD, 34);
  else p.fill(...WHITE, 9);
  p.rect(x + w * 0.18, y, w * 0.64, 24, 12);

  if (active) p.fill(...GOLD);
  else p.fill(165);
  p.textStyle(p.BOLD);
  p.textSize(12);
  p.textAlign(p.CENTER, p.CENTER);
  p.text(label, x + w / 2, y + 12);
}

function drawMontyRateBars(p: p5, x: number, y: number, w: number, h: number, monty: MontyState) {
  const trials = Math.max(1, monty.trials);
  const barH = clamp(h * 0.3, 16, 24);
  const gap = Math.max(18, h - barH * 2);

  drawRateBar(p, x, y, w, barH, '不換門', monty.stayWins / trials);
  drawRateBar(p, x, y + barH + gap, w, barH, '換門', monty.switchWins / trials);
}

function drawRateBar(p: p5, x: number, y: number, w: number, h: number, label: string, rate: number) {
  p.noStroke();
  p.fill(...WHITE, 8);
  p.rect(x, y, w, h, 8);

  p.fill(...GOLD, 105);
  p.rect(x, y, w * rate, h, 8);

  p.fill(205);
  p.textStyle(p.NORMAL);
  p.textSize(12);
  p.textAlign(p.LEFT, p.CENTER);
  p.text(label, x, y - 12);

  p.textAlign(p.RIGHT, p.CENTER);
  p.text(fmtPct(rate), x + w, y - 12);
}

function hitRect(x: number, y: number, rect: Rect) {
  return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
}

function pickHostDoor(carDoor: number, playerChoice: number) {
  const candidates = [0, 1, 2].filter((door) => door !== carDoor && door !== playerChoice);
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function recordMontyTrial(monty: MontyState, carDoor: number, firstChoice: number): MontyState {
  return {
    ...monty,
    trials: monty.trials + 1,
    stayWins: monty.stayWins + (firstChoice === carDoor ? 1 : 0),
    switchWins: monty.switchWins + (firstChoice === carDoor ? 0 : 1),
  };
}

type ModeButtonProps = {
  active: boolean;
  children: string;
  onClick: () => void;
};

function ModeButton({ active, children, onClick }: ModeButtonProps) {
  return (
    <button
      type="button"
      className={`probability-statistics-explore__mode${active ? ' is-active' : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

type RangeFieldProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (value: number) => void;
};

function RangeField({ label, value, min, max, step, display, onChange }: RangeFieldProps) {
  return (
    <label className="probability-statistics-explore__field">
      <span className="probability-statistics-explore__field-label">
        {label}
        <span className="probability-statistics-explore__val">{display}</span>
      </span>
      <input
        className="range-control"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
      />
    </label>
  );
}

export default function ProbabilityStatisticsExploreRoot() {
  const [mode, setMode] = useState<Mode>('conditional');
  const [conditional, setConditional] = useState(DEFAULT_CONDITIONAL);
  const [cltView, setCltView] = useState(() => createCltState());
  const [monty, setMonty] = useState(() => makeMontyState());
  const [montyNotice, setMontyNotice] = useState('');

  const modeRef = useRef(mode);
  const conditionalRef = useRef(conditional);
  const cltRef = useRef(createCltState());
  const montyRef = useRef(monty);
  const lastCltSyncRef = useRef(0);
  const handleMontyDoorClickRef = useRef<(index: number, now: number) => void>(() => {});

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    conditionalRef.current = conditional;
  }, [conditional]);

  useEffect(() => {
    montyRef.current = monty;
  }, [monty]);

  const syncCltView = useCallback(() => {
    setCltView({ ...cltRef.current, counts: [...cltRef.current.counts] });
  }, []);

  const resetClt = useCallback(
    (nextN = cltRef.current.n) => {
      const current = cltRef.current;
      cltRef.current = createCltState(Math.round(nextN), current.running, current.speed);
      syncCltView();
    },
    [syncCltView],
  );

  const setCltSpeed = useCallback(
    (speed: number) => {
      cltRef.current.speed = Math.round(speed);
      syncCltView();
    },
    [syncCltView],
  );

  const toggleClt = useCallback(() => {
    cltRef.current.running = !cltRef.current.running;
    syncCltView();
  }, [syncCltView]);

  const chooseMontyStrategy = useCallback((shouldSwitch: boolean) => {
    setMonty((current) => {
      if (current.phase !== 'revealed' || current.playerChoice === null || current.openedDoor === null) {
        return current;
      }

      const closed = [0, 1, 2].filter(
        (door) => door !== current.playerChoice && door !== current.openedDoor,
      );
      const finalChoice = shouldSwitch ? closed[0] : current.playerChoice;
      const result = finalChoice === current.carDoor;
      const action = shouldSwitch ? '換門' : '不換門';
      const recorded = recordMontyTrial(current, current.carDoor, current.playerChoice);

      return {
        ...recorded,
        finalChoice,
        result,
        phase: 'result',
        status: `${action}：${result ? '猜中車' : '猜到羊'}。`,
        invalidDoor: null,
      };
    });
    setMontyNotice('');
  }, []);

  const startMontyRound = useCallback(() => {
    setMonty((current) =>
      makeMontyState({
        trials: current.trials,
        stayWins: current.stayWins,
        switchWins: current.switchWins,
      }),
    );
    setMontyNotice('');
  }, []);

  const simulateMontyBatch = useCallback((count: number) => {
    setMonty((current) => {
      let next = current;

      for (let i = 0; i < count; i += 1) {
        const carDoor = Math.floor(Math.random() * 3);
        const firstChoice = Math.floor(Math.random() * 3);
        next = recordMontyTrial(next, carDoor, firstChoice);
      }

      return makeMontyState({
        trials: next.trials,
        stayWins: next.stayWins,
        switchWins: next.switchWins,
      });
    });
    setMontyNotice('');
  }, []);

  const resetMontyStats = useCallback(() => {
    setMonty(makeMontyState());
    setMontyNotice('');
  }, []);

  useEffect(() => {
    handleMontyDoorClickRef.current = (index: number, now: number) => {
      const current = montyRef.current;

      if (current.phase === 'choose') {
        const openedDoor = pickHostDoor(current.carDoor, index);
        setMonty({
          ...current,
          playerChoice: index,
          openedDoor,
          phase: 'revealed',
          status: `主持人打開 ${openedDoor + 1} 號羊門：點原門是不換，點另一扇是換門`,
          invalidDoor: null,
        });
        setMontyNotice('');
        return;
      }

      if (current.phase !== 'revealed') return;

      if (index === current.openedDoor) {
        setMonty({
          ...current,
          status: '已打開的羊門不能再選，請點原門或另一扇未打開的門。',
          invalidDoor: index,
          invalidUntil: now + 850,
        });
        setMontyNotice('已打開的門不會觸發換門決策。');
        return;
      }

      chooseMontyStrategy(index !== current.playerChoice);
    };
  }, [chooseMontyStrategy]);

  const draw = useCallback((p: p5) => {
    if (modeRef.current === 'clt') {
      const wasRunning = cltRef.current.running;
      const changed = updateClt(p, cltRef.current);
      const now = p.millis();
      const reachedLimit = cltRef.current.total >= cltRef.current.maxParticles;
      const runningStopped = wasRunning && !cltRef.current.running;

      if (changed && (reachedLimit || runningStopped || now - lastCltSyncRef.current > 250)) {
        lastCltSyncRef.current = now;
        syncCltView();
      }
    }

    if (modeRef.current === 'conditional') {
      drawConditionalScene(p, conditionalRef.current);
    } else if (modeRef.current === 'clt') {
      drawCltScene(p, cltRef.current);
    } else {
      drawMontyScene(p, montyRef.current);
    }
  }, [syncCltView]);

  const canvasHostRef = useRef<HTMLDivElement>(null);
  const drawRef = useRef(draw);

  useEffect(() => {
    drawRef.current = draw;
  }, [draw]);

  useEffect(() => {
    const host = canvasHostRef.current;
    if (!host) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    const boot = async () => {
      const { default: P5 } = await import('p5');
      if (disposed) return;

      const sketch = (p: p5) => {
        p.setup = () => {
          const { width, height } = measureProbabilityCanvas(host);
          p.createCanvas(width, height);
          p.pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
          p.textFont('sans-serif');
        };

        p.draw = () => drawRef.current(p);

        p.mousePressed = () => {
          if (modeRef.current !== 'monty') return;

          const door = montyDoorRects(p).find((rect) => hitRect(p.mouseX, p.mouseY, rect));
          if (!door) return;

          handleMontyDoorClickRef.current(door.index, p.millis());
        };
      };

      const instance = new P5(sketch, host);

      const ro = new ResizeObserver(() => {
        if (disposed) return;
        if (!isP5RendererReady(instance)) return;

        const { width, height } = measureProbabilityCanvas(host);
        instance.resizeCanvas(width, height);
        instance.pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
      });
      ro.observe(host);

      cleanup = () => {
        disposed = true;
        ro.disconnect();
        instance.remove();
      };
    };

    boot();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  const conditionalStats = useMemo(() => {
    const s = normalizeConditional(conditional);
    return [
      ['P(A|B)', fmtPct(safeDiv(s.pAB, s.pB))],
      ['P(B|A)', fmtPct(safeDiv(s.pAB, s.pA))],
      ['P(A∩B)', fmtPct(s.pAB)],
    ] as const;
  }, [conditional]);

  const cltStats = useMemo(() => {
    const mean = cltView.total > 0 ? weightedMean(cltView.counts) : 0;
    const sd = cltView.total > 0 ? weightedSD(cltView.counts, mean) : 0;
    return [
      ['樣本總數', `${cltView.total}`],
      ['平均 k̄', fmtNum(mean, 2)],
      ['標準差 σ', fmtNum(sd, 2)],
    ] as const;
  }, [cltView]);

  const montyStats = useMemo(() => {
    const trials = Math.max(1, monty.trials);
    return [
      ['累積局數', `${monty.trials}`],
      ['不換門', fmtPct(monty.stayWins / trials)],
      ['換門', fmtPct(monty.switchWins / trials)],
    ] as const;
  }, [monty]);

  const range = abRange(conditional);
  const normalizedConditional = normalizeConditional(conditional);

  return (
    <div className="probability-statistics-explore">
      <div className="probability-statistics-explore__stage">
        <div className="probability-statistics-explore__visual">
          <div
            ref={canvasHostRef}
            className="probability-statistics-explore__canvas"
            role="img"
            aria-label="古典機率與條件機率互動視覺化"
          />
        </div>

        <aside className="probability-statistics-explore__sidebar">
          <div className="probability-statistics-explore__block">
            <p className="probability-statistics-explore__block-title">模式</p>
            <div className="probability-statistics-explore__modes">
              <ModeButton active={mode === 'conditional'} onClick={() => setMode('conditional')}>
                條件機率
              </ModeButton>
              <ModeButton active={mode === 'clt'} onClick={() => setMode('clt')}>
                中央極限定理
              </ModeButton>
              <ModeButton active={mode === 'monty'} onClick={() => setMode('monty')}>
                蒙提霍爾
              </ModeButton>
            </div>
          </div>

          {mode === 'conditional' ? (
            <>
              <div className="probability-statistics-explore__block">
                <p className="probability-statistics-explore__block-title">參數</p>
                <RangeField
                  label="事件 A"
                  min={0.05}
                  max={0.95}
                  step={0.01}
                  value={normalizedConditional.pA}
                  display={`P(A) = ${fmtPct(normalizedConditional.pA)}`}
                  onChange={(pA) => setConditional((prev) => normalizeConditional({ ...prev, pA }))}
                />
                <RangeField
                  label="事件 B"
                  min={0.05}
                  max={0.95}
                  step={0.01}
                  value={normalizedConditional.pB}
                  display={`P(B) = ${fmtPct(normalizedConditional.pB)}`}
                  onChange={(pB) => setConditional((prev) => normalizeConditional({ ...prev, pB }))}
                />
                <RangeField
                  label="交集"
                  min={range.minAB}
                  max={range.maxAB}
                  step={0.01}
                  value={normalizedConditional.pAB}
                  display={`P(A∩B) = ${fmtPct(normalizedConditional.pAB)}`}
                  onChange={(pAB) => setConditional((prev) => normalizeConditional({ ...prev, pAB }))}
                />
              </div>

              <StatsBlock title="統計" rows={conditionalStats} />

              <div className="probability-statistics-explore__block">
                <p className="probability-statistics-explore__block-title">公式</p>
                <p className="probability-statistics-explore__stat">P(A|B)=P(A∩B)/P(B)</p>
                <p className="probability-statistics-explore__stat">
                  P(A∩B) ∈ [{fmtPct(range.minAB)}, {fmtPct(range.maxAB)}]
                </p>
              </div>
            </>
          ) : null}

          {mode === 'clt' ? (
            <>
              <div className="probability-statistics-explore__block">
                <p className="probability-statistics-explore__block-title">參數</p>
                <RangeField
                  label="樣本數"
                  min={2}
                  max={40}
                  step={1}
                  value={cltView.n}
                  display={`n = ${cltView.n}`}
                  onChange={(n) => resetClt(n)}
                />
                <RangeField
                  label="速度"
                  min={1}
                  max={20}
                  step={1}
                  value={cltView.speed}
                  display={`v = ${cltView.speed}`}
                  onChange={setCltSpeed}
                />
                <div className="probability-statistics-explore__actions">
                  <button type="button" onClick={toggleClt}>
                    {cltView.running ? '暫停' : '繼續'}
                  </button>
                  <button type="button" onClick={() => resetClt(cltView.n)}>
                    清除
                  </button>
                </div>
              </div>

              <StatsBlock title="統計" rows={cltStats} />

              <div className="probability-statistics-explore__block">
                <p className="probability-statistics-explore__block-title">公式</p>
                <p className="probability-statistics-explore__stat">X ~ Bin(n, 0.5)</p>
                <p className="probability-statistics-explore__stat">
                  n ≥ 8 且樣本夠多時顯示常態 guide
                </p>
              </div>
            </>
          ) : null}

          {mode === 'monty' ? (
            <>
              <div className="probability-statistics-explore__block">
                <p className="probability-statistics-explore__block-title">操作</p>
                {monty.phase === 'choose' ? (
                  <p className="probability-statistics-explore__hint">在左側選一扇門。</p>
                ) : null}
                {monty.phase === 'revealed' ? (
                  <div className="probability-statistics-explore__actions">
                    <button type="button" onClick={() => chooseMontyStrategy(false)}>
                      不換門
                    </button>
                    <button type="button" onClick={() => chooseMontyStrategy(true)}>
                      換門
                    </button>
                  </div>
                ) : null}
                {monty.phase === 'result' ? (
                  <button type="button" onClick={startMontyRound}>
                    下一局
                  </button>
                ) : null}
                <div className="probability-statistics-explore__actions">
                  <button type="button" onClick={() => simulateMontyBatch(100)}>
                    統計 +100
                  </button>
                  <button type="button" onClick={resetMontyStats}>
                    重設統計
                  </button>
                </div>
                {montyNotice ? (
                  <p className="probability-statistics-explore__hint" role="status">
                    {montyNotice}
                  </p>
                ) : null}
              </div>

              <StatsBlock title="統計" rows={montyStats} />

              <div className="probability-statistics-explore__block">
                <p className="probability-statistics-explore__block-title">觀察</p>
                <p className="probability-statistics-explore__stat">不換門 → 約 1/3</p>
                <p className="probability-statistics-explore__stat">換門 → 約 2/3</p>
                <p className="probability-statistics-explore__stat">
                  統計 +100：純統計，不逐局播放
                </p>
              </div>
            </>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

type StatsBlockProps = {
  title: string;
  rows: readonly (readonly [string, string])[];
};

function StatsBlock({ title, rows }: StatsBlockProps) {
  return (
    <div className="probability-statistics-explore__block">
      <p className="probability-statistics-explore__block-title">{title}</p>
      {rows.map(([label, value]) => (
        <p className="probability-statistics-explore__stat" key={label}>
          {label}
          <span>{value}</span>
        </p>
      ))}
    </div>
  );
}
