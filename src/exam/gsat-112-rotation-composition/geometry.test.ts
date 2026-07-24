import { describe, expect, it } from 'vitest';
import { multiplyMatrices } from '../../curve/modules/matrix-linear-transform/matrix';
import {
  examTransforms,
  getComparison,
  getExpressionSteps,
  matricesEqual,
} from './geometry';

describe('112 學測數A多選 11 的矩陣關係', () => {
  it('辨認正確的單一矩陣與合成關係', () => {
    expect(matricesEqual(examTransforms.A, {
      a: -examTransforms.B.a,
      b: -examTransforms.B.b,
      c: -examTransforms.B.c,
      d: -examTransforms.B.d,
    })).toBe(true);
    expect(getComparison('rotations').equal).toBe(true);
    expect(getComparison('rotation-reflection').equal).toBe(false);
    expect(getComparison('question-four').equal).toBe(false);
    expect(getComparison('question-five').equal).toBe(true);
  });

  it('鏡射是自身的反矩陣，不會把 C 誤認成 D 的反矩陣', () => {
    const identity = { a: 1, b: 0, c: 0, d: 1 };
    expect(matricesEqual(multiplyMatrices(examTransforms.C, examTransforms.C), identity)).toBe(true);
    expect(matricesEqual(multiplyMatrices(examTransforms.D, examTransforms.D), identity)).toBe(true);
    expect(matricesEqual(examTransforms.C, examTransforms.D)).toBe(false);
  });

  it('合成 XY 會先做 Y，再做 X', () => {
    const steps = getExpressionSteps('AC');

    expect(steps.first).toBe('C');
    expect(steps.second).toBe('A');
    expect(matricesEqual(steps.firstMatrix, examTransforms.C)).toBe(true);
    expect(
      matricesEqual(
        steps.resultMatrix,
        multiplyMatrices(examTransforms.A, examTransforms.C),
      ),
    ).toBe(true);
  });
});
