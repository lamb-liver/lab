import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import {
  clearListFilters,
  clearUrlParams,
  getCardFilterTokens,
  serializeSearchIndex,
  updateListFilterCount,
} from './listFilter';

function mockCountRoot(options: {
  unit?: string;
  countText?: string;
} = {}): { root: HTMLElement; countEl: { textContent: string } } {
  const countEl = { textContent: options.countText ?? '' };
  const root = {
    querySelector: (sel: string) => (sel === '[data-filter-count]' ? countEl : null),
    getAttribute: (name: string) =>
      name === 'data-filter-count-unit' ? (options.unit ?? null) : null,
  } as unknown as HTMLElement;
  return { root, countEl };
}

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

  describe('updateListFilterCount', () => {
    it('shows total-only copy when all items are visible', () => {
      const { root, countEl } = mockCountRoot({ unit: '個主題' });
      updateListFilterCount(root, 12, 12);
      expect(countEl.textContent).toBe('共 12 個主題');
    });

    it('shows filtered copy when some items are hidden', () => {
      const { root, countEl } = mockCountRoot();
      updateListFilterCount(root, 3, 10);
      expect(countEl.textContent).toBe('顯示 3 / 10 篇');
    });

    it('defaults unit to 篇 when data-filter-count-unit is absent', () => {
      const { root, countEl } = mockCountRoot();
      updateListFilterCount(root, 5, 5);
      expect(countEl.textContent).toBe('共 5 篇');
    });
  });

  describe('clearListFilters', () => {
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

    it('resets search, active filter, and clears URL params once', () => {
      const searchInput = { value: 'foo' };
      const allButton = {
        getAttribute: (name: string) => (name === 'data-filter-value' ? '*' : null),
        classList: { toggle: vi.fn() },
        setAttribute: vi.fn(),
      };
      const tagButton = {
        getAttribute: (name: string) => (name === 'data-filter-value' ? '幾何' : null),
        classList: { toggle: vi.fn() },
        setAttribute: vi.fn(),
      };
      const bar = {
        querySelectorAll: (sel: string) =>
          sel === 'button[data-filter-value]' ? [allButton, tagButton] : [],
      };
      const root = {
        getAttribute: (name: string) =>
          name === 'data-filter-param' ? 'tag' : name === 'data-search-param' ? 'q' : null,
        querySelector: (sel: string) => {
          if (sel === '[data-filter-bar]') return bar;
          if (sel === '[data-list-search-input]') return searchInput;
          return null;
        },
      } as unknown as HTMLElement;

      clearListFilters(root);

      expect(searchInput.value).toBe('');
      expect(allButton.classList.toggle).toHaveBeenCalledWith('is-active', true);
      expect(allButton.setAttribute).toHaveBeenCalledWith('aria-pressed', 'true');
      expect(tagButton.classList.toggle).toHaveBeenCalledWith('is-active', false);
      expect(pushState).toHaveBeenCalledTimes(1);
      expect(pushState).toHaveBeenCalledWith(null, '', 'https://example.test/works');
    });
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
