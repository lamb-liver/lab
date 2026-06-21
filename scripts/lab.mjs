#!/usr/bin/env node
import { existsSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const defaultPorts = [4321, 4322, 4323, 4173];

const bins = {
  astro: resolve(repoRoot, 'node_modules/astro/bin/astro.mjs'),
  vitest: resolve(repoRoot, 'node_modules/vitest/vitest.mjs'),
  playwright: resolve(repoRoot, 'node_modules/@playwright/test/cli.js'),
};

function usage() {
  return [
    'Usage:',
    '  npm run lab -- <command> [args]',
    '',
    'Commands:',
    '  dev [--clean-ports] [astro args...]',
    '  dev:force [--clean-ports] [astro args...]',
    '  dev:recover [--clean-ports] [astro args...]',
    '  preview [--clean-ports] [astro args...]',
    '  build [astro args...]',
    '  test [vitest args...]',
    '  test:content-audit [vitest args...]',
    '  test:works-smoke [playwright args...]',
    '  test:seo-ux [playwright args...]',
    '  smoke:work <slug> [playwright args...]',
    '  smoke:explore <slug> [playwright args...]',
    '  covers:explore',
    '  audit:content',
    '  audit:explore-covers',
    '  audit:integration',
    '  new:work [args...]',
    '  new:explore [args...]',
    '  validate:changed [--dry-run] [--base ref]',
    '  vite:deps:clean',
    '  ports [--ports 4321,4322]',
    '  ports:clean [--ports 4321,4322]',
    '  doctor',
    '',
    'Port cleanup:',
    '  npm run dev -- --clean-ports --host 127.0.0.1',
    '  npm run ports:clean -- --ports 4321,4322',
  ].join('\n');
}

function normalizedEnv() {
  const pathParts = [
    resolve(repoRoot, 'node_modules/.bin'),
    '/usr/local/bin',
    '/opt/homebrew/bin',
    process.env.PATH ?? '',
  ].filter(Boolean);

  return {
    ...process.env,
    PATH: pathParts.join(':'),
  };
}

function runNodeScript(scriptPath, args = []) {
  const result = spawnSync(process.execPath, [scriptPath, ...args], {
    cwd: repoRoot,
    env: normalizedEnv(),
    stdio: 'inherit',
  });
  if (result.status === null) {
    throw new Error(result.error?.message ?? `Failed to run ${scriptPath}`);
  }
  process.exitCode = result.status;
}

function runBin(name, args = []) {
  const binPath = bins[name];
  if (!binPath || !existsSync(binPath)) {
    throw new Error(`Missing local ${name} binary. Run npm install first.`);
  }
  runNodeScript(binPath, args);
}

function parseCsvPorts(value) {
  const ports = value
    .split(',')
    .map((part) => Number(part.trim()))
    .filter((port) => Number.isInteger(port) && port > 0 && port < 65536);
  if (ports.length === 0) {
    throw new Error(`Invalid port list: ${value}`);
  }
  return [...new Set(ports)];
}

function splitLabFlags(args) {
  const lab = {
    cleanPorts: false,
    ports: null,
  };
  const passthrough = [];

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--') {
      passthrough.push(...args.slice(i + 1));
      break;
    }
    if (arg === '--clean-ports') {
      lab.cleanPorts = true;
      continue;
    }
    if (arg === '--ports') {
      const value = args[i + 1];
      if (!value) throw new Error('Missing value for --ports');
      lab.ports = parseCsvPorts(value);
      i += 1;
      continue;
    }
    passthrough.push(arg);
  }

  return { lab, passthrough };
}

function findArgValue(args, longName) {
  const eqPrefix = `${longName}=`;
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg.startsWith(eqPrefix)) return arg.slice(eqPrefix.length);
    if (arg === longName) return args[i + 1] ?? null;
  }
  return null;
}

function requestedPort(args, fallback) {
  const raw = findArgValue(args, '--port');
  if (!raw) return fallback;
  const port = Number(raw);
  if (!Number.isInteger(port) || port <= 0 || port >= 65536) {
    throw new Error(`Invalid --port value: ${raw}`);
  }
  return port;
}

function lsofPids(port) {
  const result = spawnSync('lsof', ['-nP', '-ti', `tcp:${port}`], {
    cwd: repoRoot,
    env: normalizedEnv(),
    encoding: 'utf8',
  });

  if (result.error) return null;
  if (result.status !== 0 && !result.stdout.trim()) return [];

  return result.stdout
    .split('\n')
    .map((line) => Number(line.trim()))
    .filter((pid) => Number.isInteger(pid) && pid > 0);
}

function psInfo(pid) {
  const result = spawnSync('ps', ['-p', String(pid), '-o', 'pid=', '-o', 'comm=', '-o', 'args='], {
    cwd: repoRoot,
    env: normalizedEnv(),
    encoding: 'utf8',
  });
  return result.stdout.trim() || `pid=${pid}`;
}

function scanPorts(ports) {
  return ports.map((port) => {
    const pids = lsofPids(port);
    return {
      port,
      available: Array.isArray(pids) && pids.length === 0,
      pids,
    };
  });
}

function printPortReport(ports) {
  const report = scanPorts(ports);
  for (const item of report) {
    if (item.pids === null) {
      console.log(`${item.port}: unable to inspect; lsof is unavailable`);
      continue;
    }
    if (item.pids.length === 0) {
      console.log(`${item.port}: free`);
      continue;
    }
    console.log(`${item.port}: occupied`);
    for (const pid of item.pids) {
      console.log(`  ${psInfo(pid)}`);
    }
  }
  return report;
}

