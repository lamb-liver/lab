#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const playwrightBin = resolve(repoRoot, 'node_modules/@playwright/test/cli.js');

const configs = {
  work: {
    envKey: 'SMOKE_WORK_SLUG',
    registryPath: resolve(repoRoot, 'src/works/interactiveRegistry.ts'),
    arrayName: 'workInteractiveSlugs',
    spec: 'tests/work-single.smoke.spec.ts',
    routePrefix: '/works',
  },
  explore: {
    envKey: 'SMOKE_EXPLORE_SLUG',
    registryPath: resolve(repoRoot, 'src/explore/interactiveRegistry.ts'),
    arrayName: 'exploreInteractiveSlugs',
    spec: 'tests/explore-single.smoke.spec.ts',
    routePrefix: '/explore',
  },
};

function usage() {
  return [
    'Usage:',
    '  npm run smoke:work -- <slug> [playwright args...]',
    '  npm run smoke:explore -- <slug> [playwright args...]',
    '',
    'Examples:',
    '  npm run smoke:work -- rose-curve',
    '  npm run smoke:explore -- vectors --headed',
  ].join('\n');
}

function readSlugArray(config) {
  const source = readFileSync(config.registryPath, 'utf8');
  const match = source.match(new RegExp(`export\\s+const\\s+${config.arrayName}\\s*=\\s*\\[([\\s\\S]*?)\\]\\s+as\\s+const`));
  if (!match) throw new Error(`Cannot read ${config.arrayName} from ${config.registryPath}`);
  return [...match[1].matchAll(/'([^']+)'/g)].map((item) => item[1]);
}

function main() {
  const [kind, slug, ...playwrightArgs] = process.argv.slice(2);
  if (!kind || kind === '--help' || kind === '-h') {
    console.log(usage());
    return;
  }

  const config = configs[kind];
  if (!config) throw new Error(`Unknown smoke kind: ${kind}\n\n${usage()}`);
  if (!slug) throw new Error(`Missing slug.\n\n${usage()}`);
  if (!existsSync(playwrightBin)) {
    throw new Error('Missing local Playwright binary. Run npm install first.');
  }

  const slugs = readSlugArray(config);
  if (!slugs.includes(slug)) {
    throw new Error(
      `Unknown ${kind} slug: ${slug}\nKnown slugs: ${slugs.join(', ')}`,
    );
  }

  console.log(`Running ${kind} smoke for ${config.routePrefix}/${slug}`);
  const result = spawnSync(
    process.execPath,
    [playwrightBin, 'test', config.spec, ...playwrightArgs],
    {
      cwd: repoRoot,
      env: {
        ...process.env,
        [config.envKey]: slug,
      },
      stdio: 'inherit',
    },
  );

  if (result.status === null) {
    throw new Error(result.error?.message ?? `Failed to run ${config.spec}`);
  }
  process.exitCode = result.status;
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = process.exitCode || 1;
}
