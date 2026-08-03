import type p5 from 'p5';
import {
  SCALE_MAX,
  SCALE_MIN,
  SCALE_EXAMPLE_POINT,
  computeHomogeneousMetrics,
  getSimplexTriangle,
  scaleMetrics,
  simplexToCartesian,
  type SimplexLayer,
  type SimplexPoint,
  type StudyStage,
} from '../../contest/homogeneous-normalization/geometry';

type Snapshot = {
  width: number;
  height: number;
  stage: StudyStage;
  point: SimplexPoint;
  scale: number;
  layer: SimplexLayer;
};

type LayerInfo = {
  label: string;
  formula: string;
  hint: string;
  color: readonly [number, number, number];
};

const ACCENT = [212, 184, 122] as const;
const WHITE = [232, 232, 232] as const;
const MUTED = [170, 162, 151] as const;
const BLUE = [110, 168, 255] as const;
const GREEN = [164, 225, 176] as const;

export function renderHomogeneousNormalizationContestScene(p: p5, snap: Snapshot): void {
  p.background(10, 10, 10);
  p.textFont("system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif");
  p.textStyle(p.NORMAL);

  if (snap.stage === 'degrees') drawDegrees(p, snap.width, snap.height);
  if (snap.stage === 'homogenize') drawHomogenize(p, snap.width, snap.height);
  if (snap.stage === 'scale') drawScale(p, snap);
  if (snap.stage === 'simplex') drawSimplex(p, snap);
}

function drawDegrees(p: p5, width: number, height: number): void {
  const cards = [
    ['二次量', 'q = ab + bc + ca', BLUE],
    ['零次量', '1', MUTED],
    ['三次量', 'r = abc', ACCENT],
  ] as const;
  const cardWidth = Math.min(250, (width - 72) / 3);

  p.textAlign(p.CENTER, p.CENTER);
  p.fill(...WHITE, 235);
  p.textSize(Math.min(24, width * 0.04));
  p.text('先看上界：4q ≤ 1 + 9r', width / 2, height * 0.1);
  p.textSize(Math.min(15, width * 0.026));
  p.fill(...MUTED, 220);
  p.text('左邊是二次；右邊同時有零次與三次', width / 2, height * 0.17);

  cards.forEach(([title, formula, color], index) => {
    const x = width / 2 + (index - 1) * (cardWidth + 18);
    drawCard(p, x - cardWidth / 2, height * 0.29, cardWidth, height * 0.34, title, formula, color);
  });
}

function drawHomogenize(p: p5, width: number, height: number): void {
  p.textAlign(p.CENTER, p.CENTER);
  p.fill(...WHITE, 235);
  p.textSize(Math.min(24, width * 0.04));
  p.text('因為 s = a + b + c = 1，可以補回次數', width / 2, height * 0.1);
  p.textSize(Math.min(14, width * 0.024));
  p.fill(...MUTED, 220);
  p.text('1 = s³，q = sq', width / 2, height * 0.17);

  drawCard(p, width * 0.1, height * 0.27, width * 0.8, height * 0.18, '原來的上界', '4q ≤ 1 + 9r', BLUE);
  p.fill(...ACCENT, 230);
  p.textSize(Math.min(22, width * 0.036));
  p.text('↓  把每一項都補成三次', width / 2, height * 0.52);
  drawCard(p, width * 0.1, height * 0.63, width * 0.8, height * 0.18, '補回次數後', '4sq ≤ s³ + 9r', ACCENT);
  p.fill(...WHITE, 215);
  p.textSize(Math.min(14, width * 0.024));
  p.text('兩邊現在都是三次', width / 2, height * 0.88);
}

