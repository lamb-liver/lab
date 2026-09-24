import type p5 from 'p5';
import {
  ANSWER_INTERVAL,
  EXACT_PROBABILITY,
  HALF,
  choiceFor,
  isSmall,
  type Sample,
} from '../../exam/amc12a-2024-20-random-points-area-probability/geometry';
import { withDash } from './p5PlotHelpers';

const GOLD = [212, 184, 122] as const;
const BLUE = [93, 173, 226] as const;
const RED = [235, 110, 100] as const;
const WHITE = [232, 232, 232] as const;
const CANVAS_FONT = "'Noto Sans TC', system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
const SQRT3_2 = Math.sqrt(3) / 2;
const DOT_LIMIT = 2500;

type Rect = { x: number; y: number; w: number; h: number };
type Pt = { x: number; y: number };

export type RandomPointsLayout = {
  triangle: Rect;
  square: Rect;
  graph: Rect;
  choices: Rect;
};

export function randomPointsLayout(width: number, height: number): RandomPointsLayout {
  const pad = 16;
  const stacked = width < 520;
  const bottomH = stacked ? Math.max(150, height * 0.26) : Math.max(150, height * 0.32);
  const topY = 40;
  const topH = height - topY - bottomH - pad;
  let triangle: Rect;
  let square: Rect;
  if (stacked) {
    const each = (topH - pad) / 2;
    const side = Math.min(width - pad * 2, each);
    triangle = { x: (width - side * 1.15) / 2, y: topY, w: side * 1.15, h: side };
    square = { x: (width - side) / 2 + 12, y: topY + each + pad, w: side - 24, h: side - 24 };
  } else {
    const side = Math.min((width - pad * 3) / 2, topH);
    triangle = { x: pad, y: topY, w: (width - pad * 3) / 2, h: side };
    const sq = side - 34;
    square = { x: width / 2 + pad / 2 + 34, y: topY, w: sq, h: sq };
  }
  const graphY = height - bottomH;
  const graph: Rect = { x: 50, y: graphY + 14, w: width - 70, h: bottomH - 70 };
  const choices: Rect = { x: 50, y: height - 34, w: width - 70, h: 16 };
  return { triangle, square, graph, choices };
}

/** 三角形邊長 1、A 在左下；回傳畫面座標轉換 */
function triangleFrame(rect: Rect) {
  const side = Math.min(rect.w - 40, (rect.h - 30) / SQRT3_2);
  const ox = rect.x + (rect.w - side) / 2;
  const oy = rect.y + rect.h - 12;
  const map = (x: number, y: number): Pt => ({ x: ox + x * side, y: oy - y * side });
  return {
    map,
    a: map(0, 0),
    b: map(1, 0),
    c: map(0.5, SQRT3_2),
    p: (t: number) => map(t, 0),
    q: (t: number) => map(0.5 * t, SQRT3_2 * t),
  };
}

export function trianglePointScreens(layout: RandomPointsLayout, x: number, y: number) {
  const frame = triangleFrame(layout.triangle);
  return { p: frame.p(x), q: frame.q(y), a: frame.a, b: frame.b, c: frame.c };
}

/** 把滑鼠投影到 AB 或 AC 上，回傳比例 */
export function fractionOnSide(layout: RandomPointsLayout, side: 'p' | 'q', mx: number, my: number): number {
  const frame = triangleFrame(layout.triangle);
  const end = side === 'p' ? frame.b : frame.c;
  const dx = end.x - frame.a.x;
  const dy = end.y - frame.a.y;
  const t = ((mx - frame.a.x) * dx + (my - frame.a.y) * dy) / (dx * dx + dy * dy);
  return Math.min(1, Math.max(0, t));
}

export function squareToScreen(layout: RandomPointsLayout, x: number, y: number): Pt {
  const s = layout.square;
  return { x: s.x + x * s.w, y: s.y + s.h - y * s.h };
}

