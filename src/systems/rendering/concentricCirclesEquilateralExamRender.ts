import type p5 from 'p5';
import {
  ORIGIN,
  RADII,
  distance,
  polar,
  rotateAbout,
  rotationAngle,
  uniqueConfiguration,
  type Point2,
  type Turn,
} from '../../exam/amc12b-2025-25-concentric-circles-equilateral/geometry';
import { withDash } from './p5PlotHelpers';

const GOLD = [212, 184, 122] as const;
const BLUE = [93, 173, 226] as const;
const PURPLE = [198, 166, 235] as const;
const WHITE = [232, 232, 232] as const;
const CANVAS_FONT = 'system-ui, -apple-system, BlinkMacSystemFont, "Noto Sans TC CJK", sans-serif';
type Color = readonly [number, number, number];

export type ConcentricPlot = { cx: number; cy: number; scale: number };

const WORLD_HALF = 3.5;

export function concentricPlot(width: number, height: number): ConcentricPlot {
  const top = 86;
  const usable = Math.min(width - 32, height - top - 18);
  return { cx: width / 2, cy: top + (height - top - 18) / 2, scale: usable / (2 * WORLD_HALF) };
}

export function toScreen(plot: ConcentricPlot, point: Point2): Point2 {
  return { x: plot.cx + point.x * plot.scale, y: plot.cy - point.y * plot.scale };
}

export function worldFromScreen(plot: ConcentricPlot, sx: number, sy: number): Point2 {
  return { x: (sx - plot.cx) / plot.scale, y: (plot.cy - sy) / plot.scale };
}

type Snap = {
  width: number;
  height: number;
  aAngle: number;
  bAngle: number;
  progress: number;
  turn: Turn;
};

function circle(p: p5, plot: ConcentricPlot, center: Point2, r: number, color: Color, alpha: number, weight: number): void {
  const c = toScreen(plot, center);
  p.push();
  p.noFill();
  p.stroke(color[0], color[1], color[2], alpha);
  p.strokeWeight(weight);
  p.circle(c.x, c.y, 2 * r * plot.scale);
  p.pop();
}

function segment(p: p5, plot: ConcentricPlot, a: Point2, b: Point2, color: Color, alpha: number, weight: number): void {
  const s = toScreen(plot, a);
  const t = toScreen(plot, b);
  p.push();
  p.stroke(color[0], color[1], color[2], alpha);
  p.strokeWeight(weight);
  p.line(s.x, s.y, t.x, t.y);
  p.pop();
}

function dot(p: p5, plot: ConcentricPlot, at: Point2, color: Color, label: string, size = 9, handle = false): void {
  const s = toScreen(plot, at);
  p.push();
  if (handle) {
    p.stroke(color[0], color[1], color[2], 230);
    p.strokeWeight(2);
    p.fill(10, 10, 10);
    p.circle(s.x, s.y, 18);
  }
  p.noStroke();
  p.fill(color[0], color[1], color[2], 245);
  p.circle(s.x, s.y, size);
  p.textSize(13);
  // 標籤貼近右緣時改放左側，避免窄畫布裁掉「C（切點）」
  if (s.x + 11 + p.textWidth(label) > p.width - 4) {
    p.textAlign(p.RIGHT, p.CENTER);
    p.text(label, s.x - 11, s.y - 11);
  } else {
    p.textAlign(p.LEFT, p.CENTER);
    p.text(label, s.x + 11, s.y - 11);
  }
  p.pop();
}

