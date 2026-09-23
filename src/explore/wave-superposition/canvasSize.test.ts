import { describe, expect, it } from 'vitest';
import { canvasHeightForWidth, stableCanvasHeightForWidth } from './canvasSize';

describe('canvasHeightForWidth', () => {
  it('clamps superposition height at min width', () => {
    expect(canvasHeightForWidth('superposition', 200)).toBe(300);
  });

  it('scales with width between clamps', () => {
    const h = canvasHeightForWidth('superposition', 680);
    expect(h).toBe(420);
    expect(h).toBeLessThanOrEqual(520);
  });

  it('beat mode scales by BEAT_HEIGHT_SCALE when not clamped', () => {
    const w = 680;
    const superH = canvasHeightForWidth('superposition', w);
    const beatH = canvasHeightForWidth('beat', w);
    expect(beatH).toBeLessThan(superH);
    expect(beatH).toBe(315);
  });

  it('respects vh cap as upper bound only', () => {
    const h = canvasHeightForWidth('superposition', 680, { vhCapPx: 350 });
    expect(h).toBe(350);
  });

  it('does not exceed max at ultrawide width', () => {
    const h = canvasHeightForWidth('superposition', 2000);
    expect(h).toBe(520);
  });

  it('stable height is the max across modes so beat does not shrink the canvas', () => {
    const w = 680;
    const stable = stableCanvasHeightForWidth(w);
    expect(stable).toBe(canvasHeightForWidth('superposition', w));
    expect(stable).toBe(canvasHeightForWidth('guide', w));
    expect(stable).toBeGreaterThan(canvasHeightForWidth('beat', w));
  });
});
