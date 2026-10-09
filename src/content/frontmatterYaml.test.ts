import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = path.resolve(__dirname);

const markdownFiles = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return markdownFiles(full);
    return entry.name.endsWith('.md') ? [full] : [];
  });

describe('frontmatter title and description', () => {
  it('are quoted when they contain " #", which YAML would read as a comment', () => {
    for (const file of markdownFiles(ROOT)) {
      const frontmatter = fs.readFileSync(file, 'utf8').match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
      for (const key of ['title', 'description']) {
        const raw = frontmatter.match(new RegExp(`^${key}: (.*)$`, 'm'))?.[1] ?? '';
        if (/^['"|>]/.test(raw)) continue;
        expect(raw, `${path.relative(ROOT, file)} ${key}`).not.toMatch(/\s#/);
      }
    }
  });
});
