import { describe, expect, it } from 'vitest';
import { exploreStageRootSlugs } from './components/explore/ExploreInteractiveStage';
import { workStageRootSlugs } from './components/works/WorkInteractiveStage';
import { exploreInteractiveSlugs } from './explore/interactiveRegistry';
import { workCurveBySlug } from './curve/registry';
import { workInteractionHints, workInteractiveSlugs } from './works/interactiveRegistry';
import { readContentSlugs } from './test/contentSlugs';

describe('registry ↔ content 同步', () => {
  it('workInteractiveSlugs、workCurveBySlug 與 WorkInteractiveStage 雙向一致，且皆存在於 content/works', () => {
    const contentSlugs = readContentSlugs('works');
    const registryKeys = Object.keys(workCurveBySlug).sort();
    const interactiveSlugs = [...workInteractiveSlugs].sort();

    expect(interactiveSlugs).toEqual(registryKeys);
    expect(workStageRootSlugs).toEqual(interactiveSlugs);
    expect(Object.keys(workInteractionHints).sort()).toEqual(interactiveSlugs);

    for (const slug of interactiveSlugs) {
      expect(contentSlugs, `interactive slug missing content: ${slug}`).toContain(slug);
      expect(workCurveBySlug[slug], `missing module for ${slug}`).toBeDefined();
      expect(workInteractionHints[slug], `missing interaction hint for ${slug}`).toMatch(/^(button|input|select|none)$/);
    }
  });

  it('exploreInteractiveSlugs 皆存在於 content/explore', () => {
    const contentSlugs = readContentSlugs('explore');
    expect(exploreStageRootSlugs).toEqual([...exploreInteractiveSlugs].sort());

    for (const slug of exploreInteractiveSlugs) {
      expect(contentSlugs, `interactive slug missing content: ${slug}`).toContain(slug);
    }
  });
});
