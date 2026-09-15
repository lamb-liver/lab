import { describe, expect, it } from 'vitest';
import { giscusDiscussionTerm } from './siteOps';

describe('giscusDiscussionTerm', () => {
  it('normalizes missing and extra trailing slashes to one', () => {
    expect(giscusDiscussionTerm('/works/julia-set')).toBe('/works/julia-set/');
    expect(giscusDiscussionTerm('/works/julia-set/')).toBe('/works/julia-set/');
    expect(giscusDiscussionTerm('/')).toBe('/');
  });
});
