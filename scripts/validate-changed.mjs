#!/usr/bin/env node
import { existsSync, readFileSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { basename, dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseStageRootImports } from './stage-root-map.mjs';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const packageAndConfigFiles = new Set([
  'package.json',
  'package-lock.json',
  'astro.config.mjs',
  'tsconfig.json',
  'vitest.config.ts',
  'playwright.config.ts',
]);

function usage() {
  return [
    'Usage:',
    '  npm run validate:changed',
    '  npm run validate:changed -- --dry-run',
    '  npm run validate:changed -- --base origin/main',
    '',
    'Selects focused checks from changed files:',
    '  content -> content audit + registry sync',
    '  curve module -> module test + thumbnail registry',
    '  work root/hook/registry -> registry sync + single work smoke when slug is known',
    '  explore root/css/content -> registry sync + single explore smoke when slug is known',
  ].join('\n');
}

function parseArgs(argv) {
  const options = {
    base: 'HEAD',
    dryRun: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
      continue;
    }
    if (arg === '--dry-run') {
      options.dryRun = true;
      continue;
    }
    if (arg === '--base') {
      const value = argv[i + 1];
      if (!value) throw new Error('Missing value for --base');
      options.base = value;
      i += 1;
      continue;
    }
    throw new Error(`Unknown option: ${arg}\n\n${usage()}`);
  }

  return options;
}

function gitLines(args) {
  const result = spawnSync('git', args, {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    throw new Error(result.stderr.trim() || `git ${args.join(' ')} failed`);
  }
  return result.stdout.split('\n').map((line) => line.trim()).filter(Boolean);
}

function changedFiles(base) {
  return [
    ...gitLines(['diff', '--name-only', '--diff-filter=ACMRD', base]),
    ...gitLines(['ls-files', '--others', '--exclude-standard']),
  ].filter((file, index, all) => all.indexOf(file) === index).sort();
}

function read(path) {
  return readFileSync(resolve(repoRoot, path), 'utf8');
}

function parseWorkModuleMap() {
  const registry = read('src/curve/registry.ts');
  const imports = new Map();
  for (const match of registry.matchAll(/import\s+\{\s*([A-Za-z0-9_]+)\s*\}\s+from\s+'\.\/modules\/([^']+)'/g)) {
    imports.set(match[1], match[2]);
  }

  const map = new Map();
  const record = registry.match(/workCurveBySlug:\s*Record<string,\s*CurveModule>\s*=\s*\{([\s\S]*?)\n\};/);
  if (!record) return map;
  for (const match of record[1].matchAll(/'([^']+)':\s*([A-Za-z0-9_]+)/g)) {
    const slug = match[1];
    const moduleDir = imports.get(match[2]);
    if (moduleDir) map.set(moduleDir, slug);
  }
  return map;
}

function importPathToRelative(fromFile, importPath) {
  const withoutExtension = resolve(repoRoot, dirname(fromFile), importPath);
  const candidates = [
    withoutExtension,
    `${withoutExtension}.ts`,
    `${withoutExtension}.tsx`,
    `${withoutExtension}.css`,
    `${withoutExtension}.astro`,
    `${withoutExtension}.mjs`,
    `${withoutExtension}.js`,
    resolve(withoutExtension, 'index.ts'),
    resolve(withoutExtension, 'index.tsx'),
  ];
  const target =
    candidates.find((candidate) => existsSync(candidate) && statSync(candidate).isFile()) ??
    candidates[0];
  return relative(repoRoot, target);
}

function buildStageFileMap(stageFile) {
  const fileToSlug = new Map();
  for (const [slug, importPath] of parseStageRootImports(read(stageFile))) {
    fileToSlug.set(importPathToRelative(stageFile, importPath), slug);
  }
  return fileToSlug;
}

function addSlug(map, file, slug) {
  if (!map.has(file)) map.set(file, new Set());
  map.get(file).add(slug);
}

function relativeImportTargets(file) {
  const absolute = resolve(repoRoot, file);
  if (!existsSync(absolute) || !statSync(absolute).isFile()) return [];
  const targets = [];
  for (const match of read(file).matchAll(/from\s+'(\.{1,2}\/[^']+)'/g)) {
    targets.push(importPathToRelative(file, match[1]));
  }
  return targets;
}

// Maps every file transitively imported by a stage root to the slugs that
// consume it, so a change to any shared hook, renderer, geometry, or topic
// module selects a smoke run for each affected page. Replaces the previous
// hand-maintained hook/renderer/special-case tables, which dropped slugs on
// shared files and went stale as consumers changed.
export function buildReachabilityMap(rootMap, allowPrefixes) {
  const fileToSlugs = new Map();
  const importCache = new Map();
  const targetsOf = (file) => {
    if (!importCache.has(file)) {
      importCache.set(
        file,
        relativeImportTargets(file).filter((target) =>
          allowPrefixes.some((prefix) => target.startsWith(prefix)),
        ),
      );
    }
    return importCache.get(file);
  };

  for (const [rootFile, slug] of rootMap) {
    const stack = [rootFile];
    const seen = new Set();
    while (stack.length > 0) {
      const file = stack.pop();
      if (seen.has(file)) continue;
      seen.add(file);
      addSlug(fileToSlugs, file, slug);
      stack.push(...targetsOf(file));
    }
  }
  return fileToSlugs;
}

