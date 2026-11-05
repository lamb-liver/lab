import type p5 from 'p5';
import { BALLS, HIT_PROBABILITY, type Tally } from '../../exam/gaokao-2025-i-distinct-balls-expectation/geometry';
import { withDash } from './p5PlotHelpers';

const GOLD = [212, 184, 122] as const;
const WHITE = [232, 232, 232] as const;

type Scene = { width: number; height: number; tally: Tally; locale?: 'en' };

export function renderDistinctBallsExam(p: p5, scene: Scene): void {
  const { tally } = scene;
  const en = scene.locale === 'en';
  p.background(10, 10, 10);
  p.textFont('system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans TC CJK", sans-serif');
  const pad = 22;
  const w = scene.width - pad * 2;
  const slot = w / BALLS;
  const r = Math.min(26, slot * 0.3);
  const lampY = pad + r + 18;
  const seen = new Set(tally.last);

  p.noStroke();
  p.fill(...WHITE, 160);
  p.textSize(12);
  p.textAlign(p.LEFT, p.TOP);
  p.text(
    tally.last.length
      ? `${en ? 'Last round' : '上一輪'}: ${tally.last.join(', ')}  →  X = ${seen.size}`
      : en
        ? 'Draw a round to light the balls'
        : '抽一輪，看哪幾顆球亮起來',
    pad,
    pad - 14,
  );

  const barTop = lampY + r + 34;
  const barBottom = scene.height - 40;
  const barH = barBottom - barTop;
  const target = barBottom - HIT_PROBABILITY * barH;

  for (let i = 0; i < BALLS; i += 1) {
    const cx = pad + slot * (i + 0.5);
    const lit = seen.has(i + 1);
    const ink = lit ? GOLD : WHITE;
    p.stroke(ink[0], ink[1], ink[2], lit ? 240 : 90);
    p.strokeWeight(2);
    p.fill(lit ? p.color(212, 184, 122, 70) : p.color(10, 10, 10));
    p.circle(cx, lampY, r * 2);
    p.noStroke();
    p.fill(ink[0], ink[1], ink[2], lit ? 255 : 150);
    p.textSize(15);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(String(i + 1), cx, lampY);

    const share = tally.rounds ? tally.hits[i] / tally.rounds : 0;
    const bw = Math.min(40, slot * 0.45);
    p.noStroke();
    p.fill(212, 184, 122, 150);
    p.rect(cx - bw / 2, barBottom - share * barH, bw, share * barH);
    p.fill(...WHITE, 170);
    p.textSize(11);
    p.textAlign(p.CENTER, p.TOP);
    p.text(tally.rounds ? share.toFixed(3) : '—', cx, barBottom + 6);
  }

  p.stroke(...WHITE, 70);
  p.strokeWeight(1);
  p.line(pad, barBottom, scene.width - pad, barBottom);
  p.stroke(...WHITE, 170);
  withDash(p, [5, 5], () => {
    p.line(pad, target, scene.width - pad, target);
  });
  p.noStroke();
  p.fill(...WHITE, 200);
  p.textSize(12);
  p.textAlign(p.RIGHT, p.BOTTOM);
  p.text(`61/125 ≈ 0.488`, scene.width - pad, target - 4);
  p.textAlign(p.LEFT, p.BOTTOM);
  p.text(en ? 'Share of rounds each ball appears' : '每顆球出現過的輪數比例', pad, barTop - 6);
}
