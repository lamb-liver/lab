import { describe, expect, it } from 'vitest';
import { combineRowOperationResults } from './geometry';

describe('113 分科數甲選填 9 的相同列運算', () => {
  it('保留兩組已知系統的線性組合並得到原題答案', () => {
    expect(combineRowOperationResults(1, 0)).toEqual({
      originalRightSide: [2, 1],
      reducedRightSide: [3, 2],
      solution: [5, 2],
    });
    expect(combineRowOperationResults(0, 1)).toEqual({
      originalRightSide: [-1, -1],
      reducedRightSide: [2, -1],
      solution: [1, -1],
    });
    expect(combineRowOperationResults(-1, -2)).toEqual({
      originalRightSide: [0, 1],
      reducedRightSide: [-7, 0],
      solution: [-7, 0],
    });
  });
});
