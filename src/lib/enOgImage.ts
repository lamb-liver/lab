import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import satori from 'satori';
import sharp from 'sharp';
import { buildEnOgElement, type EnOgCardContent } from './enOgSatori';
import { renderThumbnailDataUrl, resolveWorkOgContent, WORK_OG_HEIGHT, WORK_OG_WIDTH } from './workOgImage';

const require = createRequire(import.meta.url);

type OgFont = { name: string; data: ArrayBuffer; weight: 400; style: 'normal' };

const FONT_FILES: Array<[string, string]> = [
  // 英文字：Noto Sans TC 的拉丁子集（與中文 OG 同一套字體設計）
  ['Noto Sans', require.resolve('@fontsource/noto-sans-tc/files/noto-sans-tc-latin-400-normal.woff')],
  // 品牌「羊·實驗」等中文字：與中文作品 OG 相同的字型檔
  [
    'Noto Sans TC',
    require.resolve('@fontsource/noto-sans-tc/files/noto-sans-tc-chinese-traditional-400-normal.woff'),
  ],
  ['JetBrains Mono', require.resolve('@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff')],
  // 公式符號備援（希臘字母、上下標、數學運算子）：見 scripts/og-fonts/README.md
  ['Noto Sans Mono', fileURLToPath(new URL('../../scripts/og-fonts/NotoSansMono-OgSymbols.woff', import.meta.url))],
  ['Noto Sans Math', fileURLToPath(new URL('../../scripts/og-fonts/NotoSansMath-OgSymbols.woff', import.meta.url))],
];

/** 作品模組的公式含中文字時的英文版（用語依 docs/i18n-glossary.md） */
const EN_FORMULA_OVERRIDES: Record<string, string> = {
  'lp-objective-level-curves': 'z = px + qy, level curves px + qy = k',
  'lp-vertex-optimum': 'zⱼ = p xⱼ + q yⱼ, optimum at a vertex',
  'poincare-triangle': 'angle sum < 180°',
  'row-op-solution-space': 'row 3 := row 3 + k × row 1',
};

/** 公式來自作品模組（中文頁共用），英文卡片把全形逗號／分號換成半形 */
export function toEnFormula(slug: string, formula: string): string {
  const text = EN_FORMULA_OVERRIDES[slug] ?? formula;
  return text.replace(/，\s*/g, ', ').replace(/；\s*/g, '; ').trim();
}

let cachedFonts: OgFont[] | null = null;

export function getEnOgFonts(): OgFont[] {
  if (cachedFonts) return cachedFonts;
  cachedFonts = FONT_FILES.map(([name, path]) => ({
    name,
    data: Uint8Array.from(readFileSync(path)).buffer,
    weight: 400,
    style: 'normal',
  }));
  return cachedFonts;
}

const COVER_WIDTH = 960;
const COVER_HEIGHT = 600;
const COVER_BACKGROUND = '#0a0a0a';

export async function coverDataUrl(pngPath: string): Promise<string> {
  const png = await sharp(readFileSync(pngPath))
    .resize(COVER_WIDTH, COVER_HEIGHT, { fit: 'contain', background: COVER_BACKGROUND })
    .png()
    .toBuffer();
  return `data:image/png;base64,${png.toString('base64')}`;
}

/**
 * 以 satori 繪製；任何字元在所有字型中都找不到時，satori 會呼叫 loadAdditionalAsset，
 * 這裡把它當成缺字檢查：有缺字就讓 build 失敗，不會產生豆腐字的圖。
 */
const CJK_TEXT = /[\u3000-\u303f\u3400-\u9fff\uf900-\ufaff\uff00-\uffef]/;

export async function renderEnOgCard(content: EnOgCardContent, label: string): Promise<Buffer> {
  // 品牌「羊·實驗」之外，英文卡片上不應出現中文
  for (const text of [content.title, content.kicker, content.formula]) {
    if (text && CJK_TEXT.test(text)) {
      throw new Error(`en OG ${label}: Chinese text in ${JSON.stringify(text)}`);
    }
  }
  const missing: string[] = [];
  const svg = await satori(buildEnOgElement(content), {
    width: WORK_OG_WIDTH,
    height: WORK_OG_HEIGHT,
    fonts: getEnOgFonts(),
    loadAdditionalAsset: async (_code, segment) => {
      missing.push(segment);
      return [];
    },
  });
  if (missing.length) {
    throw new Error(`en OG ${label}: no font has glyphs for ${JSON.stringify(missing.join(''))}`);
  }
  return sharp(Buffer.from(svg)).png().toBuffer();
}

export async function renderEnWorkOgPng(slug: string, title: string): Promise<Buffer> {
  const { formula } = resolveWorkOgContent(slug, title);
  const imageDataUrl = await renderThumbnailDataUrl(slug);
  return renderEnOgCard({ title, formula: toEnFormula(slug, formula), imageDataUrl }, `works/${slug}`);
}
