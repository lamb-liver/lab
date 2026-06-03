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

  test('explore detail exposes article OG metadata', async ({ page }) => {
    await page.goto('/explore/fourier-series');

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      /https:\/\/lab\.lambliver\.dev\/explore\/fourier-series\/?$/,
    );
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article');
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      'content',
      /https:\/\/lab\.lambliver\.dev\/explore\/fourier-series\/?$/,
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      'https://lab.lambliver.dev/explore/fourier-series-epicycles-cover.png',
    );
  });

  test('rendered math keeps visual KaTeX html without hidden MathML extraction', async ({
    request,
  }) => {
    const html = await (await request.get('/works/exponential-growth-decay')).text();
    expect(html).toContain('katex-html');
    expect(html).not.toContain('class="katex-mathml"');
    expect(html).not.toContain('<annotation encoding="application/x-tex"');
  });

  test('works search filters by title and syncs q query param', async ({ page }) => {
    await page.goto('/works');

    const search = page.locator('#works-search-input');
    await search.fill('朱利亞');
    await expect(page).toHaveURL(/\/works\/?\?q=%E6%9C%B1%E5%88%A9%E4%BA%9E/);
    await expect(page.locator('[data-search-slug="julia-set"]')).toBeVisible();
    await expect(page.locator('[data-search-slug="rose-curve"]')).toBeHidden();

    await search.fill('');
    await expect(page).toHaveURL(/\/works\/?$/);
    await expect(page.locator('[data-search-slug="rose-curve"]')).toBeVisible();
  });

  test('explore search filters by title and combines with category', async ({ page }) => {
    await page.goto('/explore');

    const search = page.locator('#explore-search-input');
    await search.fill('矩陣');
    await expect(page).toHaveURL(/\/explore\/?\?q=%E7%9F%A9%E9%99%A3/);
    await expect(page.locator('[data-search-slug="matrix-linear-transform"]')).toBeVisible();
    await expect(page.locator('[data-search-slug="fourier-series"]')).toBeHidden();

    await page.getByRole('button', { name: '代數' }).click();
    await expect(page).toHaveURL(
      /\/explore\/?\?q=%E7%9F%A9%E9%99%A3&category=%E4%BB%A3%E6%95%B8$/,
    );
    await expect(page.locator('[data-search-slug="matrix-linear-transform"]')).toBeVisible();

    await page.getByRole('button', { name: '分析' }).click();
    await expect(page.locator('[data-search-slug="matrix-linear-transform"]')).toBeHidden();
    await expect(page.locator('[data-filter-empty]')).toBeVisible();

    await page.goBack();
    await expect(page.getByRole('button', { name: '代數' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(search).toHaveValue('矩陣');
    await expect(page.locator('[data-search-slug="matrix-linear-transform"]')).toBeVisible();
  });

  test('explore card descriptions do not expose raw math delimiters', async ({ page }) => {
    await page.goto('/explore');
    const descriptions = await page.locator('.card--explore .card__desc').allTextContents();
    expect(descriptions.join('\n')).not.toMatch(/\$[^$\n]+\$/);
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

  test('explore filter reads, writes, and restores the category query param', async ({
    page,
  }) => {
    await page.goto('/explore?category=分析');
    await expect(page.getByRole('button', { name: '分析' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    await page.getByRole('button', { name: '全部' }).click();
    await expect(page).toHaveURL(/\/explore$/);

    await page.goBack();
    await expect(page).toHaveURL(/\/explore\/?\?category=%E5%88%86%E6%9E%90$/);
    await expect(page.getByRole('button', { name: '分析' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    await page.getByRole('button', { name: '幾何' }).click();
    await expect(page).toHaveURL(/\/explore\/?\?category=%E5%B9%BE%E4%BD%95$/);
  });

  test('home page shows featured picks and section positioning', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 2, name: '精選' })).toBeVisible();
    await expect(page.locator('[data-search-slug="julia-set"]')).toBeVisible();
    await expect(page.locator('[data-search-slug="spirograph-curve"]')).toBeVisible();
    await expect(page.getByRole('link', { name: /進入作品集/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /進入主題導覽/ })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: '最新主題' })).toBeVisible();
    await expect(page.locator('.home-topic-list')).toBeVisible();
  });

  test('desktop nav exposes one canonical link set and keeps explore route stable', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/works');
    await expect(page.locator('[data-nav-toggle]')).toBeHidden();
    await expect(page.getByRole('link', { name: '作品集' })).toHaveCount(1);
    const exploreLink = page.getByRole('link', { name: '主題導覽' });
    await expect(exploreLink).toHaveCount(1);
    await expect(exploreLink).toHaveAttribute('href', '/explore');
  });

  test('mobile nav exposes links only after opening the controlled menu', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/works');

    await expect(page.getByRole('button', { name: '開啟選單' })).toBeVisible();
    const menuButton = page.locator('[data-nav-toggle]');
    await expect(menuButton).toBeVisible();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#site-nav-links')).toBeHidden();
    await expect(page.getByRole('link', { name: '主題導覽' })).toHaveCount(0);

    await menuButton.click();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#site-nav-links')).toBeVisible();
    await expect(page.getByRole('link', { name: '作品集' })).toHaveCount(1);
    await expect(page.getByRole('link', { name: '主題導覽' })).toHaveCount(1);
    await expect(page.getByRole('link', { name: '關於' })).toHaveCount(1);
  });

  test('interactive pages include server-rendered loading fallback markup', async ({ request }) => {
    const workHtml = await (await request.get('/works/rose-curve')).text();
    expect(workHtml).toContain('interactive-loading');

    const exploreHtml = await (await request.get('/explore/conic-dynamic-geometry')).text();
    expect(exploreHtml).toContain('interactive-loading');
  });

  test('detail pages include top return links', async ({ page }) => {
    await page.goto('/works/rose-curve');
    await expect(page.locator('.back-link--top')).toHaveText('← 返回作品集');

    await page.goto('/explore/fourier-series');
    await expect(page.locator('.back-link--top')).toHaveText('← 返回主題導覽');
  });
});
