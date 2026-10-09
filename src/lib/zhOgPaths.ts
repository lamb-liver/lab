/**
 * 中文試題與主題頁的社群預覽圖路徑。圖檔在 build 前由 scripts/generate-work-og.mjs
 * 產生到 public/og/zh/：左邊品牌＋出處／分類＋中文標題，右邊原本的封面（版面與英文卡片相同）。
 * 中文作品頁沿用 /og/works/。
 */
export type ZhOgKind = 'exam' | 'explore';

export const ZH_OG_DIR = '/og/zh';

export function getZhOgImagePath(kind: ZhOgKind, slug: string): string {
  return `${ZH_OG_DIR}/${kind}/${slug}.png`;
}

/** 主題卡的分類小字，與導覽列「主題導覽」及試題出處的「・」分隔一致，例如「主題導覽・代數」 */
export function zhExploreKicker(category: string): string {
  return `主題導覽・${category}`;
}
