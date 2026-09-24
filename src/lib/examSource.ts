/**
 * 試題來源的共用規則：考科清單、來源標籤、原題連結文字與出處標示。
 *
 * 台灣考科（學測／分科）沿用民國年與「題型＋題號」標籤；
 * AMC 12 用西元年與「第 N 題」標籤，原題連到 AoPS 題目頁並標示 © MAA。
 * content.config.ts、ExamCard、exam 詳情頁、列表搜尋索引與 relatedContent 都從這裡取，
 * 避免同一個標籤格式散在多處。
 */

export const taiwanExamSubjects = ['學測數A', '學測數B', '分科數甲'] as const;
export const amcExamSubjects = ['AMC 12A', 'AMC 12B'] as const;
export const examSubjects = [...taiwanExamSubjects, ...amcExamSubjects] as const;

export type ExamSubjectName = (typeof examSubjects)[number];

type ExamSourceFields = {
  year: number;
  subject: string;
  questionType: string;
  questionNo: string;
};

export function isAmcSubject(subject: string): boolean {
  return (amcExamSubjects as readonly string[]).includes(subject);
}

/** 例：`112 學測數A・多選11`、`2023 AMC 12B・第21題` */
export function examSourceLabel(data: ExamSourceFields): string {
  if (isAmcSubject(data.subject)) {
    return `${data.year} ${data.subject}・第${data.questionNo}題`;
  }
  return `${data.year} ${data.subject}・${data.questionType}${data.questionNo}`;
}

/** 詳情頁原題／解析連結的文字 */
export function examSourceLinkLabels(subject: string): { source: string; analysis: string } {
  if (isAmcSubject(subject)) {
    return { source: 'AoPS 題目頁', analysis: '解析' };
  }
  return { source: '大考中心原卷', analysis: '試題解析' };
}

/** AMC 題目依 MAA 要求標示出處；台灣考科回傳 null（沿用原卷連結） */
export function examCreditLine(data: ExamSourceFields): string | null {
  if (!isAmcSubject(data.subject)) return null;
  return `題目出處：${data.year} ${data.subject}, Problem #${data.questionNo} © MAA`;
}
