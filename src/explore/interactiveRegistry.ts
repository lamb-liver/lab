/** 互動 explore slug（與 `content/explore/{slug}.md`、`ExploreInteractiveStage` 同步） */
export const exploreInteractiveSlugs = ['fourier-series'] as const;

export type ExploreInteractiveSlug = (typeof exploreInteractiveSlugs)[number];

export function isExploreInteractive(slug: string): slug is ExploreInteractiveSlug {
  return (exploreInteractiveSlugs as readonly string[]).includes(slug);
}
