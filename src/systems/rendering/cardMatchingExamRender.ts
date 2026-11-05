import type p5 from 'p5';
import { JIA, MATCHINGS, YI, score } from '../../exam/gaokao-2024-i-card-matching/geometry';

const GOLD = [212, 184, 122] as const;
const WHITE = [232, 232, 232] as const;
const CYAN = [128, 196, 210] as const;
type Rgb = readonly [number, number, number];

type Scene = { width: number; height: number; index: number; onlyWins: boolean; locale?: 'en' };

/** 上半：甲、乙兩排牌與目前配對；下半：24 種配對的格子，依甲得分上色 */
export function renderCardMatchingExam(p: p5, scene: Scene): void {
  p.background(10, 10, 10);
  p.textFont('system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans TC CJK", sans-serif');
  const en = scene.locale === 'en';
  const narrow = scene.width < 520;
  const topH = scene.height * 0.5;
  const m = MATCHINGS[scene.index];

  const cardW = Math.min(56, (scene.width - 60) / 4 - 16);
  const cardH = Math.min(cardW * 1.3, topH * 0.3);
  const gap = (scene.width - 60 - 4 * cardW) / 3;
  const cx = (i: number) => 30 + i * (cardW + gap) + cardW / 2;
  const yJia = 22;
  const yYi = topH - cardH - 10;

  // 配對線
  m.forEach((j, i) => {
    const win = JIA[i] > YI[j];
    p.stroke(...((win ? GOLD : WHITE) as Rgb), win ? 230 : 90);
    p.strokeWeight(win ? 3 : 1.5);
    p.line(cx(i), yJia + cardH, cx(j), yYi);
  });

  const card = (x: number, y: number, label: string, color: readonly [number, number, number]) => {
    p.noFill();
    p.stroke(...color, 220);
    p.strokeWeight(1.5);
    p.rect(x - cardW / 2, y, cardW, cardH, 6);
    p.noStroke();
    p.fill(...color);
    p.textSize(narrow ? 16 : 20);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(label, x, y + cardH / 2);
  };
  JIA.forEach((v, i) => card(cx(i), yJia, String(v), GOLD));
  YI.forEach((v, j) => card(cx(j), yYi, String(v), CYAN));
  p.noStroke();
  p.fill(...WHITE, 160);
  p.textSize(11);
  p.textAlign(p.LEFT, p.CENTER);
  p.text(en ? 'A' : '甲', 6, yJia + cardH / 2);
  p.text(en ? 'B' : '乙', 6, yYi + cardH / 2);

  // 24 格
  const cols = narrow ? 6 : 12;
  const rows = 24 / cols;
  const gx0 = 14;
  const gy0 = topH + 14;
  const cw = (scene.width - 28) / cols;
  const ch = Math.min(56, (scene.height - gy0 - 10) / rows);
  MATCHINGS.forEach((mm, idx) => {
    const s = score(mm);
    const x = gx0 + (idx % cols) * cw;
    const y = gy0 + Math.floor(idx / cols) * ch;
    const win = s >= 2;
    const dim = scene.onlyWins && !win;
    p.noStroke();
    p.fill(...((win ? GOLD : WHITE) as Rgb), dim ? 8 : win ? 70 : 22);
    p.rect(x + 2, y + 2, cw - 4, ch - 4, 4);
    if (idx === scene.index) {
      p.noFill();
      p.stroke(...WHITE);
      p.strokeWeight(2);
      p.rect(x + 1, y + 1, cw - 2, ch - 2, 5);
    }
    p.noStroke();
    p.fill(...WHITE, dim ? 60 : 230);
    p.textSize(narrow ? 12 : 14);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(String(s), x + cw / 2, y + ch / 2);
  });
}

