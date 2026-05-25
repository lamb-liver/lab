import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import {
  createVectorFieldAnimState,
  stepVectorFieldAnimation,
} from '../../curve/modules/vector-field-streamlines/animation';
import type { ParamValues } from '../../curve/types';
import { renderVectorFieldStreamlinesScene } from '../../systems/rendering/vectorFieldStreamlinesRender';
import { useP5CanvasHost } from './useP5CanvasHost';

type Options = {
  defaultParams: ParamValues;
  targetParams: ParamValues;
};

export function useVectorFieldStreamlinesP5({
  defaultParams,
  targetParams,
}: Options) {
  const animRef = useRef(createVectorFieldAnimState(defaultParams));
  const targetParamsRef = useRef<ParamValues>(defaultParams);

  useEffect(() => {
    targetParamsRef.current = targetParams;
  }, [targetParams]);

  const draw = useCallback((p: p5) => {
    animRef.current = stepVectorFieldAnimation(
      animRef.current,
      targetParamsRef.current,
    );

    const anim = animRef.current;
    renderVectorFieldStreamlinesScene(p, {
      width: p.width,
      height: p.height,
      streamlines: anim.streamlines,
    });
  }, []);

  const canvasHostRef = useP5CanvasHost(draw, [draw]);

  return { canvasHostRef };
}
