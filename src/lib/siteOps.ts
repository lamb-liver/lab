export const UMAMI_DOMAINS = 'lab.lambliver.dev';
export const UMAMI_SCRIPT_URL_DEFAULT = 'https://cloud.umami.is/script.js';

export const GISCUS = {
  repo: 'lamb-liver/lab',
  repoId: 'R_kgDOSnhjXQ',
  category: 'Announcements',
  categoryId: 'DIC_kwDOSnhjXc4DFqsH',
} as const;

/** Canonical discussion term: always trailing slash, never duplicate slashes. */
export function giscusDiscussionTerm(pathname: string): string {
  return `${pathname.replace(/\/+$/, '')}/`;
}
