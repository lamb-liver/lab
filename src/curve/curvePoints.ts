import type { CurvePoint, ThumbnailSpec } from './types';

/**
 * 將 `sample()` 的回傳窄化為點列。依 `SampleOptions` 約定，
 * default purpose 的採樣一律回傳 `CurvePoint[]`；`ThumbnailSpec`
 * 只出現在 `purpose: 'thumbnail'` 路徑。
 */
export function asCurvePoints(out: CurvePoint[] | ThumbnailSpec): CurvePoint[] {
  return out as CurvePoint[];
}
