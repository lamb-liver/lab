import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import {
  clearUrlParams,
  getCardFilterTokens,
  serializeSearchIndex,
} from './listFilter';

describe('listFilter', () => {
  it('serializeSearchIndex escapes < for script embedding', () => {
    const json = serializeSearchIndex([{ title: '</script><evil>' }]);
    expect(json).not.toContain('</script>');
    expect(JSON.parse(json)[0].title).toBe('</script><evil>');
  });

  it('getCardFilterTokens reads comma-separated tags', () => {
    const el = {
      getAttribute: (name: string) =>
        name === 'data-filter-tags' ? '幾何, 參數方程' : null,
    } as HTMLElement;
    expect(getCardFilterTokens(el)).toEqual(['幾何', '參數方程']);
  });

  describe('clearUrlParams', () => {
    const pushState = vi.fn();
    let locationHref = 'https://example.test/works?tag=幾何&q=foo';

    beforeEach(() => {
      locationHref = 'https://example.test/works?tag=幾何&q=foo';
      vi.stubGlobal('history', { pushState });
      vi.stubGlobal('window', {
        location: {
          get href() {
            return locationHref;
          },
        },
      });
    });

    afterEach(() => {
      vi.unstubAllGlobals();
      pushState.mockReset();
    });

    it('clears multiple params in one pushState', () => {
      clearUrlParams(['tag', 'q']);

      expect(pushState).toHaveBeenCalledTimes(1);
      expect(pushState).toHaveBeenCalledWith(null, '', 'https://example.test/works');
    });

    it('skips pushState when params are already absent', () => {
      locationHref = 'https://example.test/works';
      clearUrlParams(['missing']);

      expect(pushState).not.toHaveBeenCalled();
    });
  });
});
