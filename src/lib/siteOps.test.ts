import { describe, expect, it } from 'vitest';
import {
  giscusDiscussionTerm,
  UMAMI_HOST_URL_DEFAULT,
  UMAMI_SCRIPT_URL_DEFAULT,
} from './siteOps';

describe('giscusDiscussionTerm', () => {
  it('normalizes missing and extra trailing slashes to one', () => {
    expect(giscusDiscussionTerm('/works/julia-set')).toBe('/works/julia-set/');
    expect(giscusDiscussionTerm('/works/julia-set/')).toBe('/works/julia-set/');
    expect(giscusDiscussionTerm('/')).toBe('/');
  });
});

describe('umami first-party proxy', () => {
  it('serves the tracker from this origin, not umami.is', () => {
    expect(UMAMI_SCRIPT_URL_DEFAULT).toBe('/stats/script.js');
    expect(UMAMI_HOST_URL_DEFAULT).toBe('https://lab.lambliver.dev/stats');
    expect(UMAMI_SCRIPT_URL_DEFAULT).not.toContain('umami.is');
    expect(UMAMI_HOST_URL_DEFAULT).not.toContain('umami.is');
  });
});
