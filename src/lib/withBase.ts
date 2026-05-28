export function withBase(path: string): string {
  if (!path) return path;
  if (/^https?:\/\//.test(path)) return path;
  if (path.startsWith('data:')) return path;

  const base = import.meta.env.BASE_URL;
  if (path === '/') return base;

  return `${base}${path.replace(/^\//, '')}`;
}

/** 導覽 active 狀態（相容 `base: '/lab/'`） */
export function isActivePath(path: string, pathname: string): boolean {
  const href = withBase(path);

  if (path === '/') {
    const root = href.endsWith('/') && href.length > 1 ? href.slice(0, -1) : href;
    return pathname === href || pathname === root || pathname === '/';
  }

  const target = href.endsWith('/') ? href.slice(0, -1) : href;
  return pathname === target || pathname.startsWith(`${target}/`);
}
