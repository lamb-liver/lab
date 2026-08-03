import { contestInteractiveSlugs, type ContestInteractiveSlug } from './interactiveSlugs';

export { contestInteractiveSlugs, type ContestInteractiveSlug };

export function isContestInteractive(slug: string): slug is ContestInteractiveSlug {
  return (contestInteractiveSlugs as readonly string[]).includes(slug);
}
