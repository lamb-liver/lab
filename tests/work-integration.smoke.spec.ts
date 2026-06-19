import { expect, test, type Page } from '@playwright/test';
import { workInteractiveSlugs, type WorkInteractiveSlug } from '../src/works/interactiveRegistry';

const selectedSlug = process.env.SMOKE_WORK_SLUG;
const selectedSlugs = selectedSlug ? [selectedSlug] : workInteractiveSlugs;

if (selectedSlug && !(workInteractiveSlugs as readonly string[]).includes(selectedSlug)) {
  throw new Error(
    `SMOKE_WORK_SLUG must be one of: ${workInteractiveSlugs.join(', ')}`,
  );
}

type ConsoleIssue = {
  type: string;
  text: string;
};

test.describe('work integration smoke', () => {
  for (const slug of selectedSlugs) {
    test(`/works/${slug} mounts canvas, controls, metadata, and declared interaction`, async ({ page }) => {
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

      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        new RegExp(`/works/${slug}/?$`),
      );
      await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
        'content',
        'article',
      );
      await expect(page.locator('canvas')).toHaveCount(1);
      await expect(page.locator(`#${slug}-controls`)).toBeVisible();
      await expect(page.locator(`#${slug}-controls`).locator('.curve-work-controls')).toBeVisible();
      await expect(page.locator('.interactive-loading')).toBeHidden();

      await exerciseFirstInteraction(page, slug);

      expect(pageErrors, `page errors for ${slug}`).toEqual([]);
      expect(consoleIssues, `console issues for ${slug}`).toEqual([]);
    });
  }
});

async function exerciseFirstInteraction(page: Page, slug: WorkInteractiveSlug) {
  const controls = page.locator(`#${slug}-controls`);
  const control = controls.locator('button:not([disabled]), input:not([disabled]), select:not([disabled])').first();
  await expect(control, `${slug} should expose an interactive control`).toBeVisible();

  const tagName = await control.evaluate((element) => element.tagName.toLowerCase());
  if (tagName === 'button') {
    await control.click();
    return;
  }

  if (tagName === 'input') {
    await control.evaluate((element) => {
      const inputElement = element as HTMLInputElement;
      if (inputElement.type === 'checkbox') {
        inputElement.checked = !inputElement.checked;
      } else {
        const current = Number(inputElement.value);
        const min = Number(inputElement.min || current);
        const max = Number(inputElement.max || current + 1);
        const step = Number(inputElement.step || 1);
        inputElement.value = String(current < max ? Math.min(max, current + step) : min);
      }
      inputElement.dispatchEvent(new Event('input', { bubbles: true }));
      inputElement.dispatchEvent(new Event('change', { bubbles: true }));
    });
    return;
  }

  await control.evaluate((element) => {
    const selectElement = element as HTMLSelectElement;
    const nextIndex = selectElement.selectedIndex + 1 < selectElement.options.length ? selectElement.selectedIndex + 1 : 0;
    selectElement.selectedIndex = nextIndex;
    selectElement.dispatchEvent(new Event('input', { bubbles: true }));
    selectElement.dispatchEvent(new Event('change', { bubbles: true }));
  });
}

function hasDoubleSlashAssetPath(text: string): boolean {
  return /\/[^/\s]+\/\/(?:explore|works|assets|_astro)\//.test(text);
}
