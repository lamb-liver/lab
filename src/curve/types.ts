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

export type SamplePurpose = 'default' | 'thumbnail';

/**
 * 曲線幾何採樣。
 * - 建置期卡片縮圖：必傳 `purpose: 'thumbnail'`（見 `curveThumbnail.ts`）。
 * - morph / 靜態曲線（Rose、Lissajous…）：`default` 供 runtime `renderFrame` 點列。
 * - 自訂 p5 互動（Julia、相位圖、Euler…）：runtime 不走 `sample`；模組內 `sample` 僅服務縮圖。
 */
export type SampleOptions = {
  step: number;
  revealProgress?: number;
  purpose?: SamplePurpose;
};

export type ThumbnailPath = {
  points: CurvePoint[];
  opacity?: number;
  closed?: boolean;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  excludeFromBbox?: boolean;
};

/** 縮圖用圓點（例如帕斯卡三角形的格點） */
export type ThumbnailCircle = {
  x: number;
  y: number;
  r: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
};

export type ThumbnailSpec = {
  paths: ThumbnailPath[];
  circles?: ThumbnailCircle[];
  coordinateSystem?: 'math' | 'canvas';
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
  /** 見 `SampleOptions` 註解：互動專用模組仍以 `purpose: 'thumbnail'` 為主路徑。 */
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