function cleanPorts(ports) {
  const report = scanPorts(ports);
  for (const item of report) {
    if (item.pids === null) {
      throw new Error('Cannot clean ports because lsof is unavailable.');
    }
    for (const pid of item.pids) {
      console.log(`Stopping ${pid} on port ${item.port}: ${psInfo(pid)}`);
      try {
        process.kill(pid, 'TERM');
      } catch (error) {
        console.log(`  failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }
}

function assertPortsFree(ports, clean) {
  if (clean) {
    cleanPorts(ports);
  }

  const report = scanPorts(ports);
  const occupied = report.filter((item) => Array.isArray(item.pids) && item.pids.length > 0);
  const unknown = report.filter((item) => item.pids === null);

  if (unknown.length > 0) {
    console.log('Port check skipped: lsof is unavailable.');
    return;
  }

  if (occupied.length === 0) return;

  console.log('Local server port check failed:');
  for (const item of occupied) {
    console.log(`- ${item.port} is occupied by ${item.pids.join(', ')}`);
  }
  console.log('');
  console.log('Use one of:');
  console.log('  npm run dev -- --clean-ports');
  console.log('  npm run ports:clean -- --ports ' + ports.join(','));
  console.log('  npm run dev -- --port <free-port>');
  process.exitCode = 1;
  throw new Error('Port collision detected.');
}

function cleanViteDeps() {
  const depsPath = resolve(repoRoot, 'node_modules/.vite/deps');
  rmSync(depsPath, { recursive: true, force: true });
  console.log(`Removed ${depsPath}`);
}

function runServer(kind, args, extraAstroArgs = []) {
  const { lab, passthrough } = splitLabFlags(args);
  const astroArgs = [kind, ...extraAstroArgs, ...passthrough];
  const defaultPort = requestedPort(astroArgs, 4321);
  const ports = lab.ports ?? [defaultPort];

  assertPortsFree(ports, lab.cleanPorts || process.env.LAB_CLEAN_PORTS === '1');

  runBin('astro', astroArgs);
}

function commandPorts(args, shouldClean) {
  const { lab } = splitLabFlags(args);
  const ports = lab.ports ?? defaultPorts;
  if (shouldClean) cleanPorts(ports);
  printPortReport(ports);
}

function doctor() {
  console.log(`repo: ${repoRoot}`);
  console.log(`node: ${process.execPath}`);
  console.log(`node version: ${process.version}`);
  console.log(`PATH: ${normalizedEnv().PATH}`);
  for (const [name, path] of Object.entries(bins)) {
    console.log(`${name}: ${existsSync(path) ? path : 'missing'}`);
  }
  console.log('');
  printPortReport(defaultPorts);
}

function main() {
  const [command = 'help', ...args] = process.argv.slice(2);

  if (command === 'help' || command === '--help' || command === '-h') {
    console.log(usage());
    return;
  }

  if (command === 'doctor') return doctor();
  if (command === 'ports') return commandPorts(args, false);
  if (command === 'ports:clean') return commandPorts(args, true);

  if (command === 'dev') return runServer('dev', args);
  if (command === 'dev:force') return runServer('dev', args, ['--force']);
  if (command === 'dev:recover') {
    cleanViteDeps();
    return runServer('dev', args, ['--force']);
  }
  if (command === 'preview') return runServer('preview', args);
  if (command === 'build') return runBin('astro', ['build', ...args]);
  if (command === 'astro') return runBin('astro', args);

  if (command === 'test') return runBin('vitest', ['run', ...args]);
  if (command === 'test:content-audit') {
    return runBin('vitest', ['run', 'src/content/contentAudit.test.ts', ...args]);
  }
  if (command === 'test:works-smoke') {
    return runBin('playwright', ['test', 'tests/work-integration.smoke.spec.ts', ...args]);
  }
  if (command === 'test:seo-ux') {
    return runBin('playwright', ['test', 'tests/seo-ux.spec.ts', ...args]);
  }
  if (command === 'smoke:work') {
    return runNodeScript(resolve(repoRoot, 'scripts/run-smoke.mjs'), ['work', ...args]);
  }
  if (command === 'smoke:explore') {
    return runNodeScript(resolve(repoRoot, 'scripts/run-smoke.mjs'), ['explore', ...args]);
  }

  if (command === 'new:explore') {
    return runNodeScript(resolve(repoRoot, 'scripts/new-explore.mjs'), args);
  }
  if (command === 'new:work') {
    return runNodeScript(resolve(repoRoot, 'scripts/new-work.mjs'), args);
  }
  if (command === 'covers:explore') {
    return runNodeScript(resolve(repoRoot, 'scripts/explore-covers/generate.mjs'), args);
  }
  if (command === 'audit:content') {
    return runNodeScript(resolve(repoRoot, 'scripts/audit-content.mjs'), args);
  }
  if (command === 'audit:explore-covers') {
    return runNodeScript(resolve(repoRoot, 'scripts/audit-explore-covers.mjs'), args);
  }
  if (command === 'audit:integration') {
    return runNodeScript(resolve(repoRoot, 'scripts/audit-integration.mjs'), args);
  }
  if (command === 'validate:changed') {
    return runNodeScript(resolve(repoRoot, 'scripts/validate-changed.mjs'), args);
  }
  if (command === 'vite:deps:clean') return cleanViteDeps();

  throw new Error(`Unknown command: ${command}\n\n${usage()}`);
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = process.exitCode || 1;
}
