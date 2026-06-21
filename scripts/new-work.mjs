#!/usr/bin/env node
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function usage() {
  return [
    'Usage:',
    '  npm run new:work -- <slug> [--title <title>] [--description <text>] [--date YYYY-MM-DD] [--tags tag,tag] [--dry-run]',
    '',
    'Creates a draft-only Works skeleton and does not update registries.',
  ].join('\n');
}

export function parseNewWorkArgs(argv) {
  const options = {
    title: null,
    description: null,
    date: new Date().toISOString().slice(0, 10),
    tags: ['待分類'],
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
      if (!['title', 'description', 'date', 'tags'].includes(key)) {
        throw new Error(`Unknown option: ${arg}`);
      }
      const value = argv[i + 1];
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for ${arg}`);
      }
      if (key === 'tags') {
        options.tags = value.split(',').map((tag) => tag.trim()).filter(Boolean);
      } else {
        options[key] = value;
      }
      i += 1;
      continue;
    }
    if (slug) throw new Error(`Unexpected positional argument: ${arg}`);
    slug = arg;
  }

  return { help: false, slug, options };
}

export function buildNewWorkFiles({ slug, title, description, date, tags }, root = repoRoot) {
  assertValidSlug(slug);
  assertValidDate(date);
  if (!Array.isArray(tags) || tags.length === 0) {
    throw new Error('At least one tag is required.');
  }

  const finalTitle = title || titleFromSlug(slug);
  const finalDescription = description || `${finalTitle} 的互動視覺化草稿。`;

  return [
    {
      relativePath: `src/content/works/${slug}.md`,
      absolutePath: resolve(root, 'src/content/works', `${slug}.md`),
      content: workContentTemplate({
        title: finalTitle,
        description: finalDescription,
        date,
        tags,
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
    '1. Create an interactive component and add it to the registry if needed.',
    '2. Replace draft placeholder copy before publishing.',
    '3. Set a positive order before publishing.',
    '4. Run npm run audit:content.',
    '5. Run npm run build.',
    '',
    `Work content: src/content/works/${slug}.md`,
  ].join('\n');
}

function workContentTemplate({ title, description, date, tags }) {
  const tagLines = tags.map((tag) => `  - ${tag}`).join('\n');
  return `---
title: ${title}
description: ${description}
tags:
${tagLines}
date: ${date}
order: 0
featured: false
draft: true
---

## 參數方程

待補：寫出這件作品的核心公式、幾何語意與參數範圍。

$$
y=f(t)
$$

## 互動說明

- **參數調整**：待補主要控制如何改變圖形。
- **觀察畫面**：待補讀者應先看見的變化。

## 觀察重點

- 待補一個能從畫面驗證的數學關係。

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
  const { help, slug, options } = parseNewWorkArgs(process.argv.slice(2));
  if (help) {
    console.log(usage());
    return;
  }

  const files = buildNewWorkFiles({ slug, ...options });
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
