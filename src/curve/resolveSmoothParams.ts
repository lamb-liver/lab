import type { ParamValues, RuntimeMeta } from './types';

/** 合併 target params 與 partial smooth patch，供 getMetadata 防呆。 */
export function resolveSmoothParams(
  params: ParamValues,
  runtime?: Pick<RuntimeMeta, 'smoothParams'>,
): ParamValues {
  return { ...params, ...(runtime?.smoothParams ?? {}) };
}
