import { expect, test } from '@playwright/test';
import { contestInteractiveSlugs } from '../src/contest/interactiveRegistry';
import {
  collectControlsAcrossModes,
  readInteractionLabels,
  unmatchedLabels,
} from './helpers/controlLabels';

const requested = process.env.CONTEST_CONTROLS_SLUGS?.split(',')
  .map((value) => value.trim())
  .filter(Boolean);
const slugs = requested?.length ? requested : [...contestInteractiveSlugs].sort();

const canvasOnlyInteractions: Record<string, string[]> = {
  'homogeneous-normalization': ['拖曳比例點'],
};

test.describe('研題文案與介面控制項一致', () => {
  for (const slug of slugs) {
    test(`/contest/${slug} 的互動說明標籤都能在介面上找到`, async ({ page }) => {
      const labels = readInteractionLabels('contest-studies', slug);
      expect(labels, `${slug} 的 ## 互動說明 應該有粗體標籤`).not.toEqual([]);

      await page.goto(`/contest/${slug}`, { waitUntil: 'networkidle' });
      await expect(page.locator('.interactive-loading')).toBeHidden();

      const controls = await collectControlsAcrossModes(page, '.contest-detail');
      const allowed = canvasOnlyInteractions[slug] ?? [];
      const missing = unmatchedLabels(
        labels.filter((label) => !allowed.includes(label)),
        controls,
      );

      expect(missing, `${slug}：互動說明找不到對應控制項。實際控制項：${controls.join(' | ')}`).toEqual([]);
    });
  }
});

test.describe('研題主流程互動 smoke', () => {
  test('桌面可切換階段、鍵盤微調與拖曳比例點', async ({ page }) => {
    await page.goto('/contest/homogeneous-normalization', { waitUntil: 'networkidle' });
    await expect(page.locator('.interactive-loading')).toBeHidden();

    const root = page.locator('.homogeneous-normalization-contest');
    await root.getByRole('button', { name: '看比例三角形' }).click();
    const a = root.locator('#contest-a');
    const before = Number(await a.inputValue());
    await a.focus();
    await page.keyboard.press('ArrowRight');
    expect(Number(await a.inputValue())).toBeGreaterThan(before);

    const canvas = root.locator('canvas');
    await expect(canvas).toBeVisible();
    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();
    if (!box) return;
    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.7, box.y + box.height * 0.45);
    await page.mouse.up();

    const sum = root.locator('.homogeneous-normalization-contest__readings p').filter({ hasText: 'a+b+c' }).locator('strong');
    await expect(sum).toHaveText('1');
    await root.getByRole('button', { name: '上界差值' }).click();
    await expect(root.getByRole('button', { name: '上界差值' })).toHaveAttribute('aria-pressed', 'true');

    await root.getByRole('button', { name: '只改大小' }).click();
    const scale = root.locator('#contest-scale');
    await scale.focus();
    await page.keyboard.press('ArrowRight');
    expect(Number(await scale.inputValue())).toBeGreaterThan(1);
    await root.getByRole('button', { name: '補回次數' }).click();
    await expect(root.getByRole('button', { name: '補回次數' })).toHaveAttribute('aria-pressed', 'true');
  });

  test.describe('390px', () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test('可操作且沒有橫向溢位', async ({ page }) => {
      await page.goto('/contest/homogeneous-normalization', { waitUntil: 'networkidle' });
      await expect(page.locator('.interactive-loading')).toBeHidden();

      const root = page.locator('.homogeneous-normalization-contest');
      await root.getByRole('button', { name: '看比例三角形' }).click();
      const canvas = root.locator('canvas');
      await expect(canvas).toBeVisible();
      const box = await canvas.boundingBox();
      expect(box).not.toBeNull();
      if (!box) return;
      await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width * 0.62, box.y + box.height * 0.52);
      await page.mouse.up();

      const a = root.locator('#contest-a');
      await a.focus();
      await page.keyboard.press('ArrowLeft');
      await expect(root.locator('.homogeneous-normalization-contest__readings')).toContainText('a+b+c');
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
    });
  });
});
