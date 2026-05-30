import { describe, expect, it } from 'vitest';
import { resolveSmoothParams } from './resolveSmoothParams';

describe('resolveSmoothParams', () => {
  it('merges partial smooth patch over target params', () => {
    const params = { r1: 1.2, r2: 1, theta1: 0.5, theta2: 1.2 };
    const smooth = resolveSmoothParams(params, { smoothParams: { theta2: 1.25 } });
    expect(smooth).toEqual({ r1: 1.2, r2: 1, theta1: 0.5, theta2: 1.25 });
  });
});
