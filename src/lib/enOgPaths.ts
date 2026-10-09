/**
 * 英文版（/en/**）社群預覽圖的路徑。圖檔在 build 前由 scripts/generate-work-og.mjs
 * 產生到 public/og/en/，中文版沿用 /og/works/ 與 exam／explore 封面，不受影響。
 */
export type EnOgKind = 'works' | 'exam' | 'explore';

export const EN_OG_DIR = '/og/en';

export function getEnOgImagePath(kind: EnOgKind, slug: string): string {
  return `${EN_OG_DIR}/${kind}/${slug}.png`;
}
