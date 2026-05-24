import type { CacheStrategy, CurveModule, CurvePoint, ParamValues } from './types';

/** 整數 k 的奇偶（Rose：奇數 θ∈[0,π]、偶數 θ∈[0,2π]，不可跨奇偶 blend） */
function integerParity(kInt: number): number {
  return ((kInt % 2) + 2) % 2;
}

function curveStep(points: CurvePoint[]): number {
  if (points.length > 1) return points[1].theta - points[0].theta;
  return 0;
}

/** 在採樣點列上依參數 theta 線性內插；theta 超出範圍則回傳 null */
function interpolateAtTheta(points: CurvePoint[], theta: number): CurvePoint | null {
  if (points.length === 0) return null;

  const maxT = points[points.length - 1].theta;
  if (theta > maxT) return null;
  if (theta <= points[0].theta) return { ...points[0], theta };

  for (let i = 1; i < points.length; i++) {
    if (points[i].theta >= theta) {
      const p0 = points[i - 1];
      const p1 = points[i];
      const span = p1.theta - p0.theta;
      const u = span > 0 ? (theta - p0.theta) / span : 0;
      return {
        x: p0.x + (p1.x - p0.x) * u,
        y: p0.y + (p1.y - p0.y) * u,
        theta,
        arcLength: p0.arcLength + (p1.arcLength - p0.arcLength) * u,
      };
    }
  }

  return { ...points[points.length - 1], theta };
}

/**
 * 依參數 theta 順序混合兩條點列（支援 odd π / even 2π 不同總長）。
 * 不截斷至較短陣列；maxTheta = max(lastA.theta, lastB.theta)。
 */
function blendPoints(
  a: CurvePoint[],
  b: CurvePoint[],
  t: number,
  step: number,
): CurvePoint[] {
  const maxTheta = Math.max(
    a[a.length - 1]?.theta ?? 0,
    b[b.length - 1]?.theta ?? 0,
  );
  if (maxTheta <= 0) return [];

  const dt = step > 0 ? step : curveStep(a) || curveStep(b) || 0.006;
  const result: CurvePoint[] = [];

  for (let theta = 0; theta <= maxTheta + dt * 0.5; theta += dt) {
    const pa = interpolateAtTheta(a, theta);
    const pb = interpolateAtTheta(b, theta);

    if (pa && pb) {
      result.push({
        x: pa.x + (pb.x - pa.x) * t,
        y: pa.y + (pb.y - pa.y) * t,
        theta,
        arcLength: pa.arcLength + (pb.arcLength - pa.arcLength) * t,
      });
    } else if (pb) {
      result.push({ ...pb, theta });
    } else if (pa) {
      result.push({ ...pa, theta });
    }
  }

  return result;
}

export type CurveCache = {
  clear: () => void;
  rebuildForTarget: (targetParams: ParamValues, step: number) => void;
  getDisplayPoints: (params: ParamValues, step: number) => CurvePoint[];
};

export function createCurveCache(module: CurveModule): CurveCache {
  const strategy: CacheStrategy = module.cacheStrategy ?? { kind: 'none' };
  const numericCache = new Map<number, CurvePoint[]>();
  const stringCache = new Map<string, CurvePoint[]>();

  const sampleAt = (params: ParamValues, step: number): CurvePoint[] =>
    module.sample(params, { step });

  const clear = (): void => {
    numericCache.clear();
    stringCache.clear();
  };

  const rebuildForTarget = (targetParams: ParamValues, step: number): void => {
    clear();
    if (strategy.kind === 'integerBlend') {
      const key = strategy.paramKey;
      const kInt = Math.round(targetParams[key]);
      numericCache.set(
        kInt,
        sampleAt({ ...targetParams, [key]: kInt }, step),
      );
      return;
    }
    if (strategy.kind === 'exact') {
      stringCache.set(strategy.cacheKey(targetParams), sampleAt(targetParams, step));
    }
  };

  const ensureIntegerSample = (
    intVal: number,
    smoothParams: ParamValues,
    step: number,
  ): CurvePoint[] => {
    if (strategy.kind !== 'integerBlend') {
      return sampleAt(smoothParams, step);
    }
    let pts = numericCache.get(intVal);
    if (!pts) {
      pts = sampleAt({ ...smoothParams, [strategy.paramKey]: intVal }, step);
      numericCache.set(intVal, pts);
    }
    return pts;
  };

  const getDisplayPoints = (params: ParamValues, step: number): CurvePoint[] => {
    if (strategy.kind === 'none') {
      return sampleAt(params, step);
    }

    if (strategy.kind === 'exact') {
      const key = strategy.cacheKey(params);
      let pts = stringCache.get(key);
      if (!pts) {
        pts = sampleAt(params, step);
        stringCache.set(key, pts);
      }
      return pts;
    }

    const v = params[strategy.paramKey];
    const low = Math.floor(v);
    const high = Math.ceil(v);

    if (low === high) {
      return ensureIntegerSample(low, params, step);
    }

    if (integerParity(low) !== integerParity(high)) {
      const nearest = Math.round(v);
      return ensureIntegerSample(nearest, params, step);
    }

    const t = v - low;
    return blendPoints(
      ensureIntegerSample(low, params, step),
      ensureIntegerSample(high, params, step),
      t,
      step,
    );
  };

  return { clear, rebuildForTarget, getDisplayPoints };
}
