import type { RenderConfig } from '../systems/rendering/types';

export type CurvePoint = {
  x: number;
  y: number;
  theta: number;
  arcLength: number;
};

export type ParamKey = string;

export type ParamValues = Record<ParamKey, number>;

export type ParamDef = {
  key: ParamKey;
  label: string;
  min: number;
  max: number;
  step: number;
  default: number;
};

export type ParamSchema = ParamDef[];

export type SampleOptions = {
  step: number;
  revealProgress?: number;
  purpose?: SamplePurpose;
};

export type SamplePurpose = 'default' | 'thumbnail';

export type ThumbnailPath = {
  points: CurvePoint[];
  opacity?: number;
  closed?: boolean;
  strokeWidth?: number;
  excludeFromBbox?: boolean;
};

export type ThumbnailSpec = {
  paths: ThumbnailPath[];
};

export type RuntimeMeta = {
  revealPct: number;
  smoothParams: ParamValues;
  /** 等角螺線等：動態 reveal 參數（非百分比） */
  revealTheta?: number;
};

export type CurveMetadata = {
  title: string;
  formula: string;
  stats: Array<{ key: string; label: string; value: string | number }>;
};

export type CacheStrategy =
  | { kind: 'integerBlend'; paramKey: ParamKey }
  | { kind: 'exact'; cacheKey: (params: ParamValues) => string }
  | { kind: 'none' };

export type CurveModule = {
  id: string;
  paramSchema: ParamSchema;
  defaultParams: ParamValues;
  sample: (params: ParamValues, opts: SampleOptions) => CurvePoint[] | ThumbnailSpec;
  getMetadata: (params: ParamValues, runtime?: RuntimeMeta) => CurveMetadata;
  renderPreset: RenderConfig;
  cacheStrategy?: CacheStrategy;
  sampleStep?: number;
  animation?: { lerp: number; revealSpeed: number };
};

export type AnimationState = {
  params: ParamValues;
  targetParams: ParamValues;
  revealProgress: number;
  isComplete: boolean;
};
