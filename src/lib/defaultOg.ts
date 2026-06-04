import { getWorkOgImagePath } from './workOgImage';

/** Default social preview: 繁花曲線 work OG (build-time `/og/works/spirograph-curve.png`). */
export const DEFAULT_OG_SLUG = 'spirograph-curve';
export const DEFAULT_OG_IMAGE = getWorkOgImagePath(DEFAULT_OG_SLUG);
export const DEFAULT_OG_IMAGE_ALT = '繁花曲線';

export function isDefaultOgImage(path: string | undefined): boolean {
  if (!path) return true;
  return path === DEFAULT_OG_IMAGE;
}
