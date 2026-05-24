import { describe, expect, it } from 'vitest';
import { exploreInteractiveSlugs } from './explore/interactiveRegistry';
import { workCurveBySlug } from './curve/registry';
import { workInteractiveSlugs } from './works/interactiveRegistry';
import { readContentSlugs } from './test/contentSlugs';

describe('registry ↔ content 同步', () => {
  it('workInteractiveSlugs 與 workCurveBySlug 雙向一致，且皆存在於 content/works', () => {
    const contentSlugs = readContentSlugs('works');
    const registryKeys = Object.keys(workCurveBySlug).sort();
    const interactiveSlugs = [...workInteractiveSlugs].sort();

    expect(interactiveSlugs).toEqual(registryKeys);

    for (const slug of interactiveSlugs) {
      expect(contentSlugs, `interactive slug missing content: ${slug}`).toContain(slug);
      expect(workCurveBySlug[slug], `missing module for ${slug}`).toBeDefined();
    }
  });

  it('exploreInteractiveSlugs 皆存在於 content/explore', () => {
    const contentSlugs = readContentSlugs('explore');
    for (const slug of exploreInteractiveSlugs) {
      expect(contentSlugs, `interactive slug missing content: ${slug}`).toContain(slug);
    }
  });
});
