import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import { workCurveBySlug } from '../curve/registry';
import { readContentSlugs } from '../test/contentSlugs';
import { getCurveThumbnailSvg } from './curveThumbnail';
import {
  assertSharpCompatibleSvg,
  renderWorkOgPng,
  WORK_OG_HEIGHT,
  WORK_OG_WIDTH,
} from './workOgImage';

describe('work OG image generation', () => {
  it('keeps registry aligned with content and SVGs sharp-compatible', () => {
    const registrySlugs = Object.keys(workCurveBySlug).sort();
    const contentSlugs = readContentSlugs('works').sort();
    expect(registrySlugs).toEqual(contentSlugs);

    for (const slug of registrySlugs) {
      const svg = getCurveThumbnailSvg(slug);
      expect(svg, `thumbnail should render for ${slug}`).toBeTruthy();
      assertSharpCompatibleSvg(svg!, slug);
    }
  });

  it('allows fragment url() but rejects remote url()', () => {
    assertSharpCompatibleSvg(
      '<svg viewBox="0 0 10 10"><rect fill="url(#g)" width="10" height="10"/></svg>',
      'fragment',
    );
    expect(() =>
      assertSharpCompatibleSvg(
        '<svg viewBox="0 0 10 10"><rect fill="url(https://example.com/x)" width="10" height="10"/></svg>',
        'remote',
      ),
    ).toThrow(/external url\(\)/);
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