function drawScale(p: p5, snap: Snapshot): void {
  const metrics = computeHomogeneousMetrics(SCALE_EXAMPLE_POINT);
  const t = snap.scale;
  const scaled = scaleMetrics(metrics, t);
  const currentX =
    snap.width * 0.16 +
    ((t - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * snap.width * 0.68;
  const rows = [
    ['s', metrics.s, scaled.s, '× t'],
    ['q', metrics.q, scaled.q, '× t²'],
    ['r', metrics.r, scaled.r, '× t³'],
    ['下界差值', metrics.lowerGap, scaled.lowerGap, '× t³'],
    ['上界差值', metrics.upperGap, scaled.upperGap, '× t³'],
  ] as const;

  p.textAlign(p.CENTER, p.CENTER);
  p.fill(...WHITE, 235);
  p.textSize(Math.min(24, snap.width * 0.04));
  p.text('只改大小，不改比例', snap.width / 2, snap.height * 0.09);
  p.textSize(Math.min(14, snap.width * 0.024));
  p.fill(...MUTED, 220);
  p.text('固定比例 0.5:0.3:0.2；(a,b,c) 變成 (ta,tb,tc)', snap.width / 2, snap.height * 0.16);

  const barY = snap.height * 0.28;
  p.stroke(...MUTED, 150);
  p.strokeWeight(2);
  p.line(snap.width * 0.16, barY, snap.width * 0.84, barY);
  for (const mark of [SCALE_MIN, 1, SCALE_MAX]) {
    const x = snap.width * 0.16 + ((mark - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * snap.width * 0.68;
    p.stroke(...MUTED, 120);
    p.line(x, barY - 8, x, barY + 8);
    p.noStroke();
    p.fill(...MUTED, 210);
    p.textSize(11);
    p.text('t=' + mark.toFixed(2), x, barY + 24);
  }
  p.noStroke();
  p.fill(...ACCENT, 245);
  p.circle(currentX, barY, 16);
  p.fill(...WHITE, 230);
  p.textSize(12);
  p.text('目前 t=' + t.toFixed(2), currentX, barY - 22);

  const left = snap.width * 0.14;
  const top = snap.height * 0.48;
  const rowHeight = Math.min(42, snap.height * 0.105);
  p.fill(...MUTED, 190);
  p.textSize(11);
  p.textAlign(p.CENTER, p.CENTER);
  p.text('縮放前', snap.width * 0.43, top - rowHeight * 0.55);
  p.text('縮放後', snap.width * 0.66, top - rowHeight * 0.55);
  rows.forEach(([name, before, after, rule], index) => {
    const y = top + index * rowHeight;
    p.stroke(index === 3 ? ACCENT[0] : MUTED[0], index === 3 ? ACCENT[1] : MUTED[1], index === 3 ? ACCENT[2] : MUTED[2], 65);
    p.strokeWeight(1);
    p.line(left, y + rowHeight * 0.45, snap.width - left, y + rowHeight * 0.45);
    p.noStroke();
    p.textAlign(p.LEFT, p.CENTER);
    const labelColor = index === 3 ? ACCENT : WHITE;
    p.fill(labelColor[0], labelColor[1], labelColor[2], 225);
    p.text(name, left, y);
    p.textAlign(p.CENTER, p.CENTER);
    p.fill(...MUTED, 210);
    p.text(before.toFixed(3), snap.width * 0.43, y);
    p.fill(...WHITE, 230);
    p.text(after.toFixed(3), snap.width * 0.66, y);
    p.textAlign(p.RIGHT, p.CENTER);
    p.fill(...MUTED, 190);
    p.text(rule, snap.width - left, y);
  });
  p.textAlign(p.CENTER, p.CENTER);
  p.fill(...ACCENT, 220);
  p.textSize(Math.min(14, snap.width * 0.024));
  p.text('兩個差值都乘上 t³，但正負與等號位置不變', snap.width / 2, snap.height * 0.94);
}

function drawSimplex(p: p5, snap: Snapshot): void {
  const triangle = getSimplexTriangle(snap.width, snap.height);
  const point = simplexToCartesian(snap.point, triangle);
  const info = getLayerInfo(snap.layer);

  drawSimplexField(p, triangle, snap.layer);
  p.noFill();
  p.stroke(...MUTED, 180);
  p.strokeWeight(1.5);
  p.triangle(
    triangle.a.x,
    triangle.a.y,
    triangle.b.x,
    triangle.b.y,
    triangle.c.x,
    triangle.c.y,
  );

  p.noStroke();
  p.textAlign(p.LEFT, p.TOP);
  p.textSize(13);
  p.fill(...info.color, 240);
  p.text(info.label, 18, 10);
  p.textSize(11);
  p.fill(...WHITE, 220);
  p.text(info.formula, 18, 29);

  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(12);
  p.fill(...ACCENT, 235);
  p.text('a=1', triangle.a.x, triangle.a.y - 16);
  p.fill(...BLUE, 235);
  p.text('b=1', triangle.b.x - 20, triangle.b.y + 4);
  p.fill(...GREEN, 235);
  p.text('c=1', triangle.c.x + 20, triangle.c.y + 4);

  const center = simplexToCartesian({ a: 1 / 3, b: 1 / 3, c: 1 / 3 }, triangle);
  drawMarker(p, center, '中心', info.color, true);

  if (snap.layer === 'lower') {
    drawMarker(p, triangle.a, '', BLUE, true);
    drawMarker(p, triangle.b, '', BLUE, true);
    drawMarker(p, triangle.c, '', BLUE, true);
  }
  if (snap.layer === 'upper') {
    for (const edge of [
      { x: (triangle.a.x + triangle.b.x) / 2, y: (triangle.a.y + triangle.b.y) / 2 },
      { x: (triangle.b.x + triangle.c.x) / 2, y: (triangle.b.y + triangle.c.y) / 2 },
      { x: (triangle.c.x + triangle.a.x) / 2, y: (triangle.c.y + triangle.a.y) / 2 },
    ]) drawMarker(p, edge, '邊中點', ACCENT, true);
  }

  p.noStroke();
  p.fill(...WHITE, 255);
  p.circle(point.x, point.y, 18);
  p.fill(10, 10, 10, 235);
  p.circle(point.x, point.y, 7);
  const isCenter = Math.hypot(point.x - center.x, point.y - center.y) < 24;
  if (!isCenter) {
    p.textAlign(p.LEFT, p.BOTTOM);
    p.textSize(11);
    p.fill(...WHITE, 230);
    p.text('目前點', point.x + 10, point.y - 7);
  }

  p.textAlign(p.LEFT, p.BOTTOM);
  p.fill(...MUTED, 205);
  p.text(info.hint + '；白點＝目前比例', 18, snap.height - 12);
}

function drawSimplexField(p: p5, triangle: ReturnType<typeof getSimplexTriangle>, layer: SimplexLayer): void {
  const steps = 14;
  const samples: Array<{ point: { x: number; y: number }; value: number }> = [];
  let maxValue = 0;

  for (let i = 0; i <= steps; i += 1) {
    for (let j = 0; j <= steps - i; j += 1) {
      const sample = computeHomogeneousMetrics({
        a: i / steps,
        b: j / steps,
        c: 1 - (i + j) / steps,
      });
      const value = metricForLayer(sample, layer);
      maxValue = Math.max(maxValue, value);
      samples.push({
        point: simplexToCartesian({ a: i / steps, b: j / steps, c: 1 - (i + j) / steps }, triangle),
        value,
      });
    }
  }

  const info = getLayerInfo(layer);
  const radius = Math.max(4, Math.min(7, triangle.c.x / 90));
  p.noStroke();
  for (const sample of samples) {
    const intensity = maxValue > 0 ? sample.value / maxValue : 0;
    p.fill(info.color[0], info.color[1], info.color[2], 18 + intensity * 155);
    p.circle(sample.point.x, sample.point.y, radius);
  }
}

function metricForLayer(
  metrics: ReturnType<typeof computeHomogeneousMetrics>,
  layer: SimplexLayer,
): number {
  if (layer === 'q') return metrics.q;
  if (layer === 'r') return metrics.r;
  if (layer === 'lower') return metrics.lowerGap;
  return metrics.upperGap;
}

function getLayerInfo(layer: SimplexLayer): LayerInfo {
  if (layer === 'q') {
    return {
      label: 'q 的大小',
      formula: 'q = ab + bc + ca',
      hint: 'q 在中心最大，在三個頂點為 0',
      color: BLUE,
    };
  }
  if (layer === 'r') {
    return {
      label: 'r 的大小',
      formula: 'r = abc',
      hint: 'r 在中心最大，碰到邊界就變成 0',
      color: GREEN,
    };
  }
  if (layer === 'lower') {
    return {
      label: '下界差值',
      formula: 'q − 9r ≥ 0',
      hint: '下界等號：中心與三個頂點',
      color: BLUE,
    };
  }
  return {
    label: '上界差值',
    formula: '1 + 9r − 4q ≥ 0',
    hint: '上界等號：中心與三個邊中點',
    color: ACCENT,
  };
}

function drawCard(
  p: p5,
  x: number,
  y: number,
  width: number,
  height: number,
  title: string,
  value: string,
  color: readonly [number, number, number],
): void {
  p.fill(255, 255, 255, 7);
  p.stroke(...color, 105);
  p.strokeWeight(1);
  p.rect(x, y, width, height, 8);
  p.noStroke();
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(12);
  p.fill(...color, 225);
  p.text(title, x + width / 2, y + height * 0.28);
  p.textSize(Math.min(21, width * 0.075));
  p.fill(...WHITE, 235);
  p.text(value, x + width / 2, y + height * 0.64);
}

function drawMarker(
  p: p5,
  point: { x: number; y: number },
  label: string,
  color: readonly [number, number, number],
  strong: boolean,
): void {
  p.noStroke();
  p.fill(color[0], color[1], color[2], strong ? 225 : 80);
  p.circle(point.x, point.y, strong ? 10 : 6);
  if (!label) return;
  p.textAlign(p.CENTER, p.BOTTOM);
  p.textSize(10);
  p.fill(color[0], color[1], color[2], 220);
  p.text(label, point.x, point.y - 9);
}
