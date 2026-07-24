import { examInteractiveSlugs, type ExamInteractiveSlug } from './interactiveSlugs';

export { examInteractiveSlugs, type ExamInteractiveSlug };

export function isExamInteractive(slug: string): slug is ExamInteractiveSlug {
  return (examInteractiveSlugs as readonly string[]).includes(slug);
}
