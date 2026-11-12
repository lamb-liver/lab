import type p5 from 'p5';
import { readLead } from '../../exam/gaokao-2025-ii-two-point-lead/geometry';

const GOLD = [212, 184, 122] as const;
const WHITE = [232, 232, 232] as const;
const GAP_SCALE = 0.36;

type Scene = { width: number; height: number; n: number };
type Rect = { x: number; y: number; w: number; h: number };
type Point = { x: number; y: number };

function panels(width: number, height: number): { bars: Rect; stems: Rect } {
  const pad = 22;
  const gap = 16;
  if (width < 640) {
    const h = (height - pad * 2 - gap) / 2;
    return {
      bars: { x: pad, y: pad, w: width - pad * 2, h },
      stems: { x: pad, y: pad + h + gap, w: width - pad * 2, h },
    };
  }
  const w = (width - pad * 2 - gap) / 2;
  const h = height - pad * 2;
  return {
    bars: { x: pad, y: pad, w, h },
    stems: { x: pad + w + gap, y: pad, w, h },
  };
}

function drawLabel(
  p: p5,
  text: string,
  point: Point,
  color: readonly [number, number, number],
  bounds: Rect,
) {
  p.noStroke();
  p.fill(...color, 230);
  p.textSize(14);
  p.textAlign(p.CENTER, p.CENTER);
  const half = Math.max(12, p.textWidth(text) / 2 + 4);
  const x = Math.min(bounds.x + bounds.w - half, Math.max(bounds.x + half, point.x));
  const y = Math.min(bounds.y + bounds.h - 12, Math.max(bounds.y + 12, point.y));
  p.text(text, x, y);
}

export function renderTwoPointLeadExam(p: p5, scene: Scene): void {
  const reading = readLead(scene.n);
  const { bars, stems } = panels(scene.width, scene.height);

  p.background(10, 10, 10);
  p.textFont('system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans TC CJK", sans-serif');

  const thick = Math.max(18, Math.min(42, bars.h * 0.16));
  const goldY = bars.y + bars.h * 0.34;
  const whiteY = bars.y + bars.h * 0.7;
  const x0 = bars.x + 16;
  const unit = (bars.w - 32) / GAP_SCALE;

  const paint = (y: number, length: number, color: readonly [number, number, number], alpha: number) => {
    p.noStroke();
    p.fill(...color, alpha);
    p.rect(x0, y - thick / 2, Math.max(2, length * unit), thick, 2);
  };
  paint(goldY, reading.goldGap, GOLD, 215);
  paint(whiteY, reading.whiteGap, WHITE, 200);

  const tickX = x0 + (reading.p / reading.q) * reading.whiteGap * unit;
  p.stroke(...WHITE, 230);
  p.strokeWeight(1.5);
  p.line(tickX, goldY - thick / 2 - 14, tickX, goldY + thick / 2);
  drawLabel(p, 'p/q', { x: tickX, y: goldY - thick / 2 - 24 }, WHITE, bars);

  const plotX = stems.x + 12;
  const plotW = stems.w - 24;
  const baseY = stems.y + stems.h - 28;
  const plotH = baseY - (stems.y + 16);
  const peak = Math.max(...reading.steps.map((step) => step.difference));
  const yTop = Math.max(peak * 1.15, 0.12);
  const xOf = (k: number) => plotX + ((k - 2) / 6) * plotW;
  const yOf = (value: number) => baseY - (value / yTop) * plotH;

  p.stroke(...WHITE, 40);
  p.strokeWeight(1);
  p.line(plotX, baseY, plotX + plotW, baseY);

  p.noFill();
  p.stroke(...WHITE, 80);
  p.strokeWeight(1.5);
  p.beginShape();
  for (const row of reading.steps) p.vertex(xOf(row.k), yOf(row.difference));
  p.endShape();

  const stemW = Math.min(22, plotW / 10);
  for (const row of reading.steps) {
    const odd = row.k % 2 === 1;
    const color: readonly [number, number, number] = odd ? GOLD : WHITE;
    const top = yOf(row.difference);
    p.noStroke();
    p.fill(...color, odd ? 220 : 200);
    p.rect(xOf(row.k) - stemW / 2, top, stemW, Math.max(2, baseY - top), 2);
    drawLabel(p, String(row.k), { x: xOf(row.k), y: baseY + 14 }, color, stems);
  }
}
