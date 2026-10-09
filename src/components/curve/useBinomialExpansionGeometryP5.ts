import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import { modeFromValue, normalizeLen } from '../../curve/modules/binomial-expansion-geometry/geometry';
import type { ParamValues } from '../../curve/types';
import { renderBinomialExpansionGeometryScene } from '../../systems/rendering/binomialExpansionGeometryRender';
import { useP5CanvasHost } from './useP5CanvasHost';

type Options = {
  targetParams: ParamValues;
  locale?: 'en';
};

export function useBinomialExpansionGeometryP5({
  targetParams,
  locale,
}: Options) {
  const targetParamsRef = useRef<ParamValues>(targetParams);
  const localeRef = useRef(locale);

  useEffect(() => {
    targetParamsRef.current = targetParams;
  }, [targetParams]);

  useEffect(() => {
    localeRef.current = locale;
  }, [locale]);

  const draw = useCallback((p: p5) => {
    const params = targetParamsRef.current;
    const a = normalizeLen(params.a);
    const b = normalizeLen(params.b);
    const mode = modeFromValue(params.mode);
    renderBinomialExpansionGeometryScene(p, {
      width: p.width,
      height: p.height,
      a,
      b,
      mode,
      locale: localeRef.current,
    });
  }, []);

  const canvasHostRef = useP5CanvasHost(draw, [draw]);
  return { canvasHostRef };
}
