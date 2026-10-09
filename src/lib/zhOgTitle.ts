/**
 * 中文 OG 卡片的標題排版（試題／主題卡與作品卡共用）：放得下就排一行；
 * 太長就在標點或「的」「與」之後（或全形括號之前）斷成兩行，不在詞中間斷開。
 */

/** 中文字（含全形標點）算 1 個字寬，其餘算 0.55 個字寬 */
export function zhTitleWidth(title: string): number {
  let width = 0;
  for (const ch of title) width += /[\u2e80-\u9fff\uf900-\ufaff\uff00-\uffef]/.test(ch) ? 1 : 0.55;
  return width;
}

/** 標題欄寬 528px，留一點餘裕 */
const TITLE_MAX_WIDTH = 520;
/** 試題／主題卡的字級 */
export const ZH_CARD_TITLE_SIZES = [64, 56, 52, 48, 44];
/** 作品卡的字級（短標題沿用原本較大的 72px） */
export const ZH_WORK_TITLE_SIZES = [72, 64, 60, 56, 52, 48, 44];
/** 一行要縮到比這更小時，改排兩行 */
const ONE_LINE_MIN_SIZE = 52;
/** 斷行點：標點之後，或「的」「與」之後 */
const BREAK_AFTER = /[，、：；的與]/;
/** 斷行點：全形左括號之前 */
const BREAK_BEFORE = /[（「]/;

function fitSize(width: number, sizes: number[]): number | null {
  return sizes.find((size) => size * width <= TITLE_MAX_WIDTH) ?? null;
}

/**
 * 一行以 52px 以上放得下就排一行；否則在斷行點斷成兩行（選兩行中較長那行最短的斷點），
 * 字級取兩行都放得下的最大值。沒有斷行點時寧可排一行縮小字級，不在詞中間斷開。
 */
export function zhTitleLayout(
  title: string,
  sizes: number[] = ZH_CARD_TITLE_SIZES,
): { text: string; fontSize: number } {
  const smallest = sizes[sizes.length - 1];
  const oneLine = fitSize(zhTitleWidth(title), sizes);
  if (oneLine && oneLine >= ONE_LINE_MIN_SIZE) return { text: title, fontSize: oneLine };

  const chars = [...title];
  let best: { lines: [string, string]; width: number } | null = null;
  for (let i = 1; i < chars.length - 1; i += 1) {
    if (!BREAK_AFTER.test(chars[i]) && !BREAK_BEFORE.test(chars[i + 1])) continue;
    const lines: [string, string] = [chars.slice(0, i + 1).join('').trim(), chars.slice(i + 1).join('').trim()];
    const width = Math.max(zhTitleWidth(lines[0]), zhTitleWidth(lines[1]));
    if (!best || width < best.width) best = { lines, width };
  }
  if (!best) {
    if (oneLine) return { text: title, fontSize: oneLine };
    // 最後手段：一行用最小字級也放不下又沒有斷行點，才從中間斷開
    const half = Math.ceil(chars.length / 2);
    const lines: [string, string] = [chars.slice(0, half).join('').trim(), chars.slice(half).join('').trim()];
    best = { lines, width: Math.max(zhTitleWidth(lines[0]), zhTitleWidth(lines[1])) };
  }
  const twoLines = fitSize(best.width, sizes) ?? smallest;
  if (oneLine && oneLine >= twoLines) return { text: title, fontSize: oneLine };
  return { text: best.lines.join('\n'), fontSize: twoLines };
}
