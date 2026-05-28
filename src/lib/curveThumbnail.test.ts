import { describe, expect, it } from 'vitest';
import { workCurveBySlug } from '../curve/registry';
import type { CurveModule, CurvePoint } from '../curve/types';
import { getCurveThumbnailSvg, normalizeToThumbnailSpec } from './curveThumbnail';

const point = (x: number, y: number): CurvePoint => ({ x, y, theta: 0, arcLength: 0 });

describe('curveThumbnail', () => {
  it('normalizes legacy sample output into a single path', () => {
    const raw = [point(0, 0), point(1, 1)];
    const spec = normalizeToThumbnailSpec(raw);
    expect(spec.paths).toHaveLength(1);
    expect(spec.paths[0]?.points).toHaveLength(2);
  });

  it('renders filled closed paths when fill is set', () => {
    const slug = '__thumbnail-test-fill__';
    const module: CurveModule = {
      id: slug,
      paramSchema: [],
      defaultParams: {},
      sample: () => ({
        coordinateSystem: 'canvas',
        paths: [
          {
            points: [point(40, 40), point(120, 40), point(120, 120), point(40, 120)],
            closed: true,
            fill: 'rgba(212, 184, 122, 0.4)',
            stroke: 'rgb(212, 184, 122)',
            strokeWidth: 0.8,
          },
        ],
      }),
      getMetadata: () => ({ title: '', formula: '', stats: [] }),
      renderPreset: {
        grid: { kind: 'none' },
        backdrop: { color: '#000000', vignette: 0 },
        curve: { stroke: '#ffffff', strokeWeight: 1, glow: false },
      },
    };

    workCurveBySlug[slug] = module;
    const svg = getCurveThumbnailSvg(slug);
    delete workCurveBySlug[slug];

    expect(svg).toContain('fill="rgba(212, 184, 122, 0.4)"');
  });

  it('renders one svg path for each thumbnail path', () => {
    const slug = '__thumbnail-test-multipath__';
    const module: CurveModule = {
      id: slug,
      paramSchema: [],
      defaultParams: {},
      sample: () => ({
        paths: [
          { points: [point(-1, -1), point(1, 1)] },
          { points: [point(-1, 1), point(1, -1)], opacity: 0.35, strokeWidth: 0.5 },
        ],
      }),
      getMetadata: () => ({ title: '', formula: '', stats: [] }),
      renderPreset: {
        grid: { kind: 'none' },
        backdrop: { color: '#000000', vignette: 0 },
        curve: { stroke: '#ffffff', strokeWeight: 1, glow: false },
      },
    };

    workCurveBySlug[slug] = module;
    const svg = getCurveThumbnailSvg(slug);
    delete workCurveBySlug[slug];

    expect(svg).toBeTruthy();
    expect(svg?.match(/<path /g)?.length).toBe(2);
    expect(svg).toContain('opacity="0.35"');
    expect(svg).toContain('stroke-width="0.5"');
  });

  it('fits bbox using non-excluded paths and still renders excluded paths', () => {
    const slug = '__thumbnail-test-exclude-bbox__';
    const module: CurveModule = {
      id: slug,
      paramSchema: [],
      defaultParams: {},
      sample: () => ({
        paths: [
          { points: [point(-1, -1), point(1, 1)] },
          { points: [point(-100, 0), point(100, 0)], excludeFromBbox: true, opacity: 0.2 },
        ],
      }),
      getMetadata: () => ({ title: '', formula: '', stats: [] }),
      renderPreset: {
        grid: { kind: 'none' },
        backdrop: { color: '#000000', vignette: 0 },
        curve: { stroke: '#ffffff', strokeWeight: 1, glow: false },
      },
    };

    workCurveBySlug[slug] = module;
    const svg = getCurveThumbnailSvg(slug);
    delete workCurveBySlug[slug];

    expect(svg).toBeTruthy();
    expect(svg?.match(/<path /g)?.length).toBe(2);
    expect(svg).toContain('opacity="0.2"');
  });

  it('supports NaN separators as disjoint stroke segments in one path', () => {
    const slug = '__thumbnail-test-nan-segments__';
    const module: CurveModule = {
      id: slug,
      paramSchema: [],
      defaultParams: {},
      sample: () => ({
        paths: [
          {
            points: [
              point(-1, -1),
              point(-0.9, -1),
              { x: Number.NaN, y: Number.NaN, theta: Number.NaN, arcLength: Number.NaN },
              point(1, 1),
              point(1.1, 1),
            ],
            strokeWidth: 0.5,
          },
        ],
      }),
      getMetadata: () => ({ title: '', formula: '', stats: [] }),
      renderPreset: {
        grid: { kind: 'none' },
        backdrop: { color: '#000000', vignette: 0 },
        curve: { stroke: '#ffffff', strokeWeight: 1, glow: false },
      },
    };
    workCurveBySlug[slug] = module;
    const svg = getCurveThumbnailSvg(slug);
    delete workCurveBySlug[slug];

    expect(svg).toBeTruthy();
    expect(svg?.match(/<path /g)?.length).toBe(1);
    expect(svg?.match(/M /g)?.length).toBeGreaterThanOrEqual(2);
  });
});
