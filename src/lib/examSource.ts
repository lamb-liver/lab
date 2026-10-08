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

const EN_SUBJECT: Record<string, string> = {
  '學測數A': 'GSAT Math A',
  '學測數B': 'GSAT Math B',
  '分科數甲': 'AST Math A',
};

const EN_QUESTION_TYPE: Record<string, string> = {
  單選: 'Multiple choice',
  多選: 'Multiple select',
  選填: 'Fill-in',
  非選: 'Written',
};

/** 篩選按鈕等只顯示考科名稱的地方；AMC 考科名稱本來就是英文 */
export function examSubjectLabel(subject: string, locale?: 'en'): string {
  return locale === 'en' ? (EN_SUBJECT[subject] ?? subject) : subject;
}

/** 例：`112 學測數A・多選11`、`2023 AMC 12B・第21題` */
export function examSourceLabel(data: ExamSourceFields, locale?: 'en'): string {
  if (locale === 'en') {
    const subject = EN_SUBJECT[data.subject] ?? data.subject;
    if (isAmcSubject(data.subject)) return `${data.year} ${subject}, Problem ${data.questionNo}`;
    const type = EN_QUESTION_TYPE[data.questionType] ?? data.questionType;
    return `${data.year} ${subject}, ${type} ${data.questionNo}`;
  }
  if (isAmcSubject(data.subject)) {
    return `${data.year} ${data.subject}・第${data.questionNo}題`;
  }
  return `${data.year} ${data.subject}・${data.questionType}${data.questionNo}`;
}

/** 詳情頁原題／解析連結的文字 */
export function examSourceLinkLabels(
  subject: string,
  locale?: 'en',
): { source: string; analysis: string } {
  if (locale === 'en') {
    if (isAmcSubject(subject)) return { source: 'AoPS problem page', analysis: 'Solutions' };
    return { source: 'Original paper', analysis: 'Official solutions' };
  }
  if (isAmcSubject(subject)) {
    return { source: 'AoPS 題目頁', analysis: '解析' };
  }
  return { source: '大考中心原卷', analysis: '試題解析' };
}

/** AMC 題目依 MAA 要求標示出處；台灣考科回傳 null（沿用原卷連結） */
export function examCreditLine(data: ExamSourceFields, locale?: 'en'): string | null {
  if (!isAmcSubject(data.subject)) return null;
  if (locale === 'en') {
    return `Source: ${data.year} ${data.subject}, Problem #${data.questionNo} © MAA`;
  }
  return `題目出處：${data.year} ${data.subject}, Problem #${data.questionNo} © MAA`;
}
