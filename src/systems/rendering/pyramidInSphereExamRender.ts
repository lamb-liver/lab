import type p5 from 'p5';
import {
  L_MAX,
  L_MIN,
  L_PEAK,
  R,
  V_MAX,
  V_MIN,
  readPyramid,
  volumeAt,
} from '../../exam/gaokao-2022-i-pyramid-in-sphere-volume/geometry';
import { withDash } from './p5PlotHelpers';

const GOLD = [212, 184, 122] as const;
const WHITE = [232, 232, 232] as const;
const CYAN = [128, 196, 210] as const;

type Scene = { width: number; height: number; l: number };

export function renderPyramidInSphereExam(p: p5, scene: Scene): void {
  p.background(10, 10, 10);
  p.textFont('system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans TC CJK", sans-serif');
  const narrow = scene.width < 560;
  const r = readPyramid(scene.l);

  // 左（或上）：軸截面
  const secW = narrow ? scene.width : scene.width * 0.42;
  const secH = narrow ? scene.height * 0.5 : scene.height;
  const unit = Math.min(secW, secH) / (2 * R + 1.4);
  const cx = secW / 2;
  const cy = secH / 2;
  const toX = (u: number) => cx + u * unit;
  const toY = (v: number) => cy - v * unit; // 球心在原點，頂點 (0, 3)

  p.noFill();
  p.stroke(...WHITE, 90);
  p.strokeWeight(1);
  p.circle(cx, cy, 2 * R * unit);
  const apexY = R;
  const baseY = R - r.height;
  withDash(p, [3, 4], () => {
    p.stroke(...WHITE, 60);
    p.line(toX(0), toY(apexY), toX(0), toY(baseY));
    p.line(toX(-r.halfDiagonal), toY(baseY), toX(r.halfDiagonal), toY(baseY));
  });
  p.stroke(...GOLD, 230);
  p.strokeWeight(2);
  p.line(toX(0), toY(apexY), toX(-r.halfDiagonal), toY(baseY));
  p.line(toX(0), toY(apexY), toX(r.halfDiagonal), toY(baseY));
  p.noStroke();
  p.fill(...WHITE);
  p.circle(cx, cy, 5);
  p.fill(...GOLD);
  p.circle(toX(0), toY(apexY), 7);
  p.circle(toX(-r.halfDiagonal), toY(baseY), 7);
  p.circle(toX(r.halfDiagonal), toY(baseY), 7);
  p.textSize(12);
  p.fill(...GOLD, 240);
  p.textAlign(p.LEFT, p.CENTER);
  p.text(
    `l = ${r.l.toFixed(2)}`,
    toX(r.halfDiagonal / 2) + 8,
    toY((apexY + baseY) / 2),
  );
  p.fill(...CYAN, 240);
  p.textAlign(p.RIGHT, p.CENTER);
  p.text(
    `h = ${r.height.toFixed(2)}`,
    toX(0) - 6,
    toY((apexY + baseY) / 2) + 16,
  );
  p.fill(...WHITE, 150);
  p.textAlign(p.LEFT, p.TOP);
  p.text('R = 3', toX(0) + 6, cy + 4);

  // 右（或下）：V(l) 曲線
  const gx0 = narrow ? 44 : secW + 44;
  const gx1 = scene.width - 16;
  const gy0 = narrow ? secH + 18 : 24;
  const gy1 = scene.height - 34;
  const vLo = 6;
  const vHi = 22;
  const sx = (l: number) => gx0 + ((l - L_MIN) / (L_MAX - L_MIN)) * (gx1 - gx0);
  const sy = (v: number) => gy1 - ((v - vLo) / (vHi - vLo)) * (gy1 - gy0);

  p.stroke(...WHITE, 90);
  p.strokeWeight(1);
  p.line(gx0, gy1, gx1, gy1);
  p.line(gx0, gy0, gx0, gy1);
  // 答案範圍
  p.noStroke();
  p.fill(...CYAN, 28);
  p.rect(gx0, sy(V_MAX), gx1 - gx0, sy(V_MIN) - sy(V_MAX));
  withDash(p, [3, 4], () => {
    p.stroke(...CYAN, 120);
    p.line(gx0, sy(V_MAX), gx1, sy(V_MAX));
    p.line(gx0, sy(V_MIN), gx1, sy(V_MIN));
    p.stroke(...WHITE, 60);
    p.line(sx(L_PEAK), gy0, sx(L_PEAK), gy1);
  });
  p.noStroke();
  p.fill(...CYAN, 220);
  p.textSize(11);
  p.textAlign(p.RIGHT, p.CENTER);
  p.text('64/3', gx0 - 4, sy(V_MAX));
  p.text('27/4', gx0 - 4, sy(V_MIN));
  p.fill(...WHITE, 150);
  p.textAlign(p.CENTER, p.TOP);
  p.text('3', sx(L_MIN), gy1 + 6);
  p.text('2√6', sx(L_PEAK), gy1 + 6);
  p.text('3√3', sx(L_MAX), gy1 + 6);
  p.textAlign(p.RIGHT, p.BOTTOM);
  p.text('l', gx1, gy1 - 4);

  p.noFill();
  p.stroke(...GOLD, 220);
  p.strokeWeight(2);
  p.beginShape();
  for (let i = 0; i <= 120; i += 1) {
    const l = L_MIN + ((L_MAX - L_MIN) * i) / 120;
    p.vertex(sx(l), sy(volumeAt(l)));
  }
  p.endShape();
  p.noStroke();
  p.fill(...GOLD);
  p.circle(sx(r.l), sy(r.volume), 10);
  p.fill(...GOLD, 240);
  p.textSize(12);
  const lx = sx(r.l);
  p.textAlign(lx > (gx0 + gx1) / 2 ? p.RIGHT : p.LEFT, p.BOTTOM);
  p.text(
    `V = ${r.volume.toFixed(2)}`,
    lx + (lx > (gx0 + gx1) / 2 ? -8 : 8),
    sy(r.volume) + 22,
  );
}
