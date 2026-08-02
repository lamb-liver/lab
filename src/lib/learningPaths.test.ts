import { describe, expect, it } from 'vitest';
import { readContentFiles } from '../../scripts/audit-content.mjs';
import { conceptSlugs } from './concepts';
import { learningPaths } from './learningPaths';

// collection → 已發布 slug 集合（draft: true 排除）
const publishedByCollection = (() => {
  const map = new Map<string, Set<string>>();
  for (const file of readContentFiles()) {
    if (/^draft:\s*true\s*$/m.test(file.body)) continue;
    if (!map.has(file.collection)) map.set(file.collection, new Set());
    map.get(file.collection)!.add(file.slug);
  }
  return map;
})();

const conceptSet = new Set<string>(conceptSlugs);

describe('learning paths manifest', () => {
  it('has unique path slugs', () => {
    const slugs = learningPaths.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('every step references an existing, published content entry', () => {
    for (const path of learningPaths) {
      for (const step of path.steps) {
        const published = publishedByCollection.get(step.collection);
        expect(
          published?.has(step.slug),
          `${path.slug} → ${step.collection}/${step.slug} 不存在或為草稿`,
        ).toBe(true);
      }
    }
  });

  it('every path concept is a registered concept slug', () => {
    for (const path of learningPaths) {
      for (const concept of path.concepts) {
        expect(conceptSet.has(concept), `${path.slug}: 未知概念 ${concept}`).toBe(true);
      }
    }
  });

  it('every step has a non-empty connective note', () => {
    for (const path of learningPaths) {
      for (const step of path.steps) {
        expect(step.note.trim().length, `${path.slug} → ${step.slug} 缺 note`).toBeGreaterThan(0);
      }
    }
  });
});