export function squareFromScreen(layout: RandomPointsLayout, mx: number, my: number): Pt | null {
  const s = layout.square;
  const x = (mx - s.x) / s.w;
  const y = (s.y + s.h - my) / s.h;
  if (x < -0.05 || x > 1.05 || y < -0.05 || y > 1.05) return null;
  return { x: Math.min(1, Math.max(0, x)), y: Math.min(1, Math.max(0, y)) };
}

type Snap = {
  width: number;
  height: number;
  x: number;
  y: number;
  samples: readonly Sample[];
  count: number;
  squeeze: boolean;
};

function label(p: p5, text: string, x: number, y: number, color: readonly [number, number, number], alpha = 200, size = 12): void {
  p.push();
  p.noStroke();
  p.fill(color[0], color[1], color[2], alpha);
  p.textSize(size);
  p.text(text, x, y);
  p.pop();
}

function handle(p: p5, at: Pt, color: readonly [number, number, number]): void {
  p.push();
  p.stroke(color[0], color[1], color[2], 230);
  p.strokeWeight(2);
  p.fill(10, 10, 10);
  p.circle(at.x, at.y, 16);
  p.noStroke();
  p.fill(color[0], color[1], color[2]);
  p.circle(at.x, at.y, 6);
  p.pop();
}

function drawTriangle(p: p5, layout: RandomPointsLayout, x: number, y: number): void {
  const frame = triangleFrame(layout.triangle);
  const small = isSmall(x, y);
  const pp = frame.p(x);
  const qq = frame.q(y);
  const tone = small ? GOLD : RED;

  p.push();
  p.noFill();
  p.stroke(WHITE[0], WHITE[1], WHITE[2], 150);
  p.strokeWeight(1.6);
  p.triangle(frame.a.x, frame.a.y, frame.b.x, frame.b.y, frame.c.x, frame.c.y);
  p.noStroke();
  p.fill(tone[0], tone[1], tone[2], 70);
  p.triangle(frame.a.x, frame.a.y, pp.x, pp.y, qq.x, qq.y);
  p.stroke(tone[0], tone[1], tone[2], 230);
  p.strokeWeight(2);
  p.line(pp.x, pp.y, qq.x, qq.y);
  p.pop();

  label(p, 'A', frame.a.x - 14, frame.a.y + 4, WHITE);
  label(p, 'B', frame.b.x + 6, frame.b.y + 4, WHITE);
  label(p, 'C', frame.c.x - 4, frame.c.y - 8, WHITE);
  handle(p, pp, BLUE);
  handle(p, qq, BLUE);
  label(p, 'P', pp.x - 4, pp.y + 22, BLUE, 230);
  label(p, 'Q', qq.x - 20, qq.y - 6, BLUE, 230);
  label(
    p,
    `面積比 = x·y = ${(x * y).toFixed(3)} ${small ? '< 1/2' : '≥ 1/2'}`,
    layout.triangle.x + 4,
    layout.triangle.y + 2,
    tone,
    230,
    12.5,
  );
}

