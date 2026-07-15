// Shared parser for the interactive Stage `rootBySlug` maps.
// Stage entries must use the lazy form: 'slug': lazy(() => import('./XxxRoot')).
// A static entry is intentionally not matched so audits surface it as a missing
// root entry instead of silently accepting a bundle-size regression.
export function parseStageRootImports(source, objectName = 'rootBySlug') {
  const match = source.match(
    new RegExp(`const\\s+${objectName}\\s*=\\s*\\{([\\s\\S]*?)\\}\\s+satisfies`),
  );
  if (!match) return new Map();
  const map = new Map();
  for (const item of match[1].matchAll(
    /(?:'([^']+)'|([A-Za-z0-9_]+)):\s*lazy\(\(\)\s*=>\s*import\('([^']+)'\)\)/g,
  )) {
    map.set(item[1] ?? item[2], item[3]);
  }
  return map;
}
