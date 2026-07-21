import { useCallback } from 'react';
import type p5 from 'p5';
import type { CrossProductGeometryParams } from '../../curve/modules/cross-product-geometry/geometry';
import { renderCrossProductGeometryScene } from '../../systems/rendering/crossProductGeometryRender';
import { useOrbitViewP5 } from './useOrbitViewP5';

type Options = {
  params: CrossProductGeometryParams;
  onParamsChange: (patch: Partial<CrossProductGeometryParams>) => void;
};

export function useCrossProductGeometryP5({ params, onParamsChange }: Options) {
  const render = useCallback(
    (p: p5, current: CrossProductGeometryParams, rotating: boolean) => {
      renderCrossProductGeometryScene(p, {
        width: p.width,
        height: p.height,
        params: current,
        rotating,
      });
    },
    [],
  );

  return useOrbitViewP5({
    params,
    onParamsChange,
    render,
    redrawKey: `${params.theta}|${params.lenB}|${params.phi}|${params.yaw}|${params.pitch}|${params.mode}`,
  });
}
