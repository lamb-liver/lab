import type { CollectionEntry } from 'astro:content';

/**
 * 純分組 helper：把三集合條目按 concept slug 匯集，供 /concept 聚合頁使用。
 * 呼叫端須先自行過濾（getPublishedAsc / DEV 分支）與排序；此處只分組、不重造 draft/排序。
 * 概念頁門檻由 conceptHasPage 定義。
 */

export interface ConceptGroup {
  works: CollectionEntry<'works'>[];
  explore: CollectionEntry<'explore'>[];
  exams: CollectionEntry<'exam'>[];
  /** 英文頁用的英文集合條目（選填；中文頁不傳） */
  worksEn?: CollectionEntry<'worksEn'>[];
  exploreEn?: CollectionEntry<'exploreEn'>[];
  examsEn?: CollectionEntry<'examEn'>[];
  /** 三集合合計篇數（呼叫端傳入的多為已發布條目） */
  total: number;
  /** 有內容的集合數（0–3） */
  collectionCount: number;
}

/** 跨至少 2 個集合才建 /concept/[slug] 頁；此條件已必然代表至少 2 篇。 */
export const conceptHasPage = (group: ConceptGroup): boolean =>
  group.collectionCount >= 2;

export function buildConceptIndex(
  works: CollectionEntry<'works'>[],
  explore: CollectionEntry<'explore'>[],
  exams: CollectionEntry<'exam'>[],
): Map<string, ConceptGroup> {
  const index = new Map<string, ConceptGroup>();

  const ensure = (slug: string): ConceptGroup => {
    let group = index.get(slug);
    if (!group) {
      group = { works: [], explore: [], exams: [], total: 0, collectionCount: 0, worksEn: [], exploreEn: [], examsEn: [] };
      index.set(slug, group);
    }
    return group;
  };

  for (const entry of works) {
    for (const slug of entry.data.concepts) ensure(slug).works.push(entry);
  }
  for (const entry of explore) {
    for (const slug of entry.data.concepts) ensure(slug).explore.push(entry);
  }
  for (const entry of exams) {
    for (const slug of entry.data.concepts) ensure(slug).exams.push(entry);
  }

  for (const group of index.values()) {
    group.total = group.works.length + group.explore.length + group.exams.length;
    group.collectionCount =
      (group.works.length > 0 ? 1 : 0) +
      (group.explore.length > 0 ? 1 : 0) +
      (group.exams.length > 0 ? 1 : 0);
  }

  return index;
}

/** 便利函式：回傳達門檻（有頁）的 concept slug 集合 */
export const pagedConceptSlugs = (index: Map<string, ConceptGroup>): Set<string> => {
  const set = new Set<string>();
  for (const [slug, group] of index) {
    if (conceptHasPage(group)) set.add(slug);
  }
  return set;
};

/** 把英文集合條目依 concept slug 併入既有索引（呼叫端須已過濾草稿與排序） */
export function attachEnglishEntries(
  index: Map<string, ConceptGroup>,
  worksEn: CollectionEntry<'worksEn'>[],
  exploreEn: CollectionEntry<'exploreEn'>[],
  examsEn: CollectionEntry<'examEn'>[],
): void {
  const bySlug = (entries: { id: string }[]) => new Map(entries.map((e) => [e.id, e]));
  const worksBy = bySlug(worksEn);
  const exploreBy = bySlug(exploreEn);
  const examsBy = bySlug(examsEn);
  for (const group of index.values()) {
    group.worksEn = group.works.flatMap((e) => {
      const en = worksBy.get(e.id) as CollectionEntry<'worksEn'> | undefined;
      return en ? [en] : [];
    });
    group.exploreEn = group.explore.flatMap((e) => {
      const en = exploreBy.get(e.id) as CollectionEntry<'exploreEn'> | undefined;
      return en ? [en] : [];
    });
    group.examsEn = group.exams.flatMap((e) => {
      const en = examsBy.get(e.id) as CollectionEntry<'examEn'> | undefined;
      return en ? [en] : [];
    });
  }
}
