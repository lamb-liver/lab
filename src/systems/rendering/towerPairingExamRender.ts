import type p5 from 'p5';
import { withDash } from './p5PlotHelpers';
import { ROWS, targetSums, type Pairing } from '../../exam/gaokao-2026-i-tower-pairing/geometry';

const GOLD = [212, 184, 122] as const;
const WHITE = [232, 232, 232] as const;
const CYAN = [128, 196, 210] as const;
type Rgb = readonly [number, number, number];

type Scene = { width: number; height: number; d: number; pairing: Pairing | null; locale?: 'en' };

/** 6 個組和各畫一條：左段、右段分別是兩列的座數，總長就是組和 */
export function renderTowerPairingExam(p: p5, scene: Scene): void {
  p.background(10, 10, 10);
  p.textFont('system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans TC CJK", sans-serif');
  const en = scene.locale === 'en';
  const narrow = scene.width < 520;
  const left = narrow ? 64 : 84;
  const right = scene.width - 16;
  const top = 16;
  const chipsH = 46;
  const bottom = scene.height - chipsH - 18;
  const sums = targetSums(scene.d);
  const maxSum = 40;
  const unit = (right - left) / maxSum;
  const rowH = (bottom - top) / sums.length;

  // 刻度
  p.stroke(...WHITE, 40);
  p.strokeWeight(1);
  for (let v = 0; v <= maxSum; v += 4) p.line(left + v * unit, top, left + v * unit, bottom);
  p.noStroke();
  p.fill(...WHITE, 120);
  p.textSize(10);
  p.textAlign(p.CENTER, p.TOP);
  for (let v = 0; v <= maxSum; v += 8) p.text(String(v), left + v * unit, bottom + 3);

  sums.forEach((s, i) => {
    const y = top + i * rowH + rowH * 0.18;
    const h = rowH * 0.64;
    const ok = Number.isInteger(s) && s > 0 && s % 2 === 0;
    p.noStroke();
    p.fill(...((ok ? WHITE : GOLD) as Rgb), 220);
    p.textSize(narrow ? 11 : 13);
    p.textAlign(p.RIGHT, p.CENTER);
    p.text(`b${i + 1} = ${Number.isInteger(s) ? s : s.toFixed(1)}`, left - 8, y + h / 2);

    const pair = scene.pairing?.[i];
    if (pair) {
      const [a, b] = pair.map((idx) => ROWS[idx]).sort((m, n) => n - m);
      p.fill(...GOLD, 200);
      p.rect(left, y, a * unit, h, 3);
      p.fill(...CYAN, 200);
      p.rect(left + a * unit, y, b * unit, h, 3);
      p.fill(10);
      p.textSize(11);
      p.textAlign(p.CENTER, p.CENTER);
      if (a * unit > 16) p.text(String(a), left + (a * unit) / 2, y + h / 2);
      if (b * unit > 12) p.text(String(b), left + a * unit + (b * unit) / 2, y + h / 2);
    } else if (s > 0) {
      p.noFill();
      p.stroke(...((ok ? WHITE : GOLD) as Rgb), 120);
      withDash(p, [4, 4], () => p.rect(left, y, Math.min(s, maxSum) * unit, h, 3));
      p.noStroke();
    }
    if (!ok) {
      p.fill(...GOLD, 230);
      p.textSize(11);
      p.textAlign(p.LEFT, p.CENTER);
      const why = s <= 0 ? (en ? 'not positive' : '不是正數') : s < 4 ? (en ? 'below 1+3' : '小於 1+3') : en ? 'odd' : '奇數';
      p.text(why, left + Math.max(0, Math.min(s, maxSum)) * unit + 6, y + h / 2);
    }
  });

  // 12 列座數，用掉的變暗
  const used = new Set(scene.pairing?.flat() ?? []);
  const chipW = (scene.width - 32) / ROWS.length;
  const cy = scene.height - chipsH / 2 - 4;
  ROWS.forEach((v, i) => {
    const x = 16 + i * chipW + chipW / 2;
    p.noStroke();
    p.fill(...WHITE, used.has(i) ? 40 : 18);
    p.rect(x - chipW / 2 + 2, cy - 14, chipW - 4, 28, 4);
    p.fill(...WHITE, used.has(i) ? 120 : 230);
    p.textSize(narrow ? 11 : 13);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(String(v), x, cy);
  });
}
