import { describe, expect, it } from 'vitest';
import { concepts, conceptAreas } from './concepts';
import { conceptAreaEn, conceptLabelEn } from './conceptLabels';

describe('English concept labels', () => {
  it('covers every concept and area with Latin-only text', () => {
    for (const concept of concepts) {
      expect(conceptLabelEn(concept.slug)).toMatch(/^[A-Z][A-Za-z' ,-]+$/);
    }
    for (const area of conceptAreas) {
      expect(conceptAreaEn(area)).toMatch(/^[A-Z][A-Za-z' ,-]+$/);
    }
  });
});
