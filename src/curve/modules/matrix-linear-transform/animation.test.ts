import { describe, expect, it } from 'vitest';
import { FRAME_MS_60FPS } from '../animationTiming';
import { PARAM_LERP } from './constants';
import {
  createMatrixLinearAnimState,
  stepMatrixLinearAnimation,
  type MatrixLinearParams,
} from './animation';

const params: MatrixLinearParams = {
  mode: 'free',
  free: { a: 2, b: 0, c: 0, d: 2 },
  specialType: 'rotation',
  specialParamRaw: 0,
  composeAngleDeg: 0,
  composeShear: 0,
};

describe('stepMatrixLinearAnimation', () => {
  it('uses shared 60fps frame scaling for matrix lerp', () => {
    const oneFrame = stepMatrixLinearAnimation(
      createMatrixLinearAnimState(),
      params,
      FRAME_MS_60FPS,
    );
    const invalidDelta = stepMatrixLinearAnimation(
      createMatrixLinearAnimState(),
      params,
      0,
    );
    const clampedLongFrame = stepMatrixLinearAnimation(
      createMatrixLinearAnimState(),
      params,
      FRAME_MS_60FPS * 30,
    );

    expect(oneFrame.currentMatrix.a).toBeCloseTo(1 + PARAM_LERP);
    expect(invalidDelta.currentMatrix.a).toBeCloseTo(oneFrame.currentMatrix.a);
    expect(clampedLongFrame.currentMatrix.a).toBeCloseTo(
      1 + (1 - Math.pow(1 - PARAM_LERP, 3)),
    );
  });
});
