import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);

const sansPath = require.resolve(
  '@fontsource/noto-sans-tc/files/noto-sans-tc-chinese-traditional-400-normal.woff',
);
const monoPath = require.resolve(
  '@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff',
);

/**
 * 公式備援字型（依序在主字型缺字時使用）：
 * - Noto Sans TC 的 115、119 號子集：全形「，」「：」「；」（chinese-traditional 子集不含這些標點）
 * - Noto Sans Mono / Noto Sans Math：希臘字母、上下標、數學運算子（見 scripts/og-fonts/README.md）
 */
const fallbackFonts: Array<[string, string]> = [
  [
    'Noto Sans TC Punct',
    require.resolve('@fontsource/noto-sans-tc/files/noto-sans-tc-115-400-normal.woff'),
  ],
  [
    'Noto Sans TC Punct2',
    require.resolve('@fontsource/noto-sans-tc/files/noto-sans-tc-119-400-normal.woff'),
  ],
  [
    'Noto Sans Mono',
    fileURLToPath(new URL('../../scripts/og-fonts/NotoSansMono-OgSymbols.woff', import.meta.url)),
  ],
  [
    'Noto Sans Math',
    fileURLToPath(new URL('../../scripts/og-fonts/NotoSansMath-OgSymbols.woff', import.meta.url)),
  ],
];

/** Copy file bytes into a detached ArrayBuffer (never reuse Buffer.buffer pools). */
function readFontArrayBuffer(path: string): ArrayBuffer {
  const bytes = readFileSync(path);
  return Uint8Array.from(bytes).buffer;
}

let cachedFonts: Array<{ name: string; data: ArrayBuffer; weight: 400; style: 'normal' }> | null =
  null;

export function getWorkOgFonts(): Array<{
  name: string;
  data: ArrayBuffer;
  weight: 400;
  style: 'normal';
}> {
  if (cachedFonts) return cachedFonts;

  cachedFonts = [
    {
      name: 'Noto Sans TC',
      data: readFontArrayBuffer(sansPath),
      weight: 400,
      style: 'normal',
    },
    {
      name: 'JetBrains Mono',
      data: readFontArrayBuffer(monoPath),
      weight: 400,
      style: 'normal',
    },
    ...fallbackFonts.map(([name, path]) => ({
      name,
      data: readFontArrayBuffer(path),
      weight: 400 as const,
      style: 'normal' as const,
    })),
  ];

  return cachedFonts;
}
