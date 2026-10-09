import { describe, expect, it } from 'vitest';
import { getEnOgImagePath } from './enOgPaths';
import { enTitleFontSize } from './enOgSatori';

describe('English OG cards', () => {
  it('lives under /og/en/<kind>/<slug>.png, apart from the Chinese images', () => {
    expect(getEnOgImagePath('works', 'rose-curve')).toBe('/og/en/works/rose-curve.png');
    expect(getEnOgImagePath('exam', 'ast-114-solid-of-revolution')).toBe(
      '/og/en/exam/ast-114-solid-of-revolution.png',
    );
    expect(getEnOgImagePath('explore', 'vectors')).toBe('/og/en/explore/vectors.png');
  });

  it('shrinks long English titles', () => {
    expect(enTitleFontSize('Rose curve')).toBe(64);
    expect(enTitleFontSize('Same area, same volume for the solid of revolution?')).toBe(42);
  });
});
