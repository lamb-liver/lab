#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const playwrightBin = resolve(repoRoot, 'node_modules/@playwright/test/cli.js');
const registryPath = resolve(repoRoot, 'src/works/interactiveSlugs.ts');

function usage() {
  return [
    'Usage:',
    '  npm run audit:work-controls                    # 掃全部 works（僅已發布）',
    '  npm run audit:work-controls -- <slug>[,<slug>] # 只掃指定頁',
    '',
    '比對每篇 works 的 ## 互動說明 粗體標籤是否都能在頁面上找到對應控制項，',
    '擋住「文案描述了介面上不存在的控制項」這類漂移。',
  ].join('\n');
}

function readSlugs() {
  const source = readFileSync(registryPath, 'utf8');
  const match = source.match(
    /export\s+const\s+workInteractiveSlugs\s*=\s*\[([\s\S]*?)\]\s+as\s+const/,
  );
  if (!match) throw new Error(`Cannot read workInteractiveSlugs from ${registryPath}`);
  return [...match[1].matchAll(/'([^']+)'/g)].map((item) => item[1]).sort();
}

/** draft 的 content 描述的是「打算做成什麼」，模組還是佔位幾何，不納入比對 */
function readPublishedSlugs() {
  const dir = resolve(repoRoot, 'src/content/works');
  return readdirSync(dir)
    .filter((name) => name.endsWith('.md') || name.endsWith('.mdx'))
    .filter((name) => !/^draft:\s*true\s*$/m.test(readFileSync(resolve(dir, name), 'utf8')))
    .map((name) => name.replace(/\.mdx?$/, ''));
}

function main() {
  const [arg, ...playwrightArgs] = process.argv.slice(2);
  if (arg === '--help' || arg === '-h') {
    console.log(usage());
    return;
  }
  if (!existsSync(playwrightBin)) {
    throw new Error('Missing local Playwright binary. Run npm install first.');
  }

  const known = readSlugs();
  const requested = arg ? arg.split(',').map((value) => value.trim()).filter(Boolean) : [];
  for (const slug of requested) {
    if (!known.includes(slug)) {
      throw new Error(`Unknown works slug: ${slug}\nKnown slugs: ${known.join(', ')}`);
    }
  }

  const published = new Set(readPublishedSlugs());
  const target = (requested.length ? requested : known).filter((slug) => published.has(slug));
  if (target.length === 0) {
    console.log('No published works to check (requested slugs are draft-only).');
    return;
  }
  console.log(`Checking works control labels for ${target.length} page(s)`);

  const result = spawnSync(
    process.execPath,
    [playwrightBin, 'test', 'tests/work-controls.spec.ts', ...playwrightArgs],
    {
      cwd: repoRoot,
      env: {
        ...process.env,
        ...(requested.length ? { WORK_CONTROLS_SLUGS: target.join(',') } : {}),
      },
      stdio: 'inherit',
    },
  );

  if (result.status === null) {
    throw new Error(result.error?.message ?? 'Failed to run tests/work-controls.spec.ts');
  }
  process.exitCode = result.status;
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = process.exitCode || 1;
}
