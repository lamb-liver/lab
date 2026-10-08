function slugsIn(files: Record<string, unknown>): Set<string> {
  return new Set(
    Object.keys(files).map((file) => (file.split('/').pop() ?? '').replace(/\.mdx?$/, '')),
  );
}

/** Slugs that have an English markdown file. Adding the file publishes the page. */
export const enWorkSlugs = slugsIn(import.meta.glob('../content/en/works/*.{md,mdx}'));
export const enExploreSlugs = slugsIn(import.meta.glob('../content/en/explore/*.{md,mdx}'));
export const enExamSlugs = slugsIn(import.meta.glob('../content/en/exam/*.{md,mdx}'));

/** hreflang set for a section index (home, list pages). `path` is the zh path, e.g. `/works/`. */
export function indexAlternates(site: URL, path: string): Array<{ hreflang: string; href: string }> {
  const zh = new URL(path, site).href;
  const en = new URL(`/en${path}`, site).href;
  return [
    { hreflang: 'zh-Hant', href: zh },
    { hreflang: 'en', href: en },
    { hreflang: 'x-default', href: zh },
  ];
}

/** hreflang set for one translated page. Absent when this slug has no English page yet. */
export function translationAlternates(
  site: URL,
  kind: 'works' | 'explore' | 'exam',
  slug: string,
): Array<{ hreflang: string; href: string }> | undefined {
  const translated =
    kind === 'works' ? enWorkSlugs : kind === 'explore' ? enExploreSlugs : enExamSlugs;
  if (!translated.has(slug)) return undefined;
  const zh = new URL(`/${kind}/${slug}/`, site).href;
  const en = new URL(`/en/${kind}/${slug}/`, site).href;
  return [
    { hreflang: 'zh-Hant', href: zh },
    { hreflang: 'en', href: en },
    { hreflang: 'x-default', href: zh },
  ];
}

const SECTIONS = ['works', 'explore', 'exam', 'concept', 'path', 'about'];

/** 沒有對應頁時，語言切換改去另一語言同一區塊的列表頁；不屬於任何區塊就回首頁 */
export function nearestCounterpartList(pathname: string, locale?: 'en'): string {
  const parts = pathname.split('/').filter(Boolean);
  if (parts[0] === 'en') parts.shift();
  const section = SECTIONS.includes(parts[0] ?? '') ? parts[0] : undefined;
  if (locale === 'en') return section ? `/${section}/` : '/';
  return section ? `/en/${section}/` : '/en/';
}
