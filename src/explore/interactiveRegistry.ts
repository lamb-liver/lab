/** 互動 explore slug（與 `content/explore/{slug}.md`、`ExploreInteractiveStage` 同步） */
export const exploreInteractiveSlugs = [
  'fourier-series',
  'trig-wave-interference',
  'conic-dynamic-geometry',
  'matrix-linear-transform',
  'limits-riemann-sum',
  'differential-equations-geometry',
  'complex-euler-formula',
  'sequences-and-series',
] as const;

export type ExploreInteractiveSlug = (typeof exploreInteractiveSlugs)[number];

export function isExploreInteractive(slug: string): slug is ExploreInteractiveSlug {
  return (exploreInteractiveSlugs as readonly string[]).includes(slug);
}
