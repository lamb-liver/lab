export type MatrixMode = 'free' | 'special' | 'compose';

export type SpecialType = 'rotation' | 'scale' | 'shear' | 'reflection';

export type Matrix2 = {
  a: number;
  b: number;
  c: number;
  d: number;
};

export type Point2 = { x: number; y: number };
