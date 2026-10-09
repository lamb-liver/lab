import { describe, expect, it } from 'vitest';
import { getZhOgImagePath, zhExploreKicker } from './zhOgPaths';
import { zhTitleLayout, zhTitleWidth } from './zhOgImage';

describe('Chinese exam/explore OG cards', () => {
  it('builds card paths under /og/zh/', () => {
    expect(getZhOgImagePath('exam', 'ast-114-solid-of-revolution')).toBe(
      '/og/zh/exam/ast-114-solid-of-revolution.png',
    );
    expect(getZhOgImagePath('explore', 'vectors')).toBe('/og/zh/explore/vectors.png');
  });

  it('labels topics like the nav', () => {
    expect(zhExploreKicker('代數')).toBe('主題導覽・代數');
  });

  it('keeps short titles on one line and breaks long ones after punctuation or 的／與', () => {
    expect(zhTitleWidth('平面向量')).toBe(4);
    expect(zhTitleLayout('平面向量')).toEqual({ text: '平面向量', fontSize: 64 });
    expect(zhTitleLayout('相同列運算的線性組合')).toEqual({ text: '相同列運算的線性組合', fontSize: 52 });
    expect(zhTitleLayout('二次曲線的幾何動態軌跡')).toEqual({ text: '二次曲線的\n幾何動態軌跡', fontSize: 64 });
    expect(zhTitleLayout('面積相同，旋轉體體積相同嗎')).toEqual({
      text: '面積相同，\n旋轉體體積相同嗎',
      fontSize: 64,
    });
    expect(zhTitleLayout('三角函數的疊加與波的干涉').text).toBe('三角函數的\n疊加與波的干涉');
    expect(zhTitleLayout('圓心在 x 軸、兩垂線距離比與切線斜率').text).toBe('圓心在 x 軸、\n兩垂線距離比與切線斜率');
  });
});
