#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function usage() {
  return [
    'Usage:',
    '  npm run new:work -- <slug> [--title <title>] [--description <text>] [--date YYYY-MM-DD] [--tags tag,tag] [--interactive] [--dry-run]',
    '',
    'Creates a draft-only Works skeleton. With --interactive it also scaffolds a',
    'curve module and Root component and wires all three registries',
    '(interactiveSlugs, workCurveBySlug, WorkInteractiveStage).',
  ].join('\n');
}

export function parseNewWorkArgs(argv) {
  const options = {
    title: null,
    description: null,
    date: new Date().toISOString().slice(0, 10),
    tags: ['待分類'],
    interactive: false,
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
    if (arg === '--interactive') {
      options.interactive = true;
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

export function buildNewWorkFiles(
  { slug, title, description, date, tags, interactive = false },
  root = repoRoot,
) {
  assertValidSlug(slug);
  assertValidDate(date);
  if (!Array.isArray(tags) || tags.length === 0) {
    throw new Error('At least one tag is required.');
  }

  const finalTitle = title || titleFromSlug(slug);
  const finalDescription = description || `${finalTitle} 的互動視覺化草稿。`;

  const files = [
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

  if (interactive) {
    const camel = camelFromSlug(slug);
    const pascal = pascalFromSlug(slug);
    files.push(
      {
        relativePath: `src/curve/modules/${slug}/index.ts`,
        absolutePath: resolve(root, 'src/curve/modules', slug, 'index.ts'),
        content: curveModuleTemplate({ slug, camel, title: finalTitle }),
      },
      {
        relativePath: `src/components/works/${pascal}CurveRoot.tsx`,
        absolutePath: resolve(root, 'src/components/works', `${pascal}CurveRoot.tsx`),
        content: curveRootTemplate({ slug, camel, pascal, title: finalTitle }),
      },
    );
  }

  return files;
}

// Anchored inserts that keep the three work registries synchronized
// (see docs/editing-rules.md "Registry Changes").
export function buildRegistryInsertions(slug, root = repoRoot) {
  const camel = camelFromSlug(slug);
  const pascal = pascalFromSlug(slug);

  return [
    {
      relativePath: 'src/works/interactiveSlugs.ts',
      absolutePath: resolve(root, 'src/works/interactiveSlugs.ts'),
      describe: `add '${slug}' to workInteractiveSlugs`,
      apply: (source) =>
        replaceOnce(source, '\n] as const;', `\n  '${slug}',\n] as const;`),
    },
    {
      relativePath: 'src/curve/registry.ts',
      absolutePath: resolve(root, 'src/curve/registry.ts'),
      describe: `import ${camel}Module and add workCurveBySlug entry`,
      apply: (source) => {
        const imports = [...source.matchAll(/^import \{ \w+ \} from '\.\/modules\/[^']+';$/gm)];
        if (imports.length === 0) throw new Error('Cannot find module imports in curve/registry.ts');
        const lastImport = imports[imports.length - 1];
        const withImport =
          source.slice(0, lastImport.index + lastImport[0].length) +
          `\nimport { ${camel}Module } from './modules/${slug}';` +
          source.slice(lastImport.index + lastImport[0].length);
        return replaceOnce(withImport, '\n};', `\n  '${slug}': ${camel}Module,\n};`);
      },
    },
    {
      relativePath: 'src/components/works/WorkInteractiveStage.tsx',
      absolutePath: resolve(root, 'src/components/works/WorkInteractiveStage.tsx'),
      describe: `add lazy rootBySlug entry for '${slug}'`,
      apply: (source) =>
        replaceOnce(
          source,
          '\n} satisfies Record<WorkInteractiveSlug,',
          `\n  '${slug}': lazy(() => import('./${pascal}CurveRoot')),\n} satisfies Record<WorkInteractiveSlug,`,
        ),
    },
  ];
}

function replaceOnce(source, anchor, replacement) {
  const index = source.indexOf(anchor);
  if (index === -1) throw new Error(`Registry anchor not found: ${JSON.stringify(anchor)}`);
  return source.slice(0, index) + replacement + source.slice(index + anchor.length);
}

export function assertRegistrable(slug, root = repoRoot) {
  for (const insertion of buildRegistryInsertions(slug, root)) {
    const source = readFileSync(insertion.absolutePath, 'utf8');
    if (source.includes(`'${slug}'`)) {
      throw new Error(`Slug already registered in ${insertion.relativePath}: ${slug}`);
    }
  }
}

export function applyRegistryInsertions(slug, root = repoRoot) {
  const insertions = buildRegistryInsertions(slug, root);
  for (const insertion of insertions) {
    const source = readFileSync(insertion.absolutePath, 'utf8');
    writeFileSync(insertion.absolutePath, insertion.apply(source), 'utf8');
  }
  return insertions;
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

export function nextSteps(slug, interactive = false) {
  if (interactive) {
    return [
      '',
      'Created draft content, curve module, Root component, and registry entries.',
      '',
      'Next steps:',
      `1. Replace the placeholder geometry in src/curve/modules/${slug}/index.ts.`,
      '2. Replace draft placeholder copy before publishing.',
      '3. Set a positive order before publishing.',
      '4. Run npm run validate:changed.',
      `5. Run npm run smoke:work -- ${slug}.`,
      '',
      `Work content: src/content/works/${slug}.md`,
    ].join('\n');
  }
  return [
    '',
    'Created draft content.',
    '',
    'Next steps:',
    '1. Create an interactive component and add it to the registry if needed (or rerun with --interactive).',
    '2. Replace draft placeholder copy before publishing.',
    '3. Set a positive order before publishing.',
    '4. Run npm run audit:content.',
    '5. Run npm run build.',
    '',
    `Work content: src/content/works/${slug}.md`,
  ].join('\n');
}

function curveModuleTemplate({ slug, camel, title }) {
  return `import { defaultsFromSchema } from '../../defaults';
import { BASE_POINT_STEP } from '../../constants';
import type { CurveModule, CurvePoint, ParamSchema, ParamValues, ThumbnailSpec } from '../../types';

const RADIUS = 200;

const paramSchema: ParamSchema = [
  { key: 'n', label: '待命名參數 n', min: 1, max: 8, step: 1, default: 3 },
];

function sampleCurve(params: ParamValues, step: number): CurvePoint[] {
  const n = Math.round(params.n);
  if (n <= 0 || step <= 0) return [];

  const points: CurvePoint[] = [];
  let cumulative = 0;
  let prevX = 0;
  let prevY = 0;

  for (let theta = 0; theta <= 2 * Math.PI; theta += step) {
    // 待替換：佔位幾何 r = R·(0.6 + 0.4·cos(nθ))
    const r = RADIUS * (0.6 + 0.4 * Math.cos(n * theta));
    const x = r * Math.cos(theta);
    const y = r * Math.sin(theta);

    if (points.length > 0) {
      cumulative += Math.hypot(x - prevX, y - prevY);
    }

    points.push({ x, y, theta, arcLength: cumulative });
    prevX = x;
    prevY = y;
  }

  return points;
}

export const ${camel}Module: CurveModule = {
  id: '${slug}',
  paramSchema,
  defaultParams: defaultsFromSchema(paramSchema),
  sample: (params, { step, purpose }) => {
    const points = sampleCurve(params, step);
    if (purpose === 'thumbnail') {
      const spec: ThumbnailSpec = {
        paths: [{ points, closed: true }],
      };
      return spec;
    }
    return points;
  },
  getMetadata: (params) => ({
    title: '${title}',
    formula: '待補公式',
    stats: [{ key: 'n', label: 'n', value: Math.round(params.n) }],
  }),
  sampleStep: BASE_POINT_STEP,
};
`;
}

function curveRootTemplate({ slug, camel, pascal, title }) {
  return `import CurveWorkRoot from '../curve/CurveWorkRoot';
import { ${camel}Module } from '../../curve/modules/${slug}';

type Props = {
  controlsMountId: string;
};

export default function ${pascal}CurveRoot({ controlsMountId }: Props) {
  return (
    <CurveWorkRoot
      module={${camel}Module}
      controlsMountId={controlsMountId}
      canvasAriaLabel="${title}動畫"
    />
  );
}
`;
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

function pascalFromSlug(slug) {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function camelFromSlug(slug) {
  const pascal = pascalFromSlug(slug);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function main() {
  const { help, slug, options } = parseNewWorkArgs(process.argv.slice(2));
  if (help) {
    console.log(usage());
    return;
  }

  const files = buildNewWorkFiles({ slug, ...options });
  const insertions = options.interactive ? buildRegistryInsertions(slug) : [];
  if (options.dryRun) {
    console.log(files.map((file) => file.relativePath).join('\n'));
    for (const insertion of insertions) {
      console.log(`${insertion.relativePath}: ${insertion.describe}`);
    }
    console.log(nextSteps(slug, options.interactive));
    return;
  }

  if (options.interactive) assertRegistrable(slug);
  writeGeneratedFiles(files);
  console.log(files.map((file) => `Created ${file.relativePath}`).join('\n'));
  if (options.interactive) {
    for (const insertion of applyRegistryInsertions(slug)) {
      console.log(`Updated ${insertion.relativePath}: ${insertion.describe}`);
    }
  }
  console.log(nextSteps(slug, options.interactive));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
