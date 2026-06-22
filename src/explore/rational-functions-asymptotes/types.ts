export type RationalPresetId = 'factor' | 'hole' | 'reciprocal' | 'oblique';

export type RationalParamKey = 'A' | 'r' | 'a' | 'h' | 'b' | 'm' | 'c';

export type RationalParams = Record<RationalParamKey, number>;

export type RationalPreset = {
  id: RationalPresetId;
  label: string;
  title: string;
  note: string;
  params: RationalParams;
  sliders: RationalParamKey[];
  yMin: number;
  yMax: number;
};

type RationalFarAsymptote =
  | { type: 'horizontal'; label: string; value: number }
  | { type: 'oblique'; label: string; m: number; b: number };

type RationalHole = {
  x: number;
  y: number;
};

export type RationalModel = {
  family: string;
  title: string;
  simplified: string;
  far: RationalFarAsymptote;
  verticals: number[];
  holes: RationalHole[];
  zeros: number[];
  warning: string;
  f: (x: number) => number;
  split: string;
};

export type Rect = {
  x: number;
  y: number;
  w: number;
  h: number;
};
