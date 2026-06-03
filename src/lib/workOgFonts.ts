import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const sansPath = require.resolve(
  '@fontsource/noto-sans-tc/files/noto-sans-tc-chinese-traditional-400-normal.woff',
);
const monoPath = require.resolve(
  '@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff',
);

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
      data: readFileSync(sansPath).buffer as ArrayBuffer,
      weight: 400,
      style: 'normal',
    },
    {
      name: 'JetBrains Mono',
      data: readFileSync(monoPath).buffer as ArrayBuffer,
      weight: 400,
      style: 'normal',
    },
  ];

  return cachedFonts;
}
