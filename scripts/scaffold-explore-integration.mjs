#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const categories = ['幾何', '代數', '統計', '拓樸', '分析'];

function usage() {
  return [
    'Usage:',
    '  npm run scaffold:explore -- <slug> [--title <title>] [--category <category>] [--description <text>] [--date YYYY-MM-DD] [--dry-run] [--skip-validate]',
    '',
    'Example:',
    '  npm run scaffold:explore -- eigenvectors --title 特徵向量 --category 代數',
    '',
    'Creates:',
    '  src/content/explore/<slug>.md',
    '  src/components/explore/<PascalSlug>ExploreRoot.tsx',
    '  src/styles/components/explore/<slug>-explore.css',
    '',
    'Updates:',
    '  src/explore/interactiveRegistry.ts',
    '  src/components/explore/ExploreInteractiveStage.tsx',
  ].join('\n');
}

function parseArgs(argv) {
  const options = {
    title: null,
    category: '分析',
    description: null,
    date: new Date().toISOString().slice(0, 10),
    dryRun: false,
    skipValidate: false,
  };
  let slug = null;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      return { help: true, options, slug };
    }
    if (arg === '--dry-run') {
      options.dryRun = true;
      continue;
    }
    if (arg === '--skip-validate') {
      options.skipValidate = true;
      continue;
    }
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      if (!['title', 'category', 'description', 'date'].includes(key)) {
        throw new Error(`Unknown option: ${arg}`);
      }
      const value = argv[i + 1];
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for ${arg}`);
      }
      options[key] = value;
      i += 1;
      continue;
    }
    if (slug) {
      throw new Error(`Unexpected positional argument: ${arg}`);
    }
    slug = arg;
  }

  return { help: false, options, slug };
}

function toPascalCase(slug) {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function titleFromSlug(slug) {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function assertValidInput(slug, options) {
  if (!slug) {
    throw new Error(`Missing slug.\n\n${usage()}`);
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error('Slug must be kebab-case with lowercase letters, numbers, and single hyphens.');
  }
  if (!categories.includes(options.category)) {
    throw new Error(`Category must be one of: ${categories.join(', ')}`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(options.date)) {
    throw new Error('Date must use YYYY-MM-DD.');
  }
}

function contentTemplate({ slug, title, description, category, date }) {
  return `---
title: ${title}
description: ${description}
category: ${category}
date: ${date}
featured: false
draft: true
---

## 基本概念

補上這個主題要回答的中心問題：同一個概念、公式、操作或讀圖語言如何在多個情境中出現。

## 互動說明

- **導覽**：描述預設畫面保留哪些控制，以及讀者應先觀察什麼。
- **對照**：描述模式切換、參數映射與 stats 文字。

## 觀察重點

- 寫跨越至少兩個表徵的觀察，不逐條重複 Works 結論。
- 寫參數改變後可被畫面或 stats 驗證的現象。
- 寫這個 Explore 和單件 Works 不同的讀圖角色。

## 相關作品

- [待補作品](/works/example-slug)

## 延伸閱讀

- [待補資料](https://example.com)
`;
}

function componentTemplate({ componentName, cssFile, cssClass, title }) {
  return `import '../../styles/components/explore/${cssFile}';

export default function ${componentName}() {
  return (
    <section className="${cssClass}" aria-label="${title}">
      <div className="${cssClass}__stage">
        <div className="${cssClass}__visual">
          <div className="${cssClass}__canvas" aria-hidden="true">
            <div className="${cssClass}__guide">
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>

        <aside className="${cssClass}__sidebar">
          <h2>${title}</h2>
          <p>導覽模式與 stats 待接入。</p>
        </aside>
      </div>
    </section>
  );
}
`;
}

function cssTemplate({ cssClass }) {
  return `.${cssClass} {
  width: 100%;
  background: #0a0a0a;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.${cssClass}__stage {
  display: grid;
  grid-template-columns: minmax(0, 1fr) min(304px, 33vw);
  align-items: start;
  contain: layout;
}

.${cssClass}__visual {
  min-width: 0;
  padding: var(--space-4) var(--space-5);
  background: #0a0a0a;
}

.${cssClass}__canvas {
  display: grid;
  place-items: center;
  min-height: clamp(320px, 52vw, 560px);
}

.${cssClass}__guide {
  display: grid;
  gap: 18px;
  width: min(420px, 86%);
}

.${cssClass}__guide span {
  display: block;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgb(212, 184, 122), transparent);
  opacity: 0.82;
}

.${cssClass}__guide span:nth-child(2) {
  transform: translateX(14%) scaleX(0.72);
  opacity: 0.48;
}

.${cssClass}__guide span:nth-child(3) {
  transform: translateX(-10%) scaleX(0.54);
  opacity: 0.32;
}

.${cssClass}__sidebar {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-5);
  background: rgb(12, 12, 12);
  border-left: 1px solid var(--color-border);
  position: sticky;
  top: var(--nav-height);
  align-self: start;
  max-height: calc(100vh - var(--nav-height));
  overflow-y: auto;
  overscroll-behavior: contain;
  font-family: var(--font-sans);
  font-size: 0.8125rem;
}

