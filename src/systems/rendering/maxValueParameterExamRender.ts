import type p5 from 'p5';
import { OPTIONS, criticalX, f, maxValue } from '../../exam/gaokao-2026-i-max-value-parameter/geometry';
import { clipRect, withDash } from './p5PlotHelpers';

const GOLD = [212, 184, 122] as const;
const WHITE = [232, 232, 232] as const;
const CYAN = [128, 196, 210] as const;

type Scene = { width: number; height: number; a: number; locale?: 'en' };

const X_MIN = -2.5;
const X_MAX = 4;
const Y_MIN = -0.3;
const Y_MAX = 1.7;

export function renderMaxValueParameterExam(p: p5, scene: Scene): void {
  p.background(10, 10, 10);
  p.textFont('system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans TC CJK", sans-serif');
  const left = 36;
  const right = scene.width - 14;
  const top = 16;
  const bottom = scene.height - 28;
  const sx = (x: number) => left + ((x - X_MIN) / (X_MAX - X_MIN)) * (right - left);
  const sy = (y: number) => bottom - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * (bottom - top);
  const box = { x: left, y: top, w: right - left, h: bottom - top };

  p.stroke(...WHITE, 70);
  p.strokeWeight(1);
  p.line(left, sy(0), right, sy(0));
  p.line(sx(0), top, sx(0), bottom);
  p.noStroke();
  p.fill(...WHITE, 140);
  p.textSize(10);
  p.textAlign(p.CENTER, p.TOP);
  for (let x = -2; x <= 4; x += 1) if (x !== 0) p.text(String(x), sx(x), sy(0) + 4);
  p.textAlign(p.RIGHT, p.CENTER);
  p.text('1', sx(0) - 5, sy(1));

  withDash(p, [3, 4], () => {
    p.stroke(...WHITE, 70);
    p.line(left, sy(1), right, sy(1));
  });

  const plot = (fn: (x: number) => number, color: readonly [number, number, number], alpha: number, w: number, from = X_MIN) => {
    clipRect(p, box, () => {
      p.noFill();
      p.stroke(...color, alpha);
      p.strokeWeight(w);
      p.beginShape();
      for (let px = sx(from); px <= right; px += 1.5) {
        const x = X_MIN + ((px - left) / (right - left)) * (X_MAX - X_MIN);
        p.vertex(px, sy(fn(x)));
      }
      p.endShape();
    });
  };

  // 四個選項的曲線當底
  OPTIONS.forEach((o) => plot((x) => f(x, o.a), WHITE, 40, 1));
  // 最大點的軌跡 y = e^{−x}
  withDash(p, [5, 5], () => plot((x) => Math.exp(-x), CYAN, 200, 1.4, -0.53));
  plot((x) => f(x, scene.a), GOLD, 235, 2.2);

  const x0 = criticalX(scene.a);
  const m = maxValue(scene.a);
  withDash(p, [2, 4], () => {
    p.stroke(...GOLD, 120);
    p.line(sx(x0), sy(0), sx(x0), sy(m));
  });
  p.noStroke();
  p.fill(...GOLD);
  p.circle(sx(x0), sy(m), 10);
  p.fill(...GOLD, 230);
  p.textSize(12);
  p.textAlign(p.LEFT, p.BOTTOM);
  p.text(`(${x0.toFixed(2)}, ${m.toFixed(3)})`, Math.min(sx(x0) + 8, right - 110), sy(m) - 6);
  p.fill(...CYAN, 220);
  p.textAlign(p.RIGHT, p.BOTTOM);
  p.text('y = e^(−x)', right - 4, sy(Math.exp(-3.6)) - 6);
}
