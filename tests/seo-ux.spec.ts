import { expect, test } from '@playwright/test';
import { readFileSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { descriptionHasRawMath } from '../src/content/descriptionMath';
import { readExploreEntries } from '../src/content/exploreEntries';
import { getCollectionPagerNeighbors, getPublishedAsc } from '../src/content/utils';
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  DEFAULT_OG_IMAGE_ALT_EN,
  DEFAULT_OG_IMAGE_EN,
} from '../src/lib/defaultOg';
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
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'zh_TW');
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

  test('work params hydrate from the query and write changes back', async ({ page }) => {
    await page.goto('/works/rose-curve/?k=3');

    const slider = page.locator('#rose-k');
    await expect(slider).toHaveValue('3');

    await slider.evaluate((el) => {
      const input = el as HTMLInputElement;
      input.value = '8';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });

    await expect.poll(() => new URL(page.url()).searchParams.get('k')).toBe('8');
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

    await page.goto('/concept');
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'website');
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      'content',
      /https:\/\/lab\.lambliver\.dev\/concept\/?$/,
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      'content',
      `${siteSeo.concept.title} · 羊·實驗`,
    );
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
      'content',
      siteSeo.concept.description,
    );
  });

  test('concept detail aggregates Works, Explore, and Exam', async ({ page }) => {
    await page.goto('/concept/complex-numbers');

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      /https:\/\/lab\.lambliver\.dev\/concept\/complex-numbers\/?$/,
    );
    await expect(page.getByRole('heading', { level: 1, name: '複數' })).toBeVisible();
    await expect(page.locator('[data-search-slug="complex-arithmetic-geometry"]')).toBeVisible();
    await expect(page.locator('[data-search-slug="complex-euler-formula"]')).toBeVisible();
    await expect(page.locator('[data-search-slug="ast-111-complex-unit-circle"]')).toBeVisible();
  });

  test('English concept pages use English labels, cards, and hreflang pairs', async ({ page }) => {
    await page.goto('/en/concept/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('heading', { level: 1, name: 'Concept index' })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toBeVisible();
    await expect(page.getByRole('link', { name: /Complex numbers/ })).toHaveAttribute(
      'href',
      '/en/concept/complex-numbers',
    );
    await expect(page.locator('link[rel="alternate"][hreflang="zh-Hant"]')).toHaveAttribute(
      'href',
      /\/concept\/$/,
    );

    await page.goto('/en/concept/complex-numbers/');
    await expect(page.getByRole('heading', { level: 1, name: 'Complex numbers' })).toBeVisible();
    await expect(
      page.locator('a[href="/en/works/complex-arithmetic-geometry/"]').first(),
    ).toBeVisible();
    await expect(page.locator('a[href="/en/exam/ast-111-complex-unit-circle/"]').first()).toBeVisible();
    await expect(page.locator('[data-lang-toggle]')).toHaveAttribute(
      'href',
      '/concept/complex-numbers/',
    );

    await page.goto('/en/works/complex-arithmetic-geometry/');
    await expect(page.locator('.concept-tag', { hasText: 'Complex numbers' })).toHaveAttribute(
      'href',
      '/en/concept/complex-numbers',
    );
  });

  test('English curated paths keep the step order and link to English pages', async ({ page }) => {
    await page.goto('/en/path/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('heading', { level: 1, name: 'Curated paths' })).toBeVisible();
    await expect(
      page.getByRole('link', { name: /From trigonometric functions to Fourier/ }),
    ).toHaveAttribute('href', '/en/path/trig-to-fourier');
    await expect(page.locator('link[rel="alternate"][hreflang="zh-Hant"]')).toHaveAttribute(
      'href',
      /\/path\/$/,
    );

    await page.goto('/en/path/vectors-to-space/');
    const steps = page.locator('.path-step__title');
    await expect(steps).toHaveCount(7);
    await expect(steps.nth(0)).toHaveAttribute('href', '/en/works/vector-addition-scalar/');
    await expect(steps.nth(3)).toHaveAttribute('href', '/en/explore/space-vectors-planes-lines/');
    await expect(steps.nth(6)).toHaveAttribute(
      'href',
      '/en/exam/gsat-112-skew-line-distance/',
    );
    await expect(page.locator('[data-lang-toggle]')).toHaveAttribute(
      'href',
      '/path/vectors-to-space/',
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

    const contact = page.locator('.about-section--contact');
    await expect(contact.getByRole('link', { name: 'lambliver.dev@gmail.com' })).toHaveAttribute(
      'href',
      'mailto:lambliver.dev@gmail.com',
    );
    await expect(contact.getByRole('link', { name: 'lambliver.dev', exact: true })).toHaveAttribute(
      'href',
      'https://lambliver.dev/',
    );
    await expect(contact.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/lamb-liver',
    );
    await expect(contact.getByRole('link', { name: 'Threads @lambliver0420' })).toHaveAttribute(
      'href',
      'https://www.threads.com/@lambliver0420',
    );
    await expect(contact.getByRole('link', { name: 'Facebook' })).toHaveAttribute(
      'href',
      'https://www.facebook.com/profile.php?id=61589694329153',
    );

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/about');
    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    );
    expect(hasHorizontalOverflow).toBe(false);
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
    const jsonLd = readJsonLd(
      await page.locator('script[type="application/ld+json"]').allTextContents(),
    );
    expect(jsonLd.some((item) => item['@type'] === 'WebSite')).toBe(true);

    await expect(page.getByRole('link', { name: '從三角函數到傅立葉 →' })).toHaveAttribute(
      'href',
      '/path/trig-to-fourier',
    );
    await expect(page.getByRole('link', { name: '從平面向量到空間幾何 →' })).toHaveAttribute(
      'href',
      '/path/vectors-to-space',
    );
    await expect(page.getByRole('link', { name: '概念索引 →' })).toHaveAttribute('href', '/concept');
    await expect(page.getByRole('link', { name: '試題視覺化 →' })).toHaveAttribute('href', '/exam');

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    const homeOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    );
    expect(homeOverflow).toBe(false);
  });

  test('learning path index lists curated paths', async ({ page }) => {
    await page.goto('/path');
    await expect(page.locator('h1')).toHaveText('策展路徑');
    await expect(page.getByRole('link', { name: /從三角函數到傅立葉/ })).toHaveAttribute(
      'href',
      '/path/trig-to-fourier',
    );
    await expect(page.getByRole('link', { name: /從平面向量到空間幾何/ })).toHaveAttribute(
      'href',
      '/path/vectors-to-space',
    );

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/path');
    const pathOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    );
    expect(pathOverflow).toBe(false);
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

  test('detail pages expose authored Article and BreadcrumbList JSON-LD', async ({ page }) => {
    await page.goto('/works/rose-curve');
    const workJsonLd = readJsonLd(
      await page.locator('script[type="application/ld+json"]').allTextContents(),
    );
    expect(workJsonLd.some((item) => item['@type'] === 'WebSite')).toBe(false);
    expect(
      workJsonLd.some(
        (item) =>
          item['@type'] === 'Article' &&
          item.headline === '玫瑰曲線' &&
          (item.author as Record<string, unknown>)?.name === 'lamb-liver',
      ),
    ).toBe(true);
    expect(workJsonLd.some((item) => item['@type'] === 'BreadcrumbList')).toBe(true);

    await page.goto('/explore/fourier-series');
    const exploreJsonLd = readJsonLd(
      await page.locator('script[type="application/ld+json"]').allTextContents(),
    );
    expect(
      exploreJsonLd.some(
        (item) =>
          item['@type'] === 'Article' &&
          item.headline === '傅立葉級數' &&
          (item.author as Record<string, unknown>)?.name === 'lamb-liver',
      ),
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

  test('works and explore expose audience labels and optional prerequisites', async ({ page }) => {
    await page.goto('/works');
    await expect(page.locator('[data-search-slug="rose-curve"]')).toHaveAttribute(
      'data-content-audience',
      '直觀探索',
    );
    await expect(
      page.locator('[data-search-slug="rose-curve"] [data-audience-label]'),
    ).toHaveText('直觀探索');

    await page.goto('/works/eigenvector-geometry');
    await expect(page.locator('[data-audience-label]')).toHaveText('大學概念');
    await expect(page.locator('.content-prerequisites strong')).toHaveText('建議先備：');
    await expect(page.locator('.content-prerequisites')).toContainText('矩陣、平面向量');

    await page.goto('/explore/fourier-series');
    await expect(page.locator('[data-audience-label]')).toHaveText('大學概念');
    await expect(page.locator('.content-prerequisites strong')).toHaveText('建議先備：');
    await expect(page.locator('.content-prerequisites')).toContainText('三角函數、級數');
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
    for (const route of ['/', '/works', '/explore', '/concept']) {
      await page.goto(route);
      await expect(page.locator('[data-nav-toggle]')).toBeHidden();
      await expect(page.locator('.site-nav__link[href="/explore"]')).toHaveText('主題導覽');
      await expect(page.locator('.site-nav__link[href="/explore"]')).toHaveAttribute(
        'href',
        '/explore',
      );
      await expect(page.locator('.site-nav__link[href="/concept"]')).toHaveText('概念');
    }
  });

  test('English pages expose English OG cards and en_US locale', async ({ page, request }) => {
    const site = 'https://lab.lambliver.dev';
    const cases: Array<[string, string, string]> = [
      ['/en/works/rose-curve/', '/og/en/works/rose-curve.png', 'Rose curve'],
      [
        '/en/exam/ast-114-solid-of-revolution/',
        '/og/en/exam/ast-114-solid-of-revolution.png',
        'Same area, same volume for the solid of revolution?',
      ],
      ['/en/explore/vectors/', '/og/en/explore/vectors.png', 'Plane vectors'],
      ['/en/', DEFAULT_OG_IMAGE_EN, DEFAULT_OG_IMAGE_ALT_EN],
      ['/en/concept/', DEFAULT_OG_IMAGE_EN, DEFAULT_OG_IMAGE_ALT_EN],
    ];
    for (const [path, image, alt] of cases) {
      await page.goto(path);
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', `${site}${image}`);
      await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', `${site}${image}`);
      await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute('content', alt);
      await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute('content', '1200');
      await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute('content', '630');
      await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'en_US');
      await expect(page.locator('meta[property="og:locale:alternate"]')).toHaveAttribute('content', 'zh_TW');
      await expect(page.locator('link[rel="alternate"][hreflang="zh-Hant"]')).toHaveCount(1);
      const response = await request.get(image);
      expect(response.ok(), image).toBe(true);
      expect(response.headers()['content-type']).toContain('image/png');
    }

    // 中文頁不變
    await page.goto('/');
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      `${site}${DEFAULT_OG_IMAGE}`,
    );
    await page.goto('/explore/vectors/');
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      `${site}/images/explore-covers/vectors.png`,
    );
  });

  test('English pages use English nav, breadcrumb, and footer with a link back to Chinese', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/en/works/rose-curve/');

    await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible();
    const menuButton = page.locator('[data-nav-toggle]');
    await menuButton.click();
    await expect(menuButton).toHaveAttribute('aria-label', 'Close menu');
    const navLinks = page.locator('#site-nav-links');
    await expect(navLinks.getByRole('link', { name: 'Works' })).toHaveAttribute('href', '/en/works');
    await expect(page.locator('[data-lang-toggle]')).toHaveAttribute(
      'href',
      '/works/rose-curve/',
    );
    await expect(page.locator('.site-nav__logo')).toHaveAttribute('href', '/en/');

    const crumbs = page.getByRole('navigation', { name: 'Breadcrumb' });
    await expect(crumbs.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/en/');
    await expect(crumbs.getByRole('link', { name: 'Works' })).toHaveAttribute('href', '/en/works');

    const footer = page.locator('.site-footer__nav');
    await expect(footer).toHaveAttribute('aria-label', 'Site navigation');
    await expect(footer.getByRole('link', { name: 'Explore' })).toHaveAttribute(
      'href',
      '/en/explore',
    );
  });

  test('Chinese nav links to the English page and English nav lists every section', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/works/rose-curve/');
    await expect(page.locator('[data-lang-toggle][hreflang="en"]')).toHaveText('English');
    await expect(page.locator('[data-lang-toggle][hreflang="en"]')).toHaveAttribute(
      'href',
      '/en/works/rose-curve/',
    );
    await page.goto('/about');
    await expect(page.locator('[data-lang-toggle][hreflang="en"]')).toHaveAttribute('href', '/en/about/');

    await page.goto('/en/');
    await expect(page.locator('[data-lang-toggle]')).toHaveAttribute('hreflang', 'zh-Hant');
    await expect(page.locator('[data-lang-toggle]')).toHaveAttribute('href', '/');
    await expect(page.locator('.site-nav__link[href="/en/concept"]')).toHaveText('Concepts');
    await expect(page.locator('.site-nav__link[href="/en/about"]')).toHaveText('About');
    const footer = page.locator('.site-footer__nav');
    await expect(footer.getByRole('link', { name: 'Curated paths' })).toHaveAttribute(
      'href',
      '/en/path',
    );

    await page.goto('/en/about/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('heading', { level: 1, name: 'About' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Copy' })).toBeVisible();
    await expect(page.locator('[data-lang-toggle]')).toHaveAttribute('href', '/about/');
  });

  test('one language toggle in the header on every route type, round-tripping to the same page', async ({
    page,
  }) => {
    const pairs: Array<[string, string]> = [
      ['/', '/en/'],
      ['/works/', '/en/works/'],
      ['/works/rose-curve/', '/en/works/rose-curve/'],
      ['/explore/', '/en/explore/'],
      ['/explore/vectors/', '/en/explore/vectors/'],
      ['/exam/', '/en/exam/'],
      ['/exam/gsat-112-skew-line-distance/', '/en/exam/gsat-112-skew-line-distance/'],
      ['/concept/', '/en/concept/'],
      ['/concept/complex-numbers/', '/en/concept/complex-numbers/'],
      ['/path/', '/en/path/'],
      ['/path/trig-to-fourier/', '/en/path/trig-to-fourier/'],
      ['/about/', '/en/about/'],
    ];
    const strip = (url: string) => new URL(url).pathname.replace(/\/?$/, '/');
    for (const width of [1280, 390]) {
      await page.setViewportSize({ width, height: 844 });
      for (const [zh, en] of pairs) {
        await page.goto(zh);
        const toggle = page.locator('[data-lang-toggle]');
        await expect(toggle).toHaveCount(1);
        await expect(toggle).toBeVisible();
        await expect(toggle).toHaveText('English');
        await expect(toggle).toHaveAttribute('lang', 'en');
        await expect(page.locator('a[hreflang="en"]')).toHaveCount(1);
        const box = await toggle.boundingBox();
        expect(box!.height).toBeGreaterThanOrEqual(44);
        expect(box!.width).toBeGreaterThanOrEqual(44);
        await toggle.click();
        await expect(page).toHaveURL((url) => strip(url.href) === en);
        const back = page.locator('[data-lang-toggle]');
        await expect(back).toHaveText('中文');
        await expect(back).toHaveAttribute('lang', 'zh-Hant');
        await expect(page.locator('a[hreflang="zh-Hant"]')).toHaveCount(1);
        await back.click();
        await expect(page).toHaveURL((url) => strip(url.href) === zh);
      }
    }
  });

  test('one click switches the whole site language and the choice sticks', async ({
    page,
    context,
  }) => {
    const lang = () => page.locator('html').getAttribute('lang');
    const expectAllInternalLinks = async (prefix: 'en' | 'zh') => {
      const hrefs = await page
        .locator('a[href^="/"]:not([data-lang-toggle])')
        .evaluateAll((links) => links.map((a) => a.getAttribute('href') ?? ''));
      const assets = /^\/(og|images|fonts|thumbs|_astro|rss|sitemap)/;
      const pages = hrefs.filter((href) => !assets.test(href) && !/\.[a-z0-9]+$/i.test(href));
      expect(pages.length).toBeGreaterThan(0);
      for (const href of pages) {
        if (prefix === 'en') expect(href, href).toMatch(/^\/en(\/|$)/);
        else expect(href, href).not.toMatch(/^\/en(\/|$)/);
      }
    };

    await page.goto('/works/rose-curve/');
    await page.locator('[data-lang-toggle]').click();
    await expect(page).toHaveURL(/\/en\/works\/rose-curve\/?$/);
    expect(await page.evaluate(() => localStorage.getItem('lab-lang'))).toBe('en');
    expect((await context.cookies()).find((c) => c.name === 'lab-lang')?.value).toBe('en');

    // 透過導覽列、卡片、內文連結走幾頁，全都要維持英文
    await expectAllInternalLinks('en');
    await page.locator('.site-nav__links').getByRole('link', { name: 'Exams' }).click();
    await expect(page).toHaveURL(/\/en\/exam\/?$/);
    expect(await lang()).toBe('en');
    await expectAllInternalLinks('en');
    await page.locator('main a[href^="/en/exam/"]').first().click();
    await expect(page).toHaveURL(/\/en\/exam\/[^/]+\/?$/);
    expect(await lang()).toBe('en');
    await page.locator('main a[href^="/en/concept/"]').first().click();
    await expect(page).toHaveURL(/\/en\/concept\/[^/]+\/?$/);
    expect(await lang()).toBe('en');
    await expectAllInternalLinks('en');
    await page.locator('.site-footer a[href^="/en/path"]').first().click();
    await expect(page).toHaveURL(/\/en\/path\/?$/);
    expect(await lang()).toBe('en');

    // 重新整理、以及直接打中文網址，都依偏好換成英文對應頁
    await page.reload();
    expect(await lang()).toBe('en');
    await page.goto('/explore/vectors/?subject=x#top');
    await expect(page).toHaveURL(/\/en\/explore\/vectors\/(\?subject=x)?$/);
    expect(await lang()).toBe('en');
    const fresh = await context.newPage();
    await fresh.goto('/about/');
    await expect(fresh).toHaveURL(/\/en\/about\/?$/);
    await fresh.close();

    // 只靠 cookie 也有效（localStorage 被清掉時）
    await page.evaluate(() => localStorage.removeItem('lab-lang'));
    await page.goto('/concept/');
    await expect(page).toHaveURL(/\/en\/concept\/?$/);

    // 再按一次切回中文，全站恢復中文
    await page.locator('[data-lang-toggle]').click();
    await expect(page).toHaveURL(/\/concept\/?$/);
    expect(await lang()).toBe('zh-Hant');
    await expectAllInternalLinks('zh');
    await page.goto('/en/works/rose-curve/');
    await expect(page).toHaveURL(/\/works\/rose-curve\/?$/);
    expect(await lang()).toBe('zh-Hant');
    await page.locator('.site-nav__links').getByRole('link', { name: '作品集' }).click();
    expect(await lang()).toBe('zh-Hant');
    await expectAllInternalLinks('zh');
  });

  test('English detail pages list related exam problems in English', async ({ page }) => {
    await page.goto('/en/works/cross-product-geometry/');
    const related = page.getByRole('region', { name: 'Related exam problems' });
    await expect(related.getByRole('heading', { name: 'Related exam problems' })).toBeVisible();
    await expect(related.locator('a[href="/en/exam/gsat-112-skew-line-distance"]')).toContainText(
      'Exam: Skew lines',
    );
    await expect(related).toContainText('112 GSAT Mathematics A, Fill-in 17');
    await page.goto('/en/explore/vectors/');
    await expect(
      page.getByRole('region', { name: 'Related exam problems' }).locator('a[href^="/en/exam/"]'),
    ).not.toHaveCount(0);
  });

  test('English home links the curated paths and the concept index', async ({ page }) => {
    await page.goto('/en/');
    const more = page.locator('.home-more-links');
    await expect(more.locator('a[href="/en/path/trig-to-fourier"]')).toContainText(
      'From trigonometric functions to Fourier',
    );
    await expect(more.locator('a[href="/en/concept"]')).toHaveText('Concept index →');
  });

  test('circle inversion radius slider keeps the figure alive (zh and en)', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(String(error)));
    for (const url of ['/works/circle-inversion/', '/en/works/circle-inversion/']) {
      await page.goto(url);
      const slider = page.locator('#circle-inversion-radius');
      const before = await slider.inputValue();
      await slider.focus();
      for (let i = 0; i < 4; i++) await page.keyboard.press('ArrowRight');
      await expect(slider).toBeVisible();
      expect(await slider.inputValue()).not.toBe(before);
    }
    expect(errors).toEqual([]);
  });

  test('crawlers are never redirected by the saved language', async ({ browser }) => {
    const base = test.info().project.use.baseURL as string;
    const context = await browser.newContext({
      baseURL: base,
      userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1)',
    });
    await context.addCookies([{ name: 'lab-lang', value: 'en', url: base }]);
    const page = await context.newPage();
    await page.goto('/works/rose-curve/');
    expect(await page.locator('html').getAttribute('lang')).toBe('zh-Hant');
    await context.close();
  });

  test('language toggle keeps the shared exam subject filter', async ({ page }) => {
    await page.goto('/exam/?subject=%E5%88%86%E7%A7%91%E6%95%B8%E7%94%B2');
    await page.locator('[data-lang-toggle]').click();
    await expect(page).toHaveURL(/\/en\/exam\/\?subject=%E5%88%86%E7%A7%91%E6%95%B8%E7%94%B2$/);
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
    await expect(navLinks.getByRole('link', { name: '概念', exact: true })).toHaveCount(1);
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

  test('detail pages offer giscus; lists and home do not', async ({ page }) => {
    await page.goto('/works/rose-curve');
    await expect(page.locator('.page-comments')).toBeVisible();
    await expect(page.locator('script[src="https://giscus.app/client.js"]')).toHaveCount(0);

    await page.locator('.page-comments').scrollIntoViewIfNeeded();
    await expect(page.locator('script[src="https://giscus.app/client.js"]')).toHaveCount(1);

    await page.goto('/');
    await expect(page.locator('.page-comments')).toHaveCount(0);
    await page.goto('/works');
    await expect(page.locator('.page-comments')).toHaveCount(0);
  });

  test('umami is omitted in local/dev without a production website id', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('script[data-website-id]')).toHaveCount(0);
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
