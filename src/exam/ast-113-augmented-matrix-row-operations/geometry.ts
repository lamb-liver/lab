export type Pair = readonly [number, number];

export type RowOperationCombination = {
  originalRightSide: Pair;
  reducedRightSide: Pair;
  solution: Pair;
};

export function combineRowOperationResults(
  alpha: number,
  beta: number,
): RowOperationCombination {
  const originalRightSide: Pair = [2 * alpha - beta, alpha - beta];
  const reducedRightSide: Pair = [3 * alpha + 2 * beta, 2 * alpha - beta];
  const solution: Pair = [
    reducedRightSide[0] + reducedRightSide[1],
    reducedRightSide[1],
  ];

  return { originalRightSide, reducedRightSide, solution };
}
