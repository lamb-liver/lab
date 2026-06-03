import sharp from 'sharp';
import { getCurveThumbnailSvg } from './curveThumbnail';

export const WORK_OG_WIDTH = 1200;
export const WORK_OG_HEIGHT = 630;

const THUMBNAIL_WIDTH = 1200;
const THUMBNAIL_HEIGHT = 750;
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

  if (/@font-face\b|url\(/i.test(svg)) {
    throw new Error(`work OG SVG for ${slug} must not reference external fonts`);
  }
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

export async function renderWorkOgPng(slug: string): Promise<Buffer> {
  const svg = getCurveThumbnailSvg(slug);
  if (!svg) {
    throw new Error(`missing thumbnail SVG for ${slug}`);
  }

  assertSharpCompatibleSvg(svg, slug);

  return sharp(Buffer.from(withFixedSvgSize(svg)))
    .resize(WORK_OG_WIDTH, WORK_OG_HEIGHT, {
      fit: 'contain',
      background: OG_BACKGROUND,
    })
    .png()
    .toBuffer();
}
