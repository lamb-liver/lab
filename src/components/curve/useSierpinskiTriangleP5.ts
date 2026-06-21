import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import { SIERPINSKI_REVEAL_SPEED } from '../../curve/modules/sierpinski-triangle';
import type { ParamValues } from '../../curve/types';
import { renderSierpinskiTriangleScene } from '../../systems/rendering/sierpinskiTriangleRender';
import { useP5CanvasHost } from './useP5CanvasHost';

type Options = {
  targetParams: ParamValues;
};

export function useSierpinskiTriangleP5({ targetParams }: Options) {
  const targetParamsRef = useRef<ParamValues>(targetParams);
  const revealRef = useRef(0);
  const lastKeyRef = useRef(paramsKey(targetParams));

  useEffect(() => {
    targetParamsRef.current = targetParams;
  }, [targetParams]);

  const restartKey = paramsKey(targetParams);

  const draw = useCallback((p: p5) => {
    const params = targetParamsRef.current;
    const key = paramsKey(params);
    if (key !== lastKeyRef.current) {
      lastKeyRef.current = key;
      revealRef.current = 0;
    }

    revealRef.current = Math.min(1, revealRef.current + SIERPINSKI_REVEAL_SPEED);

    renderSierpinskiTriangleScene(p, {
      width: p.width,
      height: p.height,
      params,
      revealProgress: revealRef.current,
    });

    return { keepLooping: revealRef.current < 1 };
  }, []);

  const canvasHostRef = useP5CanvasHost(draw, [draw], undefined, {
    mode: 'reveal',
    restartOn: [restartKey],
  });

  return { canvasHostRef };
}

function paramsKey(params: ParamValues): string {
  return [Math.round(params.depth ?? 6), Math.round(params.mode ?? 2)].join('|');
}
