import satori from 'satori';
import sharp from 'sharp';
import { workCurveBySlug } from '../curve/registry';
import { getCurveThumbnailSvg } from './curveThumbnail';
import { getWorkOgFonts } from './workOgFonts';
import { buildWorkOgElement } from './workOgSatori';
import { ogFormulaProblems, toZhOgFormula } from './ogFormula';

export const WORK_OG_WIDTH = 1200;
export const WORK_OG_HEIGHT = 630;

const THUMBNAIL_WIDTH = 960;
const THUMBNAIL_HEIGHT = 600;
const OG_BACKGROUND = '#0a0a0a';

export function assertSharpCompatibleSvg(svg: string, slug: string): void {
  if (!/<svg\b[^>]*\bviewBox=(["']).+?\1/i.test(svg)) {
    throw new Error(`work OG SVG for ${slug} must include a viewBox`);
  }

  if (/<foreignObject\b/i.test(svg)) {
    throw new Error(`work OG SVG for ${slug} must not use foreignObject`);
  }

  if (/\b(?:href|xlink:href)\s*=\s*(["'])(?!#|data:)[^"']+\1/i.test(svg)) {
    throw new Error(`work OG SVG for ${slug} must not reference external href assets`);
  }

  if (/@font-face\b/i.test(svg)) {
    throw new Error(`work OG SVG for ${slug} must not embed @font-face`);
  }

  if (hasExternalSvgUrl(svg)) {
    throw new Error(`work OG SVG for ${slug} must not reference external url() assets`);
  }
}

/** Allow fragment (#id) and data: URLs; block http(s) and other remote fetches sharp cannot resolve. */
function hasExternalSvgUrl(svg: string): boolean {
  const urlPattern = /url\s*\(\s*(['"]?)([^'")]+)\1?\s*\)/gi;
  for (const match of svg.matchAll(urlPattern)) {
    const ref = match[2].trim();
    if (ref.startsWith('#') || ref.startsWith('data:')) continue;
    return true;
  }
  return false;
}

function withFixedSvgSize(svg: string): string {
  return svg.replace(/<svg\b([^>]*)>/i, (_match, attrs: string) => {
    const fixedAttrs = attrs
      .replace(/\swidth=(["']).*?\1/i, '')
      .replace(/\sheight=(["']).*?\1/i, '');
    return `<svg${fixedAttrs} width="${THUMBNAIL_WIDTH}" height="${THUMBNAIL_HEIGHT}">`;
  });
}

export function getWorkOgImagePath(slug: string): string {
  return `/og/works/${slug}.png`;
}

export function resolveWorkOgContent(slug: string, titleOverride?: string): {
  title: string;
  formula: string;
} {
  const mod = workCurveBySlug[slug];
  if (!mod) {
    throw new Error(`unknown work slug: ${slug}`);
  }

  const meta = mod.getMetadata(mod.defaultParams);
  return {
    title: titleOverride ?? meta.title,
    formula: meta.formula.trim(),
  };
}

export async function renderThumbnailDataUrl(slug: string): Promise<string> {
  const svg = getCurveThumbnailSvg(slug);
  if (!svg) {
    throw new Error(`missing thumbnail SVG for ${slug}`);
  }

  assertSharpCompatibleSvg(svg, slug);

  const png = await sharp(Buffer.from(withFixedSvgSize(svg)))
    .resize(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT, {
      fit: 'contain',
      background: OG_BACKGROUND,
    })
    .png()
    .toBuffer();

  return `data:image/png;base64,${png.toString('base64')}`;
}

export async function renderWorkOgPng(slug: string, titleOverride?: string): Promise<Buffer> {
  const resolved = resolveWorkOgContent(slug, titleOverride);
  // 公式改成卡片用的單行版本（Unicode 上下標、太長只留放得下的部分），與英文卡片共用對照表
  const content = { ...resolved, formula: toZhOgFormula(slug, resolved.formula) };
  const problems = ogFormulaProblems(content.formula);
  if (problems.length) {
    throw new Error(`work OG ${slug}: formula ${JSON.stringify(content.formula)}: ${problems.join('; ')}`);
  }
  const thumbnailDataUrl = await renderThumbnailDataUrl(slug);

  // satori 在所有字型都找不到某字元時才會呼叫 loadAdditionalAsset；
  // 這裡把它當成缺字檢查，有缺字就讓 build 失敗，不產生豆腐字的圖。
  const missing: string[] = [];
  const svg = await satori(buildWorkOgElement({ ...content, thumbnailDataUrl }), {
    width: WORK_OG_WIDTH,
    height: WORK_OG_HEIGHT,
    fonts: getWorkOgFonts(),
    loadAdditionalAsset: async (_code, segment) => {
      missing.push(segment);
      return [];
    },
  });
  if (missing.length) {
    const chars = [...new Set(missing.join(''))].join(' ');
    throw new Error(`work OG ${slug}: missing glyphs in OG fonts: ${chars}`);
  }

  return sharp(Buffer.from(svg)).png().toBuffer();
}

/** Warm font files during build so first OG route does not pay cold-start I/O. */
export function preloadWorkOgFonts(): void {
  getWorkOgFonts();
}
