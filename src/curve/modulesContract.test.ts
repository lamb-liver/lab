import { describe, expect, it } from 'vitest';
import { BASE_POINT_STEP } from './constants';
import { workCurveBySlug } from './registry';
import type { CurvePoint, ThumbnailSpec } from './types';

/**
 * 全 registry module 的共同契約：schema 與預設值一致、縮圖採樣產出有限座標、
 * metadata 形狀完整。沒有專屬數學測試的 module 至少由此掃描把守。
 */
describe('curve module 共同契約', () => {
  for (const [slug, module] of Object.entries(workCurveBySlug)) {
    describe(slug, () => {
      it('defaultParams 覆蓋 schema 且落在範圍內', () => {
        for (const def of module.paramSchema) {
          const value = module.defaultParams[def.key];
          expect(value, `${slug} missing default for ${def.key}`).toBeDefined();
          expect(value).toBeGreaterThanOrEqual(def.min);
          expect(value).toBeLessThanOrEqual(def.max);
          expect(def.default).toBe(value);
        }
      });

      it('縮圖採樣產出非空且座標有限', () => {
        const out = module.sample(module.defaultParams, {
          step: module.sampleStep ?? BASE_POINT_STEP,
          purpose: 'thumbnail',
        });

        const paths = Array.isArray(out) ? [{ points: out as CurvePoint[] }] : (out as ThumbnailSpec).paths;
        const circles = Array.isArray(out) ? [] : ((out as ThumbnailSpec).circles ?? []);
        const totalShapes = paths.length + circles.length;
        expect(totalShapes, `${slug} thumbnail is empty`).toBeGreaterThan(0);

        // 非有限座標是合法的分段記號（見 curveThumbnail.ts），
        // 但整條 path 全為非有限點就一定是壞資料。
        for (const path of paths) {
          if (path.points.length === 0) continue;
          const finiteCount = path.points.filter(
            (point) => Number.isFinite(point.x) && Number.isFinite(point.y),
          ).length;
          expect(finiteCount, `${slug} path has no finite points`).toBeGreaterThan(0);
        }
        for (const circle of circles) {
          expect(Number.isFinite(circle.x) && Number.isFinite(circle.y), `${slug} non-finite circle`).toBe(true);
          expect(circle.r).toBeGreaterThan(0);
        }
      });

      it('getMetadata 回傳完整形狀', () => {
        const meta = module.getMetadata(module.defaultParams);
        expect(meta.title.length).toBeGreaterThan(0);
        expect(typeof meta.formula).toBe('string');
        expect(Array.isArray(meta.stats)).toBe(true);
      });
    });
  }
});
