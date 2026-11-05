import type p5 from 'p5';
import {
  CENTERS,
  K_AT_MAX,
  K_RANGE,
  MAX_SUM,
  sumThroughOrigin,
} from '../../exam/gaokao-2026-i-three-circles-chords/geometry';
import { clipRect, withDash } from './p5PlotHelpers';

const GOLD = [212, 184, 122] as const;
const WHITE = [232, 232, 232] as const;
const CYAN = [128, 196, 210] as const;
type Rgb = readonly [number, number, number];
const CIRCLE_COLORS: readonly Rgb[] = [WHITE, CYAN, GOLD];

type Scene = { width: number; height: number; k: number; b: number; locale?: 'en' };

export function renderThreeCirclesChordsExam(p: p5, scene: Scene): void {
  p.background(10, 10, 10);
  p.textFont('system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans TC CJK", sans-serif');
  const en = scene.locale === 'en';
  const { k, b } = scene;

  // 上半：三個圓與直線
  const plotH = scene.height * 0.66;
  const xMin = -3;
  const xMax = 3;
  const yMin = -1.4;
  const yMax = 3.1;
  const scale = Math.min((scene.width - 24) / (xMax - xMin), (plotH - 16) / (yMax - yMin));
  const cx = scene.width / 2;
  const cy = 8 + yMax * scale;
  const sx = (x: number) => cx + x * scale;
  const sy = (y: number) => cy - y * scale;
  const box = { x: 0, y: 0, w: scene.width, h: plotH };

  clipRect(p, box, () => {
    p.stroke(...WHITE, 50);
    p.strokeWeight(1);
    p.line(0, sy(0), scene.width, sy(0));
    p.line(sx(0), 0, sx(0), plotH);

    CENTERS.forEach((c, i) => {
      p.noFill();
      p.stroke(...CIRCLE_COLORS[i], 150);
      p.strokeWeight(1.4);
      p.circle(sx(c.x), sy(c.y), 2 * scale);
      p.noStroke();
      p.fill(...CIRCLE_COLORS[i], 200);
      p.circle(sx(c.x), sy(c.y), 5);
    });

    // 直線 y = kx + b
    const x0 = (0 - cx) / scale - 1;
    const x1 = (scene.width - cx) / scale + 1;
    p.stroke(...WHITE, 120);
    p.strokeWeight(1.2);
    p.line(sx(x0), sy(k * x0 + b), sx(x1), sy(k * x1 + b));

    // 弦：圓心投影到直線，往兩側延伸半弦長
    const ux = 1 / Math.sqrt(1 + k * k);
    const uy = k / Math.sqrt(1 + k * k);
    CENTERS.forEach((c, i) => {
      const t = (c.x - 0) * ux + (c.y - b) * uy;
      const fx = t * ux;
      const fy = b + t * uy;
      const d2 = (c.x - fx) ** 2 + (c.y - fy) ** 2;
      if (d2 >= 1) return;
      const half = Math.sqrt(1 - d2);
      p.stroke(...CIRCLE_COLORS[i], 240);
      p.strokeWeight(3);
      p.line(sx(fx - half * ux), sy(fy - half * uy), sx(fx + half * ux), sy(fy + half * uy));
      withDash(p, [2, 4], () => {
        p.stroke(...CIRCLE_COLORS[i], 110);
        p.strokeWeight(1);
        p.line(sx(c.x), sy(c.y), sx(fx), sy(fy));
      });
    });

    p.noStroke();
    p.fill(...WHITE, 170);
    p.textSize(11);
    p.textAlign(p.LEFT, p.TOP);
    ['C₁', 'C₂', 'C₃'].forEach((name, i) => {
      p.fill(...CIRCLE_COLORS[i], 220);
      p.text(name, sx(CENTERS[i].x) + 0.72 * scale, sy(CENTERS[i].y) - 0.95 * scale);
    });
  });

  // 下半：b = 0 時弦長和對 k 的曲線
  const left = 40;
  const right = scene.width - 14;
  const top = plotH + 18;
  const bottom = scene.height - 22;
  const gx = (kk: number) => left + ((kk + K_RANGE) / (2 * K_RANGE)) * (right - left);
  const vMin = 2;
  const vMax = 3.3;
  const gy = (v: number) => bottom - ((v - vMin) / (vMax - vMin)) * (bottom - top);

  p.stroke(...WHITE, 70);
  p.strokeWeight(1);
  p.line(left, bottom, right, bottom);
  p.line(left, top, left, bottom);
  p.noStroke();
  p.fill(...WHITE, 150);
  p.textSize(10);
  p.textAlign(p.CENTER, p.TOP);
  for (let kk = -K_RANGE; kk <= K_RANGE; kk += 2) p.text(String(kk), gx(kk), bottom + 3);
  p.textAlign(p.LEFT, p.TOP);
  p.text(en ? 'b = 0: s₁+s₂+s₃ against k' : 'b = 0：s₁+s₂+s₃ 對 k', left + 6, top - 14);
  p.textAlign(p.RIGHT, p.CENTER);
  p.text('3', left - 4, gy(3));

  withDash(p, [3, 4], () => {
    p.stroke(...WHITE, 60);
    p.line(left, gy(3), right, gy(3));
    p.stroke(...GOLD, 90);
    p.line(left, gy(MAX_SUM), right, gy(MAX_SUM));
  });

  clipRect(p, { x: left, y: top - 2, w: right - left, h: bottom - top + 2 }, () => {
    p.noFill();
    p.stroke(...CYAN, 220);
    p.strokeWeight(1.8);
    p.beginShape();
    for (let px = left; px <= right; px += 1) {
      const kk = -K_RANGE + ((px - left) / (right - left)) * 2 * K_RANGE;
      const v = sumThroughOrigin(kk);
      if (v === null) {
        p.endShape();
        p.beginShape();
        continue;
      }
      p.vertex(px, gy(v));
    }
    p.endShape();
  });

  [K_AT_MAX, -K_AT_MAX].forEach((kk) => {
    p.noStroke();
    p.fill(...GOLD);
    p.circle(gx(kk), gy(MAX_SUM), 6);
  });

  const current = Math.abs(b) < 1e-9 ? sumThroughOrigin(k) : null;
  if (current !== null && current >= vMin) {
    p.fill(...WHITE);
    p.circle(gx(k), gy(current), 8);
  }
}
