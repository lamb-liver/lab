export function normalizeFilterToken(value: string): string {
  return value.trim().toLowerCase();
}

export function getCardFilterTokens(el: HTMLElement): string[] {
  const tags = el.getAttribute('data-filter-tags');
  const category = el.getAttribute('data-filter-category');
  return (tags ?? category ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.toLowerCase());
}

export function applyTagFilter(
  grid: HTMLElement,
  tagValue: string,
  emptyEl: HTMLElement | null,
): void {
  let visibleCount = 0;

  grid.querySelectorAll('[data-filter-item]').forEach((card) => {
    const el = card as HTMLElement;
    if (tagValue === '*') {
      el.hidden = false;
      visibleCount += 1;
      return;
    }

    const show = getCardFilterTokens(el).includes(tagValue);
    el.hidden = !show;
    if (show) visibleCount += 1;
  });

  if (emptyEl) {
    emptyEl.hidden = tagValue === '*' || visibleCount > 0;
  }
}

export function applyListGridFilter(
  grid: HTMLElement,
  filterValue: string,
  searchSlugs: Set<string> | null,
  hasSearchQuery: boolean,
  emptyEl: HTMLElement | null,
): void {
  let visibleCount = 0;

  grid.querySelectorAll('[data-filter-item]').forEach((card) => {
    const el = card as HTMLElement;
    const slug = el.getAttribute('data-search-slug') ?? '';

    const tagMatch =
      filterValue === '*' || getCardFilterTokens(el).includes(filterValue);

    const searchMatch =
      !hasSearchQuery || searchSlugs === null || (slug !== '' && searchSlugs.has(slug));

    const show = tagMatch && searchMatch;
    el.hidden = !show;
    if (show) visibleCount += 1;
  });

  if (emptyEl) {
    emptyEl.hidden = visibleCount > 0;
  }
}

export const applyWorksGridFilter = applyListGridFilter;

export function getFilterButton(bar: Element, value: string): HTMLButtonElement | null {
  const normalized = normalizeFilterToken(value);
  for (const button of bar.querySelectorAll('button[data-filter-value]')) {
    const buttonValue = button.getAttribute('data-filter-value')?.trim().toLowerCase();
    if (buttonValue === normalized) return button as HTMLButtonElement;
  }
  return null;
}

export function setActiveFilter(bar: Element, activeButton: HTMLButtonElement): void {
  bar.querySelectorAll('button[data-filter-value]').forEach((button) => {
    const active = button === activeButton;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
}

export function readUrlParam(param: string | null): string {
  if (!param) return '';
  return new URL(window.location.href).searchParams.get(param)?.trim() ?? '';
}

export function updateUrlParam(param: string | null, value: string): void {
  if (!param) return;

  const url = new URL(window.location.href);
  const trimmed = value.trim();
  if (!trimmed) {
    url.searchParams.delete(param);
  } else {
    url.searchParams.set(param, trimmed);
  }

  if (url.href !== window.location.href) {
    history.pushState(null, '', url);
  }
}

/** Safe to embed in `<script type="application/json">` (blocks `</script>` breakout). */
export function serializeSearchIndex(records: unknown[]): string {
  return JSON.stringify(records).replace(/</g, '\\u003c');
}
