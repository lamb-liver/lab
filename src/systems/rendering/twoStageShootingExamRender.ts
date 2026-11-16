import type p5 from 'p5';
import { pairedLabels, readStage } from '../../exam/gaokao-2024-ii-two-stage-shooting/geometry';

const GOLD = [212, 184, 122] as const;
const WHITE = [232, 232, 232] as const;

type Scene = { width: number; height: number; n: number };
type Rect = { x: number; y: number; w: number; h: number };

function panels(width: number, height: number): { chance: Rect; score: Rect } {
  const pad = 22;
  const gap = 16;
  if (width < 640) {
    const h = (height - pad * 2 - gap) / 2;
    return {
      chance: { x: pad, y: pad, w: width - pad * 2, h },
      score: { x: pad, y: pad + h + gap, w: width - pad * 2, h },
    };
  }
  const w = (width - pad * 2 - gap) / 2;
  const h = height - pad * 2;
  return {
    chance: { x: pad, y: pad, w, h },
    score: { x: pad + w + gap, y: pad, w, h },
  };
}

function paintPair(
  p: p5,
  bounds: Rect,
  gold: number,
  white: number,
  labels: { gold: string; white: string },
  caption: string,
) {
  const peak = Math.max(gold, white, 1e-6);
  const unit = (bounds.w - 96) / (peak * 1.12);
  const thick = Math.max(16, Math.min(40, bounds.h * 0.16));
  const x0 = bounds.x + 12;
  const goldY = bounds.y + bounds.h * 0.4;
  const whiteY = bounds.y + bounds.h * 0.74;

  p.noStroke();
  p.fill(...WHITE, 210);
  p.textSize(15);
  p.textAlign(p.LEFT, p.CENTER);
  p.text(caption, x0, bounds.y + 16);

  const bar = (
    y: number,
    value: number,
    color: readonly [number, number, number],
    alpha: number,
    text: string,
  ) => {
    p.noStroke();
    p.fill(...color, alpha);
    p.rect(x0, y - thick / 2, Math.max(2, value * unit), thick, 2);
    p.fill(...color, 230);
    p.textSize(14);
    p.textAlign(p.RIGHT, p.CENTER);
    p.text(text, bounds.x + bounds.w - 8, y);
  };

  bar(goldY, gold, GOLD, 220, labels.gold);
  bar(whiteY, white, WHITE, 200, labels.white);
}

export function renderTwoStageShootingExam(p: p5, scene: Scene): void {
  const reading = readStage(scene.n);
  const { chance, score } = panels(scene.width, scene.height);

  p.background(10, 10, 10);
  p.textFont('system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans TC CJK", sans-serif');

  paintPair(
    p,
    chance,
    reading.chanceGold,
    reading.chanceWhite,
    pairedLabels(reading.chanceGold, reading.chanceWhite, 3),
    'P(15)',
  );
  paintPair(
    p,
    score,
    reading.scoreGold,
    reading.scoreWhite,
    pairedLabels(reading.scoreGold, reading.scoreWhite, 2),
    'E',
  );
}
