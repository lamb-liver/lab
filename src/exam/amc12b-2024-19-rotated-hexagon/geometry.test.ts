import { describe, expect, it } from 'vitest';
import {
  HEX_AT_60_FACTOR,
  SIDE,
  SQRT3,
  TARGET_AREA_FACTOR,
  TRIANGLE_AREA_FACTOR,
  areaOverSqrt3,
  circumradius,
  hexVertices,
  hullArea,
  officialTan,
  officialTheta,
  shoelace,
  tangentQuadraticRoots,
  triangleVertices,
} from './geometry';

const DEG = Math.PI / 180;

describe('2024 AMC 12B #19 旋轉六邊形', () => {
  it('外接圓半徑 14√3/3，正三角形邊長 14、面積 49√3', () => {
    expect(circumradius()).toBeCloseTo(SIDE / SQRT3, 12);
    const tri = triangleVertices(0, 0);
    const d = Math.hypot(tri[0].x - tri[1].x, tri[0].y - tri[1].y);
    expect(d).toBeCloseTo(SIDE, 10);
    expect(shoelace(tri) / SQRT3).toBeCloseTo(TRIANGLE_AREA_FACTOR, 8);
  });

  it('鞋帶公式與閉式在幾個角度上一致，起點不影響面積', () => {
    for (const theta of [0, 20 * DEG, 30 * DEG, officialTheta(), 60 * DEG]) {
      for (const start of [0, Math.PI / 2]) {
        expect(shoelace(hexVertices(theta, start))).toBeCloseTo(hullArea(theta), 8);
      }
    }
  });

  it('tan θ = 5√3/11 時面積 / √3 = 91；30° 與 60° 都不是', () => {
    const theta = officialTheta();
    expect(Math.sin(theta)).toBeCloseTo((5 * SQRT3) / 14, 12);
    expect(Math.cos(theta)).toBeCloseTo(11 / 14, 12);
    expect(areaOverSqrt3(theta)).toBeCloseTo(TARGET_AREA_FACTOR, 8);
    expect(areaOverSqrt3(30 * DEG)).toBeCloseTo(49 * SQRT3, 8);
    expect(hullArea(30 * DEG)).toBeCloseTo(147, 8);
    expect(areaOverSqrt3(60 * DEG)).toBeCloseTo(HEX_AT_60_FACTOR, 8);
    expect(areaOverSqrt3(0)).toBeCloseTo(TRIANGLE_AREA_FACTOR, 8);
  });

  it('(0, 60°] 上面積嚴格增加，91√3 只經過一次', () => {
    const marks = [0, 30 * DEG, officialTheta(), 60 * DEG];
    for (let i = 1; i < marks.length; i += 1) {
      expect(hullArea(marks[i])).toBeGreaterThan(hullArea(marks[i - 1]));
    }
  });

  it('二次方程的兩根是 5√3/11 與 4√3；後者是 tan(120°−θ)，超出 60°', () => {
    const [small, large] = tangentQuadraticRoots();
    expect(small).toBeCloseTo(officialTan(), 12);
    expect(large).toBeCloseTo(4 * SQRT3, 10);
    expect(large).toBeGreaterThan(SQRT3);
    const other = Math.atan(large);
    expect(other).toBeGreaterThan(60 * DEG);
    expect(other).toBeCloseTo((120 * DEG) - officialTheta(), 8);
    expect(areaOverSqrt3(other)).toBeCloseTo(TARGET_AREA_FACTOR, 8);
  });

  it('半角正切是 √3/5，倍角才回到 5√3/11；4/5 的面積不是 91√3', () => {
    const theta = officialTheta();
    const half = Math.sin(theta) / (1 + Math.cos(theta));
    expect(half).toBeCloseTo(SQRT3 / 5, 12);
    const doubled = (2 * half) / (1 - half * half);
    expect(doubled).toBeCloseTo(officialTan(), 12);
    expect(areaOverSqrt3(Math.atan(4 / 5))).not.toBeCloseTo(TARGET_AREA_FACTOR, 1);
    expect(areaOverSqrt3(Math.atan(SQRT3 / 5))).not.toBeCloseTo(TARGET_AREA_FACTOR, 1);
  });
});
