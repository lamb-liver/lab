import { describe, expect, it } from 'vitest';
import { BASE_CANVAS_SIZE, BASE_POINT_STEP } from '../../constants';
import { addVec3, vec3 } from '../../projection3d';
import { rowOpSolutionSpaceModule } from './index';
import {
  sceneFromParams,
  solutionLabel,
  rowResidual,
  type RowOpParams,
} from './geometry';

const KS = [-2, -1, 0, 0.35, 2];

describe('row-op-solution-space module', () => {
  it('預設參數採樣非空且落在設計舞台內', () => {
    const out = rowOpSolutionSpaceModule.sample(rowOpSolutionSpaceModule.defaultParams, {
      step: rowOpSolutionSpaceModule.sampleStep ?? BASE_POINT_STEP,
      purpose: 'thumbnail',
    });
    const points = Array.isArray(out) ? out : out.paths.flatMap((path) => path.points);
    expect(points.length).toBeGreaterThan(0);
    for (const point of points) {
      expect(Math.abs(point.x)).toBeLessThanOrEqual(BASE_CANVAS_SIZE / 2);
      expect(Math.abs(point.y)).toBeLessThanOrEqual(BASE_CANVAS_SIZE / 2);
    }
  });

  it('列運算不改變三組方程式的解', () => {
    for (const k of KS) {
      const point = sceneFromParams({ preset: 0, k });
      expect(point.solution.kind).toBe('point');
      if (point.solution.kind !== 'point') continue;
      expect(point.solution.point.x).toBeCloseTo(1);
      expect(point.solution.point.y).toBeCloseTo(1);
      expect(point.solution.point.z).toBeCloseTo(1);
      expect(solutionLabel(point.solution)).toBe('(1, 1, 1)');

      const line = sceneFromParams({ preset: 1, k });
      expect(line.solution.kind).toBe('line');
      const onLine = vec3(1, 1, 2);
      for (const row of line.rows) expect(Math.abs(rowResidual(row, onLine))).toBeLessThan(1e-8);
      if (line.solution.kind === 'line') {
        expect(Math.abs(line.solution.direction.x)).toBeLessThan(1e-8);
        expect(Math.abs(line.solution.direction.y)).toBeLessThan(1e-8);
      }

      const empty = sceneFromParams({ preset: 2, k });
      expect(empty.solution.kind).toBe('empty');
      expect(Math.abs(rowResidual(empty.rows[2], vec3(1, 1, 0)))).toBeGreaterThan(0.5);
    }
  });

  it('金色平面繞著它與第一式的交線轉，白線不參與這次運算', () => {
    for (const preset of [0, 1, 2] as const) {
      const origin = sceneFromParams({ preset, k: 0 });
      expect(origin.hinge).not.toBeNull();
      const hingePoint = origin.hinge![0];
      const hingeStep = addVec3(hingePoint, vec3(
        origin.hinge![1].x - hingePoint.x,
        origin.hinge![1].y - hingePoint.y,
        origin.hinge![1].z - hingePoint.z,
      ));
      for (const k of KS) {
        const next = sceneFromParams({ preset, k } satisfies RowOpParams);
        expect(Math.abs(rowResidual(next.rows[0], hingePoint))).toBeLessThan(1e-8);
        expect(Math.abs(rowResidual(next.rows[2], hingePoint))).toBeLessThan(1e-8);
        expect(Math.abs(rowResidual(next.rows[2], hingeStep))).toBeLessThan(1e-8);
        expect(next.guide[0].x).toBeCloseTo(1);
        expect(next.guide[0].y).toBeCloseTo(1);
        expect(next.guide[1].x).toBeCloseTo(1);
        expect(next.guide[1].y).toBeCloseTo(1);
      }
    }
  });
});
