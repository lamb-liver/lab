import { expect, test, type Page } from '@playwright/test';
import {
  workInteractionHints,
  workInteractiveSlugs,
  type WorkInteractionHint,
  type WorkInteractiveSlug,
} from '../src/works/interactiveRegistry';

type ConsoleIssue = {
  type: string;
  text: string;
};

test.describe('work integration smoke', () => {
  for (const slug of workInteractiveSlugs) {
    test(`/works/${slug} mounts canvas, controls, and declared interaction`, async ({ page }) => {
      const consoleIssues: ConsoleIssue[] = [];
      const pageErrors: string[] = [];

      page.on('console', (message) => {
        const text = message.text();
        if (message.type() === 'error' || hasDoubleSlashAssetPath(text)) {
          consoleIssues.push({ type: message.type(), text });
        }
      });
      page.on('pageerror', (error) => pageErrors.push(error.message));

      await page.goto(`/works/${slug}`, { waitUntil: 'networkidle' });

      await expect(page.locator('canvas')).toHaveCount(1);
      await expect(page.locator(`#${slug}-controls`)).toBeVisible();
      await expect(page.locator(`#${slug}-controls`).locator('.curve-work-controls')).toBeVisible();

      await exerciseDeclaredInteraction(page, slug, workInteractionHints[slug]);

      expect(pageErrors, `page errors for ${slug}`).toEqual([]);
      expect(consoleIssues, `console issues for ${slug}`).toEqual([]);
    });
  }
});

async function exerciseDeclaredInteraction(page: Page, slug: WorkInteractiveSlug, hint: WorkInteractionHint) {
  const controls = page.locator(`#${slug}-controls`);

  if (hint === 'button') {
    const button = controls.locator('button:not([disabled])').first();
    await expect(button, `${slug} should expose a clickable button`).toBeVisible();
    await button.click();
    return;
  }

  if (hint === 'input') {
    const input = controls.locator('input:not([disabled])').first();
    await expect(input, `${slug} should expose an input control`).toBeVisible();
    await input.evaluate((element) => {
      const inputElement = element as HTMLInputElement;
      const current = Number(inputElement.value);
      const min = Number(inputElement.min || current);
      const max = Number(inputElement.max || current + 1);
      const next = current < max ? Math.min(max, current + Number(inputElement.step || 1)) : min;
      inputElement.value = String(next);
      inputElement.dispatchEvent(new Event('input', { bubbles: true }));
      inputElement.dispatchEvent(new Event('change', { bubbles: true }));
    });
    return;
  }

  if (hint === 'select') {
    const select = controls.locator('select:not([disabled])').first();
    await expect(select, `${slug} should expose a select control`).toBeVisible();
    await select.evaluate((element) => {
      const selectElement = element as HTMLSelectElement;
      const nextIndex = selectElement.selectedIndex + 1 < selectElement.options.length ? selectElement.selectedIndex + 1 : 0;
      selectElement.selectedIndex = nextIndex;
      selectElement.dispatchEvent(new Event('input', { bubbles: true }));
      selectElement.dispatchEvent(new Event('change', { bubbles: true }));
    });
    return;
  }

  await expect(controls.locator('button, input, select')).toHaveCount(0);
}

function hasDoubleSlashAssetPath(text: string): boolean {
  return /\/[^/\s]+\/\/(?:explore|works|assets|_astro)\//.test(text);
}
