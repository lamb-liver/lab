import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
// @ts-expect-error untyped .mjs script module
import { parseStageRootImports } from '../../scripts/stage-root-map.mjs';
// @ts-expect-error untyped .mjs script module
import { selectCommands } from '../../scripts/validate-changed.mjs';
import {
  assertRegistrable,
  buildNewWorkFiles,
  buildRegistryInsertions,
  // @ts-expect-error untyped .mjs script module
} from '../../scripts/new-work.mjs';
import { workInteractiveSlugs } from '../works/interactiveRegistry';
import { exploreInteractiveSlugs } from '../explore/interactiveRegistry';

const repoRoot = resolve(__dirname, '../..');

function read(path: string) {
  return readFileSync(resolve(repoRoot, path), 'utf8');
}

function commandLines(files: string[]): string[] {
  return selectCommands(files).map((item: { args: string[] }) => item.args.join(' '));
}

describe('stage-root-map 解析', () => {
  it('解析出的 work slug 集合與 registry 完全一致（防解析靜默失效）', () => {
    const map = parseStageRootImports(read('src/components/works/WorkInteractiveStage.tsx'));
    expect([...map.keys()].sort()).toEqual([...workInteractiveSlugs].sort());
    expect(map.get('rose-curve')).toBe('./RoseCurveRoot');
  });

  it('解析 explore stage，含未加引號的 key', () => {
    const map = parseStageRootImports(read('src/components/explore/ExploreInteractiveStage.tsx'));
    expect([...map.keys()].sort()).toEqual([...exploreInteractiveSlugs].sort());
    expect(map.get('vectors')).toBe('./VectorsExploreRoot');
  });

  it('靜態 import 條目不被接受（強制 lazy 慣例）', () => {
    const source = [
      "const rootBySlug = {",
      "  'static-entry': StaticRoot,",
      "  'lazy-entry': lazy(() => import('./LazyRoot')),",
      "} satisfies Record<string, ComponentType>;",
    ].join('\n');
    const map = parseStageRootImports(source);
    expect(map.has('static-entry')).toBe(false);
    expect(map.get('lazy-entry')).toBe('./LazyRoot');
  });
});

describe('validate-changed 命令選擇', () => {
  it('root 檔改動 → registry sync + 該作品 smoke', () => {
    const lines = commandLines(['src/components/works/RoseCurveRoot.tsx']);
    expect(lines).toContain('npm run test -- src/registry.sync.test.ts');
    expect(lines).toContain('npm run smoke:work -- rose-curve');
  });

  it('共用 rendering 檔改動 → 每個消費端（work 與 explore）都被選中', () => {
    const lines = commandLines(['src/systems/rendering/p5PlotHelpers.ts']);
    const workSmokes = lines.filter((l) => l.startsWith('npm run smoke:work -- '));
    const exploreSmokes = lines.filter((l) => l.startsWith('npm run smoke:explore -- '));
    expect(workSmokes.length).toBeGreaterThan(0);
    expect(exploreSmokes.length).toBeGreaterThan(0);
    for (const line of workSmokes) {
      const slug = line.replace('npm run smoke:work -- ', '');
      expect(workInteractiveSlugs).toContain(slug);
    }
  });

  it('explore topic 模組改動 → 對應 explore smoke', () => {
    const lines = commandLines(['src/explore/fourier/path.ts']);
    expect(lines).toContain('npm run smoke:explore -- fourier-series');
  });

  it('curve module 改動 → module 測試 + 縮圖 registry + 該作品 smoke', () => {
    const lines = commandLines(['src/curve/modules/rose/index.ts']);
    expect(lines).toContain('npm run test -- src/curve/modules/rose/rose.test.ts');
    expect(lines).toContain('npm run smoke:work -- rose-curve');
    expect(lines.some((l) => l.includes('curveThumbnail.registry.test.ts'))).toBe(true);
  });

  it('高扇出共用檔改動 → 以完整 works smoke suite 取代逐一列舉', () => {
    const lines = commandLines(['src/components/curve/ParamControls.tsx']);
    expect(lines).toContain('npm run test:works-smoke');
    expect(lines.filter((l) => l.startsWith('npm run smoke:work -- ')).length).toBe(0);
  });
});

describe('new:work --interactive scaffold', () => {
  const plan = {
    slug: 'matrix-grid',
    title: '矩陣格線',
    description: '矩陣格線的互動視覺化草稿。',
    date: '2026-06-12',
    tags: ['代數'],
    interactive: true,
  };

  it('生成 content、module、Root 三個檔案，且 module 可命名正確', () => {
    const files = buildNewWorkFiles(plan, repoRoot);
    expect(files.map((f: { relativePath: string }) => f.relativePath)).toEqual([
      'src/content/works/matrix-grid.md',
      'src/curve/modules/matrix-grid/index.ts',
      'src/components/works/MatrixGridCurveRoot.tsx',
    ]);
    const moduleFile = files[1].content as string;
    expect(moduleFile).toContain('export const matrixGridModule: CurveModule');
    expect(moduleFile).toContain("id: 'matrix-grid'");
    const rootFile = files[2].content as string;
    expect(rootFile).toContain('export default function MatrixGridCurveRoot');
    expect(rootFile).toContain("import { matrixGridModule } from '../../curve/modules/matrix-grid'");
  });

  it('三個 registry 的 anchored 插入都落在正確位置', () => {
    const [slugsIns, registryIns, stageIns] = buildRegistryInsertions('matrix-grid', repoRoot);

    const slugsOut = slugsIns.apply("export const workInteractiveSlugs = [\n  'rose-curve',\n] as const;");
    expect(slugsOut).toContain("  'rose-curve',\n  'matrix-grid',\n] as const;");

    const registryOut = registryIns.apply(
      [
        "import { roseModule } from './modules/rose';",
        '',
        'export const workCurveBySlug: Record<string, CurveModule> = {',
        "  'rose-curve': roseModule,",
        '};',
      ].join('\n'),
    );
    expect(registryOut).toContain("import { matrixGridModule } from './modules/matrix-grid';");
    expect(registryOut).toContain("  'matrix-grid': matrixGridModule,\n};");

    const stageOut = stageIns.apply(
      [
        'const rootBySlug = {',
        "  'rose-curve': lazy(() => import('./RoseCurveRoot')),",
        '} satisfies Record<WorkInteractiveSlug, ComponentType<RootProps>>;',
      ].join('\n'),
    );
    expect(stageOut).toContain("  'matrix-grid': lazy(() => import('./MatrixGridCurveRoot')),");
    // 新條目由共用解析器可讀（scaffold 產物必須通過 audit 的 lazy 檢查）
    const parsed = parseStageRootImports(stageOut);
    expect(parsed.get('matrix-grid')).toBe('./MatrixGridCurveRoot');
  });

  it('已註冊 slug 會被拒絕，未使用 slug 通過', () => {
    expect(() => assertRegistrable('rose-curve', repoRoot)).toThrow('already registered');
    expect(() => assertRegistrable('surely-unused-slug', repoRoot)).not.toThrow();
  });
});
