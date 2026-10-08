function slugsIn(files: Record<string, unknown>): Set<string> {
  return new Set(
    Object.keys(files).map((file) => (file.split('/').pop() ?? '').replace(/\.mdx?$/, '')),
  );
}

/** Slugs that have an English markdown file. Adding the file publishes the page. */
export const enWorkSlugs = slugsIn(import.meta.glob('../content/en/works/*.{md,mdx}'));
export const enExploreSlugs = slugsIn(import.meta.glob('../content/en/explore/*.{md,mdx}'));
export const enExamSlugs = slugsIn(import.meta.glob('../content/en/exam/*.{md,mdx}'));

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
