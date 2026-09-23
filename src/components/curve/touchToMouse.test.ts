import { describe, expect, it } from 'vitest';
import type p5 from 'p5';
import { eventClientY, pointerOnCanvas } from './touchToMouse';

function fakeP(opts: { mouseX?: number; mouseY?: number; width?: number; height?: number }): p5 {
  return {
    mouseX: opts.mouseX ?? 0,
    mouseY: opts.mouseY ?? 0,
    width: opts.width ?? 100,
    height: opts.height ?? 100,
  } as unknown as p5;
}

describe('pointerOnCanvas', () => {
  it('uses sketch coordinates when the event has no canvas target', () => {
    expect(pointerOnCanvas(fakeP({ mouseX: 10, mouseY: 10 }))).toBe(true);
    expect(pointerOnCanvas(fakeP({ mouseX: -1, mouseY: 10 }))).toBe(false);
    expect(pointerOnCanvas(fakeP({ mouseX: 10, mouseY: 200, height: 100 }))).toBe(false);
  });
});

describe('eventClientY', () => {
  it('reads clientY from pointer-like events', () => {
    expect(eventClientY({ clientY: 120 } as PointerEvent)).toBe(120);
    expect(eventClientY()).toBeNull();
  });
});
