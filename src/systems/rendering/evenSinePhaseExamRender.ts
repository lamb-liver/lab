import type p5 from 'p5';
import { f } from '../../exam/gaokao-2026-i-even-sine-phase/geometry';
import { clipRect, withDash } from './p5PlotHelpers';

const GOLD = [212, 184, 122] as const;
const WHITE = [232, 232, 232] as const;
const CYAN = [128, 196, 210] as const;

type Scene = { width: number; height: number; a: number; theta: number; locale?: 'en' };

const X_MIN = -Math.PI;
const X_MAX = Math.PI;

export function renderEvenSinePhaseExam(p: p5, scene: Scene): void {
  p.background(10, 10, 10);
  p.textFont('system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans TC CJK", sans-serif');
  const left = 30;
  const right = scene.width - 14;
  const top = 16;
  const bottom = scene.height - 28;
  const sx = (x: number) => left + ((x - X_MIN) / (X_MAX - X_MIN)) * (right - left);
  const sy = (y: number) => (top + bottom) / 2 - (y / 2.5) * ((bottom - top) / 2);
  const box = { x: left, y: top, w: right - left, h: bottom - top };

  // (0, π/2) 區間
  p.noStroke();
  p.fill(...GOLD, 22);
  p.rect(sx(0), top, sx(Math.PI / 2) - sx(0), bottom - top);

  p.stroke(...WHITE, 70);
  p.strokeWeight(1);
  p.line(left, sy(0), right, sy(0));
  p.line(sx(0), top, sx(0), bottom);
  p.noStroke();
  p.fill(...WHITE, 140);
  p.textSize(10);
  p.textAlign(p.CENTER, p.TOP);
  const ticks: [number, string][] = [
    [-Math.PI, '−π'],
    [-Math.PI / 2, '−π/2'],
    [Math.PI / 2, 'π/2'],
    [(2 * Math.PI) / 3, '2π/3'],
    [Math.PI, 'π'],
  ];
  ticks
    .filter(([, label]) => scene.width >= 520 || label !== '2π/3')
    .forEach(([x, label]) => p.text(label, Math.min(right - 8, sx(x)), sy(0) + 4));
  p.textAlign(p.RIGHT, p.CENTER);
  p.text('2', sx(0) - 4, sy(2));
  p.text('−2', sx(0) - 4, sy(-2));

  const plot = (fn: (x: number) => number, color: readonly [number, number, number], alpha: number, w: number) =>
    clipRect(p, box, () => {
      p.noFill();
      p.stroke(...color, alpha);
      p.strokeWeight(w);
      p.beginShape();
      for (let px = left; px <= right; px += 1) {
        const x = X_MIN + ((px - left) / (right - left)) * (X_MAX - X_MIN);
        p.vertex(px, sy(fn(x)));
      }
      p.endShape();
    });

  // 鏡像 f(−x)：和 f 重合就是偶函數
  withDash(p, [6, 5], () => plot((x) => f(-x, scene.a, scene.theta), CYAN, 200, 1.4));
  plot((x) => f(x, scene.a, scene.theta), GOLD, 235, 2.2);

  const x23 = (2 * Math.PI) / 3;
  const v = f(x23, scene.a, scene.theta);
  withDash(p, [2, 4], () => {
    p.stroke(...WHITE, 90);
    p.line(sx(x23), sy(0), sx(x23), sy(v));
  });
  p.noStroke();
  p.fill(...WHITE);
  p.circle(sx(x23), sy(v), 8);
  p.textSize(12);
  p.textAlign(p.LEFT, p.CENTER);
  p.text(v.toFixed(2), Math.min(sx(x23) + 8, right - 36), sy(v) + (v > 1.6 ? 12 : -12));
}
