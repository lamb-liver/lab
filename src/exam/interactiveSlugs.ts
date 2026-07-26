/** Interactive Exam slug source. Keep in sync with ExamInteractiveStage. */
export const examInteractiveSlugs = [
  'ast-111-complex-unit-circle',
  'ast-111-parabola-focal-chord-directrix-projection',
  'ast-112-isosceles-120-construction',
  'ast-113-augmented-matrix-row-operations',
  'ast-113-geometric-distribution',
  'ast-114-solid-of-revolution',
  'gsat-112-rotation-composition',
  'gsat-112-sinusoid-superposition',
  'gsat-112-skew-line-distance',
  'gsat-114-cubic-symmetry-center',
  'gsat-115-parabola-restricted-translation',
] as const;

export type ExamInteractiveSlug = (typeof examInteractiveSlugs)[number];
