import { describe, expect, it } from 'vitest';
import { auditContentFiles, readContentFiles } from './contentAudit';

describe('content audit', () => {
  it('keeps frontmatter math and interaction/observation sections aligned', () => {
    expect(auditContentFiles()).toEqual([]);
  });

  it('covers every content file in works and explore', () => {
    const files = readContentFiles();
    expect(files).toHaveLength(56);
    expect(files.filter((file) => file.collection === 'works')).toHaveLength(44);
    expect(files.filter((file) => file.collection === 'explore')).toHaveLength(12);
  });
});
