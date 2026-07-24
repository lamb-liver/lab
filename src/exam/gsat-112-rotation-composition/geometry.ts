import {
  matrixDifference,
  matrixFromSpecial,
  matrixRotation,
  multiplyMatrices,
} from '../../curve/modules/matrix-linear-transform/matrix';
import type { Matrix2 } from '../../curve/modules/matrix-linear-transform/types';

export const examTransforms = {
  A: matrixRotation(-Math.PI / 2),
  B: matrixRotation(Math.PI / 2),
  C: matrixFromSpecial('reflection', Math.PI / 4),
  D: matrixFromSpecial('reflection', -Math.PI / 4),
} satisfies Record<string, Matrix2>;

export type TransformName = keyof typeof examTransforms;
export type MatrixExpression = 'AB' | 'BA' | 'AC' | 'CA' | 'CD' | 'BD';
export type ComparisonId = 'rotations' | 'rotation-reflection' | 'question-four' | 'question-five';

export const comparisonOptions: ReadonlyArray<{
  id: ComparisonId;
  label: string;
  left: MatrixExpression;
  right: MatrixExpression;
  note: string;
}> = [
  {
    id: 'rotations',
    label: '兩個旋轉',
    left: 'AB',
    right: 'BA',
    note: '順、逆時針各轉 90°，兩種順序都回到原位。',
  },
  {
    id: 'rotation-reflection',
    label: '旋轉與鏡射',
    left: 'AC',
    right: 'CA',
    note: '旋轉和鏡射通常不可交換，圖形方向會分岔。',
  },
  {
    id: 'question-four',
    label: 'AB 與 CD',
    left: 'AB',
    right: 'CD',
    note: 'AB 是不變變換，CD 是旋轉 180°，兩者不同。',
  },
  {
    id: 'question-five',
    label: 'AC 與 BD',
    left: 'AC',
    right: 'BD',
    note: '兩組合成都等於對 x 軸鏡射。',
  },
];

export function matrixForExpression(expression: MatrixExpression): Matrix2 {
  const left = expression[0] as TransformName;
  const right = expression[1] as TransformName;
  return multiplyMatrices(examTransforms[left], examTransforms[right]);
}

export function getExpressionSteps(expression: MatrixExpression) {
  const first = expression[1] as TransformName;
  const second = expression[0] as TransformName;
  return {
    first,
    second,
    firstMatrix: examTransforms[first],
    resultMatrix: matrixForExpression(expression),
  };
}

export function matricesEqual(left: Matrix2, right: Matrix2): boolean {
  return matrixDifference(left, right) < 1e-9;
}

export function getComparison(id: ComparisonId) {
  const option = comparisonOptions.find((item) => item.id === id) ?? comparisonOptions[0];
  const leftSteps = getExpressionSteps(option.left);
  const rightSteps = getExpressionSteps(option.right);
  return {
    ...option,
    leftSteps,
    rightSteps,
    leftMatrix: leftSteps.resultMatrix,
    rightMatrix: rightSteps.resultMatrix,
    equal: matricesEqual(leftSteps.resultMatrix, rightSteps.resultMatrix),
  };
}
