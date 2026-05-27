import { describe, expect, it } from 'vitest';
import {
  appendHistoryBuffer,
  createHistoryBuffer,
  historyMaxPoints,
  pointAt,
  rebuildHistoryBuffer,
  toPhasorSampleParams,
} from './geometry';

describe('complex-phase-portrait geometry', () => {
  it('pointAt matches sum of two phasors at t=0 with zero phase', () => {
    const params = toPhasorSampleParams(1.2, 3, 0);
    const p = pointAt(0, params);
    expect(p.x).toBeCloseTo(1.2 + 0.8, 5);
    expect(p.y).toBeCloseTo(0, 5);
  });

  it('rebuildHistoryBuffer fills without exceeding capacity', () => {
    const buffer = createHistoryBuffer();
    rebuildHistoryBuffer(buffer, toPhasorSampleParams(1, 3, 0));
    expect(buffer.count).toBeLessThanOrEqual(historyMaxPoints());
    expect(buffer.count).toBeGreaterThan(0);
  });

  it('appendHistoryBuffer rolls in place without changing capacity', () => {
    const buffer = createHistoryBuffer();
    const params = toPhasorSampleParams(1, 3, 0);
    rebuildHistoryBuffer(buffer, params);
    const beforeCount = buffer.count;
    appendHistoryBuffer(buffer, 1.5, params);
    expect(buffer.count).toBe(beforeCount);
    expect(buffer.points).toHaveLength(historyMaxPoints());
  });
});
