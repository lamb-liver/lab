import { useCallback } from 'react';
import type p5 from 'p5';
import type { SpaceVectorProjectionParams } from '../../curve/modules/space-vector-three-plane-projection/geometry';
import { renderSpaceVectorThreePlaneProjectionScene } from '../../systems/rendering/spaceVectorThreePlaneProjectionRender';
import { useOrbitViewP5 } from './useOrbitViewP5';

type Options = {
  params: SpaceVectorProjectionParams;
  onParamsChange: (patch: Partial<SpaceVectorProjectionParams>) => void;
  locale?: 'en';
};

export function useSpaceVectorThreePlaneProjectionP5({
  params,
  onParamsChange,
  locale,
}: Options) {
  const render = useCallback(
    (p: p5, current: SpaceVectorProjectionParams, rotating: boolean) => {
      renderSpaceVectorThreePlaneProjectionScene(p, {
        width: p.width,
        height: p.height,
        params: current,
        rotating,
        locale,
      });
    },
    [locale],
  );

  return useOrbitViewP5({
    params,
    onParamsChange,
    render,
    redrawKey: `${params.vx}|${params.vy}|${params.vz}|${params.yaw}|${params.pitch}|${params.plane}`,
  });
}
