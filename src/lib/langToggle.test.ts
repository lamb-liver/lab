import { describe, expect, it } from 'vitest';
import { nearestCounterpartList } from './translatedSlugs';

describe('nearestCounterpartList (language toggle fallback)', () => {
  it('goes to the other language list for the same section', () => {
    expect(nearestCounterpartList('/works/unknown/')).toBe('/en/works/');
    expect(nearestCounterpartList('/en/exam/unknown/', 'en')).toBe('/exam/');
  });

  it('falls back to the other home page outside a section', () => {
    expect(nearestCounterpartList('/thumbs/x/')).toBe('/en/');
    expect(nearestCounterpartList('/en/nowhere/', 'en')).toBe('/');
  });
});
