#!/usr/bin/env node
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { EXAM_SUBJECTS } from './audit-content.mjs';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const QUESTION_TYPES = ['單選', '多選', '選填', '非選'];

function usage() {
  return [
    'Usage:',
    '  npm run new:exam -- <slug> --year <112> --subject <學測數A> --type <多選> --no <11> \\',
    '    [--title <title>] [--description <text>] [--unit <unit>] [--date YYYY-MM-DD] [--dry-run]',
    '',
    `  --subject  one of: ${EXAM_SUBJECTS.join(', ')}`,
    `  --type     one of: ${QUESTION_TYPES.join(', ')}`,
    '',
    'Creates a draft-only Exam content skeleton and does not update registries.',
    'Draft Exam entries are available in dev and stay out of production until the release Gate passes.',
  ].join('\n');
}

export function parseNewExamArgs(argv) {
  const options = {
    title: null,
    description: null,
    year: null,
    subject: '學測數A',
    type: '多選',
    no: null,
    unit: null,
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
      if (!['title', 'description', 'year', 'subject', 'type', 'no', 'unit', 'date'].includes(key)) {
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

export function buildNewExamFiles(
  { slug, title, description, year, subject, type, no, unit, date },
  root = repoRoot,
) {
  assertValidSlug(slug);
  assertValidDate(date);
  if (!EXAM_SUBJECTS.includes(subject)) {
    throw new Error(`Subject must be one of: ${EXAM_SUBJECTS.join(', ')}`);
  }
  if (!QUESTION_TYPES.includes(type)) {
    throw new Error(`Question type must be one of: ${QUESTION_TYPES.join(', ')}`);
  }
  if (!year || !/^\d{3}$/.test(String(year))) {
    throw new Error('Year must be a 3-digit ROC year, e.g. 112.');
  }
  if (!no) throw new Error('Question number is required, e.g. --no 11.');

  const finalTitle = title || titleFromSlug(slug);
  const finalDescription = description || `${year} ${subject} ${type} ${no} 的試題視覺化草稿。`;

  return [
    {
      relativePath: `src/content/exam/${slug}.md`,
      absolutePath: resolve(root, 'src/content/exam', `${slug}.md`),
      content: examContentTemplate({
        title: finalTitle,
        description: finalDescription,
        year,
        subject,
        type,
        no,
        unit: unit || '待填單元',
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
    '1. Fill sourceUrl with the CEEC original paper, and analysisUrl if an accuracy-rate source exists.',
    '2. Rewrite the question in your own words. Do not paste the original text or options.',
    '3. Link relatedExplore / relatedWorks to published slugs.',
    '4. Add the interactive: src/exam/, src/components/exam/, and the stage registry.',
    `5. Add scripts/exam-covers/${slug}.svg, run npm run covers:exam, then set coverImage.`,
    '6. Set the true publish date and a positive order before publishing.',
    '7. Complete the Exam release Gate in docs/exam-visualization-plan.md.',
    '8. Preview with npm run dev, then open /exam.',
    '',
    `Exam content: src/content/exam/${slug}.md`,
  ].join('\n');
}

function examContentTemplate({ title, description, year, subject, type, no, unit, date }) {
  return `---
title: ${title}
description: ${description}
subject: ${subject}
year: ${year}
questionType: ${type}
questionNo: '${no}'
unit: ${unit}
concepts:
  - 待填觀念
sourceUrl:
analysisUrl:
relatedExplore: []
relatedWorks: []
date: ${date}
order: 0
featured: false
draft: true
---

## 題意

待補：用自己的話改寫題目設定，不要整段轉載原題與選項。

完整題目與選項見大考中心原卷（填入 sourceUrl 後在此連結）。

## 為什麼會錯

待補：這題的答對率或誘答選項分布說明了什麼，考生卡在哪一個心智步驟。

## 觀念

待補：寫出核心公式與判準。

## 互動怎麼看

待補：讀者該先動哪個控制項，觀察什麼變化，什麼時候結果會分岔。
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
  const { help, slug, options } = parseNewExamArgs(process.argv.slice(2));
  if (help) {
    console.log(usage());
    return;
  }

  const files = buildNewExamFiles({ slug, ...options });
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
