import { describe, expect, it } from 'vitest';
import {
  analyzeRegion,
  clipLineToBox,
  constraint,
  constraintFromAngle,
  feasibleVertices,
  findOptimum,
  formatConstraint,
  formatObjective,
  intersectLines,
  isBounded,
  isRedundant,
  objectiveValue,
  redundantIndices,
  regionArea,
  SCENE_MIN,
  satisfiesAll,
  vec2,
  visibleRegionPolygon,
  type Constraint,
} from './linearProgramming';

/** x ≥ 0、y ≥ 0，寫成 ≤ 形式 */
const NON_NEGATIVE: Constraint[] = [
  constraint(-1, 0, 0, 'x ≥ 0'),
  constraint(0, -1, 0, 'y ≥ 0'),
];

/** 邊長 4 的正方形 */
const SQUARE: Constraint[] = [
  ...NON_NEGATIVE,
  constraint(1, 0, 4, 'x ≤ 4'),
  constraint(0, 1, 4, 'y ≤ 4'),
];

describe('半平面與交點', () => {
  it('交點同時落在兩條約束的邊界上', () => {
    const point = intersectLines(constraint(1, 1, 6, 'A'), constraint(1, -1, 2, 'B'));
    expect(point).not.toBeNull();
    expect(point!.x).toBeCloseTo(4, 9);
    expect(point!.y).toBeCloseTo(2, 9);
  });

  it('平行約束沒有交點', () => {
    expect(intersectLines(constraint(1, 1, 6, 'A'), constraint(2, 2, 3, 'B'))).toBeNull();
  });

  it('角度與位移造出的約束，法向是單位向量', () => {
    const con = constraintFromAngle(37, 2.5, 'θ');
    expect(Math.hypot(con.a, con.b)).toBeCloseTo(1, 9);
    expect(con.c).toBe(2.5);
  });
});

describe('可行域', () => {
  it('正方形有四個角點，面積為 16', () => {
    const region = analyzeRegion(SQUARE);
    expect(region.vertices).toHaveLength(4);
    expect(region.bounded).toBe(true);
    expect(region.empty).toBe(false);
    expect(regionArea(region)).toBeCloseTo(16, 9);
  });

  it('角點依環繞順序排列，鞋帶公式才算得出面積', () => {
    const region = analyzeRegion(SQUARE);
    const corners = region.vertices.map((v) => `${v.point.x},${v.point.y}`);
    // 相鄰兩點必定共用一條邊：座標只有一個分量不同
    for (let i = 0; i < corners.length; i += 1) {
      const a = region.vertices[i].point;
      const b = region.vertices[(i + 1) % corners.length].point;
      const sameX = Math.abs(a.x - b.x) < 1e-9;
      const sameY = Math.abs(a.y - b.y) < 1e-9;
      expect(sameX || sameY).toBe(true);
    }
  });

  it('矛盾約束的可行域為空', () => {
    const region = analyzeRegion([
      ...NON_NEGATIVE,
      constraint(1, 1, 2, '和 ≤ 2'),
      constraint(-1, -1, -8, '和 ≥ 8'),
    ]);
    expect(region.empty).toBe(true);
    expect(region.vertices).toHaveLength(0);
  });

  it('只有非負限制時是無界的第一象限', () => {
    const region = analyzeRegion(NON_NEGATIVE);
    expect(region.bounded).toBe(false);
    expect(region.empty).toBe(false);
    expect(region.vertices).toHaveLength(1);
    expect(regionArea(region)).toBe(0);
  });

  it('所有角點都滿足全部約束', () => {
    const constraints: Constraint[] = [
      ...NON_NEGATIVE,
      constraint(2, 1, 10, 'A'),
      constraint(1, 3, 15, 'B'),
      constraint(1, 1, 6, 'C'),
    ];
    for (const vertex of feasibleVertices(constraints)) {
      expect(satisfiesAll(constraints, vertex.point)).toBe(true);
    }
  });
});

