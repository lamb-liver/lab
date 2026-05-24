import { describe, expect, it } from 'vitest';
import { getCurveThumbnailSvg } from './curveThumbnail';
import { workCurveBySlug } from '../curve/registry';
import type { CurvePoint, ThumbnailSpec } from '../curve/types';
import { evaluateTractrix } from '../curve/modules/catenary/geometry';
import { GRID_SEGMENT_COUNT } from '../curve/modules/linear-transform-grid';

function toSpec(raw: CurvePoint[] | ThumbnailSpec): ThumbnailSpec {
  return Array.isArray(raw) ? { paths: [{ points: raw }] } : raw;
}

function maxAbsY(points: CurvePoint[]): number {
  let max = 0;
  for (const p of points) {
    max = Math.max(max, Math.abs(p.y));
  }
  return max;
}

function pointCount(spec: ThumbnailSpec): number {
  return spec.paths.reduce((sum, path) => sum + path.points.length, 0);
}

function bboxX(spec: ThumbnailSpec): { minX: number; maxX: number } | null {
  const included = spec.paths.filter((p) => p.excludeFromBbox !== true);
  const points = included.flatMap((p) => p.points);
  if (points.length === 0) return null;
  let minX = Infinity;
  let maxX = -Infinity;
  for (const p of points) {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
  }
  return { minX, maxX };
}

describe('work thumbnail registry', () => {
  it('renders svg for every registered work slug', () => {
    for (const slug of Object.keys(workCurveBySlug)) {
      const svg = getCurveThumbnailSvg(slug);
      expect(svg, `thumbnail should render for ${slug}`).toBeTruthy();
    }
  });

  it('interference uses default params and yields 5 envelope paths', () => {
    const module = workCurveBySlug['interference-fringes']!;
    const spec = toSpec(
      module.sample(module.defaultParams, {
        step: module.sampleStep ?? 4,
        purpose: 'thumbnail',
        revealProgress: 1,
      }),
    );
    expect(spec.paths.length).toBe(5);
  });

  it('standing-wave thumbnail main path has visible amplitude', () => {
    const module = workCurveBySlug['standing-wave']!;
    const spec = toSpec(
      module.sample(module.defaultParams, {
        step: module.sampleStep ?? 2,
        purpose: 'thumbnail',
        revealProgress: 1,
      }),
    );
    expect(spec.paths.length).toBeGreaterThan(0);
    expect(maxAbsY(spec.paths[0]!.points)).toBeGreaterThan(10);
  });

  it('linear-transform-grid thumbnail yields full segment count', () => {
    const module = workCurveBySlug['linear-transform-grid']!;
    const spec = toSpec(
      module.sample(module.defaultParams, {
        step: module.sampleStep ?? 8,
        purpose: 'thumbnail',
        revealProgress: 1,
      }),
    );
    expect(spec.paths.length).toBeGreaterThanOrEqual(GRID_SEGMENT_COUNT);
  });

  it('chladni thumbnail yields >= 2000 particle points', () => {
    const module = workCurveBySlug['chladni-figures']!;
    const spec = toSpec(
      module.sample(module.defaultParams, {
        step: module.sampleStep ?? 4,
        purpose: 'thumbnail',
        revealProgress: 1,
      }),
    );
    expect(pointCount(spec)).toBeGreaterThanOrEqual(2000);
  });

  it('affine-ifs-fractal thumbnail yields >= 5000 particle points', () => {
    const module = workCurveBySlug['affine-ifs-fractal']!;
    const spec = toSpec(
      module.sample(module.defaultParams, {
        step: module.sampleStep ?? 2,
        purpose: 'thumbnail',
        revealProgress: 1,
      }),
    );
    expect(pointCount(spec)).toBeGreaterThanOrEqual(5000);
  });

  it('catenary bbox includes rope span (dynamic + rope, excludes ghost)', () => {
    const module = workCurveBySlug.catenary!;
    const spec = toSpec(
      module.sample(module.defaultParams, {
        step: module.sampleStep ?? 1,
        purpose: 'thumbnail',
        revealProgress: 1,
      }),
    );
    expect(spec.paths.length).toBe(6);
    const box = bboxX(spec);
    expect(box).toBeTruthy();
    if (!box) return;

    const tractrixEndX = evaluateTractrix(
      module.defaultParams.maxT,
      module.defaultParams.ropeLength,
    ).x;
    expect(box.maxX).toBeGreaterThan(tractrixEndX);
  });
});
