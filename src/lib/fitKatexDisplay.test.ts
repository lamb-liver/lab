import { describe, expect, it } from 'vitest';
import { fitKatexDisplay } from './fitKatexDisplay';

function makeDisplay(available: number, needed: number, naturalHeight = 40) {
  const inner = {
    scrollWidth: needed,
    style: {} as Record<string, string>,
    getBoundingClientRect() {
      const scaleMatch = /scale\(([\d.]+)\)/.exec(this.style.transform ?? '');
      const scale = scaleMatch ? Number(scaleMatch[1]) : 1;
      return { width: needed * scale, height: naturalHeight * scale };
    },
  };
  const box = {
    clientWidth: available,
    style: {} as Record<string, string>,
    dataset: {} as Record<string, string>,
    querySelector(selector: string) {
      return selector === '.katex' ? inner : null;
    },
  };
  return { box: box as unknown as HTMLElement, inner, dataset: box.dataset };
}

describe('fitKatexDisplay', () => {
  it('leaves fitting formulas alone', () => {
    const { box, inner, dataset } = makeDisplay(390, 200);
    expect(fitKatexDisplay(box)).toBe(1);
    expect(inner.style.transform).toBe('');
    expect(dataset.katexFitted).toBeUndefined();
  });

  it('scales overflow down to the container width', () => {
    const { box, inner, dataset } = makeDisplay(390, 780);
    expect(fitKatexDisplay(box)).toBeCloseTo(0.5);
    expect(inner.style.transform).toBe('scale(0.5)');
    expect(dataset.katexFitted).toBe('');
    expect(box.style.height).toBe('20px');
  });

  it('does not go below the minimum scale', () => {
    const { box, inner } = makeDisplay(390, 2000);
    expect(fitKatexDisplay(box)).toBe(0.5);
    expect(inner.style.transform).toBe('scale(0.5)');
  });
});
