import { describe, expect, it } from 'vitest';
import {
  createScatterPoints,
  paramsFromValues,
  regression,
  scaleCloud,
  translatePoints,
} from './geometry';

describe('scatter correlation regression geometry', () => {
  it('fits a perfect line', () => {
    const fit = regression([
      { x: 1, y: 2 },
      { x: 2, y: 4 },
      { x: 3, y: 6 },
    ]);

    expect(fit?.r).toBeCloseTo(1);
    expect(fit?.a).toBeCloseTo(0);
    expect(fit?.b).toBeCloseTo(2);
    expect(fit?.rss).toBeCloseTo(0);
  });

  it('keeps correlation under translation and positive scale', () => {
    const points = createScatterPoints(paramsFromValues({ n: 12, beta: 0.72, curve: 0, noise: 0.85 }));
    const r = regression(points)?.r;
    const moved = translatePoints(scaleCloud(points, 0.82), 0.6, 0);

    expect(regression(moved)?.r).toBeCloseTo(r ?? 0);
  });
});
