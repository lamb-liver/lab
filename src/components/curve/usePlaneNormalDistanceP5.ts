import { useCallback } from 'react';
import type p5 from 'p5';
import type { PlaneNormalDistanceParams } from '../../curve/modules/plane-normal-distance/geometry';
import { renderPlaneNormalDistanceScene } from '../../systems/rendering/planeNormalDistanceRender';
import { useOrbitViewP5 } from './useOrbitViewP5';

type Options = {
  params: PlaneNormalDistanceParams;
  onParamsChange: (patch: Partial<PlaneNormalDistanceParams>) => void;
};

export function usePlaneNormalDistanceP5({ params, onParamsChange }: Options) {
  const render = useCallback((p: p5, current: PlaneNormalDistanceParams, rotating: boolean) => {
    renderPlaneNormalDistanceScene(p, {
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
    redrawKey: `${params.planeTilt}|${params.planeAzimuth}|${params.h}|${params.pointX}|${params.pointZ}|${params.scale}|${params.yaw}|${params.pitch}`,
  });
}
