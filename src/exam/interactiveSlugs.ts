/** Interactive Exam slug source. Keep in sync with ExamInteractiveStage. */
export const examInteractiveSlugs = [
  'ast-113-geometric-distribution',
  'ast-114-solid-of-revolution',
  'gsat-112-rotation-composition',
  'gsat-112-sinusoid-superposition',
  'gsat-112-skew-line-distance',
] as const;

export type ExamInteractiveSlug = (typeof examInteractiveSlugs)[number];