describe('冗餘約束', () => {
  it('切不到可行域的約束是冗餘的，移除後角點不變', () => {
    const constraints: Constraint[] = [...SQUARE, constraint(1, 1, 20, '遠在天邊')];
    const redundant = redundantIndices(constraints);
    expect(redundant).toEqual([4]);

    const withoutIt = analyzeRegion(SQUARE).vertices.map((v) => v.point);
    const withIt = analyzeRegion(constraints).vertices.map((v) => v.point);
    expect(withIt).toEqual(withoutIt);
  });

  it('圍出邊界的約束不是冗餘的', () => {
    expect(isRedundant(SQUARE, 2)).toBe(false);
    expect(isRedundant(SQUARE, 3)).toBe(false);
  });

  it('拿掉後區域會往左式變大的方向無界的約束，不算冗餘', () => {
    // 少了 x ≤ 4，區域沿 +x 無界，x 的上界就取不到了
    const constraints: Constraint[] = [
      ...NON_NEGATIVE,
      constraint(1, 0, 4, 'x ≤ 4'),
      constraint(0, 1, 4, 'y ≤ 4'),
    ];
    expect(isRedundant(constraints, 2)).toBe(false);
    expect(isBounded(constraints.filter((_, i) => i !== 2))).toBe(false);
  });
});

describe('最優解', () => {
  const constraints: Constraint[] = [
    ...NON_NEGATIVE,
    constraint(2, 1, 10, 'A'),
    constraint(1, 3, 15, 'B'),
  ];

  it('頂點上的最優值等於在整個可行域取樣的最優值', () => {
    // 線性規劃基本定理：有界可行域上的線性目標，最優必在角點取得。
    // 用密集取樣當獨立對照，若哪天頂點列舉漏掉一個角點，這裡會先紅。
    const region = analyzeRegion(constraints);
    const p = 3;
    const q = 2;
    const report = findOptimum(region, constraints, p, q, 'max');
    expect(report.best).not.toBeNull();

    let sampledBest = -Infinity;
    for (let x = 0; x <= 6; x += 0.02) {
      for (let y = 0; y <= 6; y += 0.02) {
        const point = vec2(x, y);
        if (!satisfiesAll(constraints, point)) continue;
        sampledBest = Math.max(sampledBest, objectiveValue(p, q, point));
      }
    }

    expect(report.best!).toBeGreaterThanOrEqual(sampledBest - 1e-9);
    expect(report.best! - sampledBest).toBeLessThan(0.1);
  });

  it('等值線與某條邊平行時，兩個頂點並列最優', () => {
    const region = analyzeRegion(constraints);
    // 目標取 (2, 1)，與約束 A 的法向同向，A 那一整條邊都是最優
    const report = findOptimum(region, constraints, 2, 1, 'max');
    expect(report.optimal).toHaveLength(2);

    const values = report.optimal.map((index) =>
      objectiveValue(2, 1, region.vertices[index].point),
    );
    expect(values[0]).toBeCloseTo(values[1], 9);
  });

  it('目標方向一般時只有單一最優頂點', () => {
    const region = analyzeRegion(constraints);
    expect(findOptimum(region, constraints, 3, 2, 'max').optimal).toHaveLength(1);
  });

  it('排名首位就是最優，且 max 與 min 方向相反', () => {
    const region = analyzeRegion(constraints);
    const max = findOptimum(region, constraints, 3, 2, 'max');
    const min = findOptimum(region, constraints, 3, 2, 'min');
    expect(max.ranking[0]).toBe(max.optimal[0]);
    expect(max.ranking.at(-1)).toBe(min.ranking[0]);
  });

  it('目標沿無界方向變好時，回報最優值不存在', () => {
    const region = analyzeRegion(NON_NEGATIVE);
    const report = findOptimum(region, NON_NEGATIVE, 1, 1, 'max');
    expect(report.unbounded).toBe(true);
    expect(report.best).toBeNull();
  });

  it('無界區域上目標若朝內，最優值仍存在', () => {
    const region = analyzeRegion(NON_NEGATIVE);
    const report = findOptimum(region, NON_NEGATIVE, 1, 1, 'min');
    expect(report.unbounded).toBe(false);
    expect(report.best).toBeCloseTo(0, 9);
  });

  it('可行域為空時沒有排名也沒有最優', () => {
    const infeasible: Constraint[] = [
      ...NON_NEGATIVE,
      constraint(1, 1, 2, '和 ≤ 2'),
      constraint(-1, -1, -8, '和 ≥ 8'),
    ];
    const report = findOptimum(analyzeRegion(infeasible), infeasible, 1, 1, 'max');
    expect(report.best).toBeNull();
    expect(report.ranking).toHaveLength(0);
  });
});

