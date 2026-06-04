import { describe, expect, it } from 'vitest';
import { descriptionHasRawMath } from './descriptionMath';

describe('descriptionHasRawMath', () => {
  it('rejects common LaTeX and delimiter forms', () => {
    expect(descriptionHasRawMath('$a^x$')).toBe(true);
    expect(descriptionHasRawMath('$$a^x$$')).toBe(true);
    expect(descriptionHasRawMath('\\(a^x\\)')).toBe(true);
    expect(descriptionHasRawMath('\\[a^x\\]')).toBe(true);
    expect(descriptionHasRawMath('\\begin{matrix}')).toBe(true);
    expect(descriptionHasRawMath('\\log_a x')).toBe(true);
  });

  it('allows plain-text math phrasing', () => {
    expect(descriptionHasRawMath('追蹤同一個組合數如何在二項式係數中出現')).toBe(false);
    expect(descriptionHasRawMath('e^(iθ) 把旋轉與三角函數統一')).toBe(false);
  });
});
