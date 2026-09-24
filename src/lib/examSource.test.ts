import { describe, expect, it } from 'vitest';
import {
  AMC_EXAM_SUBJECTS,
  EXAM_SUBJECTS,
  TAIWAN_EXAM_SUBJECTS,
  examYearIssue,
} from '../../scripts/audit-content.mjs';
import {
  amcExamSubjects,
  examCreditLine,
  examSourceLabel,
  examSourceLinkLabels,
  examSubjects,
  isAmcSubject,
  taiwanExamSubjects,
} from './examSource';

const amc = { year: 2023, subject: 'AMC 12B', questionType: '單選', questionNo: '21' };
const taiwan = { year: 115, subject: '分科數甲', questionType: '選填', questionNo: '10' };

describe('examSource', () => {
  it('keeps the audit script subject lists in sync with the content schema', () => {
    expect(EXAM_SUBJECTS).toEqual([...examSubjects]);
    expect(TAIWAN_EXAM_SUBJECTS).toEqual([...taiwanExamSubjects]);
    expect(AMC_EXAM_SUBJECTS).toEqual([...amcExamSubjects]);
  });

  it('labels AMC entries with the Western year and problem number', () => {
    expect(isAmcSubject('AMC 12B')).toBe(true);
    expect(examSourceLabel(amc)).toBe('2023 AMC 12B・第21題');
    expect(examSourceLabel({ ...amc, subject: 'AMC 12A', year: 2024, questionNo: '20' })).toBe(
      '2024 AMC 12A・第20題',
    );
  });

  it('keeps Taiwan labels unchanged', () => {
    expect(isAmcSubject('分科數甲')).toBe(false);
    expect(examSourceLabel(taiwan)).toBe('115 分科數甲・選填10');
  });

  it('uses AoPS wording and an MAA credit line only for AMC', () => {
    expect(examSourceLinkLabels('AMC 12B')).toEqual({ source: 'AoPS 題目頁', analysis: '解析' });
    expect(examSourceLinkLabels('學測數A')).toEqual({ source: '大考中心原卷', analysis: '試題解析' });
    expect(examCreditLine(amc)).toBe('題目出處：2023 AMC 12B, Problem #21 © MAA');
    expect(examCreditLine(taiwan)).toBeNull();
  });

  it('validates the year format per source', () => {
    expect(examYearIssue('AMC 12B', '2023')).toBeNull();
    expect(examYearIssue('AMC 12A', '113')).toMatch(/4-digit/);
    expect(examYearIssue('學測數A', '112')).toBeNull();
    expect(examYearIssue('學測數A', '2023')).toMatch(/3-digit ROC/);
  });
});
