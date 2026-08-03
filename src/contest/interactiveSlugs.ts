/** Interactive contest study slug source. Keep in sync with ContestInteractiveStage. */
export const contestInteractiveSlugs = ['homogeneous-normalization'] as const;

export type ContestInteractiveSlug = (typeof contestInteractiveSlugs)[number];
