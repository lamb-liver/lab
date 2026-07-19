import { expect, test } from '@playwright/test';
import { workInteractiveSlugs } from '../src/works/interactiveRegistry';
import { readPublishedContentSlugs } from '../src/test/contentSlugs';
import {
  collectControlsAcrossModes,
  looksLikeControlReference,
  readInteractionLabels,
  unmatchedLabels,
} from './helpers/controlLabels';

/**
 * Works 版的文案／介面一致檢查。控制項由 WorkControlsPortal 掛進
 * `.work-detail__stage` 內的 controls-panel，所以 scope 取整個 stage。
 * validate:changed 會用 WORK_CONTROLS_SLUGS 只跑受影響的頁。
 */

const SCOPE = '.work-detail__stage';

const requested = process.env.WORK_CONTROLS_SLUGS?.split(',')
  .map((value) => value.trim())
  .filter(Boolean);

// draft 的 content 會描述「打算做成什麼」，此時模組還是佔位幾何，不該拿來比對
const published = new Set(readPublishedContentSlugs('works'));

const slugs = (requested?.length ? requested : [...workInteractiveSlugs].sort()).filter(
  (slug) => published.has(slug),
);

/**
 * 畫布內的互動沒有 DOM 節點，這個 spec 掃不到，必須逐一確認實作後才放行。
 * 新增條目前請先在對應的 hook／renderer 找到那段互動程式碼，並把行為寫在註解裡。
 */
const canvasOnlyInteractions: Record<string, string[]> = {
  // useEigenvectorGeometryP5.ts: draggingURef + p.mousePressed，直接拖畫布上的 u
  'eigenvector-geometry': ['一般向量 $\\mathbf u$'],
  // useInverseFunctionReflectionP5.ts: draggingPointRef + p.mousePressed
  'inverse-function-reflection': ['動點 $P$'],
  // buffonNeedleRender.ts: 收斂曲線畫在畫布上，不是控制項
  'buffon-needle': ['$\\pi$ 估計曲線'],
  // naturalLogEGeometryRender.ts: e 標記畫在 Math.E 處；反函數視圖疊 Math.exp 曲線
  'natural-log-e-geometry': ['$e$ 標記', '與 $e^x$ 對照'],
};

test.describe('works 文案與介面控制項一致', () => {
  for (const slug of slugs) {
    test(`/works/${slug} 的互動說明標籤都能在介面上找到`, async ({ page }) => {
      const allLabels = readInteractionLabels('works', slug);
      expect(allLabels, `${slug} 的 ## 互動說明 應該有粗體標籤`).not.toEqual([]);

      // 只驗指涉具名控制項的標籤；畫面元素導讀沒有 DOM 節點可比對
      const labels = allLabels.filter(looksLikeControlReference);
      test.skip(labels.length === 0, `${slug} 沒有指涉具名控制項的標籤`);

      await page.goto(`/works/${slug}`, { waitUntil: 'networkidle' });
      await expect(page.locator('.interactive-loading')).toBeHidden();
      await expect(page.locator(`${SCOPE} .control-field, ${SCOPE} button`).first()).toBeVisible();

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
