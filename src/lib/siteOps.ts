export const UMAMI_DOMAINS = 'lab.lambliver.dev';
export const UMAMI_SCRIPT_URL_DEFAULT = '/stats/script.js';
export const UMAMI_HOST_URL_DEFAULT = 'https://lab.lambliver.dev/stats';

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
