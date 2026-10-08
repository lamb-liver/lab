import { describe, expect, it } from 'vitest';
import { learningPaths } from './learningPaths';
import { learningPathCopyEn, learningPathsEn } from './learningPathsEn';

describe('English learning path copy', () => {
  it('has a title, description, and one note per step for every path', () => {
    for (const path of learningPaths) {
      const copy = learningPathCopyEn[path.slug];
      expect(copy, path.slug).toBeDefined();
      expect(copy.notes).toHaveLength(path.steps.length);
    }
  });

  it('keeps the step order and links, with Latin-only text', () => {
    for (const [zh, en] of learningPaths.map((p, i) => [p, learningPathsEn()[i]] as const)) {
      expect(en.steps.map((s) => `${s.collection}/${s.slug}`)).toEqual(
        zh.steps.map((s) => `${s.collection}/${s.slug}`),
      );
      for (const text of [en.title, en.description, ...en.steps.map((s) => s.note)]) {
        expect(text).not.toMatch(/\p{Script=Han}/u);
        expect(text.length).toBeGreaterThan(0);
      }
    }
  });
});
