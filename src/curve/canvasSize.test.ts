import { describe, expect, it } from 'vitest';
import { BASE_CANVAS_SIZE } from './constants';
import { measureWorkCanvasSize } from './canvasSize';

function host(width: number, height: number): HTMLElement {
  return { clientWidth: width, clientHeight: height } as HTMLElement;
}

describe('measureWorkCanvasSize', () => {
  it('caps at BASE_CANVAS_SIZE', () => {
    expect(measureWorkCanvasSize(host(900, 900))).toBe(BASE_CANVAS_SIZE);
  });

  it('uses the shorter side so a reserved square does not overflow', () => {
    expect(measureWorkCanvasSize(host(390, 354))).toBe(354);
  });

  it('falls back to width when height is not laid out yet', () => {
    expect(measureWorkCanvasSize(host(400, 0))).toBe(400);
  });
});
