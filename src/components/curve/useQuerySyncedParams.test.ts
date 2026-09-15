import { describe, expect, it } from 'vitest';
import {
  formatQueryNumber,
  parseParamsFromSearch,
  searchFromParams,
} from './useQuerySyncedParams';

const defaults = { k: 6, amp: 1 };

describe('query synced params', () => {
  it('formats integers without decimals and trims float noise', () => {
    expect(formatQueryNumber(6)).toBe('6');
    expect(formatQueryNumber(0.5)).toBe('0.5');
    expect(formatQueryNumber(0.30000000000000004)).toBe('0.3');
  });

  it('reads only known numeric keys and keeps defaults otherwise', () => {
    expect(parseParamsFromSearch('?k=3&amp=2.5&x=nope', defaults)).toEqual({ k: 3, amp: 2.5 });
    expect(parseParamsFromSearch('?k=nope&other=1', defaults)).toEqual(defaults);
    expect(parseParamsFromSearch('', defaults)).toEqual(defaults);
  });

  it('omits default keys and preserves unrelated query params', () => {
    expect(searchFromParams({ k: 6, amp: 1 }, defaults, '')).toBe('');
    expect(searchFromParams({ k: 3, amp: 1 }, defaults, '')).toBe('?k=3');
    expect(searchFromParams({ k: 3, amp: 2.5 }, defaults, '?utm=x')).toBe('?utm=x&k=3&amp=2.5');
    expect(searchFromParams({ k: 6, amp: 1 }, defaults, '?utm=x&k=3')).toBe('?utm=x');
  });
});
