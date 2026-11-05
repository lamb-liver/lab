import type p5 from 'p5';
import {
  CROSSINGS,
  K_MAX,
  K_MIN,
  logValue,
  orderAt,
  segments,
  type Name,
} from '../../exam/gaokao-2025-i-log-offset-order/geometry';
import { clipRect, withDash } from './p5PlotHelpers';

const GOLD = [212, 184, 122] as const;
const WHITE = [232, 232, 232] as const;
const CYAN = [128, 196, 210] as const;
const COLORS: Record<Name, readonly [number, number, number]> = { x: WHITE, y: GOLD, z: CYAN };

type Scene = { width: number; height: number; k: number };

const L_MIN = -4;
const L_MAX = 10;

export function renderLogOffsetOrderExam(p: p5, scene: Scene): void {
  p.background(10, 10, 10);
  p.textFont('system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans TC CJK", sans-serif');
  const left = 44;
  const right = scene.width - 18;
  const top = 18;
  const bottom = scene.height - 58;
  const sx = (k: number) => left + ((k - K_MIN) / (K_MAX - K_MIN)) * (right - left);
  const sy = (l: number) => bottom - ((l - L_MIN) / (L_MAX - L_MIN)) * (bottom - top);

  // 四段的底色帶
  const current = orderAt(scene.k).join('');
  segments().forEach((seg, i) => {
    const a = Math.max(K_MIN, seg.from);
    const b = Math.min(K_MAX, seg.to);
    if (b <= a) return;
    const active = seg.order.join('') === current;
    p.noStroke();
    p.fill(255, 255, 255, active ? 14 : i % 2 === 0 ? 5 : 0);
    p.rect(sx(a), top, sx(b) - sx(a), bottom - top);
    if (sx(b) - sx(a) < 40) return;
    p.fill(...WHITE, active ? 230 : 130);
    p.textSize(scene.width < 520 ? 10 : 12);
    p.textAlign(p.CENTER, p.TOP);
    p.text(seg.order.join('>'), (sx(a) + sx(b)) / 2, bottom + 26);
  });

  // 座標軸
  p.stroke(...WHITE, 90);
  p.strokeWeight(1);
  p.line(left, bottom, right, bottom);
  p.line(left, top, left, bottom);
  p.noStroke();
  p.fill(...WHITE, 150);
  p.textSize(11);
  p.textAlign(p.CENTER, p.TOP);
  for (let k = K_MIN; k <= K_MAX; k += 2) p.text(String(k), sx(k), bottom + 6);
  p.textAlign(p.RIGHT, p.CENTER);
  p.text('ln', left - 8, top + 6);
  withDash(p, [3, 4], () => {
    p.stroke(...WHITE, 50);
    p.line(left, sy(0), right, sy(0));
  });

  // 交點
  (['xy', 'xz', 'yz'] as const).forEach((key) => {
    const k = CROSSINGS[key];
    const l = logValue(key[0] as Name, k);
    withDash(p, [2, 5], () => {
      p.stroke(...WHITE, 60);
      p.line(sx(k), top, sx(k), bottom);
    });
    p.noStroke();
    p.fill(...WHITE, 200);
    p.circle(sx(k), sy(l), 6);
  });

  // 三條直線 ln x、ln y、ln z
  (['x', 'y', 'z'] as Name[]).forEach((name) => {
    clipRect(p, { x: left, y: top, w: right - left, h: bottom - top }, () => {
      p.stroke(...COLORS[name], 220);
      p.strokeWeight(2);
      p.line(sx(K_MIN), sy(logValue(name, K_MIN)), sx(K_MAX), sy(logValue(name, K_MAX)));
    });
    const labelK = K_MAX - 0.3;
    const ly = Math.min(bottom - 6, Math.max(top + 8, sy(logValue(name, labelK))));
    p.noStroke();
    p.fill(...COLORS[name], 240);
    p.textSize(14);
    p.textAlign(p.RIGHT, p.BOTTOM);
    p.text(`ln ${name}`, sx(labelK), ly - 4);
  });

  // 目前的 k
  const kx = sx(scene.k);
  p.stroke(...GOLD, 200);
  p.strokeWeight(1.4);
  p.line(kx, top, kx, bottom);
  (['x', 'y', 'z'] as Name[]).forEach((name) => {
    const l = logValue(name, scene.k);
    if (l < L_MIN || l > L_MAX) return;
    p.noStroke();
    p.fill(...COLORS[name]);
    p.circle(kx, sy(l), 9);
  });
  p.noStroke();
  p.fill(...GOLD, 230);
  p.textSize(12);
  p.textAlign(p.CENTER, p.BOTTOM);
  p.text(`k = ${scene.k.toFixed(2)}`, Math.min(right - 30, Math.max(left + 30, kx)), top + 14);
}
