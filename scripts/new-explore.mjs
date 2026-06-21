#!/usr/bin/env node
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { EXPLORE_CATEGORIES } from './audit-content.mjs';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function usage() {
  return [
    'Usage:',
    '  npm run new:explore -- <slug> [--title <title>] [--description <text>] [--category <category>] [--date YYYY-MM-DD] [--dry-run]',
    '',
    'Creates a draft-only Explore content skeleton and does not update registries.',
  ].join('\n');
}

export function parseNewExploreArgs(argv) {
  const options = {
    title: null,
    description: null,
    category: '分析',
    date: new Date().toISOString().slice(0, 10),
    dryRun: false,
  };
  let slug = null;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') return { help: true, slug, options };
    if (arg === '--dry-run') {
      options.dryRun = true;
      continue;
    }
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      if (!['title', 'description', 'category', 'date'].includes(key)) {
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
    if (slug) throw new Error(`Unexpected positional argument: ${arg}`);
    slug = arg;
  }

  return { help: false, slug, options };
}

export function buildNewExploreFiles({ slug, title, description, category, date }, root = repoRoot) {
  assertValidSlug(slug);
  assertValidDate(date);
  if (!EXPLORE_CATEGORIES.includes(category)) {
    throw new Error(`Category must be one of: ${EXPLORE_CATEGORIES.join(', ')}`);
  }

  const finalTitle = title || titleFromSlug(slug);
  const finalDescription = description || `${finalTitle} 的互動導覽草稿。`;

  return [
    {
      relativePath: `src/content/explore/${slug}.md`,
      absolutePath: resolve(root, 'src/content/explore', `${slug}.md`),
      content: exploreContentTemplate({
        title: finalTitle,
        description: finalDescription,
        category,
        date,
      }),
    },
  ];
}

export function assertCreatableFiles(files) {
  for (const file of files) {
    if (existsSync(file.absolutePath)) {
      throw new Error(`Refusing to overwrite existing file: ${file.relativePath}`);
    }
  }
}

export function writeGeneratedFiles(files) {
  assertCreatableFiles(files);
  for (const file of files) {
    mkdirSync(dirname(file.absolutePath), { recursive: true });
    writeFileSync(file.absolutePath, file.content, 'utf8');
  }
}

export function nextSteps(slug) {
  return [
    '',
    'Created draft content.',
    '',
    'Next steps:',
    '1. Add interactive component to registry if needed.',
    `2. Add cover image before publishing: public/images/explore-covers/${slug}.png`,
    `3. Add cover source if using generated covers: scripts/explore-covers/${slug}.svg`,
    '4. Set a positive order before publishing.',
    '5. Run npm run audit:content.',
    '6. Run npm run build.',
    '',
    `Explore content: src/content/explore/${slug}.md`,
  ].join('\n');
}

function exploreContentTemplate({ title, description, category, date }) {
  return `---
title: ${title}
description: ${description}
category: ${category}
date: ${date}
order: 0
featured: false
draft: true
---

## 基本概念

待補：寫出這個主題要回答的中心問題，以及它和單件 Works 的差異。

## 互動說明

- **導覽**：待補預設畫面保留哪些控制，以及讀者應先觀察什麼。
- **對照**：待補模式切換、參數映射與 stats 文字。

## 觀察重點

- 待補一個跨越至少兩個表徵的觀察。
- 待補一個參數改變後可被畫面或 stats 驗證的現象。

## 相關作品

- [待補作品](/works/example-slug)

## 延伸閱讀

- [待補資料](https://example.com)
`;
}

function assertValidSlug(slug) {
  if (!slug) throw new Error(`Missing slug.\n\n${usage()}`);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error('Slug must be kebab-case with lowercase letters, numbers, and single hyphens.');
  }
}

function assertValidDate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error('Date must use YYYY-MM-DD.');
  }
}

function titleFromSlug(slug) {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function main() {
  const { help, slug, options } = parseNewExploreArgs(process.argv.slice(2));
  if (help) {
    console.log(usage());
    return;
  }

  const files = buildNewExploreFiles({ slug, ...options });
  if (options.dryRun) {
    console.log(files.map((file) => file.relativePath).join('\n'));
    console.log(nextSteps(slug));
    return;
  }

  writeGeneratedFiles(files);
  console.log(files.map((file) => `Created ${file.relativePath}`).join('\n'));
  console.log(nextSteps(slug));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
