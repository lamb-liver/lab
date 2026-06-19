import { describe, expect, it } from 'vitest';
import {
  TAU,
  arcLength,
  circleLayout,
  formatRad,
  pickThetaDrag,
  radiusFromMode,
  thetaFromPoint,
} from './geometry';

describe('radian arc length geometry', () => {
  it('doubles arc length when radius mode doubles', () => {
    const theta = Math.PI / 3;

    expect(radiusFromMode('unit')).toBe(1);
    expect(radiusFromMode('double')).toBe(2);
    expect(arcLength(theta, 'double')).toBeCloseTo(arcLength(theta, 'unit') * 2);
  });

  it('keeps the current theta turn while dragging around the circle', () => {
    const circle = circleLayout(560, 560, 'unit');
    const theta = thetaFromPoint(TAU + 0.2, circle.cx + circle.r, circle.cy, circle);

    expect(theta).toBeCloseTo(TAU);
  });

  it('detects draggable circle area', () => {
    const circle = circleLayout(560, 560, 'unit');

    expect(pickThetaDrag(circle.cx + circle.r, circle.cy, circle)).toBe(true);
    expect(pickThetaDrag(circle.cx + circle.r + 80, circle.cy, circle)).toBe(false);
  });

  it('formats common radian labels', () => {
    expect(formatRad(Math.PI / 2)).toBe('π/2');
    expect(formatRad(Math.PI * 0.82)).toBe('2.58');
  });
});
