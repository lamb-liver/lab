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

describe('OG card formulas', async () => {
  const { EN_OG_FORMULA, ogFormulaFontSize, ogFormulaProblems, toEnOgFormula } = await import('./ogFormula');

  it('shows proper sub/superscripts instead of TeX-like syntax', () => {
    expect(toEnOgFormula('julia-set', 'z_{n+1} = z_n^2 + c')).toBe('zₙ₊₁ = zₙ² + c');
    expect(ogFormulaProblems('z_{n+1} = z_n^2 + c').length).toBeGreaterThan(0);
  });

  it('keeps every English card formula on one clean line', () => {
    for (const [slug, formula] of Object.entries(EN_OG_FORMULA)) {
      expect(ogFormulaProblems(formula), slug).toEqual([]);
      expect(ogFormulaFontSize(formula), slug).toBeGreaterThanOrEqual(22);
    }
  });

  it('turns full-width punctuation into ASCII', () => {
    expect(toEnOgFormula('unknown', 'a，b；c')).toBe('a, b; c');
  });
});
