import { describe, expect, it } from 'vitest';
import {
  buildStreamlines,
  createVectorFieldLayout,
  getFieldConfig,
  getSeedCount,
  makeSeeds,
  worldToScreen,
} from './geometry';
import { vectorFieldPatternsModule } from './index';

describe('vector field pattern geometry', () => {
  it('uses equal x/y screen scale for square plot mapping', () => {
    const layout = createVectorFieldLayout(640, 640);
    const origin = worldToScreen(layout, { x: 0, y: 0 });
    const xUnit = worldToScreen(layout, { x: 1, y: 0 });
    const yUnit = worldToScreen(layout, { x: 0, y: 1 });

    expect(Math.abs(xUnit.x - origin.x)).toBeCloseTo(Math.abs(origin.y - yUnit.y), 6);
  });

  it('computes seed count without rebuilding seed coordinates', () => {
    const source = getFieldConfig('source');
    const uniform = getFieldConfig('uniform');

    expect(getSeedCount(source, 15)).toBe(makeSeeds(source, 15).length);
    expect(getSeedCount(uniform, 15)).toBe(makeSeeds(uniform, 15).length);
  });

  it('builds streamlines for each pattern', () => {
    const vortex = getFieldConfig('vortex');
    const lines = buildStreamlines(vortex, 9);
    expect(lines.length).toBeGreaterThan(4);
    expect(lines[0]!.length).toBeGreaterThan(2);
  });
});

describe('vectorFieldPatternsModule', () => {
  it('returns thumbnail paths and four metadata rows', () => {
    const result = vectorFieldPatternsModule.sample(
      vectorFieldPatternsModule.defaultParams,
      { step: 1, purpose: 'thumbnail' },
    );
    const metadata = vectorFieldPatternsModule.getMetadata(
      vectorFieldPatternsModule.defaultParams,
    );

    expect('paths' in result).toBe(true);
    expect((result as { paths: unknown[] }).paths.length).toBeGreaterThan(4);
    expect(metadata.stats).toHaveLength(4);
  });
});
