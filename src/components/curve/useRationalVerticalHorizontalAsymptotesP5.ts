import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import { measureWorkCanvasSize } from '../../curve/canvasSize';
import type {
  RationalAsymptoteParams,
  RationalAsymptotePreset,
} from '../../curve/modules/rational-vertical-horizontal-asymptotes';
import { renderRationalVerticalHorizontalAsymptotesScene } from '../../systems/rendering/rationalVerticalHorizontalAsymptotesRender';
import { useRectP5CanvasHost, type CanvasSize } from './useRectP5CanvasHost';

type Options = {
  preset: RationalAsymptotePreset;
  params: RationalAsymptoteParams;
  showAsymptotes: boolean;
  showHoles: boolean;
  showLocal: boolean;
  advanced: boolean;
};

function measureSquareCanvas(host: HTMLElement): CanvasSize {
  const size = measureWorkCanvasSize(host);
  return { width: size, height: size };
}

export function useRationalVerticalHorizontalAsymptotesP5({
  preset,
  params,
  showAsymptotes,
  showHoles,
  showLocal,
  advanced,
}: Options) {
  const presetRef = useRef(preset);
  const paramsRef = useRef(params);
  const showAsymptotesRef = useRef(showAsymptotes);
  const showHolesRef = useRef(showHoles);
  const showLocalRef = useRef(showLocal);
  const advancedRef = useRef(advanced);

  useEffect(() => {
    presetRef.current = preset;
  }, [preset]);

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  useEffect(() => {
    showAsymptotesRef.current = showAsymptotes;
  }, [showAsymptotes]);

  useEffect(() => {
    showHolesRef.current = showHoles;
  }, [showHoles]);

  useEffect(() => {
    showLocalRef.current = showLocal;
  }, [showLocal]);

  useEffect(() => {
    advancedRef.current = advanced;
  }, [advanced]);

  const draw = useCallback((p: p5) => {
    renderRationalVerticalHorizontalAsymptotesScene(p, {
      size: p.width,
      preset: presetRef.current,
      params: paramsRef.current,
      showAsymptotes: showAsymptotesRef.current,
      showHoles: showHolesRef.current,
      showLocal: showLocalRef.current,
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
    { loop: false, redrawKey: `${preset.id}|${JSON.stringify(params)}|${showAsymptotes}|${showHoles}|${showLocal}|${advanced}` },
  );

  return { canvasHostRef };
}
