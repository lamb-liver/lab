import type { CollectionEntry } from 'astro:content';

/** 跨集合關聯連結的統一資料形狀，餵給 RelatedLinks.astro */
export interface RelatedRef {
  kind: 'work' | 'explore' | 'exam';
  /** 站內絕對路徑，例 `/works/complex-arithmetic-geometry` */
  href: string;
  title: string;
  /** 補充脈絡；exam 用來源標籤，例 `111 分科數甲・選填11` */
  meta?: string;
}

/** 與 exam/[slug].astro 的 sourceLabel 同格式 */
const examSourceLabel = (data: CollectionEntry<'exam'>['data']): string =>
  `${data.year} ${data.subject}・${data.questionType}${data.questionNo}`;

/** exam 反向索引：每個 work/explore slug → 引用它的試題（新→舊） */
export function buildExamBackrefs(
  exams: CollectionEntry<'exam'>[],
  options: { includeDraft?: boolean } = {},
): { works: Map<string, RelatedRef[]>; explore: Map<string, RelatedRef[]> } {
  const works = new Map<string, RelatedRef[]>();
  const explore = new Map<string, RelatedRef[]>();

  // 依 order 新→舊、tiebreak id，對齊 content/utils.ts 的 sortByOrderDesc
  const sorted = [...exams]
    .filter((exam) => options.includeDraft || !exam.data.draft)
    .sort((a, b) => b.data.order - a.data.order || a.id.localeCompare(b.id));

  for (const exam of sorted) {
    const ref: RelatedRef = {
      kind: 'exam',
      href: `/exam/${exam.id}`,
      title: exam.data.title,
      meta: examSourceLabel(exam.data),
    };
    for (const slug of exam.data.relatedWorks) {
      const list = works.get(slug) ?? [];
      list.push(ref);
      works.set(slug, list);
    }
    for (const slug of exam.data.relatedExplore) {
      const list = explore.get(slug) ?? [];
      list.push(ref);
      explore.set(slug, list);
    }
  }

  return { works, explore };
}
