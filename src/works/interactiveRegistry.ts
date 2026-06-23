import { workInteractiveSlugs, type WorkInteractiveSlug } from './interactiveSlugs';

export { workInteractiveSlugs, type WorkInteractiveSlug };

export function isWorkInteractive(slug: string): slug is WorkInteractiveSlug {
  return (workInteractiveSlugs as readonly string[]).includes(slug);
}

export function workControlsMountId(slug: WorkInteractiveSlug): string {
  return `${slug}-controls`;
}
