import { expect, test } from '@playwright/test';
import { readFileSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { descriptionHasRawMath } from '../src/content/descriptionMath';
import { readExploreEntries } from '../src/content/exploreEntries';
import { getCollectionPagerNeighbors, getPublishedAsc } from '../src/content/utils';
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ALT } from '../src/lib/defaultOg';
import { siteSeo } from '../src/lib/seoCopy';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const defaultOgImageUrl = `https://lab.lambliver.dev${DEFAULT_OG_IMAGE}`;

function readJsonLd(htmlTexts: string[]) {
  return htmlTexts.map((text) => JSON.parse(text)) as Array<Record<string, unknown>>;
}

function expectPlainTextDescriptions(descriptions: string[]) {
  for (const description of descriptions) {
    expect(descriptionHasRawMath(description)).toBe(false);
  }
}

test.describe('SEO metadata and UX shell', () => {
  test('built works collection keeps thumbnails out of inline HTML', () => {
    const htmlPath = resolve(projectRoot, 'dist/works/index.html');
    const html = readFileSync(htmlPath, 'utf8');

    expect(statSync(htmlPath).size).toBeLessThan(200 * 1024);
    expect(html).not.toContain('card__thumb-svg');
    expect(html).toContain('/thumbs/works/rose-curve.svg');
    expect(html.match(/<path d=/g)?.length ?? 0).toBeLessThan(50);
  });

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
    await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute(
      'content',
      '羊·實驗',
    );
    await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute(
      'content',
      '玫瑰曲線',
    );
    await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute(
      'content',
      '1200',
    );
    await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute(
      'content',
      '630',
    );
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute(
      'content',
      '#0a0a0a',
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
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      'content',
      `${siteSeo.works.title} · 羊·實驗`,
    );
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
      'content',
      siteSeo.works.description,
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      defaultOgImageUrl,
    );
    await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute(
      'content',
      DEFAULT_OG_IMAGE_ALT,
    );

    await page.goto('/explore');
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'website');
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      'content',
      /https:\/\/lab\.lambliver\.dev\/explore\/?$/,
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      'content',
      `${siteSeo.explore.title} · 羊·實驗`,
    );
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
      'content',
      siteSeo.explore.description,
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      defaultOgImageUrl,
    );
  });

  test('about page uses the shared layout SEO metadata', async ({ page }) => {
    await page.goto('/about');

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      /https:\/\/lab\.lambliver\.dev\/about\/?$/,
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      'content',
      '關於 · 羊·實驗',
    );
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'website');
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      'content',
      /https:\/\/lab\.lambliver\.dev\/about\/?$/,
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      defaultOgImageUrl,
    );
    await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute(
      'content',
      DEFAULT_OG_IMAGE_ALT,
    );
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
      'content',
      siteSeo.about.description,
    );
    await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute(
      'content',
      '1200',
    );
    await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute(
      'content',
      '630',
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      'content',
      'summary_large_image',
    );
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
      'content',
      '關於 · 羊·實驗',
    );
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
      'content',
      defaultOgImageUrl,
    );
  });

  test('home page uses default spirograph OG and aligned metadata', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      siteSeo.home.description,
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', siteSeo.home.title);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
      'content',
      siteSeo.home.description,
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      defaultOgImageUrl,
    );
    await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute(
      'content',
      DEFAULT_OG_IMAGE_ALT,
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
    await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute(
      'content',
      '傅立葉級數',
    );
  });

  test('detail pages expose WebSite, Article, and BreadcrumbList JSON-LD', async ({ page }) => {
    await page.goto('/works/rose-curve');
    const workJsonLd = readJsonLd(
      await page.locator('script[type="application/ld+json"]').allTextContents(),
    );
    expect(workJsonLd.some((item) => item['@type'] === 'WebSite')).toBe(true);
    expect(
      workJsonLd.some((item) => item['@type'] === 'Article' && item.headline === '玫瑰曲線'),
    ).toBe(true);
    expect(workJsonLd.some((item) => item['@type'] === 'BreadcrumbList')).toBe(true);

    await page.goto('/explore/fourier-series');
    const exploreJsonLd = readJsonLd(
      await page.locator('script[type="application/ld+json"]').allTextContents(),
    );
    expect(
      exploreJsonLd.some((item) => item['@type'] === 'Article' && item.headline === '傅立葉級數'),
    ).toBe(true);
    expect(exploreJsonLd.some((item) => item['@type'] === 'BreadcrumbList')).toBe(true);
  });

  test('work cards lazy-load external thumbnail SVGs', async ({ page, request }) => {
    await page.goto('/works');

    const roseThumb = page.locator('[data-search-slug="rose-curve"] .card__thumb-img');
    await expect(roseThumb).toHaveAttribute('src', '/thumbs/works/rose-curve.svg');
    await expect(roseThumb).toHaveAttribute('loading', 'lazy');
    await expect(roseThumb).toHaveAttribute('decoding', 'async');

    const response = await request.get('/thumbs/works/rose-curve.svg');
    expect(response.ok()).toBe(true);
    expect(response.headers()['content-type']).toContain('image/svg+xml');
    const svg = await response.text();
    expect(svg).toContain('<svg');
    expect(svg).toContain('<path');
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
    expectPlainTextDescriptions(descriptions);

    // 卡片顯示的就是 frontmatter 的 description；從 content 讀取，避免把文案複製成
    // 會過期的字面值（改寫 description 時這裡曾經連帶紅掉）。
    const entries = readExploreEntries();
    for (const slug of ['exponential-logarithm', 'permutations-combinations']) {
      const entry = entries.find((item) => item.id === slug);
      expect(entry, `${slug} 應存在於 explore content`).toBeDefined();
      await expect(page.locator(`[data-search-slug="${slug}"] .card__desc`)).toHaveText(
        entry!.data.description,
      );
    }
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
    for (const route of ['/', '/works', '/explore']) {
      await page.goto(route);
      await expect(page.locator('[data-nav-toggle]')).toBeHidden();
      await expect(page.locator('.site-nav__link[href="/explore"]')).toHaveText('主題導覽');
      await expect(page.locator('.site-nav__link[href="/explore"]')).toHaveAttribute(
        'href',
        '/explore',
      );
    }
  });

  test('mobile nav exposes links only after opening the controlled menu', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/works');

    const navLinks = page.locator('#site-nav-links');

    await expect(page.getByRole('button', { name: '開啟選單' })).toBeVisible();
    const menuButton = page.locator('[data-nav-toggle]');
    await expect(menuButton).toBeVisible();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    await expect(navLinks).toBeHidden();
    await expect(navLinks.getByRole('link', { name: '主題導覽' })).toHaveCount(0);

    await menuButton.click();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    await expect(navLinks).toBeVisible();
    await expect(navLinks.getByRole('link', { name: '作品集' })).toHaveCount(1);
    await expect(navLinks.getByRole('link', { name: '主題導覽' })).toHaveCount(1);
    await expect(navLinks.getByRole('link', { name: '關於' })).toHaveCount(1);

    await page.keyboard.press('Escape');
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    await expect(navLinks.getByRole('link', { name: '主題導覽' })).toHaveCount(0);

    await menuButton.click();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    await page.mouse.click(12, 820);
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    await expect(navLinks.getByRole('link', { name: '主題導覽' })).toHaveCount(0);
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
    const workBackLinkBeforeStage = await page.evaluate(() => {
      const link = document.querySelector('.back-link--top');
      const stage = document.querySelector('.work-detail__stage');
      if (!link || !stage) return false;
      return Boolean(link.compareDocumentPosition(stage) & Node.DOCUMENT_POSITION_FOLLOWING);
    });
    expect(workBackLinkBeforeStage).toBe(true);

    await page.goto('/explore/fourier-series');
    await expect(page.locator('.back-link--top')).toHaveText('← 返回主題導覽');
  });

  test('explore detail pages include same-collection previous and next navigation', async ({
    page,
  }) => {
    const explore = readExploreEntries(projectRoot);
    const sorted = getPublishedAsc(explore);
    expect(sorted.length).toBeGreaterThan(2);

    const newestEntry = sorted[sorted.length - 1]!;
    const newest = getCollectionPagerNeighbors(explore, newestEntry.id);
    expect(newest.previous?.id).toBe(sorted[sorted.length - 2]!.id);
    expect(newest.next).toBeNull();

    await page.goto(`/explore/${newestEntry.id}`);
    const newestPager = page.locator('.explore-detail__pager');
    await expect(newestPager).toBeVisible();
    await expect(
      newestPager.locator('a.explore-detail__pager-link:not(.explore-detail__pager-link--next)'),
    ).toHaveAttribute('href', `/explore/${newest.previous!.id}`);
    await expect(
      newestPager.locator('a.explore-detail__pager-link:not(.explore-detail__pager-link--next) strong'),
    ).toHaveText(newest.previous!.data.title);
    await expect(
      newestPager.locator('.explore-detail__pager-link--next.explore-detail__pager-link--disabled'),
    ).toBeVisible();

    const middle = getCollectionPagerNeighbors(explore, 'limits-riemann-sum');
    expect(middle.previous?.id).toBe('matrix-linear-transform');
    expect(middle.next?.id).toBe('differential-equations-geometry');

    await page.goto('/explore/limits-riemann-sum');
    const middlePager = page.locator('.explore-detail__pager');
    const middleLinks = middlePager.locator('a.explore-detail__pager-link');
    await expect(middleLinks).toHaveCount(2);
    await expect(middleLinks.nth(0)).toHaveAttribute('href', `/explore/${middle.previous!.id}`);
    await expect(middleLinks.nth(0).locator('strong')).toHaveText(middle.previous!.data.title);
    await expect(middleLinks.nth(1)).toHaveAttribute('href', `/explore/${middle.next!.id}`);
    await expect(middleLinks.nth(1).locator('strong')).toHaveText(middle.next!.data.title);
  });

  test('prose css no longer carries MathML-only KaTeX selectors', () => {
    const proseCss = readFileSync(resolve(projectRoot, 'src/styles/prose.css'), 'utf8');
    expect(proseCss).not.toContain('katex-mathml');
    expect(proseCss).not.toContain('annotation');
  });

  test('first tab stop is a visible skip link that targets main content', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');

    const skipLink = page.locator('.skip-link');
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toHaveText('跳至主要內容');
    await expect(skipLink).toHaveAttribute('href', '#main-content');
    await expect(skipLink).toBeInViewport();
    await expect(page.locator('main#main-content')).toHaveCount(1);
  });

  test('reduced motion swaps the hero p5 canvas for a static SVG placeholder', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/', { waitUntil: 'networkidle' });

    await expect(page.locator('.hero-canvas-static svg')).toBeVisible();
    await expect(page.locator('.hero-canvas-shell canvas')).toHaveCount(0);
  });
});
