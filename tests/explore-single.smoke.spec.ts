import { expect, test, type Page } from '@playwright/test';
import {
  exploreInteractiveSlugs,
  type ExploreInteractiveSlug,
} from '../src/explore/interactiveRegistry';

const slug = process.env.SMOKE_EXPLORE_SLUG;

if (!slug || !(exploreInteractiveSlugs as readonly string[]).includes(slug)) {
  throw new Error(
    `SMOKE_EXPLORE_SLUG must be one of: ${exploreInteractiveSlugs.join(', ')}`,
  );
}

test.describe('single explore smoke', () => {
  test(`/explore/${slug} mounts the interactive route, controls, and article metadata`, async ({
    page,
  }) => {
    const consoleIssues: string[] = [];
    const pageErrors: string[] = [];

    page.on('console', (message) => {
      const text = message.text();
      if (message.type() === 'error' || hasDoubleSlashAssetPath(text)) {
        consoleIssues.push(`${message.type()}: ${text}`);
      }
    });
    page.on('pageerror', (error) => pageErrors.push(error.message));

    await page.goto(`/explore/${slug}`, { waitUntil: 'networkidle' });

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      new RegExp(`/explore/${slug}/?$`),
    );
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
      'content',
      'article',
    );
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('[role="img"]').first()).toBeVisible();
    await expect(page.locator('.interactive-loading')).toBeHidden();

    await exerciseFirstInteraction(page, slug as ExploreInteractiveSlug);

    expect(pageErrors, `page errors for ${slug}`).toEqual([]);
    expect(consoleIssues, `console issues for ${slug}`).toEqual([]);
  });
});

async function exerciseFirstInteraction(page: Page, exploreSlug: ExploreInteractiveSlug) {
  const control = page
    .locator('.explore-detail')
    .locator('button:not([disabled]), input:not([disabled]), select:not([disabled])')
    .first();
  await expect(control, `${exploreSlug} should expose at least one control`).toBeVisible();

  const tagName = await control.evaluate((element) => element.tagName.toLowerCase());
  if (tagName === 'button') {
    await control.click();
    return;
  }

  if (tagName === 'input') {
    await control.evaluate((element) => {
      const input = element as HTMLInputElement;
      if (input.type === 'checkbox') {
        input.checked = !input.checked;
      } else {
        const current = Number(input.value);
        const min = Number(input.min || current);
        const max = Number(input.max || current + 1);
        const step = Number(input.step || 1);
        input.value = String(current < max ? Math.min(max, current + step) : min);
      }
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    return;
  }

  await control.evaluate((element) => {
    const select = element as HTMLSelectElement;
    const nextIndex =
      select.selectedIndex + 1 < select.options.length ? select.selectedIndex + 1 : 0;
    select.selectedIndex = nextIndex;
    select.dispatchEvent(new Event('input', { bubbles: true }));
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });
}

function hasDoubleSlashAssetPath(text: string): boolean {
  return /\/[^/\s]+\/\/(?:explore|works|assets|_astro)\//.test(text);
}
