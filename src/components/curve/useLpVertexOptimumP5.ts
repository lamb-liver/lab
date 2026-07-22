import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import { measureWorkCanvasSize } from '../../curve/canvasSize';
import {
  AXIS_HALF,
  computeVertexOptimumMetrics,
  type LpVertexOptimumParams,
} from '../../curve/modules/lp-vertex-optimum/geometry';
import { createLpLayout, toScreen } from '../../systems/rendering/lpScene';
import { renderLpVertexOptimumScene } from '../../systems/rendering/lpVertexOptimumRender';
import { useRectP5CanvasHost, type CanvasSize } from './useRectP5CanvasHost';
import { wireTouchToMouse } from './touchToMouse';

type Options = {
  params: LpVertexOptimumParams;
  onParamsChange: (patch: Partial<LpVertexOptimumParams>) => void;
};

const HIT_PX = 22;

function measureSquareCanvas(host: HTMLElement): CanvasSize {
  const size = measureWorkCanvasSize(host);
  return { width: size, height: size };
}

export function useLpVertexOptimumP5({ params, onParamsChange }: Options) {
  const paramsRef = useRef(params);
  const onParamsChangeRef = useRef(onParamsChange);

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  useEffect(() => {
    onParamsChangeRef.current = onParamsChange;
  }, [onParamsChange]);

  const draw = useCallback((p: p5) => {
    renderLpVertexOptimumScene(p, {
      width: p.width,
      height: p.height,
      params: paramsRef.current,
    });
  }, []);

  const extendSketch = useCallback((p: p5) => {
    /** 點圖上的頂點就跳到候選表的那一列，兩邊指的是同一件事 */
    function hitCandidate(): number | null {
      const layout = createLpLayout(p.width, p.height, AXIS_HALF);
      const metrics = computeVertexOptimumMetrics(paramsRef.current);

      for (const [index, candidate] of metrics.candidates.entries()) {
        const screen = toScreen(layout, candidate.point);
        if (Math.hypot(p.mouseX - screen.x, p.mouseY - screen.y) <= HIT_PX) return index;
      }
      return null;
    }

    p.mouseMoved = () => {
      p.cursor(hitCandidate() === null ? 'default' : 'pointer');
    };

    p.mousePressed = () => {
      const index = hitCandidate();
      if (index === null) return;
      // 再點一次同一個頂點就取消走訪，回到整表一起看
      onParamsChangeRef.current({
        visiting: paramsRef.current.visiting === index ? -1 : index,
      });
    };

    wireTouchToMouse(p);
  }, []);

  const canvasHostRef = useRectP5CanvasHost(
    draw,
    [draw, extendSketch],
    measureSquareCanvas,
    extendSketch,
  );

  return { canvasHostRef };
}
