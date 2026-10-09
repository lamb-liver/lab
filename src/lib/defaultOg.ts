import { getEnOgImagePath } from './enOgPaths';
import { getWorkOgImagePath } from './workOgImage';

/** Default social preview: 繁花曲線 work OG (build-time `/og/works/spirograph-curve.png`). */
export const DEFAULT_OG_SLUG = 'spirograph-curve';
export const DEFAULT_OG_IMAGE = getWorkOgImagePath(DEFAULT_OG_SLUG);
export const DEFAULT_OG_IMAGE_ALT = '繁花曲線';

/** 英文頁（/en/**）的預設預覽圖：同一件作品的英文卡片 */
export const DEFAULT_OG_IMAGE_EN = getEnOgImagePath('works', DEFAULT_OG_SLUG);
export const DEFAULT_OG_IMAGE_ALT_EN = 'Spirograph curve';

export function isDefaultOgImage(path: string | undefined): boolean {
  if (!path) return true;
  return path === DEFAULT_OG_IMAGE || path === DEFAULT_OG_IMAGE_EN;
}
