import type p5 from 'p5';
import {
  K_MAX,
  K_MIN,
  K_MIN_TAN,
  MIN_TAN,
  intersections,
  tanFormula,
} from '../../exam/gaokao-2026-i-ellipse-slope-product/geometry';
import { clipRect, withDash } from './p5PlotHelpers';

const GOLD = [212, 184, 122] as const;
const WHITE = [232, 232, 232] as const;
const CYAN = [128, 196, 210] as const;

type Scene = { width: number; height: number; k: number; locale?: 'en' };

export function renderEllipseSlopeProductExam(p: p5, scene: Scene): void {
  p.background(10, 10, 10);
  p.textFont('system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans TC CJK", sans-serif');
  const en = scene.locale === 'en';
  const { k } = scene;

  // 上：橢圓
  const plotH = scene.height * 0.64;
  const scale = Math.min((scene.width - 24) / 5.2, (plotH - 16) / 4.2);
  const cx = scene.width / 2;
  const cy = plotH / 2 + 4;
  const sx = (x: number) => cx + x * scale;
  const sy = (y: number) => cy - y * scale;
  const { P, Q, R } = intersections(k);

  clipRect(p, { x: 0, y: 0, w: scene.width, h: plotH }, () => {
    p.stroke(...WHITE, 45);
    p.strokeWeight(1);
    p.line(0, sy(0), scene.width, sy(0));
    p.line(sx(0), 0, sx(0), plotH);
    p.noFill();
    p.stroke(...WHITE, 170);
    p.strokeWeight(1.4);
    p.ellipse(sx(0), sy(0), 4 * scale, 2 * Math.sqrt(3) * scale);

    // 直線 l 與 PR
    p.stroke(...GOLD, 200);
    p.strokeWeight(1.6);
    p.line(sx(-3), sy(k * -2), sx(3), sy(k * 4));
    withDash(p, [4, 4], () => {
      p.stroke(...WHITE, 110);
      p.strokeWeight(1);
      p.line(sx(P.x), sy(P.y), sx(R.x), sy(R.y));
    });
    p.stroke(...CYAN, 220);
    p.strokeWeight(1.8);
    p.line(sx(Q.x), sy(Q.y), sx(R.x), sy(R.y));

    // ∠PQR 的小弧
    const a1 = Math.atan2(-(P.y - Q.y), P.x - Q.x);
    const a2 = Math.atan2(-(R.y - Q.y), R.x - Q.x);
    p.noFill();
    p.stroke(...GOLD, 220);
    p.strokeWeight(1.4);
    p.arc(sx(Q.x), sy(Q.y), 34, 34, Math.min(a1, a2), Math.max(a1, a2));

    const labels: [string, { x: number; y: number }, readonly [number, number, number]][] = [
      ['P', P, WHITE],
      ['Q', Q, WHITE],
      ['R', R, WHITE],
      ['F', { x: -1, y: 0 }, GOLD],
      ['O', { x: 0, y: 0 }, WHITE],
    ];
    labels.forEach(([name, pt, color]) => {
      p.noStroke();
      p.fill(...color);
      p.circle(sx(pt.x), sy(pt.y), 6);
      p.fill(...color, 220);
      p.textSize(12);
      p.textAlign(p.LEFT, p.BOTTOM);
      p.text(name, sx(pt.x) + 5, sy(pt.y) - 3);
    });
  });

  // 下：tan∠PQR = 4k + 3/k
  const left = 40;
  const right = scene.width - 14;
  const top = plotH + 20;
  const bottom = scene.height - 22;
  const vMin = 6;
  const vMax = 18;
  const gx = (kk: number) => left + ((kk - K_MIN) / (K_MAX - K_MIN)) * (right - left);
  const gy = (v: number) => bottom - ((v - vMin) / (vMax - vMin)) * (bottom - top);

  p.stroke(...WHITE, 70);
  p.strokeWeight(1);
  p.line(left, bottom, right, bottom);
  p.line(left, top, left, bottom);
  p.noStroke();
  p.fill(...WHITE, 150);
  p.textSize(10);
  p.textAlign(p.CENTER, p.TOP);
  for (let kk = 1; kk <= K_MAX; kk += 1) p.text(String(kk), gx(kk), bottom + 3);
  p.textAlign(p.LEFT, p.TOP);
  p.text(en ? 'tan∠PQR = 4k + 3/k' : 'tan∠PQR = 4k + 3/k 對 k', left + 6, top - 14);
  p.textAlign(p.RIGHT, p.CENTER);
  p.text('4√3', left - 4, gy(MIN_TAN));

  withDash(p, [3, 4], () => {
    p.stroke(...GOLD, 90);
    p.line(left, gy(MIN_TAN), right, gy(MIN_TAN));
  });
  clipRect(p, { x: left, y: top - 2, w: right - left, h: bottom - top + 2 }, () => {
    p.noFill();
    p.stroke(...CYAN, 220);
    p.strokeWeight(1.8);
    p.beginShape();
    for (let px = left; px <= right; px += 1) {
      const kk = K_MIN + ((px - left) / (right - left)) * (K_MAX - K_MIN);
      p.vertex(px, gy(tanFormula(kk)));
    }
    p.endShape();
  });
  p.noStroke();
  p.fill(...GOLD);
  p.circle(gx(K_MIN_TAN), gy(MIN_TAN), 6);
  const v = tanFormula(k);
  if (v <= vMax) {
    p.fill(...WHITE);
    p.circle(gx(k), gy(v), 8);
  }
}