.${cssClass}__sidebar h2 {
  margin: 0;
  color: rgb(212, 184, 122);
  font-size: 0.9375rem;
}

.${cssClass}__sidebar p {
  margin: 0;
  color: rgba(175, 175, 175, 1);
  line-height: 1.55;
}

@media (max-width: 768px) {
  .${cssClass}__stage {
    grid-template-columns: 1fr;
  }

  .${cssClass}__sidebar {
    border-left: none;
    border-top: 1px solid var(--color-border);
    position: static;
    max-height: none;
  }
}
`;
}

function addExploreSlug(registrySource, slug) {
  if (registrySource.includes(`'${slug}'`)) {
    throw new Error(`Slug already exists in src/explore/interactiveRegistry.ts: ${slug}`);
  }

  const marker = '\n] as const;';
  if (!registrySource.includes(marker)) {
    throw new Error('Could not find exploreInteractiveSlugs closing marker.');
  }
  return registrySource.replace(marker, `\n  '${slug}',${marker}`);
}

function addStageRoot(stageSource, { slug, componentName }) {
  if (stageSource.includes(`./${componentName}`) || stageSource.includes(`'${slug}':`)) {
    throw new Error(`Stage registration already exists for ${slug}.`);
  }

  const importLine = `import ${componentName} from './${componentName}';`;
  const lines = stageSource.split('\n');
  const lastRootImport = lines.reduce((last, line, index) => {
    return /^import \w+ExploreRoot from '\.\/\w+ExploreRoot';$/.test(line) ? index : last;
  }, -1);
  if (lastRootImport < 0) {
    throw new Error('Could not find Explore root import block.');
  }
  lines.splice(lastRootImport + 1, 0, importLine);
  const withImport = lines.join('\n');

  const marker = '} satisfies Record<ExploreInteractiveSlug, ComponentType>;';
  if (!withImport.includes(marker)) {
    throw new Error('Could not find rootBySlug closing marker.');
  }
  return withImport.replace(marker, `  '${slug}': ${componentName},\n${marker}`);
}

function assertNewFiles(paths) {
  for (const path of paths) {
    if (existsSync(path)) {
      throw new Error(`Refusing to overwrite existing file: ${path}`);
    }
  }
}

function runRegistryValidation() {
  console.log('');
  console.log('Running registry sync validation...');
  const result = spawnSync('npm', ['test', '--', 'src/registry.sync.test.ts'], {
    cwd: repoRoot,
    stdio: 'inherit',
  });
  if (result.status !== 0) {
    throw new Error('Registry sync validation failed.');
  }
}

function main() {
  const { help, options, slug } = parseArgs(process.argv.slice(2));
  if (help) {
    console.log(usage());
    return;
  }

  assertValidInput(slug, options);

  const title = options.title ?? titleFromSlug(slug);
  const description =
    options.description ?? `${title} 的互動導覽草稿；請改寫成跨作品的主題關係。`;
  const componentName = `${toPascalCase(slug)}ExploreRoot`;
  const cssFile = `${slug}-explore.css`;
  const cssClass = `${slug}-explore`;

  const contentPath = join(repoRoot, 'src/content/explore', `${slug}.md`);
  const componentPath = join(repoRoot, 'src/components/explore', `${componentName}.tsx`);
  const cssPath = join(repoRoot, 'src/styles/components/explore', cssFile);
  const registryPath = join(repoRoot, 'src/explore/interactiveRegistry.ts');
  const stagePath = join(repoRoot, 'src/components/explore/ExploreInteractiveStage.tsx');

  assertNewFiles([contentPath, componentPath, cssPath]);

  const registrySource = readFileSync(registryPath, 'utf8');
  const stageSource = readFileSync(stagePath, 'utf8');
  const nextRegistry = addExploreSlug(registrySource, slug);
  const nextStage = addStageRoot(stageSource, { slug, componentName });

  const writes = [
    [contentPath, contentTemplate({ slug, title, description, category: options.category, date: options.date })],
    [componentPath, componentTemplate({ componentName, cssFile, cssClass, title })],
    [cssPath, cssTemplate({ cssClass })],
    [registryPath, nextRegistry],
    [stagePath, nextStage],
  ];

  if (options.dryRun) {
    console.log(`Dry run: Explore scaffold for ${slug}`);
    for (const [path] of writes) {
      console.log(`- ${path}`);
    }
    console.log('\nNo files were changed.');
    return;
  }

  for (const [path, body] of writes) {
    writeFileSync(path, body);
  }

  console.log(`Created Explore scaffold for ${slug}.`);
  if (!options.skipValidate) {
    runRegistryValidation();
  }
  console.log('');
  console.log('Next validation:');
  console.log('  npm run build');
  console.log(`  npm run dev, then open /explore/${slug}/ after setting draft: false`);
  console.log('');
  console.log('Browser checks: one Explore stage mounts, sidebar text is visible, no console errors, and the page has no mobile overflow.');
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
