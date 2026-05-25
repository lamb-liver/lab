import type { WaveMode } from './geometry';

/** 疊加模式寬高比（對應原 sketch 680×420） */
export const SUPERPOSITION_ASPECT = 420 / 680;

/** 拍頻模式在疊加比例上再縮短（0.72–0.78） */
export const BEAT_HEIGHT_SCALE = 0.75;

export const CANVAS_HEIGHT_MIN = 300;
export const CANVAS_HEIGHT_MAX = 520;

/** vh 僅作上限，不作主控制 */
export const CANVAS_VH_CAP_RATIO = 0.42;

function aspectForMode(mode: WaveMode): number {
  return mode === 'superposition'
    ? SUPERPOSITION_ASPECT
    : SUPERPOSITION_ASPECT * BEAT_HEIGHT_SCALE;
}

/**
 * canvas 高度 = clamp(300px, width × ratio, 520px)，可選再以 vh 上限收斂。
 */
export function canvasHeightForWidth(
  mode: WaveMode,
  width: number,
  options?: { vhCapPx?: number },
): number {
  const ratio = aspectForMode(mode);
  const fromWidth = width * ratio;
  let height = Math.max(
    CANVAS_HEIGHT_MIN,
    Math.min(CANVAS_HEIGHT_MAX, fromWidth),
  );
  if (options?.vhCapPx !== undefined) {
    height = Math.min(height, options.vhCapPx);
  }
  return Math.round(height);
}

export function vhCapPx(): number {
  if (typeof window === 'undefined') return CANVAS_HEIGHT_MAX;
  return Math.floor(window.innerHeight * CANVAS_VH_CAP_RATIO);
}
