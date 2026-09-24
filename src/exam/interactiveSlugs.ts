/** Interactive Exam slug source. Keep in sync with ExamInteractiveStage. */
export const examInteractiveSlugs = [
  'amc12a-2024-20-random-points-area-probability',
  'amc12b-2023-21-lampshade-shortest-path',
  'amc12b-2025-25-concentric-circles-equilateral',
  'ast-111-complex-unit-circle',
  'ast-111-parabola-focal-chord-directrix-projection',
  'ast-112-isosceles-120-construction',
  'ast-113-augmented-matrix-row-operations',
  'ast-113-geometric-distribution',
  'ast-114-solid-of-revolution',
  'ast-114-plane-parallel-line-distance',
  'ast-114-parallelogram-direction-area',
  'ast-115-circle-two-lines-tangent',
  'gsat-112-rotation-composition',
  'gsat-112-sinusoid-superposition',
  'gsat-112-skew-line-distance',
  'gsat-114-cubic-symmetry-center',
  'gsat-115-parabola-restricted-translation',
] as const;

export type ExamInteractiveSlug = (typeof examInteractiveSlugs)[number];