describe('可見區域多邊形', () => {
  it('有界區域裁切出的多邊形，就是它的角點', () => {
    const polygon = visibleRegionPolygon(SQUARE, SCENE_MIN, 10);
    expect(polygon).toHaveLength(4);
    const corners = polygon.map((p) => `${p.x.toFixed(3)},${p.y.toFixed(3)}`).sort();
    expect(corners).toEqual(['0.000,0.000', '0.000,4.000', '4.000,0.000', '4.000,4.000'].sort());
  });

  it('無界區域也裁切得出多邊形——角點不夠但畫面上看得見', () => {
    const polygon = visibleRegionPolygon(NON_NEGATIVE, SCENE_MIN, 10);
    expect(polygon.length).toBeGreaterThanOrEqual(3);
    for (const point of polygon) {
      expect(satisfiesAll(NON_NEGATIVE, point)).toBe(true);
    }
  });

  it('可行域為空時沒有多邊形', () => {
    const infeasible: Constraint[] = [
      ...NON_NEGATIVE,
      constraint(1, 1, 2, '和 ≤ 2'),
      constraint(-1, -1, -8, '和 ≥ 8'),
    ];
    expect(visibleRegionPolygon(infeasible, SCENE_MIN, 10)).toHaveLength(0);
  });

  it('多邊形每個頂點都是可行的', () => {
    const constraints: Constraint[] = [
      ...NON_NEGATIVE,
      constraint(2, 1, 10, 'A'),
      constraint(1, 3, 15, 'B'),
    ];
    for (const point of visibleRegionPolygon(constraints, SCENE_MIN, 10)) {
      expect(satisfiesAll(constraints, point)).toBe(true);
    }
  });
});

describe('繪圖輔助', () => {
  it('裁切後的端點落在方框邊界上', () => {
    const clipped = clipLineToBox(1, 1, 2, -5, 5);
    expect(clipped).not.toBeNull();
    for (const point of clipped!) {
      expect(Math.max(Math.abs(point.x), Math.abs(point.y))).toBeLessThanOrEqual(5 + 1e-6);
      expect(point.x + point.y).toBeCloseTo(2, 9);
    }
  });

  it('完全在框外的線沒有端點', () => {
    expect(clipLineToBox(1, 0, 50, -5, 5)).toBeNull();
  });

  it('讀數用 U+2212 當負號', () => {
    const text = formatConstraint(constraint(-1.5, -2, -3, 'A'));
    expect(text).toBe('−1.50x − 2.00y ≤ −3.00');
    expect(text).not.toContain('-');
  });

  it('目標函數兩個係數各自為負時，減號來源不同但寫法一致', () => {
    expect(formatObjective(3, 2)).toBe('z = 3.0x + 2.0y');
    expect(formatObjective(3, -2)).toBe('z = 3.0x − 2.0y');
    expect(formatObjective(-3, 2)).toBe('z = −3.0x + 2.0y');

    const both = formatObjective(-3, -2);
    expect(both).toBe('z = −3.0x − 2.0y');
    expect(both).not.toContain('-');
  });
});
