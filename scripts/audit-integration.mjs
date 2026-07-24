#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { auditExamCovers, auditExploreCovers } from './audit-static-covers.mjs';
import { parseStageRootImports } from './stage-root-map.mjs';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const paths = {
  workContent: resolve(repoRoot, 'src/content/works'),
  exploreContent: resolve(repoRoot, 'src/content/explore'),
  curveRegistry: resolve(repoRoot, 'src/curve/registry.ts'),
  workRegistry: resolve(repoRoot, 'src/works/interactiveSlugs.ts'),
  exploreRegistry: resolve(repoRoot, 'src/explore/interactiveSlugs.ts'),
  workStage: resolve(repoRoot, 'src/components/works/WorkInteractiveStage.tsx'),
  exploreStage: resolve(repoRoot, 'src/components/explore/ExploreInteractiveStage.tsx'),
  workRootDir: resolve(repoRoot, 'src/components/works'),
  exploreRootDir: resolve(repoRoot, 'src/components/explore'),
};

function usage() {
  return [
    'Usage:',
    '  npm run audit:integration',
    '  npm run audit:integration -- --json',
    '',
    'Static checks for Works and Explore integration surfaces: published content, module,',
    'renderer/hook imports, Root components, registries, Stage maps, and covers.',
  ].join('\n');
}

function contentSlugSets(dir) {
  const all = new Set();
  const published = new Set();

  for (const name of readdirSync(dir)
    .filter((name) => name.endsWith('.md') || name.endsWith('.mdx'))
    .sort()) {
    const slug = basename(name).replace(/\.mdx?$/, '');
    const body = read(join(dir, name));
    all.add(slug);
    if (readFrontmatterValue(body, 'draft') !== 'true') {
      published.add(slug);
    }
  }

  return { all, published };
}

function readFrontmatterValue(body, key) {
  const lines = body.split('\n');
  if (lines[0] !== '---') return null;

  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (line === '---') return null;
    const match = line.match(new RegExp(`^${key}:\\s*(.+?)\\s*$`));
    if (match) return stripQuotes(match[1]);
  }
  return null;
}

function stripQuotes(value) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function read(path) {
  return readFileSync(path, 'utf8');
}

function parseStringArray(source, exportName) {
  const match = source.match(new RegExp(`export\\s+const\\s+${exportName}\\s*=\\s*\\[([\\s\\S]*?)\\]\\s+as\\s+const`));
  if (!match) return [];
  return [...match[1].matchAll(/'([^']+)'/g)].map((item) => item[1]);
}

function parseNamedImports(source, prefix) {
  const imports = new Map();
  const pattern = /import\s+\{\s*([A-Za-z0-9_]+)\s*\}\s+from\s+'([^']+)'/g;
  for (const match of source.matchAll(pattern)) {
    if (match[2].startsWith(prefix)) imports.set(match[1], match[2]);
  }
  return imports;
}

function parseWorkCurveMap(source) {
  const moduleImports = parseNamedImports(source, './modules/');
  const recordMatch = source.match(/workCurveBySlug:\s*Record<string,\s*CurveModule>\s*=\s*\{([\s\S]*?)\n\};/);
  const bySlug = new Map();
  if (!recordMatch) return bySlug;
  for (const item of recordMatch[1].matchAll(/'([^']+)':\s*([A-Za-z0-9_]+)/g)) {
    const slug = item[1];
    const importName = item[2];
    bySlug.set(slug, {
      importName,
      moduleImport: moduleImports.get(importName) ?? null,
    });
  }
  return bySlug;
}

function pathForImport(fromFile, importPath, extension = '.tsx') {
  const base = resolve(dirname(fromFile), importPath);
  const candidates = [
    base,
    `${base}${extension}`,
    `${base}.ts`,
    `${base}.tsx`,
    join(base, 'index.ts'),
    join(base, 'index.tsx'),
  ];
  return candidates.find((candidate) => existsSync(candidate)) ?? candidates[0];
}

function hasRelativeImportIssues(filePath, source, issues, owner) {
  const importPattern = /from\s+'(\.{1,2}\/[^']+)'/g;
  for (const match of source.matchAll(importPattern)) {
    const target = pathForImport(filePath, match[1]);
    if (!existsSync(target)) {
      issues.push({
        area: owner,
        file: filePath,
        message: `relative import target is missing: ${match[1]}`,
      });
    }
  }
}

