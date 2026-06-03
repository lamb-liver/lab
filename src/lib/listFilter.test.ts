import { describe, expect, it } from 'vitest';
import { getCardFilterTokens, serializeSearchIndex } from './listFilter';

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
});