function buildExploreCssMap(exploreRootMap) {
  const cssToSlug = new Map();
  for (const [rootFile, slug] of exploreRootMap) {
    if (!existsSync(resolve(repoRoot, rootFile))) continue;
    const root = read(rootFile);
    for (const match of root.matchAll(/import\s+'..\/..\/styles\/components\/explore\/([^']+\.css)'/g)) {
      cssToSlug.set(`src/styles/components/explore/${match[1]}`, slug);
    }
  }
  return cssToSlug;
}

function moduleTestPath(moduleDir) {
  const dir = resolve(repoRoot, 'src/curve/modules', moduleDir);
  const testName = `${basename(moduleDir)}.test.ts`;
  const candidate = resolve(dir, testName);
  return existsSync(candidate) ? relative(repoRoot, candidate) : null;
}

function command(label, args) {
  return {
    label,
    args,
    key: args.join('\u0000'),
  };
}

function add(commands, next) {
  if (!commands.some((item) => item.key === next.key)) commands.push(next);
}

export function selectCommands(files) {
  const commands = [];
  const workModuleByDir = parseWorkModuleMap();
  const workRootMap = buildStageFileMap('src/components/works/WorkInteractiveStage.tsx');
  const exploreRootMap = buildStageFileMap('src/components/explore/ExploreInteractiveStage.tsx');
  const interactiveWorkSlugs = new Set(workRootMap.values());
  const interactiveExploreSlugs = new Set(exploreRootMap.values());
  const workFileToSlugs = buildReachabilityMap(workRootMap, [
    'src/components/',
    'src/systems/',
    'src/curve/',
    'src/works/',
    'src/lib/',
  ]);
  const exploreFileToSlugs = buildReachabilityMap(exploreRootMap, [
    'src/components/',
    'src/systems/',
    'src/explore/',
    'src/lib/',
  ]);
  const exploreCssMap = buildExploreCssMap(exploreRootMap);

  // Widely shared files can fan out to dozens of works; above this many
  // affected slugs, one full works smoke run is cheaper and more complete.
  const workSmokeFanOutLimit = 6;
  const addWorkSmokes = (slugs) => {
    if (slugs.size > workSmokeFanOutLimit) {
      add(commands, command('works smoke suite', ['npm', 'run', 'test:works-smoke']));
      return;
    }
    for (const slug of [...slugs].sort()) {
      add(commands, command(`work smoke ${slug}`, ['npm', 'run', 'smoke:work', '--', slug]));
    }
  };
  const addExploreSmokes = (slugs) => {
    for (const slug of [...slugs].sort()) {
      add(commands, command(`explore smoke ${slug}`, ['npm', 'run', 'smoke:explore', '--', slug]));
    }
  };

  for (const file of files) {
    if (packageAndConfigFiles.has(file)) {
      add(commands, command('frontend validation', ['npm', 'run', 'validate:frontend', '--', '--skip-dom']));
      if (file === 'package.json') {
        add(commands, command('script entrypoints', ['npm', 'run', 'lab', '--', '--help']));
      }
      continue;
    }

    if (file === 'scripts/lab.mjs' || file.startsWith('scripts/')) {
      add(commands, command('script entrypoints', ['npm', 'run', 'lab', '--', '--help']));
      if (file.includes('audit')) {
        add(commands, command('content release audit', ['npm', 'run', 'audit:content']));
        add(commands, command('integration audit', ['npm', 'run', 'audit:integration']));
      }
      continue;
    }

    if (file.startsWith('src/content/works/') || file.startsWith('src/content/explore/')) {
      add(commands, command('content release audit', ['npm', 'run', 'audit:content']));
      add(commands, command('content audit', ['npm', 'run', 'test:content-audit']));
      add(commands, command('registry sync', ['npm', 'run', 'test', '--', 'src/registry.sync.test.ts']));
    }

    if (file.startsWith('src/content/works/')) {
      const slug = basename(file).replace(/\.mdx?$/, '');
      if (interactiveWorkSlugs.has(slug)) {
        add(commands, command(`work smoke ${slug}`, ['npm', 'run', 'smoke:work', '--', slug]));
      }
    }

    if (file.startsWith('src/content/explore/')) {
      const slug = basename(file).replace(/\.mdx?$/, '');
      if (interactiveExploreSlugs.has(slug)) {
        add(commands, command(`explore smoke ${slug}`, ['npm', 'run', 'smoke:explore', '--', slug]));
      }
    }

    if (file.startsWith('src/curve/modules/')) {
      const moduleDir = file.split('/').slice(3, 4)[0];
      const testPath = moduleTestPath(moduleDir);
      if (testPath) {
        add(commands, command(`module test ${moduleDir}`, ['npm', 'run', 'test', '--', testPath]));
      }
      add(commands, command('thumbnail registry', ['npm', 'run', 'test', '--', 'src/lib/curveThumbnail.registry.test.ts', 'src/lib/workOgImage.test.ts']));
      const slug = workModuleByDir.get(moduleDir);
      if (slug) {
        add(commands, command(`work smoke ${slug}`, ['npm', 'run', 'smoke:work', '--', slug]));
      }
      if (interactiveExploreSlugs.has(moduleDir)) {
        add(commands, command(`explore smoke ${moduleDir}`, ['npm', 'run', 'smoke:explore', '--', moduleDir]));
      }
    }

    if (
      file === 'src/curve/registry.ts' ||
      file === 'src/works/interactiveRegistry.ts' ||
      file === 'src/components/works/WorkInteractiveStage.tsx' ||
      file === 'src/explore/interactiveRegistry.ts' ||
      file === 'src/components/explore/ExploreInteractiveStage.tsx'
    ) {
      add(commands, command('registry sync', ['npm', 'run', 'test', '--', 'src/registry.sync.test.ts']));
      add(commands, command('integration audit', ['npm', 'run', 'audit:integration']));
    }

    const workRootSlug = workRootMap.get(file);
    if (workRootSlug) {
      add(commands, command('registry sync', ['npm', 'run', 'test', '--', 'src/registry.sync.test.ts']));
      add(commands, command(`work smoke ${workRootSlug}`, ['npm', 'run', 'smoke:work', '--', workRootSlug]));
    }

    const workSlugsForFile = workFileToSlugs.get(file);
    if (workSlugsForFile) addWorkSmokes(workSlugsForFile);

    const exploreSlugsForFile = exploreFileToSlugs.get(file);
    if (exploreSlugsForFile) addExploreSmokes(exploreSlugsForFile);

    const exploreRootSlug = exploreRootMap.get(file);
    if (exploreRootSlug) {
      add(commands, command('registry sync', ['npm', 'run', 'test', '--', 'src/registry.sync.test.ts']));
      add(commands, command(`explore smoke ${exploreRootSlug}`, ['npm', 'run', 'smoke:explore', '--', exploreRootSlug]));
    }

    const exploreCssSlug = exploreCssMap.get(file);
    if (exploreCssSlug) {
      add(commands, command(`explore smoke ${exploreCssSlug}`, ['npm', 'run', 'smoke:explore', '--', exploreCssSlug]));
    }

    if (file.startsWith('scripts/explore-covers/') || file.startsWith('public/images/explore-covers/')) {
      add(commands, command('explore cover audit', ['npm', 'run', 'audit:explore-covers']));
    }

    if (file.endsWith('.test.ts') && existsSync(resolve(repoRoot, file))) {
      add(commands, command(`test ${file}`, ['npm', 'run', 'test', '--', file]));
    }

    if (file === 'tests/explore-single.smoke.spec.ts') {
      add(commands, command('explore smoke list', ['npm', 'run', 'smoke:explore', '--', 'vectors', '--list']));
    } else if (file === 'tests/work-integration.smoke.spec.ts') {
      add(commands, command(`playwright list ${file}`, ['npm', 'run', 'test:works-smoke', '--', '--list']));
    } else if (file === 'tests/seo-ux.spec.ts') {
      add(commands, command(`playwright list ${file}`, ['npm', 'run', 'test:seo-ux', '--', '--list']));
    }
  }

  if (commands.length === 0 && files.length > 0) {
    add(commands, command('integration audit', ['npm', 'run', 'audit:integration']));
  }

  return commands;
}

function runCommands(commands) {
  for (const item of commands) {
    console.log(`== ${item.label} ==`);
    console.log(item.args.join(' '));
    const result = spawnSync(item.args[0], item.args.slice(1), {
      cwd: repoRoot,
      env: process.env,
      stdio: 'inherit',
    });
    if (result.status === null) {
      throw new Error(result.error?.message ?? `${item.args.join(' ')} failed`);
    }
    if (result.status !== 0) {
      process.exitCode = result.status;
      return;
    }
  }
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log(usage());
    return;
  }

  const files = changedFiles(options.base);
  if (files.length === 0) {
    console.log(`No changed files relative to ${options.base}.`);
    return;
  }

  console.log(`Changed files relative to ${options.base}:`);
  for (const file of files) console.log(`- ${file}`);

  const commands = selectCommands(files);
  if (commands.length === 0) {
    console.log('No validation command selected.');
    return;
  }

  console.log('');
  console.log('Selected validation:');
  for (const item of commands) console.log(`- ${item.args.join(' ')}`);

  if (!options.dryRun) {
    console.log('');
    runCommands(commands);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = process.exitCode || 1;
  }
}
