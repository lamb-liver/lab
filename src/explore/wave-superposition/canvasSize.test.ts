import { describe, expect, it } from 'vitest';
import {
  BEAT_HEIGHT_SCALE,
  CANVAS_HEIGHT_MAX,
  CANVAS_HEIGHT_MIN,
  canvasHeightForWidth,
  SUPERPOSITION_ASPECT,
} from './canvasSize';

describe('canvasHeightForWidth', () => {
  it('clamps superposition height at min width', () => {
    expect(canvasHeightForWidth('superposition', 200)).toBe(CANVAS_HEIGHT_MIN);
  });

  it('scales with width between clamps', () => {
    const h = canvasHeightForWidth('superposition', 680);
    expect(h).toBe(Math.round(680 * SUPERPOSITION_ASPECT));
    expect(h).toBeLessThanOrEqual(CANVAS_HEIGHT_MAX);
  });

  it('beat mode scales by BEAT_HEIGHT_SCALE when not clamped', () => {
    const w = 680;
    const superH = canvasHeightForWidth('superposition', w);
    const beatH = canvasHeightForWidth('beat', w);
    expect(beatH).toBeLessThan(superH);
    expect(beatH).toBe(Math.round(superH * BEAT_HEIGHT_SCALE));
  });

  it('respects vh cap as upper bound only', () => {
    const h = canvasHeightForWidth('superposition', 680, { vhCapPx: 350 });
    expect(h).toBe(350);
  });

  it('does not exceed max at ultrawide width', () => {
    const h = canvasHeightForWidth('superposition', 2000);
    expect(h).toBe(CANVAS_HEIGHT_MAX);
  });
});
