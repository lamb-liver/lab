import { describe, expect, it } from 'vitest';
import { siteSeo } from './seoCopy';

describe('site SEO copy consistency', () => {
  it('keeps list and home titles aligned with site section names', () => {
    expect(siteSeo.works.title).toBe('作品集');
    expect(siteSeo.explore.title).toBe('數學主題導覽');
    expect(siteSeo.home.description).toContain('主題導覽');
    expect(siteSeo.home.description).not.toContain('generative art');
  });

  it('does not label explore as a works portfolio in metadata', () => {
    expect(siteSeo.explore.description).not.toMatch(/作品集/);
    expect(siteSeo.works.description).not.toMatch(/主題導覽/);
  });
});