function checkWorkSurfaces(issues) {
  const content = contentSlugSets(paths.workContent);
  const workRegistry = read(paths.workRegistry);
  const curveRegistry = read(paths.curveRegistry);
  const workStage = read(paths.workStage);
  const interactiveSlugs = new Set(parseStringArray(workRegistry, 'workInteractiveSlugs'));
  const curveBySlug = parseWorkCurveMap(curveRegistry);
  const stageRootImports = parseStageRootImports(workStage, 'rootBySlug');
  const allSlugs = new Set([
    ...content.published,
    ...interactiveSlugs,
    ...curveBySlug.keys(),
    ...stageRootImports.keys(),
  ]);

  for (const slug of [...allSlugs].sort()) {
    if (!content.all.has(slug)) {
      issues.push({ area: 'works', slug, file: paths.workContent, message: 'missing content file' });
    }
    if (!interactiveSlugs.has(slug)) {
      issues.push({ area: 'works', slug, file: paths.workRegistry, message: 'missing workInteractiveSlugs entry' });
    }

    const curve = curveBySlug.get(slug);
    if (!curve) {
      issues.push({ area: 'works', slug, file: paths.curveRegistry, message: 'missing workCurveBySlug entry' });
    } else if (!curve.moduleImport) {
      issues.push({ area: 'works', slug, file: paths.curveRegistry, message: `missing module import for ${curve.importName}` });
    } else {
      const modulePath = pathForImport(paths.curveRegistry, curve.moduleImport, '.ts');
      if (!existsSync(modulePath)) {
        issues.push({ area: 'works', slug, file: modulePath, message: 'missing curve module index' });
      }
    }

    const rootImport = stageRootImports.get(slug);
    if (!rootImport) {
      issues.push({ area: 'works', slug, file: paths.workStage, message: 'missing WorkInteractiveStage lazy root entry' });
      continue;
    }

    const rootPath = pathForImport(paths.workStage, rootImport);
    if (!existsSync(rootPath)) {
      issues.push({ area: 'works', slug, file: rootPath, message: 'missing Root component file' });
      continue;
    }

    const rootSource = read(rootPath);
    hasRelativeImportIssues(rootPath, rootSource, issues, `works:${slug}`);
    const usesCurveWorkRoot = rootSource.includes("from '../curve/CurveWorkRoot'");
    const hookImports = [...rootSource.matchAll(/from\s+'..\/curve\/(use[A-Za-z0-9_]+P5)'/g)].map((item) => item[1]);
    if (!usesCurveWorkRoot && hookImports.length === 0) {
      issues.push({ area: 'works', slug, file: rootPath, message: 'Root does not reference CurveWorkRoot or a p5 hook' });
    }

    for (const hookName of hookImports) {
      const hookPath = resolve(repoRoot, 'src/components/curve', `${hookName}.ts`);
      if (!existsSync(hookPath)) {
        issues.push({ area: 'works', slug, file: hookPath, message: 'missing hook file' });
        continue;
      }
      const hookSource = read(hookPath);
      hasRelativeImportIssues(hookPath, hookSource, issues, `works:${slug}`);
      const hasRenderingImport =
        hookSource.includes('../../systems/rendering/') ||
        /from\s+'..\/..\/curve\/modules\/[^']+\/(?:engine|renderer)'/.test(hookSource);
      if (!hasRenderingImport) {
        issues.push({ area: 'works', slug, file: hookPath, message: 'hook does not import a rendering module' });
      }
    }
  }

  const sharedCoverRoutes = [
    'src/pages/thumbs/works/[slug].svg.ts',
    'src/pages/og/works/[slug].png.ts',
    'src/lib/curveThumbnail.registry.test.ts',
    'src/lib/workOgImage.test.ts',
  ];
  for (const relativePath of sharedCoverRoutes) {
    const file = resolve(repoRoot, relativePath);
    if (!existsSync(file)) {
      issues.push({ area: 'works', file, message: 'missing shared work cover/thumbnail surface' });
    }
  }
}

function checkExploreSurfaces(issues) {
  const content = contentSlugSets(paths.exploreContent);
  const exploreRegistry = read(paths.exploreRegistry);
  const exploreStage = read(paths.exploreStage);
  const interactiveSlugs = new Set(parseStringArray(exploreRegistry, 'exploreInteractiveSlugs'));
  const stageRootImports = parseStageRootImports(exploreStage, 'rootBySlug');
  const allSlugs = new Set([
    ...content.published,
    ...interactiveSlugs,
    ...stageRootImports.keys(),
  ]);

  for (const slug of [...allSlugs].sort()) {
    if (!content.all.has(slug)) {
      issues.push({ area: 'explore', slug, file: paths.exploreContent, message: 'missing content file' });
    }
    if (!interactiveSlugs.has(slug)) {
      issues.push({ area: 'explore', slug, file: paths.exploreRegistry, message: 'missing exploreInteractiveSlugs entry' });
    }

    const rootImport = stageRootImports.get(slug);
    if (!rootImport) {
      issues.push({ area: 'explore', slug, file: paths.exploreStage, message: 'missing ExploreInteractiveStage lazy root entry' });
      continue;
    }

    const rootPath = pathForImport(paths.exploreStage, rootImport);
    if (!existsSync(rootPath)) {
      issues.push({ area: 'explore', slug, file: rootPath, message: 'missing Explore Root component file' });
      continue;
    }

    const rootSource = read(rootPath);
    hasRelativeImportIssues(rootPath, rootSource, issues, `explore:${slug}`);
    if (!rootSource.includes('../../styles/components/explore/')) {
      issues.push({ area: 'explore', slug, file: rootPath, message: 'Explore Root does not import component CSS' });
    }
  }

  const coverResult = auditExploreCovers();
  for (const issue of coverResult.issues) {
    issues.push({ area: 'explore-cover', ...issue });
  }
}

function auditIntegration() {
  const issues = [];
  checkWorkSurfaces(issues);
  checkExploreSurfaces(issues);
  const examCoverResult = auditExamCovers();
  for (const issue of examCoverResult.issues) {
    issues.push({ area: 'exam-cover', ...issue });
  }
  return { issues };
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) {
    console.log(usage());
    return;
  }

  const result = auditIntegration();
  if (args.includes('--json')) {
    console.log(JSON.stringify(result, null, 2));
  } else if (result.issues.length === 0) {
    console.log('Integration audit passed.');
  } else {
    console.error(`Integration audit failed (${result.issues.length} issues):`);
    for (const issue of result.issues) {
      const slug = issue.slug ? `${issue.slug}: ` : '';
      console.error(`- ${issue.area}: ${slug}${issue.message} (${issue.file})`);
    }
  }

  if (result.issues.length > 0) process.exitCode = 1;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
