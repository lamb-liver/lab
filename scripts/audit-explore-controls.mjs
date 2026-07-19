#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const playwrightBin = resolve(repoRoot, 'node_modules/@playwright/test/cli.js');
const registryPath = resolve(repoRoot, 'src/explore/interactiveSlugs.ts');

function usage() {
  return [
    'Usage:',
    '  npm run audit:explore-controls                    # 掃全部 explore',
    '  npm run audit:explore-controls -- <slug>[,<slug>] # 只掃指定頁',
    '',
    '比對每篇 explore 的 ## 互動說明 粗體標籤是否都能在頁面上找到對應控制項，',
    '擋住「文案描述了介面上不存在的控制項」這類漂移。',
  ].join('\n');
}

function readSlugs() {
  const source = readFileSync(registryPath, 'utf8');
  const match = source.match(
    /export\s+const\s+exploreInteractiveSlugs\s*=\s*\[([\s\S]*?)\]\s+as\s+const/,
  );
  if (!match) throw new Error(`Cannot read exploreInteractiveSlugs from ${registryPath}`);
  return [...match[1].matchAll(/'([^']+)'/g)].map((item) => item[1]).sort();
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
      throw new Error(`Unknown explore slug: ${slug}\nKnown slugs: ${known.join(', ')}`);
    }
  }

  const target = requested.length ? requested : known;
  console.log(`Checking explore control labels for ${target.length} page(s)`);

  const result = spawnSync(
    process.execPath,
    [playwrightBin, 'test', 'tests/explore-controls.spec.ts', ...playwrightArgs],
    {
      cwd: repoRoot,
      env: {
        ...process.env,
        ...(requested.length ? { EXPLORE_CONTROLS_SLUGS: requested.join(',') } : {}),
      },
      stdio: 'inherit',
    },
  );

  if (result.status === null) {
    throw new Error(result.error?.message ?? 'Failed to run tests/explore-controls.spec.ts');
  }
  process.exitCode = result.status;
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = process.exitCode || 1;
}
