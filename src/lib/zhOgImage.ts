import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import satori from 'satori';
import sharp from 'sharp';
import { getEnOgFonts } from './enOgImage';
import { buildEnOgElement, type EnOgCardContent } from './enOgSatori';
import { WORK_OG_HEIGHT, WORK_OG_WIDTH } from './workOgImage';
import { zhTitleLayout } from './zhOgTitle';

export { zhTitleLayout, zhTitleWidth } from './zhOgTitle';

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
