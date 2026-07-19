import { useCallback } from 'react';
import type p5 from 'p5';
import type { LinePlaneParams } from '../../curve/modules/line-plane-intersection/geometry';
import { renderLinePlaneIntersectionScene } from '../../systems/rendering/linePlaneIntersectionRender';
import { useOrbitViewP5 } from './useOrbitViewP5';

type Options = {
  params: LinePlaneParams;
  onParamsChange: (patch: Partial<LinePlaneParams>) => void;
};

export function useLinePlaneIntersectionP5({ params, onParamsChange }: Options) {
  const render = useCallback((p: p5, current: LinePlaneParams, rotating: boolean) => {
    renderLinePlaneIntersectionScene(p, {
      width: p.width,
      height: p.height,
      params: current,
      rotating,
    });
  }, []);

  return useOrbitViewP5({
    params,
    onParamsChange,
    render,
    redrawKey: `${params.planeTilt}|${params.planeAzimuth}|${params.h}|${params.lineTilt}|${params.lineAzimuth}|${params.originZ}|${params.yaw}|${params.pitch}`,
  });
}
