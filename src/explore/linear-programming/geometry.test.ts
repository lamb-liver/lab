import { describe, expect, it } from 'vitest';
import { objectiveValue, satisfiesAll } from '../../curve/linearProgramming';
import {
  DEFAULT_LINEAR_PROGRAMMING_PARAMS,
  computeLinearProgrammingMetrics,
  constraintsOf,
  modeTitle,
  modeVerdict,
  objectiveOf,
  type ReadingMode,
} from './geometry';

const DEFAULTS = DEFAULT_LINEAR_PROGRAMMING_PARAMS;
const MODES: ReadingMode[] = ['constraints', 'objective', 'candidates'];

describe('線性規劃：三種讀法讀同一個場景', () => {
  it('切換讀法不改變任何幾何量', () => {
    // 這是這一頁的立論：三種讀法不是三個方法，是同一張圖的三種說法。
    const base = computeLinearProgrammingMetrics({ ...DEFAULTS, mode: 'constraints' });

    for (const mode of MODES) {
      const metrics = computeLinearProgrammingMetrics({ ...DEFAULTS, mode });
      expect(metrics.vertices).toEqual(base.vertices);
      expect(metrics.values).toEqual(base.values);
      expect(metrics.optimal).toEqual(base.optimal);
      expect(metrics.best).toEqual(base.best);
      expect(metrics.polygon).toEqual(base.polygon);
    }
  });

  it('三種讀法的結論指向同一個角點，只是措辭不同', () => {
    const metrics = computeLinearProgrammingMetrics(DEFAULTS);
    const winner = metrics.vertices[metrics.optimal[0]];
    const where = `(${winner.x.toFixed(1)}, ${winner.y.toFixed(1)})`;

    const verdicts = MODES.map((mode) => modeVerdict(metrics, mode));
    for (const verdict of verdicts) {
      expect(verdict).toContain(where);
    }
    expect(new Set(verdicts).size).toBe(MODES.length);
  });

  it('每種讀法都有自己的標題', () => {
    const titles = MODES.map(modeTitle);
    expect(new Set(titles).size).toBe(MODES.length);
    for (const title of titles) {
      expect(title.length).toBeGreaterThan(0);
    }
  });
});

describe('線性規劃：場景本身', () => {
  it('預設是有界四邊形，最優在單一角點', () => {
    const metrics = computeLinearProgrammingMetrics(DEFAULTS);
    expect(metrics.bounded).toBe(true);
    expect(metrics.empty).toBe(false);
    expect(metrics.vertices).toHaveLength(4);
    expect(metrics.optimal).toHaveLength(1);
  });

  it('角點的 z 值與排名一致', () => {
    const metrics = computeLinearProgrammingMetrics(DEFAULTS);
    const { p, q } = objectiveOf(DEFAULTS);

    for (const [index, point] of metrics.vertices.entries()) {
      expect(metrics.values[index]).toBeCloseTo(objectiveValue(p, q, point), 9);
    }
    // ranking 由優到劣，求最大值時 z 應遞減
    for (let i = 1; i < metrics.ranking.length; i += 1) {
      expect(metrics.values[metrics.ranking[i - 1]]).toBeGreaterThanOrEqual(
        metrics.values[metrics.ranking[i]] - 1e-9,
      );
    }
    expect(metrics.ranking[0]).toBe(metrics.optimal[0]);
  });

  it('所有角點都滿足全部約束', () => {
    const metrics = computeLinearProgrammingMetrics(DEFAULTS);
    for (const point of metrics.vertices) {
      expect(satisfiesAll(metrics.constraints, point)).toBe(true);
    }
  });

  it('改求最小值時最優換到另一個角點', () => {
    const max = computeLinearProgrammingMetrics({ ...DEFAULTS, sense: 'max' });
    const min = computeLinearProgrammingMetrics({ ...DEFAULTS, sense: 'min' });
    expect(min.optimal[0]).not.toBe(max.optimal[0]);
    expect(min.best!).toBeLessThanOrEqual(max.best!);
  });

  it('把約束推得夠遠，它就變成冗餘的', () => {
    const metrics = computeLinearProgrammingMetrics({ ...DEFAULTS, offsetB: 10 });
    expect(metrics.redundant.length).toBeGreaterThan(0);

    // 冗餘不代表可行域為空——它只是沒切到
    expect(metrics.empty).toBe(false);
    for (const point of metrics.vertices) {
      expect(satisfiesAll(constraintsOf({ ...DEFAULTS, offsetB: 10 }), point)).toBe(true);
    }
  });

  it('約束往回收到負值時可行域為空', () => {
    const metrics = computeLinearProgrammingMetrics({ ...DEFAULTS, offsetA: -3 });
    expect(metrics.empty).toBe(true);
    expect(metrics.best).toBeNull();
    expect(modeVerdict(metrics, 'constraints')).toContain('沒有解');
  });
});
