import type { CollectionEntry } from 'astro:content';

export type ContentEntry = {
  id: string;
  data: {
    date: Date;
    order: number;
    draft: boolean;
    featured: boolean;
  };
};

const isPublished = (entry: ContentEntry): boolean => !entry.data.draft;

/** order 大→小（首頁取最新 N 篇、需「最新在前」時用） */
const sortByOrderDesc = (a: ContentEntry, b: ContentEntry): number =>
  b.data.order - a.data.order || a.id.localeCompare(b.id);

/** order 小→大（作品集列表：越新越靠後） */
const sortByOrderAsc = (a: ContentEntry, b: ContentEntry): number =>
  a.data.order - b.data.order || a.id.localeCompare(b.id);

export const getPublished = <E extends ContentEntry>(entries: E[]): E[] =>
  entries.filter(isPublished).sort(sortByOrderDesc);

/** 首頁等：僅已掛載互動 canvas 的條目，order 新→舊，取前 limit 篇 */
export const getPublishedInteractive = <E extends ContentEntry>(
  entries: E[],
  interactiveSlugs: readonly string[],
  limit: number,
): E[] => {
  const allowed = new Set<string>(interactiveSlugs);
  return getPublished(entries)
    .filter((entry) => allowed.has(entry.id))
    .slice(0, limit);
};

export const getPublishedAsc = <E extends ContentEntry>(entries: E[]): E[] =>
  entries.filter(isPublished).sort(sortByOrderAsc);

export function getCollectionPagerNeighbors<E extends ContentEntry>(
  entries: E[],
  slug: string,
): { previous: E | null; next: E | null } {
  const sorted = getPublishedAsc(entries);
  const index = sorted.findIndex((entry) => entry.id === slug);
  if (index < 0) {
    return { previous: null, next: null };
  }
  return {
    previous: index > 0 ? sorted[index - 1]! : null,
    next: index < sorted.length - 1 ? sorted[index + 1]! : null,
  };
}

/** 首頁精選：僅 `featured: true`，order 新→舊，且 slug 在互動 registry 內 */
export const getFeaturedInteractive = <E extends ContentEntry>(
  entries: E[],
  interactiveSlugs: readonly string[],
  limit: number,
): E[] => {
  const allowed = new Set<string>(interactiveSlugs);
  return getPublished(entries)
    .filter((entry) => entry.data.featured && allowed.has(entry.id))
    .slice(0, limit);
};

export const excludeEntryIds = <E extends ContentEntry>(
  entries: E[],
  excludeIds: ReadonlySet<string>,
): E[] => entries.filter((entry) => !excludeIds.has(entry.id));

export const getStaticPathsFromCollection = <E extends ContentEntry>(
  entries: E[],
  options: { includeDraft?: boolean } = {},
) =>
  entries.filter((entry) => options.includeDraft || isPublished(entry)).map((entry) => ({
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

/** 試題視覺化列表篩選：僅顯示目前有內容的考科 */
export const collectExamSubjects = (
  entries: CollectionEntry<'exam'>[],
): string[] => {
  const subjects = new Set<string>();
  for (const entry of entries) {
    subjects.add(entry.data.subject);
  }
  return [...subjects].sort((a, b) => a.localeCompare(b, 'zh-TW'));
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
