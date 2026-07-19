import { expect, test } from '@playwright/test';
import { exploreInteractiveSlugs } from '../src/explore/interactiveRegistry';
import {
  collectControlsAcrossModes,
  readInteractionLabels,
  unmatchedLabels,
} from './helpers/controlLabels';

/**
 * 擋住「文案描述了介面上不存在的控制項」這類漂移。
 * 預設掃全部 slug；validate:changed 會用 EXPLORE_CONTROLS_SLUGS 只跑受影響的頁。
 */

const SCOPE = '.explore-detail';

const requested = process.env.EXPLORE_CONTROLS_SLUGS?.split(',')
  .map((value) => value.trim())
  .filter(Boolean);

const slugs = requested?.length ? requested : [...exploreInteractiveSlugs].sort();

/**
 * 畫布內的互動沒有 DOM 節點，這個 spec 掃不到，必須逐一確認實作後才放行。
 * 新增條目前請先在對應的 ExploreRoot 找到那段互動程式碼，並把行為寫在註解裡。
 */
const canvasOnlyInteractions: Record<string, string[]> = {
  // DifferentialEquationsGeometryExploreRoot.tsx: p.mousePressed 於畫布上加點
  'differential-equations-geometry': ['初始條件'],
};

test.describe('explore 文案與介面控制項一致', () => {
  for (const slug of slugs) {
    test(`/explore/${slug} 的互動說明標籤都能在介面上找到`, async ({ page }) => {
      const labels = readInteractionLabels('explore', slug);
      expect(labels, `${slug} 的 ## 互動說明 應該有粗體標籤`).not.toEqual([]);

      await page.goto(`/explore/${slug}`, { waitUntil: 'networkidle' });
      await expect(page.locator('.interactive-loading')).toBeHidden();

      const controls = await collectControlsAcrossModes(page, SCOPE);
      const allowed = canvasOnlyInteractions[slug] ?? [];
      const missing = unmatchedLabels(
        labels.filter((label) => !allowed.includes(label)),
        controls,
      );

      expect(
        missing,
        `${slug}：互動說明寫了介面上找不到的控制項。實際控制項：${controls.join(' | ')}`,
      ).toEqual([]);
    });
  }
});
