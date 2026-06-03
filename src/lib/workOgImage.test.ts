import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import { workCurveBySlug } from '../curve/registry';
import { getCurveThumbnailSvg } from './curveThumbnail';
import {
  assertSharpCompatibleSvg,
  renderWorkOgPng,
  WORK_OG_HEIGHT,
  WORK_OG_WIDTH,
} from './workOgImage';

describe('work OG image generation', () => {
  it('keeps all work thumbnail SVGs compatible with sharp', () => {
    const slugs = Object.keys(workCurveBySlug);
    expect(slugs).toHaveLength(44);

    for (const slug of slugs) {
      const svg = getCurveThumbnailSvg(slug);
      expect(svg, `thumbnail should render for ${slug}`).toBeTruthy();
      assertSharpCompatibleSvg(svg!, slug);
    }
  });

  it('renders rose-curve as a 1200x630 PNG proof', async () => {
    const png = await renderWorkOgPng('rose-curve');
    const meta = await sharp(png).metadata();

    expect(meta.format).toBe('png');
    expect(meta.width).toBe(WORK_OG_WIDTH);
    expect(meta.height).toBe(WORK_OG_HEIGHT);
  });

  it('renders all registered work slugs as 1200x630 PNGs', async () => {
    for (const slug of Object.keys(workCurveBySlug)) {
      const png = await renderWorkOgPng(slug);
      const meta = await sharp(png).metadata();

      expect(meta.format, `${slug} format`).toBe('png');
      expect(meta.width, `${slug} width`).toBe(WORK_OG_WIDTH);
      expect(meta.height, `${slug} height`).toBe(WORK_OG_HEIGHT);
    }
  });
});
