export function withBase(path: string): string {
  if (!path) return path;
  if (/^https?:\/\//.test(path)) return path;
  if (path.startsWith('data:')) return path;

  const base = import.meta.env.BASE_URL;
  return `${base}${path.replace(/^\//, '')}`;
}
