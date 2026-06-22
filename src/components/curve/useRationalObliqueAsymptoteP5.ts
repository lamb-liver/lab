import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import { measureWorkCanvasSize } from '../../curve/canvasSize';
import type {
  RationalObliqueMode,
  RationalObliqueParams,
} from '../../curve/modules/rational-oblique-asymptote';
import { renderRationalObliqueAsymptoteScene } from '../../systems/rendering/rationalObliqueAsymptoteRender';
import { useRectP5CanvasHost, type CanvasSize } from './useRectP5CanvasHost';

type Options = {
  mode: RationalObliqueMode;
  params: RationalObliqueParams;
  showAsymptotes: boolean;
  showRemainder: boolean;
  advanced: boolean;
};

function measureSquareCanvas(host: HTMLElement): CanvasSize {
  const size = measureWorkCanvasSize(host);
  return { width: size, height: size };
}

export function useRationalObliqueAsymptoteP5({
  mode,
  params,
  showAsymptotes,
  showRemainder,
  advanced,
}: Options) {
  const modeRef = useRef(mode);
  const paramsRef = useRef(params);
  const showAsymptotesRef = useRef(showAsymptotes);
  const showRemainderRef = useRef(showRemainder);
  const advancedRef = useRef(advanced);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  useEffect(() => {
    showAsymptotesRef.current = showAsymptotes;
  }, [showAsymptotes]);

  useEffect(() => {
    showRemainderRef.current = showRemainder;
  }, [showRemainder]);

  useEffect(() => {
    advancedRef.current = advanced;
  }, [advanced]);

  const draw = useCallback((p: p5) => {
    renderRationalObliqueAsymptoteScene(p, {
      size: p.width,
      mode: modeRef.current,
      params: paramsRef.current,
      showAsymptotes: showAsymptotesRef.current,
      showRemainder: showRemainderRef.current,
      advanced: advancedRef.current,
    });
  }, []);
  const extendSketch = useCallback((p: p5) => {
    p.mouseWheel = () => true;
  }, []);
  const canvasHostRef = useRectP5CanvasHost(
    draw,
    [draw, extendSketch],
    measureSquareCanvas,
    extendSketch,
    { loop: false, redrawKey: `${mode}|${JSON.stringify(params)}|${showAsymptotes}|${showRemainder}|${advanced}` },
  );

  return { canvasHostRef };
}