function drawSquare(p: p5, layout: RandomPointsLayout, snap: Snap): void {
  const s = layout.square;
  const map = (x: number, y: number) => squareToScreen(layout, x, y);

  // xy<1/2 區域（藍）與補集（紅）
  const curve: Pt[] = [];
  for (let i = 0; i <= 80; i += 1) {
    const x = HALF + (HALF * i) / 80;
    curve.push(map(x, HALF / x));
  }
  p.push();
  p.noStroke();
  p.fill(BLUE[0], BLUE[1], BLUE[2], 34);
  p.beginShape();
  p.vertex(map(0, 0).x, map(0, 0).y);
  p.vertex(map(0, 1).x, map(0, 1).y);
  for (const q of curve) p.vertex(q.x, q.y);
  p.vertex(map(1, 0).x, map(1, 0).y);
  p.endShape(p.CLOSE);
  p.fill(RED[0], RED[1], RED[2], 40);
  p.beginShape();
  for (const q of curve) p.vertex(q.x, q.y);
  p.vertex(map(1, 1).x, map(1, 1).y);
  p.endShape(p.CLOSE);
  p.pop();

  // 模擬點
  const shown = Math.min(snap.count, DOT_LIMIT, snap.samples.length);
  p.push();
  p.noStroke();
  for (let i = 0; i < shown; i += 1) {
    const sample = snap.samples[i];
    const at = map(sample.x, sample.y);
    const tone = sample.small ? BLUE : RED;
    p.fill(tone[0], tone[1], tone[2], 150);
    p.circle(at.x, at.y, 2.4);
  }
  p.pop();

  p.push();
  p.noFill();
  p.stroke(WHITE[0], WHITE[1], WHITE[2], 110);
  p.strokeWeight(1.2);
  p.rect(s.x, s.y, s.w, s.h);
  p.stroke(GOLD[0], GOLD[1], GOLD[2], 230);
  p.strokeWeight(2);
  p.beginShape();
  for (const q of curve) p.vertex(q.x, q.y);
  p.endShape();
  p.pop();

  if (snap.squeeze) {
    // 不用積分的夾擠：外框 [1/2,1]²（面積 1/4）、內接三角形（面積 1/8）
    withDash(p, [5, 4], () => {
      p.push();
      p.noFill();
      p.stroke(WHITE[0], WHITE[1], WHITE[2], 190);
      p.strokeWeight(1.4);
      const a = map(0.5, 1);
      const b = map(1, 0.5);
      p.rect(a.x, a.y, b.x - a.x, b.y - a.y);
      p.pop();
    });
    p.push();
    p.noStroke();
    p.fill(GOLD[0], GOLD[1], GOLD[2], 60);
    const t1 = map(0.5, 1);
    const t2 = map(1, 1);
    const t3 = map(1, 0.5);
    p.triangle(t1.x, t1.y, t2.x, t2.y, t3.x, t3.y);
    p.pop();
  }

  const current = map(snap.x, snap.y);
  handle(p, current, isSmall(snap.x, snap.y) ? GOLD : RED);

  label(p, 'x = AP/AB', s.x + s.w / 2 - 28, s.y + s.h + 16, WHITE, 150, 11);
  p.push();
  p.translate(s.x - 14, s.y + s.h / 2 + 30);
  p.rotate(-Math.PI / 2);
  label(p, 'y = AQ/AC', 0, 0, WHITE, 150, 11);
  p.pop();
  label(p, 'xy = 1/2', map(0.62, 0.86).x, map(0.62, 0.86).y, GOLD, 220, 11);
}

function drawConvergence(p: p5, layout: RandomPointsLayout, snap: Snap, estimates: number[]): void {
  const g = layout.graph;
  const yMin = 0.7;
  const yMax = 0.95;
  const sy = (v: number) => g.y + g.h - ((Math.min(yMax, Math.max(yMin, v)) - yMin) / (yMax - yMin)) * g.h;
  const total = Math.max(1, snap.samples.length);
  const sx = (n: number) => g.x + (n / total) * g.w;

  p.push();
  p.noStroke();
  p.fill(GOLD[0], GOLD[1], GOLD[2], 26);
  p.rect(g.x, sy(ANSWER_INTERVAL.high), g.w, sy(ANSWER_INTERVAL.low) - sy(ANSWER_INTERVAL.high));
  p.noFill();
  p.stroke(WHITE[0], WHITE[1], WHITE[2], 60);
  p.rect(g.x, g.y, g.w, g.h);
  p.pop();

  withDash(p, [6, 5], () => {
    p.push();
    p.stroke(GOLD[0], GOLD[1], GOLD[2], 200);
    p.strokeWeight(1.3);
    p.line(g.x, sy(EXACT_PROBABILITY), g.x + g.w, sy(EXACT_PROBABILITY));
    p.pop();
  });

  if (estimates.length > 1) {
    p.push();
    p.noFill();
    p.stroke(BLUE[0], BLUE[1], BLUE[2], 230);
    p.strokeWeight(1.6);
    p.beginShape();
    const step = Math.max(1, Math.floor(estimates.length / 400));
    for (let i = 0; i < estimates.length; i += step) p.vertex(sx(i + 1), sy(estimates[i]));
    p.vertex(sx(estimates.length), sy(estimates[estimates.length - 1]));
    p.endShape();
    p.pop();
  }

  for (const v of [0.75, 0.875]) {
    label(p, v === 0.75 ? '3/4' : '7/8', g.x - 32, sy(v) + 4, GOLD, 180, 11);
  }
  label(p, '0.8466', g.x + g.w - 44, sy(EXACT_PROBABILITY) - 6, GOLD, 200, 11);
}

