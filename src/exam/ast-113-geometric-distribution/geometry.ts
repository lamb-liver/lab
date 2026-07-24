export const SUCCESS_PROBABILITY = 0.1;
export const SAMPLE_TARGET = 10_000;

export function geometricProbability(trial: number, p = SUCCESS_PROBABILITY): number {
  return (1 - p) ** (trial - 1) * p;
}

export function atLeastOneProbability(trials: number, p = SUCCESS_PROBABILITY): number {
  return 1 - (1 - p) ** trials;
}

export function trialsForChanceAbove(
  threshold: number,
  p = SUCCESS_PROBABILITY,
): number {
  return Math.floor(Math.log1p(-threshold) / Math.log1p(-p)) + 1;
}

export function sampleGeometric(p: number, random01: () => number): number {
  const u = Math.min(1 - Number.EPSILON, Math.max(0, random01()));
  return Math.floor(Math.log1p(-u) / Math.log1p(-p)) + 1;
}

export function generateGeometricSamples(
  count: number,
  p = SUCCESS_PROBABILITY,
  seed = 113,
): number[] {
  const random = mulberry32(seed);
  return Array.from({ length: count }, () => sampleGeometric(p, random));
}

export function summarizeGeometricSamples(
  samples: readonly number[],
  count: number,
  maxTrial = 24,
) {
  const observedCount = Math.min(samples.length, Math.max(0, Math.floor(count)));
  const bins = Array.from({ length: maxTrial }, () => 0);
  let total = 0;

  for (let i = 0; i < observedCount; i += 1) {
    const value = samples[i];
    total += value;
    bins[Math.min(value, maxTrial) - 1] += 1;
  }

  return {
    bins,
    count: observedCount,
    mean: observedCount === 0 ? 0 : total / observedCount,
  };
}

function mulberry32(seed: number): () => number {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}
