import { exploreInteractiveSlugs, type ExploreInteractiveSlug } from './interactiveSlugs';

export { exploreInteractiveSlugs, type ExploreInteractiveSlug };

export function isExploreInteractive(slug: string): slug is ExploreInteractiveSlug {
  return (exploreInteractiveSlugs as readonly string[]).includes(slug);
}
