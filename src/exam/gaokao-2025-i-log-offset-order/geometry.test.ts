import { describe, expect, it } from 'vitest';
import { CROSSINGS, OPTIONS, orderAt, orderLabel, segments, value } from './geometry';

describe('2025 高考數學新課標 I 卷第 8 題的三條對數直線', () => {
  it('交點依序是 x=y、x=z、y=z', () => {
    expect(CROSSINGS.xy).toBeGreaterThan(4);
    expect(CROSSINGS.xy).toBeLessThan(5);
    expect(CROSSINGS.xz).toBeGreaterThan(7);
    expect(CROSSINGS.xz).toBeLessThan(8);
    expect(CROSSINGS.yz).toBeGreaterThan(9);
    expect(CROSSINGS.yz).toBeLessThan(10);
    expect(value('x', CROSSINGS.xy)).toBeCloseTo(value('y', CROSSINGS.xy), 9);
  });

  it('解析常用的代入值：k=2、5、8 分別給出 A、C、D', () => {
    expect(orderLabel(orderAt(2))).toBe('x > y > z');
    expect(value('y', 5)).toBeCloseTo(9, 9);
    expect(orderLabel(orderAt(5))).toBe('y > x > z');
    expect(value('z', 8)).toBeCloseTo(125, 9);
    expect(orderLabel(orderAt(8))).toBe('y > z > x');
  });

  it('四段的順序裡沒有 x > z > y，答案是 B', () => {
    const seen = segments().map((s) => orderLabel(s.order));
    expect(seen).toEqual(['x > y > z', 'y > x > z', 'y > z > x', 'z > y > x']);
    const missing = OPTIONS.filter((o) => !seen.includes(orderLabel(o.order))).map((o) => o.key);
    expect(missing).toEqual(['B']);
  });
});
