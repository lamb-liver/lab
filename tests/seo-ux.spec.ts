import { expect, test } from '@playwright/test';

test.describe('SEO metadata and UX shell', () => {
  test('works detail exposes a dedicated work OG image', async ({ page, request }) => {
    await page.goto('/works/rose-curve');

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      /https:\/\/lab\.lambliver\.dev\/works\/rose-curve\/?$/,
    );
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article');
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      'content',
      /https:\/\/lab\.lambliver\.dev\/works\/rose-curve\/?$/,
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      'https://lab.lambliver.dev/og/works/rose-curve.png',
    );

    const ogResponse = await request.get('/og/works/rose-curve.png');
    expect(ogResponse.ok()).toBe(true);
    expect(ogResponse.headers()['content-type']).toContain('image/png');
  });

  test('collection pages expose website OG metadata', async ({ page }) => {
    await page.goto('/works');
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'website');
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      'content',
      /https:\/\/lab\.lambliver\.dev\/works\/?$/,
    );

    await page.goto('/explore');
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'website');
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      'content',
      /https:\/\/lab\.lambliver\.dev\/explore\/?$/,
    );
  });

  test('works filter reads, writes, and restores the tag query param', async ({ page }) => {
    await page.goto('/works?tag=幾何');
    await expect(page.getByRole('button', { name: '幾何' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    await page.getByRole('button', { name: '全部' }).click();
    await expect(page).toHaveURL(/\/works$/);

    await page.goBack();
    await expect(page).toHaveURL(/\/works\/?\?tag=%E5%B9%BE%E4%BD%95$/);
    await expect(page.getByRole('button', { name: '幾何' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    await page.goto('/works?tag=不存在');
    await expect(page.getByRole('button', { name: '全部' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  test('explore filter reads and writes the category query param', async ({ page }) => {
    await page.goto('/explore?category=分析');
    await expect(page.getByRole('button', { name: '分析' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    await page.getByRole('button', { name: '幾何' }).click();
    await expect(page).toHaveURL(/\/explore\/?\?category=%E5%B9%BE%E4%BD%95$/);
  });

  test('desktop and mobile nav expose only the viewport-appropriate link set', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/works');
    await expect(page.locator('.site-nav__links--desktop')).toBeVisible();
    await expect(page.locator('.site-nav__menu')).toBeHidden();

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/works');
    await expect(page.locator('.site-nav__links--desktop')).toBeHidden();
    await expect(page.locator('.site-nav__menu')).toBeVisible();
  });

  test('interactive pages include server-rendered loading fallback markup', async ({ request }) => {
    const workHtml = await (await request.get('/works/rose-curve')).text();
    expect(workHtml).toContain('interactive-loading');

    const exploreHtml = await (await request.get('/explore/conic-dynamic-geometry')).text();
    expect(exploreHtml).toContain('interactive-loading');
  });
});
