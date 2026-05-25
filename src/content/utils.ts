import type { CollectionEntry } from 'astro:content';

export type ContentEntry = {
  id: string;
  data: {
    date: Date;
    draft: boolean;
    featured: boolean;
  };
};

export const isPublished = (entry: ContentEntry): boolean => !entry.data.draft;

/** date 新→舊（首頁取最新 N 篇、需「最新在前」時用） */
export const sortByDateDesc = (a: ContentEntry, b: ContentEntry): number =>
  b.data.date.getTime() - a.data.date.getTime();

/** date 舊→新（作品集列表：越新越靠後） */
export const sortByDateAsc = (a: ContentEntry, b: ContentEntry): number =>
  a.data.date.getTime() - b.data.date.getTime();

export const getPublished = <E extends ContentEntry>(entries: E[]): E[] =>
  entries.filter(isPublished).sort(sortByDateDesc);

export const getPublishedAsc = <E extends ContentEntry>(entries: E[]): E[] =>
  entries.filter(isPublished).sort(sortByDateAsc);

/**
 * featured 策展（備用；首頁「最新」已改用 getPublished().slice(0, N)）
 *
 * - `featured` 優先（池內新→舊），不足 limit 時以 non-featured 補齊。
 * - 無 featured 時：fallback 到全部 published，取最新 N 篇。
 */
export const getFeaturedOrLatest = <E extends ContentEntry>(
  entries: E[],
  limit: number,
): E[] => {
  const published = getPublished(entries);
  const featured = published.filter((e) => e.data.featured);

  if (featured.length === 0) {
    return published.slice(0, limit);
  }

  const featuredIds = new Set(featured.map((e) => e.id));
  const rest = published.filter((e) => !featuredIds.has(e.id));
  return [...featured, ...rest].slice(0, limit);
};

export const getStaticPathsFromCollection = <E extends ContentEntry>(
  entries: E[],
) =>
  entries.filter(isPublished).map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));

/** 作品集列表篩選：從已發布條目收集唯一 tags（字典序） */
export const collectWorkTags = (
  entries: CollectionEntry<'works'>[],
): string[] => {
  const tags = new Set<string>();
  for (const entry of entries) {
    for (const tag of entry.data.tags) {
      tags.add(tag);
    }
  }
  return [...tags].sort((a, b) => a.localeCompare(b, 'zh-TW'));
};

/** 視覺化列表篩選：僅顯示目前有內容的 category */
export const collectExploreCategories = (
  entries: CollectionEntry<'explore'>[],
): string[] => {
  const categories = new Set<string>();
  for (const entry of entries) {
    categories.add(entry.data.category);
  }
  return [...categories].sort((a, b) => a.localeCompare(b, 'zh-TW'));
};