export function renderConcentricCirclesEquilateralExamScene(p: p5, snap: Snap): void {
  p.background(10, 10, 10);
  p.textFont(CANVAS_FONT);
  const plot = concentricPlot(snap.width, snap.height);

  // 三個同心圓
  const ringColors: Color[] = [WHITE, BLUE, WHITE];
  RADII.forEach((r, index) => {
    circle(p, plot, ORIGIN, r, ringColors[index], index === 1 ? 150 : 90, index === 2 ? 1.8 : 1.3);
    const label = toScreen(plot, polar(r, (100 * Math.PI) / 180));
    p.push();
    p.noStroke();
    p.fill(WHITE[0], WHITE[1], WHITE[2], 110);
    p.textSize(11);
    p.text(`r=${r}`, label.x + 4, label.y - 4);
    p.pop();
  });

  const a = polar(RADII[0], snap.aAngle);
  const angle = rotationAngle(snap.turn, snap.progress);
  const rotatedCenter = rotateAbout(ORIGIN, a, angle);
  const done = snap.progress >= 0.999;

  // 半徑 2 的圓繞 A 旋轉中的像
  withDash(p, [7, 6], () => {
    circle(p, plot, rotatedCenter, RADII[1], GOLD, done ? 220 : 150, done ? 2.2 : 1.6);
  });

  // △O A O′：|AO|=|AO′|=1，轉 60° 時成正三角形，|OO′|=1
  segment(p, plot, a, ORIGIN, WHITE, 90, 1.2);
  segment(p, plot, a, rotatedCenter, GOLD, 150, 1.2);
  if (done) {
    withDash(p, [3, 4], () => segment(p, plot, ORIGIN, rotatedCenter, GOLD, 170, 1.2));
  }
  dot(p, plot, ORIGIN, WHITE, 'O', 6);
  dot(p, plot, rotatedCenter, GOLD, 'O′', 6);

  // 試探點 B 與它的像 C′（跟著目前的旋轉角）
  const trialB = polar(RADII[1], snap.bAngle);
  const trialC = rotateAbout(trialB, a, angle);
  const trialRadius = distance(trialC, ORIGIN);
  const onBigCircle = done && Math.abs(trialRadius - RADII[2]) < 2e-3;
  withDash(p, [2, 5], () => segment(p, plot, ORIGIN, trialC, onBigCircle ? GOLD : PURPLE, 120, 1.2));

  if (done) {
    const config = uniqueConfiguration(snap.aAngle, snap.turn);
    // 切點與唯一的正三角形
    p.push();
    p.noStroke();
    p.fill(GOLD[0], GOLD[1], GOLD[2], onBigCircle ? 60 : 26);
    const [sa, sb, sc] = [config.a, config.b, config.c].map((q) => toScreen(plot, q));
    p.triangle(sa.x, sa.y, sb.x, sb.y, sc.x, sc.y);
    p.pop();
    for (const [from, to] of [
      [config.a, config.b],
      [config.b, config.c],
      [config.c, config.a],
    ] as const) {
      segment(p, plot, from, to, GOLD, onBigCircle ? 240 : 110, onBigCircle ? 2.6 : 1.4);
    }
    const tangent = toScreen(plot, config.c);
    p.push();
    p.noFill();
    p.stroke(GOLD[0], GOLD[1], GOLD[2], 200);
    p.strokeWeight(1.5);
    p.circle(tangent.x, tangent.y, 20);
    p.pop();
    dot(p, plot, config.c, GOLD, 'C（切點）', 8);
  }

  segment(p, plot, a, trialB, PURPLE, 110, 1.1);
  segment(p, plot, a, trialC, PURPLE, 110, 1.1);
  dot(p, plot, trialB, PURPLE, 'B', 8, true);
  dot(p, plot, trialC, onBigCircle ? GOLD : PURPLE, 'C′', 8);
  dot(p, plot, a, GOLD, 'A', 9, true);

  // 讀數
  const lines: Array<{ text: string; gold: boolean }> = [
    {
      text: `轉 ${(snap.progress * 60).toFixed(0)}°：|OO′|=${distance(rotatedCenter, ORIGIN).toFixed(3)}，像圓半徑 2`,
      gold: false,
    },
    {
      text: onBigCircle
        ? `|OC′|=${trialRadius.toFixed(3)}＝3：B 對到唯一解`
        : `|OC′|=${trialRadius.toFixed(3)}（要等於 3，C′ 才在大圓上）`,
      gold: onBigCircle,
    },
  ];
  if (done) {
    const s2 = uniqueConfiguration(snap.aAngle, snap.turn).sideSquared;
    lines.push({ text: '|OO′|=1=3−2 ⇒ 像圓內切大圓，只有一個交點 C', gold: false });
    lines.push({ text: `唯一的正三角形：s²=|AC|²=${s2.toFixed(4)}`, gold: true });
  }
  p.push();
  p.noStroke();
  p.textAlign(p.LEFT, p.TOP);
  const fontSize = snap.width < 420 ? 11.5 : 13;
  p.textSize(fontSize);
  lines.forEach((line, index) => {
    const color = line.gold ? GOLD : WHITE;
    p.fill(color[0], color[1], color[2], line.gold ? 240 : 170);
    p.text(line.text, 14, 12 + index * (fontSize + 5), snap.width - 28);
  });
  p.pop();
}