/** 答案區間數線：只標出 (D) 的 (3/4, 7/8]，不重製其他選項 */
function drawAnswerBand(p: p5, layout: RandomPointsLayout, estimate: number | null): void {
  const c = layout.choices;
  const lo = 0.5;
  const hi = 1;
  const sx = (v: number) => c.x + ((v - lo) / (hi - lo)) * c.w;
  const inBand = estimate !== null && choiceFor(estimate) === 'D';

  p.push();
  p.stroke(WHITE[0], WHITE[1], WHITE[2], 110);
  p.strokeWeight(1.2);
  p.line(c.x, c.y + c.h / 2, c.x + c.w, c.y + c.h / 2);
  p.noStroke();
  p.fill(GOLD[0], GOLD[1], GOLD[2], inBand ? 90 : 50);
  const x0 = sx(ANSWER_INTERVAL.low);
  const x1 = sx(ANSWER_INTERVAL.high);
  p.rect(x0, c.y, x1 - x0, c.h, 3);
  p.fill(WHITE[0], WHITE[1], WHITE[2], 170);
  p.textSize(10.5);
  p.textAlign(p.CENTER, p.TOP);
  for (const [v, text] of [
    [0.5, '1/2'],
    [0.75, '3/4'],
    [0.875, '7/8'],
    [1, '1'],
  ] as const) {
    p.text(text, sx(v), c.y + c.h + 1);
  }
  p.fill(GOLD[0], GOLD[1], GOLD[2], 230);
  p.textAlign(p.CENTER, p.CENTER);
  p.text('(D)', (x0 + x1) / 2, c.y + c.h / 2);
  p.pop();

  const exact = sx(EXACT_PROBABILITY);
  p.push();
  p.stroke(GOLD[0], GOLD[1], GOLD[2], 240);
  p.strokeWeight(2);
  p.line(exact, c.y - 6, exact, c.y + c.h + 2);
  p.pop();
  if (estimate !== null) {
    const at = sx(Math.min(hi, Math.max(lo, estimate)));
    p.push();
    p.noStroke();
    p.fill(BLUE[0], BLUE[1], BLUE[2]);
    p.triangle(at, c.y - 2, at - 5, c.y - 10, at + 5, c.y - 10);
    p.pop();
  }
}

export function renderRandomPointsAreaProbabilityExamScene(p: p5, snap: Snap): void {
  p.background(10, 10, 10);
  p.textFont(CANVAS_FONT);
  const layout = randomPointsLayout(snap.width, snap.height);

  const n = Math.min(snap.count, snap.samples.length);
  const estimates: number[] = [];
  let hits = 0;
  for (let i = 0; i < n; i += 1) {
    if (snap.samples[i].small) hits += 1;
    estimates.push(hits / (i + 1));
  }
  const estimate = n > 0 ? hits / n : null;

  drawTriangle(p, layout, snap.x, snap.y);
  drawSquare(p, layout, snap);
  drawConvergence(p, layout, snap, estimates);
  drawAnswerBand(p, layout, estimate);

  label(
    p,
    `模擬 ${n.toLocaleString()} 次　估計 ${estimate === null ? '—' : estimate.toFixed(4)}　精確 (1+ln2)/2≈${EXACT_PROBABILITY.toFixed(4)}`,
    16,
    22,
    WHITE,
    190,
    snap.width < 420 ? 11 : 12.5,
  );
}
