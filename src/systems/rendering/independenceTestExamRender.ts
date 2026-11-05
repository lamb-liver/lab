import type p5 from 'p5';
import {
  CRITICAL,
  chiSquare,
  expectedTable,
  tableFor,
} from '../../exam/gaokao-2025-i-ultrasound-independence-test/geometry';
import { withDash } from './p5PlotHelpers';

const GOLD = [212, 184, 122] as const;
const WHITE = [232, 232, 232] as const;

type Scene = { width: number; height: number; b: number; locale?: 'en' };

/** χ² 用 log10(1 + χ²) 的刻度，0 到 1000 都放得下 */
function chiPos(v: number): number {
  return Math.log10(1 + v) / Math.log10(1001);
}

export function renderIndependenceTestExam(p: p5, scene: Scene): void {
  const en = scene.locale === 'en';
  const t = tableFor(scene.b);
  const e = expectedTable();
  const chi = chiSquare(t);
  p.background(10, 10, 10);
  p.textFont('system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans TC CJK", sans-serif');
  const pad = 22;
  const w = scene.width - pad * 2;

  // 上半：兩組（正常、不正常）中患病比例，觀察值 vs 獨立時
  const groups = [
    { label: en ? 'Normal scan' : '檢查正常', ill: t.a, total: t.a + t.c, exp: e.a / (e.a + e.c) },
    { label: en ? 'Abnormal scan' : '檢查不正常', ill: t.b, total: t.b + t.d, exp: e.b / (e.b + e.d) },
  ];
  const barTop = pad + 30;
  const barH = Math.max(110, scene.height * 0.5);
  const barBottom = barTop + barH;
  const colW = w / 2;
  p.noStroke();
  p.fill(...WHITE, 170);
  p.textSize(12);
  p.textAlign(p.LEFT, p.TOP);
  p.text(en ? 'Share who have the disease' : '組內患病的比例', pad, pad - 10);
  groups.forEach((g, i) => {
    const cx = pad + colW * (i + 0.5);
    const share = g.ill / g.total;
    const bw = Math.min(70, colW * 0.4);
    p.noStroke();
    p.fill(212, 184, 122, 160);
    p.rect(cx - bw / 2, barBottom - share * barH, bw, share * barH);
    const ey = barBottom - g.exp * barH;
    p.stroke(...WHITE, 200);
    p.strokeWeight(1.5);
    withDash(p, [5, 4], () => {
      p.line(cx - bw / 2 - 12, ey, cx + bw / 2 + 12, ey);
    });
    p.noStroke();
    p.fill(...GOLD, 240);
    p.textSize(13);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text(`${g.ill}/${g.total} = ${(share * 100).toFixed(1)}%`, cx, Math.max(barTop + 14, Math.min(barBottom - share * barH, ey) - 6));
    p.fill(...WHITE, 190);
    p.textSize(12);
    p.textAlign(p.CENTER, p.TOP);
    p.text(g.label, cx, barBottom + 6);
  });
  p.stroke(...WHITE, 80);
  p.strokeWeight(1);
  p.line(pad, barBottom, scene.width - pad, barBottom);
  p.noStroke();
  p.fill(...WHITE, 150);
  p.textSize(11);
  p.textAlign(p.LEFT, p.TOP);
  p.text(en ? 'dashed: 20% if independent' : '虛線：無關時兩組都是 20%', pad, barBottom + 26);

  // 下半：χ² 數線與臨界值
  const lineY = scene.height - 40;
  const x0 = pad + 6;
  const x1 = scene.width - pad - 6;
  const sx = (v: number) => x0 + chiPos(v) * (x1 - x0);
  p.stroke(...WHITE, 120);
  p.strokeWeight(1.2);
  p.line(x0, lineY, x1, lineY);
  p.noStroke();
  p.fill(...WHITE, 140);
  p.textSize(10);
  p.textAlign(p.CENTER, p.TOP);
  for (const tick of [0, 10, 100, 1000]) {
    p.text(String(tick), sx(tick), lineY + 16);
  }
  CRITICAL.forEach((c, i) => {
    const x = sx(c.k);
    p.stroke(...WHITE, i === 2 ? 220 : 110);
    p.strokeWeight(i === 2 ? 1.6 : 1);
    p.line(x, lineY - 8, x, lineY + 8);
    if (i === 2) {
      p.noStroke();
      p.fill(...WHITE, 200);
      p.textSize(11);
      p.textAlign(p.CENTER, p.BOTTOM);
      p.text('10.828', x, lineY - 10);
    }
  });
  const cx = sx(Math.min(chi, 1000));
  p.noStroke();
  p.fill(...GOLD);
  p.circle(cx, lineY, 12);
  p.textSize(13);
  p.textAlign(cx > scene.width * 0.7 ? p.RIGHT : p.LEFT, p.BOTTOM);
  p.text(`χ² = ${chi.toFixed(3)}`, cx + (cx > scene.width * 0.7 ? -8 : 8), lineY - 12);
}
