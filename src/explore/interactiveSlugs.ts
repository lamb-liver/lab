/** Interactive Explore slug source. Keep in sync with ExploreInteractiveStage. */
export const exploreInteractiveSlugs = [
  'fourier-series',
  'trig-function-graphs',
  'trig-wave-interference',
  'conic-dynamic-geometry',
  'matrix-linear-transform',
  'limits-riemann-sum',
  'differential-equations-geometry',
  'complex-euler-formula',
  'sequences-and-series',
  'permutations-combinations',
  'probability-statistics',
  'discrete-random-variables',
  'data-analysis',
  'exponential-logarithm',
  'vectors',
  'trigonometry-fundamentals',
  'function-equations',
  'rational-functions-asymptotes',
] as const;

export type ExploreInteractiveSlug = (typeof exploreInteractiveSlugs)[number];
