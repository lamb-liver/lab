import type p5 from 'p5';

/**
 * 畫布左上角的讀數區。
 *
 * 原本住在 `scene3d.ts`，但它跟 3D 無關——線性規劃那組 2D 頁面也要同一個東西。
 * 抽出來是為了讓下面那個換行修正只有一份：畫布窄時（手機）中文長句會折成兩行，
 * 用固定行距會讓下一行壓上來，所以行距要跟著實際換行數走。
 */

export type Rgb = [number, number, number];

export const SCENE_GUIDE: Rgb = [255, 255, 255];

export function drawReadout(
  p: p5,
  width: number,
  lines: string[],
  options: { highlightIndex?: number; highlightColor?: Rgb } = {},
): void {
  const { highlightIndex = -1, highlightColor = SCENE_GUIDE } = options;
  const margin = 18;
  const maxWidth = width - margin * 2;
  const fontSize = width < 420 ? 12 : 14;
  const lineHeight = fontSize + 6;

  p.push();
  p.noStroke();
  p.textSize(fontSize);
  p.textAlign(p.LEFT, p.TOP);

  let y = 16;
  for (const [index, line] of lines.entries()) {
    const on = index === highlightIndex;
    const color = on ? highlightColor : SCENE_GUIDE;
    p.fill(color[0], color[1], color[2], on ? 235 : 150);
    p.text(line, margin, y, maxWidth);
    const wrapped = Math.max(1, Math.ceil(p.textWidth(line) / maxWidth));
    y += wrapped * lineHeight;
  }
  p.pop();
}
