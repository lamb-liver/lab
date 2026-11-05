import { describe, expect, it } from 'vitest';
import { HEIGHT, clampRadius, readConeCylinder } from './geometry';

const PI = Math.PI;
const SQRT3 = Math.sqrt(3);

describe('2024 高考數學新課標 I 卷第 5 題的圓柱與圓錐', () => {
  it('r = 3 時側面積相等，母線是 2√3，體積是 3√3 π', () => {
    const reading = readConeCylinder(3);
    expect(reading.areasMatch).toBe(true);
    expect(reading.slant).toBeCloseTo(2 * SQRT3, 10);
    expect(reading.cylinderLateral).toBeCloseTo(6 * SQRT3 * PI, 10);
    expect(reading.coneLateral).toBeCloseTo(reading.cylinderLateral, 10);
    expect(reading.coneVolume).toBeCloseTo(3 * SQRT3 * PI, 10);
    expect(reading.volumeWithoutThird).toBeCloseTo(9 * SQRT3 * PI, 10);
    expect(reading.height).toBe(HEIGHT);
  });

  it('半徑改成高 √3 再漏掉 1/3，數值碰巧是 3√3 π，側面積卻不相等', () => {
    const reading = readConeCylinder(SQRT3);
    expect(reading.areasMatch).toBe(false);
    expect(reading.volumeWithoutThird).toBeCloseTo(3 * SQRT3 * PI, 10);
    expect(reading.coneVolume).toBeCloseTo(SQRT3 * PI, 10);
  });

  it('滑桿範圍裡只有 r = 3 讓兩邊側面積相等', () => {
    for (const radius of [0.5, 1, 1.73, 2, 2.99, 3.01, 4, 5]) {
      expect(readConeCylinder(radius).areasMatch).toBe(false);
    }
  });

  it('把圓錐母線換成高，側面積永遠是圓柱的一半', () => {
    for (const radius of [0.5, 1.73, 3, 5]) {
      const reading = readConeCylinder(radius);
      const usingHeight = PI * reading.radius * HEIGHT;
      expect(usingHeight * 2).toBeCloseTo(reading.cylinderLateral, 10);
      expect(usingHeight).not.toBeCloseTo(reading.cylinderLateral, 6);
    }
  });

  it('半徑夾在 0.5 與 5，非數值回到 3', () => {
    expect(clampRadius(0)).toBe(0.5);
    expect(clampRadius(8)).toBe(5);
    expect(clampRadius(Number.NaN)).toBe(3);
    expect(readConeCylinder(-1).radius).toBe(0.5);
  });
});
