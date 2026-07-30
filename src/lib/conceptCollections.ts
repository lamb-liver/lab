import { getCollection } from 'astro:content';
import { getPublishedAsc } from '../content/utils';
import { buildConceptIndex, type ConceptGroup } from './conceptIndex';

/**
 * 概念聚合的資料載入層（僅 .astro 使用；不被 vitest 匯入）。
 * DEV 顯示草稿（依 order 排序），production 只取已發布——沿用 exam/index.astro 的分支。
 */
const publishedOrDev = <E extends Parameters<typeof getPublishedAsc>[0][number]>(
  entries: E[],
): E[] =>
  import.meta.env.DEV
    ? [...entries].sort((a, b) => a.data.order - b.data.order || a.id.localeCompare(b.id))
    : getPublishedAsc(entries);

/** 載入三集合並建立 concept 分組索引 */
export async function loadConceptIndex(): Promise<Map<string, ConceptGroup>> {
  const [works, explore, exams] = await Promise.all([
    getCollection('works'),
    getCollection('explore'),
    getCollection('exam'),
  ]);
  return buildConceptIndex(
    publishedOrDev(works),
    publishedOrDev(explore),
    publishedOrDev(exams),
  );
}
