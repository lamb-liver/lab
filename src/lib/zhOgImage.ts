import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import satori from 'satori';
import sharp from 'sharp';
import { getEnOgFonts } from './enOgImage';
import { buildEnOgElement, type EnOgCardContent } from './enOgSatori';
import { WORK_OG_HEIGHT, WORK_OG_WIDTH } from './workOgImage';

const require = createRequire(import.meta.url);

type OgFont = { name: string; data: ArrayBuffer; weight: 400; style: 'normal' };

/**
 * 中文試題／主題卡：與英文卡片同一個版面（enOgSatori.ts），字型也沿用英文卡的組合
 * （Noto Sans TC 繁中子集、拉丁子集、JetBrains Mono、scripts/og-fonts 符號子集），
 * 另外補上 @fontsource/noto-sans-tc 的 114、115、119 號子集，因為繁中子集不含「・」與全形「，：；」。
 */
const PUNCT_FONT_FILES: Array<[string, string]> = [
  // 試題出處的「・」（U+30FB）
  ['Noto Sans TC Punct0', require.resolve('@fontsource/noto-sans-tc/files/noto-sans-tc-114-400-normal.woff')],
  ['Noto Sans TC Punct', require.resolve('@fontsource/noto-sans-tc/files/noto-sans-tc-115-400-normal.woff')],
  ['Noto Sans TC Punct2', require.resolve('@fontsource/noto-sans-tc/files/noto-sans-tc-119-400-normal.woff')],
];

let cachedFonts: OgFont[] | null = null;

export function getZhOgFonts(): OgFont[] {
  if (cachedFonts) return cachedFonts;
  cachedFonts = [
    ...getEnOgFonts(),
    ...PUNCT_FONT_FILES.map(([name, path]) => ({
      name,
      data: Uint8Array.from(readFileSync(path)).buffer,
      weight: 400 as const,
      style: 'normal' as const,
    })),
  ];
  return cachedFonts;
}

/** 中文字（含全形標點）算 1 個字寬，其餘算 0.55 個字寬 */
export function zhTitleWidth(title: string): number {
  let width = 0;
  for (const ch of title) width += /[\u2e80-\u9fff\uf900-\ufaff\uff00-\uffef]/.test(ch) ? 1 : 0.55;
  return width;
}

/** 標題欄寬 528px，留一點餘裕 */
const TITLE_MAX_WIDTH = 520;
const TITLE_SIZES = [64, 56, 52, 48, 44];
/** 一行要縮到比這更小時，改排兩行 */
const ONE_LINE_MIN_SIZE = 52;
/** 兩行標題的斷行點：標點之後，或「的」「與」之後，不在詞中間斷開 */
const TITLE_BREAK_AFTER = /[，、：；的與]/;

function fitSize(width: number): number | null {
  return TITLE_SIZES.find((size) => size * width <= TITLE_MAX_WIDTH) ?? null;
}

/**
 * 中文標題排版：一行以 52px 以上放得下就排一行；否則在標點或「的」「與」之後斷成兩行
 * （選兩行中較長那行最短的斷點），字級取兩行都放得下的最大值。
 */
export function zhTitleLayout(title: string): { text: string; fontSize: number } {
  const oneLine = fitSize(zhTitleWidth(title));
  if (oneLine && oneLine >= ONE_LINE_MIN_SIZE) return { text: title, fontSize: oneLine };

  const chars = [...title];
  let best: { lines: [string, string]; width: number } | null = null;
  for (let i = 1; i < chars.length - 1; i += 1) {
    if (!TITLE_BREAK_AFTER.test(chars[i])) continue;
    const lines: [string, string] = [chars.slice(0, i + 1).join('').trim(), chars.slice(i + 1).join('').trim()];
    const width = Math.max(zhTitleWidth(lines[0]), zhTitleWidth(lines[1]));
    if (!best || width < best.width) best = { lines, width };
  }
  if (!best) {
    const half = Math.ceil(chars.length / 2);
    const lines: [string, string] = [chars.slice(0, half).join('').trim(), chars.slice(half).join('').trim()];
    best = { lines, width: Math.max(zhTitleWidth(lines[0]), zhTitleWidth(lines[1])) };
  }
  const twoLines = fitSize(best.width) ?? TITLE_SIZES[TITLE_SIZES.length - 1];
  if (oneLine && oneLine >= twoLines) return { text: title, fontSize: oneLine };
  return { text: best.lines.join('\n'), fontSize: twoLines };
}

/**
 * 以 satori 繪製；任何字元在所有字型中都找不到時，satori 會呼叫 loadAdditionalAsset，
 * 這裡把它當成缺字檢查：有缺字就讓 build 失敗，不會產生豆腐字的圖。
 */
export async function renderZhOgCard(
  content: Omit<EnOgCardContent, 'formula' | 'titleFontSize'>,
  label: string,
): Promise<Buffer> {
  const missing: string[] = [];
  const layout = zhTitleLayout(content.title);
  const svg = await satori(
    buildEnOgElement({ ...content, title: layout.text, titleFontSize: layout.fontSize }),
    {
      width: WORK_OG_WIDTH,
      height: WORK_OG_HEIGHT,
      fonts: getZhOgFonts(),
      loadAdditionalAsset: async (_code, segment) => {
        missing.push(segment);
        return [];
      },
    },
  );
  if (missing.length) {
    throw new Error(`zh OG ${label}: no font has glyphs for ${JSON.stringify(missing.join(''))}`);
  }
  return sharp(Buffer.from(svg)).png().toBuffer();
}
