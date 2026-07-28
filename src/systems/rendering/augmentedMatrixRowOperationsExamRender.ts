import type p5 from 'p5';
import type { RowOperationCombination } from '../../exam/ast-113-augmented-matrix-row-operations/geometry';

type AugmentedMatrixRowOperationsExamSnap = {
  width: number;
  height: number;
  alpha: number;
  beta: number;
  result: RowOperationCombination;
};

const ACCENT = [212, 184, 122] as const;
const WHITE = [232, 232, 232] as const;
const BLUE = [93, 173, 226] as const;

export function renderAugmentedMatrixRowOperationsExamScene(
  p: p5,
  snap: AugmentedMatrixRowOperationsExamSnap,
): void {
  p.background(10, 10, 10);
  p.textFont("system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif");

  const vertical = snap.width < 520;
  const panels = vertical
    ? [
        { x: 22, y: 24, w: snap.width - 44, h: 100 },
        { x: 22, y: 158, w: snap.width - 44, h: 120 },
        { x: 22, y: 312, w: snap.width - 44, h: 94 },
      ]
    : [
        { x: 22, y: 58, w: snap.width * 0.28, h: snap.height - 116 },
        { x: snap.width * 0.36, y: 58, w: snap.width * 0.3, h: snap.height - 116 },
        { x: snap.width * 0.72, y: 58, w: snap.width * 0.25, h: snap.height - 116 },
      ];

  drawPanel(
    p,
    panels[0],
    '原常數',
    `α(2, 1)+β(−1, −1)`,
    pairText(snap.result.originalRightSide),
    BLUE,
  );
  drawPanel(
    p,
    panels[1],
    '同一列運算',
    `[1  −1 │ ${snap.result.reducedRightSide[0]}]`,
    `[0   1 │ ${snap.result.reducedRightSide[1]}]`,
    WHITE,
  );
  drawPanel(
    p,
    panels[2],
    '解',
    `y=${snap.result.solution[1]}`,
    `x=${snap.result.solution[0]}`,
    ACCENT,
  );

  p.noStroke();
  p.fill(...ACCENT, 185);
  p.textSize(12);
  p.textAlign(p.CENTER, p.CENTER);
  if (vertical) {
    p.text('相同倍數與相加關係', snap.width / 2, 141);
    p.text('先讀 y，再求 x', snap.width / 2, 295);
  } else {
    p.text('→', snap.width * 0.325, snap.height / 2);
    p.text('→', snap.width * 0.69, snap.height / 2);
  }

  p.fill(...WHITE, 95);
  p.textAlign(p.LEFT, p.TOP);
  p.text(
    `α=${snap.alpha}　β=${snap.beta}`,
    vertical ? 22 : snap.width * 0.36,
    vertical ? 8 : 25,
  );
}

function drawPanel(
  p: p5,
  rect: { x: number; y: number; w: number; h: number },
  title: string,
  line1: string,
  line2: string,
  color: readonly [number, number, number],
): void {
  p.fill(...WHITE, 7);
  p.stroke(...color, 80);
  p.strokeWeight(1);
  p.rect(rect.x, rect.y, rect.w, rect.h, 8);

  p.noStroke();
  p.fill(...color, 220);
  p.textAlign(p.LEFT, p.TOP);
  p.textStyle(p.BOLD);
  p.textSize(12);
  p.text(title, rect.x + 14, rect.y + 13);

  p.textStyle(p.NORMAL);
  p.fill(...WHITE, 170);
  p.textSize(rect.w < 190 ? 12 : 14);
  p.text(line1, rect.x + 14, rect.y + rect.h * 0.48);
  p.fill(...color, 225);
  p.text(line2, rect.x + 14, rect.y + rect.h * 0.7);
}

function pairText(pair: readonly [number, number]): string {
  return `= (${pair[0]}, ${pair[1]})`;
}
