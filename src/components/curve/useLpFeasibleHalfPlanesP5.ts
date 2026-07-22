import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import { measureWorkCanvasSize } from '../../curve/canvasSize';
import {
  ADJUSTABLE_OFFSET,
  AXIS_HALF,
  constraintsOf,
  patchConstraint,
  type LpFeasibleHalfPlanesParams,
} from '../../curve/modules/lp-feasible-half-planes/geometry';
import { createLpLayout, toWorld } from '../../systems/rendering/lpScene';
import { renderLpFeasibleHalfPlanesScene } from '../../systems/rendering/lpFeasibleHalfPlanesRender';
import { useRectP5CanvasHost, type CanvasSize } from './useRectP5CanvasHost';
import { wireTouchToMouse } from './touchToMouse';

type Options = {
  params: LpFeasibleHalfPlanesParams;
  onParamsChange: (patch: Partial<LpFeasibleHalfPlanesParams>) => void;
};

/** 抓取約束線的容差，單位為畫面像素 */
const HIT_PX = 16;

function measureSquareCanvas(host: HTMLElement): CanvasSize {
  const size = measureWorkCanvasSize(host);
  return { width: size, height: size };
}

export function useLpFeasibleHalfPlanesP5({ params, onParamsChange }: Options) {
  const paramsRef = useRef(params);
  const onParamsChangeRef = useRef(onParamsChange);
  const draggingRef = useRef<number | null>(null);

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  useEffect(() => {
    onParamsChangeRef.current = onParamsChange;
  }, [onParamsChange]);

  const draw = useCallback((p: p5) => {
    renderLpFeasibleHalfPlanesScene(p, {
      width: p.width,
      height: p.height,
      params: paramsRef.current,
    });
  }, []);

  const extendSketch = useCallback((p: p5) => {
    /**
     * 只有三條可調約束抓得動；x ≥ 0、y ≥ 0 是場景的框，拖它們會讓
     * 「可行域在第一象限」這個前提消失。
     */
    function nearestAdjustable(): number | null {
      const layout = createLpLayout(p.width, p.height, AXIS_HALF);
      const world = toWorld(layout, { x: p.mouseX, y: p.mouseY });
      const constraints = constraintsOf(paramsRef.current);
      const tolerance = HIT_PX / layout.scale;

      let best: number | null = null;
      let bestDistance = tolerance;
      for (let index = 0; index < 3; index += 1) {
        const con = constraints[ADJUSTABLE_OFFSET + index];
        const norm = Math.hypot(con.a, con.b) || 1;
        // 法向已是單位向量，點到線距離就是左式與 c 的差
        const distance = Math.abs((con.a * world.x + con.b * world.y - con.c) / norm);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = index;
        }
      }
      return best;
    }

    /** 沿法向拖曳：新的位移就是滑鼠位置在法向上的投影 */
    function updateDrag(): void {
      const index = draggingRef.current;
      if (index === null) return;
      const layout = createLpLayout(p.width, p.height, AXIS_HALF);
      const world = toWorld(layout, { x: p.mouseX, y: p.mouseY });
      const con = constraintsOf(paramsRef.current)[ADJUSTABLE_OFFSET + index];
      const offset = Math.max(-AXIS_HALF, Math.min(AXIS_HALF, con.a * world.x + con.b * world.y));
      onParamsChangeRef.current(patchConstraint(index, { offset }));
    }

    p.mouseMoved = () => {
      if (draggingRef.current !== null) return;
      p.cursor(nearestAdjustable() === null ? 'default' : 'grab');
    };

    p.mousePressed = () => {
      const index = nearestAdjustable();
      draggingRef.current = index;
      if (index === null) return;
      p.cursor('grabbing');
      // 抓住哪一條就選中哪一條，側欄滑桿跟著切過去
      onParamsChangeRef.current({ selected: index });
      updateDrag();
    };

    p.mouseDragged = () => {
      updateDrag();
    };

    p.mouseReleased = () => {
      draggingRef.current = null;
      p.cursor(nearestAdjustable() === null ? 'default' : 'grab');
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
