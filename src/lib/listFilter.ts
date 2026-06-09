/**
 * List filter pure logic: token normalization, grid visibility, URL param sync helpers.
 * DOM wiring, Fuse search, and event listeners live in ListSearchFilterScript.astro.
 */

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
): number {
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

  return visibleCount;
}

export function updateListFilterCount(
  root: HTMLElement,
  visibleCount: number,
  totalCount: number,
): void {
  const el = root.querySelector('[data-filter-count]');
  if (!el) return;

  const unit = root.getAttribute('data-filter-count-unit') || '篇';

  if (visibleCount === totalCount) {
    el.textContent = `共 ${totalCount} ${unit}`;
  } else {
    el.textContent = `顯示 ${visibleCount} / ${totalCount} ${unit}`;
  }
}

export function clearListFilters(root: HTMLElement): void {
  const filterParam = root.getAttribute('data-filter-param');
  const searchParam = root.getAttribute('data-search-param');
  const bar = root.querySelector('[data-filter-bar]');
  const searchInput = root.querySelector('[data-list-search-input]') as HTMLInputElement | null;
  const allButton = bar ? getFilterButton(bar, '*') : null;

  if (searchInput) searchInput.value = '';
  if (allButton && bar) setActiveFilter(bar, allButton);
  clearUrlParams([filterParam, searchParam]);
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
    history.pushState(null, '', url.href);
  }
}

/** Remove multiple query params in a single history entry. */
export function clearUrlParams(params: (string | null)[]): void {
  const url = new URL(window.location.href);
  let changed = false;

  for (const param of params) {
    if (!param) continue;
    if (url.searchParams.has(param)) {
      url.searchParams.delete(param);
      changed = true;
    }
  }

  if (changed && url.href !== window.location.href) {
    history.pushState(null, '', url.href);
  }
}

/** Safe to embed in `<script type="application/json">` (blocks `</script>` breakout). */
export function serializeSearchIndex(records: unknown[]): string {
  return JSON.stringify(records).replace(/</g, '\\u003c');
}
