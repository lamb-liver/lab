import type { CollectionEntry } from 'astro:content';
import { describe, expect, it } from 'vitest';
import { buildExamBackrefs } from './relatedContent';

const exam = (
  id: string,
  order: number,
  relatedWorks: string[],
  relatedExplore: string[],
  draft = false,
): CollectionEntry<'exam'> =>
  ({
    id,
    data: {
      title: `題目 ${id}`,
      year: 112,
      subject: '學測數A',
      questionType: '多選',
      questionNo: '11',
      order,
      draft,
      relatedWorks,
      relatedExplore,
    },
  }) as unknown as CollectionEntry<'exam'>;

describe('buildExamBackrefs', () => {
  it('reverses forward links into per-slug back references', () => {
    const { works, explore } = buildExamBackrefs([
      exam('e1', 1, ['rose-curve'], ['fourier-series']),
    ]);

    expect(works.get('rose-curve')?.map((r) => r.href)).toEqual(['/exam/e1']);
    expect(explore.get('fourier-series')?.map((r) => r.href)).toEqual(['/exam/e1']);
    expect(works.get('rose-curve')?.[0]).toMatchObject({
      kind: 'exam',
      title: '題目 e1',
    });
  });

  it('excludes draft exams by default, includes them with includeDraft', () => {
    const exams = [exam('draft-exam', 2, ['rose-curve'], [], true)];

    expect(buildExamBackrefs(exams).works.get('rose-curve')).toBeUndefined();
    expect(
      buildExamBackrefs(exams, { includeDraft: true }).works.get('rose-curve')?.length,
    ).toBe(1);
  });

  it('formats meta as the exam source label', () => {
    const { works } = buildExamBackrefs([exam('e1', 1, ['rose-curve'], [])]);
    expect(works.get('rose-curve')?.[0]?.meta).toBe('112 學測數A・多選11');
  });

  it('sorts back references newest first (order desc, tiebreak id)', () => {
    const { works } = buildExamBackrefs([
      exam('older', 1, ['rose-curve'], []),
      exam('newer', 3, ['rose-curve'], []),
      exam('mid', 2, ['rose-curve'], []),
    ]);
    expect(works.get('rose-curve')?.map((r) => r.href)).toEqual([
      '/exam/newer',
      '/exam/mid',
      '/exam/older',
    ]);
  });
});
