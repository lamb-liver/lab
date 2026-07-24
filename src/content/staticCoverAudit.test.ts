import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, it } from 'vitest';
import { auditExamCovers } from '../../scripts/audit-static-covers.mjs';

function pngHeader(width: number, height: number) {
  const png = Buffer.alloc(24);
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).copy(png);
  png.write('IHDR', 12, 'ascii');
  png.writeUInt32BE(width, 16);
  png.writeUInt32BE(height, 20);
  return png;
}

it('rejects an Exam cover with the wrong PNG dimensions', () => {
  const root = mkdtempSync(join(tmpdir(), 'exam-cover-audit-'));
  const slug = 'sample';

  try {
    mkdirSync(join(root, 'src/content/exam'), { recursive: true });
    mkdirSync(join(root, 'scripts/exam-covers'), { recursive: true });
    mkdirSync(join(root, 'public/images/exam-covers'), { recursive: true });
    writeFileSync(
      join(root, `src/content/exam/${slug}.md`),
      `---\ncoverImage: /images/exam-covers/${slug}.png\ndraft: false\n---\n`,
    );
    writeFileSync(join(root, `scripts/exam-covers/${slug}.svg`), '<svg />');
    writeFileSync(join(root, `public/images/exam-covers/${slug}.png`), pngHeader(800, 500));

    expect(auditExamCovers({ root }).issues.map((issue) => issue.message)).toContain(
      'cover PNG must be 1600x1000, got 800x500',
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
