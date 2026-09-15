export const PERSONAL_SITE_URL = 'https://lambliver.dev/';
export const PERSONAL_SITE_HOST = 'lambliver.dev';
export const CONTACT_EMAIL = 'lambliver.dev@gmail.com';
export const GITHUB_URL = 'https://github.com/lamb-liver';
export const THREADS_URL = 'https://www.threads.com/@lambliver0420';
export const THREADS_HANDLE = '@lambliver0420';
export const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=61589694329153';

export const SITE_AUTHOR = {
  '@type': 'Person',
  name: 'lamb-liver',
  url: PERSONAL_SITE_URL,
  email: `mailto:${CONTACT_EMAIL}`,
  sameAs: [GITHUB_URL, THREADS_URL, FACEBOOK_URL],
} as const;
