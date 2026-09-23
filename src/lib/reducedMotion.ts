export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/** Linear reveal step. Reduced motion jumps to the finished frame. */
export function advanceReveal(progress: number, delta: number): number {
  if (prefersReducedMotion()) return 1;
  if (!Number.isFinite(progress)) return 0;
  if (!Number.isFinite(delta) || delta <= 0) return Math.max(0, Math.min(1, progress));
  return Math.min(1, Math.max(0, progress) + delta);
}

/** Exponential-style reveal: `p + (1 - p) * rate`. */
export function lerpReveal(progress: number, rate: number): number {
  if (prefersReducedMotion()) return 1;
  if (!Number.isFinite(progress)) return 0;
  if (!Number.isFinite(rate) || rate <= 0) return Math.max(0, Math.min(1, progress));
  return Math.min(1, progress + (1 - progress) * rate);
}
