import { describe, expect, it } from 'vitest';
import { DEFAULT_OG_IMAGE, DEFAULT_OG_SLUG, isDefaultOgImage } from './defaultOg';

describe('defaultOg', () => {
  it('points at the spirograph work OG route', () => {
    expect(DEFAULT_OG_SLUG).toBe('spirograph-curve');
    expect(DEFAULT_OG_IMAGE).toBe('/og/works/spirograph-curve.png');
  });

  it('treats missing path and spirograph OG as the default image', () => {
    expect(isDefaultOgImage(undefined)).toBe(true);
    expect(isDefaultOgImage(DEFAULT_OG_IMAGE)).toBe(true);
    expect(isDefaultOgImage('/og/works/rose-curve.png')).toBe(false);
  });
});
