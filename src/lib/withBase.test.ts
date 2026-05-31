import { describe, expect, it } from 'vitest';
import { joinBasePath } from './withBase';

describe('joinBasePath', () => {
  it('keeps root base paths single-slashed', () => {
    expect(joinBasePath('/', '/explore/foo.png')).toBe('/explore/foo.png');
  });

  it('joins a trailing-slash base with a relative path', () => {
    expect(joinBasePath('/lab/', 'explore/foo.png')).toBe('/lab/explore/foo.png');
  });

  it('joins a base without a trailing slash with an absolute path', () => {
    expect(joinBasePath('/lab', '/explore/foo.png')).toBe('/lab/explore/foo.png');
  });

  it('does not emit double slashes for asset paths under a nested base', () => {
    expect(joinBasePath('/lab/', '/explore/foo.png')).toBe('/lab/explore/foo.png');
  });
});
