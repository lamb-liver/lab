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

function finiteBbox(spec: ThumbnailSpec):
  | { minX: number; maxX: number; minY: number; maxY: number }
  | null {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  let count = 0;

  function add(x: number, y: number) {
    if (!Number.isFinite(x) || !Number.isFinite(y)) return;
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
    count += 1;
  }

  for (const path of spec.paths) {
    for (const point of path.points) add(point.x, point.y);
  }

  for (const circle of spec.circles ?? []) {
    add(circle.x - circle.r, circle.y - circle.r);
    add(circle.x + circle.r, circle.y + circle.r);
  }

  if (count === 0) return null;
  return { minX, maxX, minY, maxY };
}

function sampleThumbnail(slug: string): ThumbnailSpec {
  const module = workCurveBySlug[slug]!;
  return toSpec(
    module.sample(module.defaultParams, {
      step: module.sampleStep ?? 4,
      purpose: 'thumbnail',
      revealProgress: 1,
    }),
  );
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
  // Sweeps every registered module; needs headroom beyond the 5s default as
  // the registry grows.
  it('renders structurally valid svg for all registered work slugs', { timeout: 60_000 }, () => {
    const slugs = Object.keys(workCurveBySlug);
    expect(slugs.length).toBeGreaterThanOrEqual(47);

    for (const slug of slugs) {
      const svg = getCurveThumbnailSvg(slug);
      expect(svg, `thumbnail should render for ${slug}`).toBeTruthy();
      expect(svg, `thumbnail should not leak invalid numbers for ${slug}`).not.toMatch(
        /NaN|Infinity/,
      );
      const nodeCount = (svg?.match(/<path /g)?.length ?? 0) + (svg?.match(/<circle /g)?.length ?? 0);
      expect(nodeCount, `thumbnail should include visible nodes for ${slug}`).toBeGreaterThan(0);

      const box = finiteBbox(sampleThumbnail(slug));
      expect(box, `thumbnail sample should include finite geometry for ${slug}`).toBeTruthy();
      if (!box) continue;
      expect(box.maxX - box.minX, `thumbnail bbox width should be non-zero for ${slug}`).toBeGreaterThan(0.001);
      expect(box.maxY - box.minY, `thumbnail bbox height should be non-zero for ${slug}`).toBeGreaterThan(0.001);
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

  it('chladni thumbnail yields >= 2000 particle points', { timeout: 30_000 }, () => {
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
