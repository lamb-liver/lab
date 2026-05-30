export const FRAME_MS_60FPS = 1000 / 60;
export const REVEAL_RESET_TIMEOUT_MS = 1200;

export function frameScale(deltaMs = FRAME_MS_60FPS): number {
  const safeDelta = Number.isFinite(deltaMs) && deltaMs > 0 ? deltaMs : FRAME_MS_60FPS;
  return Math.max(0, Math.min(3, safeDelta / FRAME_MS_60FPS));
}

export function shouldCommitPendingReset(
  pending: boolean,
  settled: boolean,
  nowMs: number,
  pendingSince: number,
): boolean {
  if (!pending) return false;
  return settled || nowMs - pendingSince > REVEAL_RESET_TIMEOUT_MS;
}
