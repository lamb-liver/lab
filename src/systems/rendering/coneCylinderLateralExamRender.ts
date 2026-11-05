import type p5 from 'p5';
import { HEIGHT, readConeCylinder } from '../../exam/gaokao-2024-i-cone-cylinder-lateral/geometry';
import { withDash } from './p5PlotHelpers';

const GOLD = [212, 184, 122] as const;
const WHITE = [232, 232, 232] as const;

type Scene = {
  width: number;
  height: number;
  radius: number;
};

function drawCylinder(p: p5, x: number, baseline: number, base: number, bodyH: number): void {
  p.noFill();
  p.stroke(...WHITE, 210);
  p.strokeWeight(1.6);
  p.rect(x, baseline - bodyH, base, bodyH);
  withDash(p, [4, 4], () => {
    p.stroke(...WHITE, 90);
    p.line(x + base / 2, baseline, x + base / 2, baseline - bodyH);
  });
}

function drawCone(
  p: p5,
  cx: number,
  baseline: number,
  halfBase: number,
  bodyH: number,
  match: boolean,
): void {
  p.noFill();
  p.stroke(...GOLD, match ? 240 : 200);
  p.strokeWeight(match ? 2.2 : 1.6);
  p.triangle(cx - halfBase, baseline, cx + halfBase, baseline, cx, baseline - bodyH);
  withDash(p, [4, 4], () => {
    p.stroke(...GOLD, 90);
    p.line(cx, baseline, cx, baseline - bodyH);
  });
}

function drawRightTriangle(
  p: p5,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number,
  match: boolean,
): void {
  const margin = 26;
  const unit = Math.min((w - margin * 2) / radius, (h - margin * 2) / HEIGHT);
  const rw = radius * unit;
  const hh = HEIGHT * unit;
  const x0 = x + (w - rw) / 2;
  const y0 = y + (h + hh) / 2;

  p.stroke(...WHITE, 190);
  p.strokeWeight(1.5);
  p.line(x0, y0, x0 + rw, y0);
  p.line(x0, y0, x0, y0 - hh);

  p.stroke(...GOLD, match ? 240 : 200);
  p.strokeWeight(match ? 2.4 : 1.8);
  p.line(x0 + rw, y0, x0, y0 - hh);

  const mark = Math.min(12, rw * 0.22, hh * 0.22);
  p.stroke(...WHITE, 140);
  p.strokeWeight(1.2);
  p.line(x0 + mark, y0, x0 + mark, y0 - mark);
  p.line(x0 + mark, y0 - mark, x0, y0 - mark);

  p.noStroke();
  p.fill(...WHITE, 220);
  p.textSize(14);
  p.textAlign(p.CENTER, p.TOP);
  p.text('r', x0 + rw / 2, y0 + 4);
  p.textAlign(p.RIGHT, p.CENTER);
  p.text('h', x0 - 8, y0 - hh / 2);
  p.fill(...GOLD, 230);
  p.textAlign(p.CENTER, p.BOTTOM);
  p.text('l', x0 + rw * 0.62, y0 - hh * 0.62);
}

function drawPair(
  p: p5,
  left: number,
  top: number,
  width: number,
  height: number,
  radius: number,
  match: boolean,
): void {
  const gap = 16;
  const slotW = (width - gap) / 2;
  const unit = Math.min((slotW - 12) / (2 * radius), (height - 28) / HEIGHT);
  const base = 2 * radius * unit;
  const bodyH = HEIGHT * unit;
  const baseline = top + (height + bodyH) / 2;
  drawCylinder(p, left + (slotW - base) / 2, baseline, base, bodyH);
  drawCone(p, left + slotW + gap + slotW / 2, baseline, base / 2, bodyH, match);
}

export function renderConeCylinderExam(p: p5, scene: Scene): void {
  const reading = readConeCylinder(scene.radius);
  p.background(10, 10, 10);
  p.textFont('system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans TC CJK", sans-serif');

  const pad = 22;
  const narrow = scene.width < 520;

  if (narrow) {
    const triH = Math.round(scene.height * 0.62);
    drawRightTriangle(p, pad, pad, scene.width - pad * 2, triH - pad, reading.radius, reading.areasMatch);
    drawPair(
      p,
      pad,
      triH,
      scene.width - pad * 2,
      scene.height - triH - pad,
      reading.radius,
      reading.areasMatch,
    );
    return;
  }

  const triW = Math.min(230, Math.max(168, scene.width * 0.34));
  drawPair(p, pad, pad, scene.width - triW - pad * 2, scene.height - pad * 2, reading.radius, reading.areasMatch);
  drawRightTriangle(
    p,
    scene.width - triW,
    pad,
    triW - pad,
    scene.height - pad * 2,
    reading.radius,
    reading.areasMatch,
  );
}
