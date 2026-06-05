#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const interactionHints = ['button', 'input', 'select', 'none'];

function usage() {
  return [
    'Usage:',
    '  npm run scaffold:work -- <slug> [--title <title>] [--description <text>] [--tags <tag,tag>] [--date YYYY-MM-DD] [--hint input|button|select|none] [--dry-run] [--skip-validate]',
    '',
    'Example:',
    '  npm run scaffold:work -- eigenvector-flow --title 特徵向量流 --tags 線性代數,向量 --hint input',
    '',
    'Creates:',
    '  src/content/works/<slug>.md',
    '  src/curve/modules/<slug>/index.ts',
    '  src/systems/rendering/<camelSlug>Render.ts',
    '  src/components/curve/use<PascalSlug>P5.ts',
    '  src/components/works/<PascalSlug>CurveRoot.tsx',
    '',
    'Updates:',
    '  src/curve/registry.ts',
    '  src/works/interactiveRegistry.ts',
    '  src/components/works/WorkInteractiveStage.tsx',
  ].join('\n');
}

function parseArgs(argv) {
  const options = {
    title: null,
    description: null,
    tags: ['待分類'],
    date: new Date().toISOString().slice(0, 10),
    hint: 'input',
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
      if (!['title', 'description', 'tags', 'date', 'hint'].includes(key)) {
        throw new Error(`Unknown option: ${arg}`);
      }
      const value = argv[i + 1];
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for ${arg}`);
      }
      if (key === 'tags') {
        options.tags = value
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean);
      } else {
        options[key] = value;
      }
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

function toCamelCase(slug) {
  const pascal = toPascalCase(slug);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
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
  if (!/^\d{4}-\d{2}-\d{2}$/.test(options.date)) {
    throw new Error('Date must use YYYY-MM-DD.');
  }
  if (!interactionHints.includes(options.hint)) {
    throw new Error(`Interaction hint must be one of: ${interactionHints.join(', ')}`);
  }
  if (options.tags.length === 0) {
    throw new Error('At least one tag is required.');
  }
}

function contentTemplate({ title, description, tags, date }) {
  const tagLines = tags.map((tag) => `  - ${tag}`).join('\n');
  return `---
title: ${title}
description: ${description}
tags:
${tagLines}
date: ${date}
featured: false
draft: true
---

## 參數方程

補上這件作品的核心公式、幾何語意與參數範圍。

$$
y=f(t)
$$

## 互動說明

- **參數調整**：描述滑桿如何改變主曲線或結構。
- **觀察重點**：描述 stats 與畫面如何對應。

## 相關作品

- [待補作品](/works/example-slug)

## 延伸閱讀

- [待補資料](https://example.com)
`;
}

function moduleTemplate({ slug, camelName, pascalName, title }) {
  return `import { lissajousRenderPreset } from '../../../systems/rendering/presets';
import { defaultsFromSchema } from '../../defaults';
import type {
  CurveMetadata,
  CurveModule,
  CurvePoint,
  ParamSchema,
  ParamValues,
  SampleOptions,
} from '../../types';

const paramSchema: ParamSchema = [
  { key: 'amplitude', label: '振幅', min: 0.4, max: 1.4, step: 0.01, default: 0.8 },
  { key: 'frequency', label: '頻率', min: 1, max: 5, step: 1, default: 2 },
  { key: 'phase', label: '相位', min: 0, max: 6.28, step: 0.01, default: 0 },
];

const defaultParams: ParamValues = defaultsFromSchema(paramSchema);

function value(params: ParamValues, key: string, fallback: number): number {
  const raw = params[key];
  return typeof raw === 'number' && Number.isFinite(raw) ? raw : fallback;
}

export function build${pascalName}Points(
  params: ParamValues,
  options: SampleOptions = { step: 1 },
): CurvePoint[] {
  const amplitude = value(params, 'amplitude', defaultParams.amplitude);
  const frequency = Math.max(1, Math.round(value(params, 'frequency', defaultParams.frequency)));
  const phase = value(params, 'phase', defaultParams.phase);
  const total = Math.max(120, Math.round(260 / Math.max(options.step, 0.5)));
  const revealCount =
    typeof options.revealProgress === 'number'
      ? Math.max(2, Math.floor(total * Math.max(0, Math.min(1, options.revealProgress))))
      : total;
  const points: CurvePoint[] = [];
  let arcLength = 0;

  for (let i = 0; i <= revealCount; i += 1) {
    const t = (i / total) * Math.PI * 2;
    const x = (t / Math.PI - 1) * 190;
    const y = -Math.sin(t * frequency + phase) * amplitude * 105;
    const prev = points[points.length - 1];
    if (prev) {
      arcLength += Math.hypot(x - prev.x, y - prev.y);
    }
    points.push({ x, y, theta: t, arcLength });
  }

  return points;
}

export const ${camelName}Module: CurveModule = {
  id: '${slug}',
  paramSchema,
  defaultParams,
  sample: (params, options) => build${pascalName}Points(params, options),
  getMetadata: (params, runtime): CurveMetadata => {
    const amplitude = value(params, 'amplitude', defaultParams.amplitude);
    const frequency = Math.round(value(params, 'frequency', defaultParams.frequency));
    const phase = value(params, 'phase', defaultParams.phase);

    return {
      title: '${title}',
      formula: 'y = A sin(ft + φ)',
      stats: [
        { key: 'amplitude', label: 'A', value: amplitude.toFixed(2) },
        { key: 'frequency', label: 'f', value: frequency },
        { key: 'phase', label: 'φ', value: phase.toFixed(2) },
        { key: 'reveal', label: 'reveal', value: runtime ? \`\${runtime.revealPct}%\` : '—' },
      ],
    };
  },
  renderPreset: lissajousRenderPreset,
  cacheStrategy: { kind: 'none' },
  sampleStep: 1,
  animation: { lerp: 0.035, revealSpeed: 0.018 },
};
`;
}

function rendererTemplate({ camelName, pascalName }) {
  return `import type p5 from 'p5';
import { ${camelName}Module } from '../../curve/modules/${camelToSlug(camelName)}';
import type { CurvePoint, ParamValues } from '../../curve/types';
import { renderFrame } from './frame';

export type ${pascalName}Snap = {
  width: number;
  height: number;
  params: ParamValues;
  revealProgress: number;
};

export function render${pascalName}Scene(p: p5, snap: ${pascalName}Snap): void {
  const points = ${camelName}Module.sample(snap.params, {
    step: ${camelName}Module.sampleStep ?? 1,
  }) as CurvePoint[];

  renderFrame(
    p,
    {
      width: snap.width,
      height: snap.height,
      params: snap.params,
      revealProgress: snap.revealProgress,
      points,
    },
    ${camelName}Module.renderPreset,
  );
}
`;
}

function hookTemplate({ camelName, pascalName }) {
  return `import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import type { ParamValues } from '../../curve/types';
import { render${pascalName}Scene } from '../../systems/rendering/${camelName}Render';
import { useP5CanvasHost } from './useP5CanvasHost';

type Options = {
  defaultParams: ParamValues;
  targetParams: ParamValues;
  onRevealPctChange: (pct: number) => void;
};

function paramsKey(params: ParamValues): string {
  return [params.amplitude, params.frequency, params.phase].join('|');
}

function revealStep(p: p5): number {
  const frameScale = Math.max(0, Math.min(3, (p.deltaTime || 1000 / 60) / (1000 / 60)));
  return 0.018 * frameScale;
}

export function use${pascalName}P5({
  defaultParams,
  targetParams,
  onRevealPctChange,
}: Options) {
  const targetParamsRef = useRef<ParamValues>(defaultParams);
  const revealRef = useRef(1);
  const lastKeyRef = useRef(paramsKey(defaultParams));
  const lastRevealPctRef = useRef(-1);
  const onRevealPctChangeRef = useRef(onRevealPctChange);

  useEffect(() => {
    targetParamsRef.current = targetParams;
  }, [targetParams]);

  useEffect(() => {
    onRevealPctChangeRef.current = onRevealPctChange;
  }, [onRevealPctChange]);

  const draw = useCallback((p: p5) => {
    const params = targetParamsRef.current;
    const key = paramsKey(params);
    if (key !== lastKeyRef.current) {
      lastKeyRef.current = key;
      revealRef.current = 0;
    }

    revealRef.current = Math.min(1, revealRef.current + revealStep(p));
    const pct = Math.floor(revealRef.current * 100);
    if (pct !== lastRevealPctRef.current) {
      lastRevealPctRef.current = pct;
      onRevealPctChangeRef.current(pct);
    }

    render${pascalName}Scene(p, {
      width: p.width,
      height: p.height,
      params,
      revealProgress: revealRef.current,
    });
  }, []);

  const canvasHostRef = useP5CanvasHost(draw, [draw]);

  return { canvasHostRef };
}
`;
}

function rootTemplate({ slug, camelName, pascalName, title }) {
  return `import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ${camelName}Module } from '../../curve/modules/${slug}';
import type { ParamValues } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import StatsPanel from '../curve/StatsPanel';
import { use${pascalName}P5 } from '../curve/use${pascalName}P5';
import '../../styles/components/works/curve-work-demo.css';

type Props = { controlsMountId?: string };

export default function ${pascalName}CurveRoot({
  controlsMountId = '${slug}-controls',
}: Props) {
  const module = ${camelName}Module;
  const [targetParams, setTargetParams] = useState<ParamValues>(module.defaultParams);
  const [revealPct, setRevealPct] = useState(0);
  const [controlsMount, setControlsMount] = useState<HTMLElement | null>(null);

  const onRevealPctChange = useCallback((pct: number) => setRevealPct(pct), []);
  const { canvasHostRef } = use${pascalName}P5({
    defaultParams: module.defaultParams,
    targetParams,
    onRevealPctChange,
  });

  useEffect(() => {
    setControlsMount(document.getElementById(controlsMountId));
  }, [controlsMountId]);

  const metadata = module.getMetadata(targetParams, {
    revealPct,
    smoothParams: targetParams,
  });

  const controls = controlsMount
    ? createPortal(
        <div className="curve-work-controls">
          <div className="curve-work-controls__meta">
            <p className="curve-work-controls__title">{metadata.title}</p>
            <p className="curve-work-controls__formula">{metadata.formula}</p>
          </div>

          <ParamControls
            module={module}
            values={targetParams}
            onChange={(key, value) => setTargetParams((prev) => ({ ...prev, [key]: value }))}
          />

          <StatsPanel metadata={metadata} />
        </div>,
        controlsMount,
      )
    : null;

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label="${title}互動視覺化"
      />
      {controls}
    </>
  );
}
`;
}

function camelToSlug(camelName) {
  return camelName.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
}

function addWorkCurveRegistry(source, { slug, camelName }) {
  if (source.includes(`./modules/${slug}`) || source.includes(`'${slug}':`)) {
    throw new Error(`Curve registry entry already exists for ${slug}.`);
  }

  const importLine = `import { ${camelName}Module } from './modules/${slug}';`;
  const lines = source.split('\n');
  const lastImport = lines.reduce((last, line, index) => {
    return /^import \{ \w+Module \} from '\.\/modules\/[-a-z0-9]+';$/.test(line) ? index : last;
  }, -1);
  if (lastImport < 0) {
    throw new Error('Could not find work curve registry import block.');
  }
  lines.splice(lastImport + 1, 0, importLine);

  const withImport = lines.join('\n');
  const marker = '};';
  const objectEnd = withImport.lastIndexOf(marker);
  if (objectEnd < 0) {
    throw new Error('Could not find workCurveBySlug closing marker.');
  }
  return `${withImport.slice(0, objectEnd)}  '${slug}': ${camelName}Module,\n${withImport.slice(objectEnd)}`;
}

function addWorkInteractiveRegistry(source, { slug, hint }) {
  if (source.includes(`'${slug}'`)) {
    throw new Error(`Work interactive registry entry already exists for ${slug}.`);
  }

  const slugMarker = '\n] as const;';
  if (!source.includes(slugMarker)) {
    throw new Error('Could not find workInteractiveSlugs closing marker.');
  }
  const withSlug = source.replace(slugMarker, `\n  '${slug}',${slugMarker}`);

  const hintMarker = '} satisfies Record<WorkInteractiveSlug, WorkInteractionHint>;';
  if (!withSlug.includes(hintMarker)) {
    throw new Error('Could not find workInteractionHints closing marker.');
  }
  return withSlug.replace(hintMarker, `  '${slug}': '${hint}',\n${hintMarker}`);
}

function addWorkStageRoot(source, { slug, pascalName }) {
  const componentName = `${pascalName}CurveRoot`;
  if (source.includes(`./${componentName}`) || source.includes(`'${slug}':`)) {
    throw new Error(`Work stage registration already exists for ${slug}.`);
  }

  const importLine = `import ${componentName} from './${componentName}';`;
  const lines = source.split('\n');
  const lastRootImport = lines.reduce((last, line, index) => {
    return /^import \w+CurveRoot from '\.\/\w+CurveRoot';$/.test(line) ? index : last;
  }, -1);
  if (lastRootImport < 0) {
    throw new Error('Could not find Work root import block.');
  }
  lines.splice(lastRootImport + 1, 0, importLine);
  const withImport = lines.join('\n');

  const marker = '} satisfies Record<WorkInteractiveSlug, ComponentType<RootProps>>;';
  if (!withImport.includes(marker)) {
    throw new Error('Could not find Work rootBySlug closing marker.');
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
  const description = options.description ?? `${title} 的互動作品草稿；請改寫成作品的核心幾何語意。`;
  const pascalName = toPascalCase(slug);
  const camelName = toCamelCase(slug);

  const contentPath = join(repoRoot, 'src/content/works', `${slug}.md`);
  const moduleDir = join(repoRoot, 'src/curve/modules', slug);
  const modulePath = join(moduleDir, 'index.ts');
  const renderPath = join(repoRoot, 'src/systems/rendering', `${camelName}Render.ts`);
  const hookPath = join(repoRoot, 'src/components/curve', `use${pascalName}P5.ts`);
  const rootPath = join(repoRoot, 'src/components/works', `${pascalName}CurveRoot.tsx`);
  const curveRegistryPath = join(repoRoot, 'src/curve/registry.ts');
  const interactiveRegistryPath = join(repoRoot, 'src/works/interactiveRegistry.ts');
  const stagePath = join(repoRoot, 'src/components/works/WorkInteractiveStage.tsx');

  assertNewFiles([contentPath, modulePath, renderPath, hookPath, rootPath]);

  const curveRegistrySource = readFileSync(curveRegistryPath, 'utf8');
  const interactiveRegistrySource = readFileSync(interactiveRegistryPath, 'utf8');
  const stageSource = readFileSync(stagePath, 'utf8');

  const nextCurveRegistry = addWorkCurveRegistry(curveRegistrySource, { slug, camelName });
  const nextInteractiveRegistry = addWorkInteractiveRegistry(interactiveRegistrySource, {
    slug,
    hint: options.hint,
  });
  const nextStage = addWorkStageRoot(stageSource, { slug, pascalName });

  const writes = [
    [contentPath, contentTemplate({ title, description, tags: options.tags, date: options.date })],
    [modulePath, moduleTemplate({ slug, camelName, pascalName, title })],
    [renderPath, rendererTemplate({ camelName, pascalName })],
    [hookPath, hookTemplate({ camelName, pascalName })],
    [rootPath, rootTemplate({ slug, camelName, pascalName, title })],
    [curveRegistryPath, nextCurveRegistry],
    [interactiveRegistryPath, nextInteractiveRegistry],
    [stagePath, nextStage],
  ];

  if (options.dryRun) {
    console.log(`Dry run: Work scaffold for ${slug}`);
    for (const [path] of writes) {
      console.log(`- ${path}`);
    }
    console.log('\nNo files were changed.');
    return;
  }

  mkdirSync(moduleDir, { recursive: true });
  for (const [path, body] of writes) {
    writeFileSync(path, body);
  }

  console.log(`Created Work scaffold for ${slug}.`);
  if (!options.skipValidate) {
    runRegistryValidation();
  }
  console.log('');
  console.log('Next validation:');
  console.log('  npm run build');
  console.log(`  npm run dev, then open /works/${slug}/ after setting draft: false`);
  console.log('');
  console.log('Browser checks: one work canvas mounts, controls portal appears, stats are non-empty, and no console errors are logged.');
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
