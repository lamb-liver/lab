import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import { measureWorkCanvasSize } from '../../curve/canvasSize';
import {
  AXIS_HALF,
  computeObjectiveMetrics,
  levelFromPoint,
  type LpObjectiveLevelCurvesParams,
} from '../../curve/modules/lp-objective-level-curves/geometry';
import { SCENE_MIN } from '../../curve/linearProgramming';
import { createLpLayout, toScreen, toWorld } from '../../systems/rendering/lpScene';
import { renderLpObjectiveLevelCurvesScene } from '../../systems/rendering/lpObjectiveLevelCurvesRender';
import { useRectP5CanvasHost, type CanvasSize } from './useRectP5CanvasHost';
import { wireTouchToMouse } from './touchToMouse';

type Options = {
  params: LpObjectiveLevelCurvesParams;
  onParamsChange: (patch: Partial<LpObjectiveLevelCurvesParams>) => void;
};

type DragTarget = 'testPoint' | 'level';

const POINT_HIT_PX = 20;

function measureSquareCanvas(host: HTMLElement): CanvasSize {
  const size = measureWorkCanvasSize(host);
  return { width: size, height: size };
}

function clampToScene(value: number): number {
  return Math.max(SCENE_MIN, Math.min(AXIS_HALF, value));
}

export function useLpObjectiveLevelCurvesP5({ params, onParamsChange }: Options) {
  const paramsRef = useRef(params);
  const onParamsChangeRef = useRef(onParamsChange);
  const dragRef = useRef<DragTarget | null>(null);

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  useEffect(() => {
    onParamsChangeRef.current = onParamsChange;
  }, [onParamsChange]);

  const draw = useCallback((p: p5) => {
    renderLpObjectiveLevelCurvesScene(p, {
      width: p.width,
      height: p.height,
      params: paramsRef.current,
      draggingTestPoint: dragRef.current === 'testPoint',
    });
  }, []);

  const extendSketch = useCallback((p: p5) => {
    /**
     * 測試點優先於等值線：兩者常常疊在一起（測試點本來就落在某條等值線上），
     * 先判點才抓得到它。
     */
    function pickTarget(): DragTarget | null {
      const layout = createLpLayout(p.width, p.height, AXIS_HALF);
      const metrics = computeObjectiveMetrics(paramsRef.current);
      const mouse = { x: p.mouseX, y: p.mouseY };

      const testScreen = toScreen(layout, metrics.testPoint);
      if (Math.hypot(mouse.x - testScreen.x, mouse.y - testScreen.y) <= POINT_HIT_PX) {
        return 'testPoint';
      }

      if (metrics.degenerate) return null;
      const world = toWorld(layout, mouse);
      const distance =
        Math.abs(paramsRef.current.p * world.x + paramsRef.current.q * world.y - paramsRef.current.k) /
        metrics.normalLength;
      return distance * layout.scale <= POINT_HIT_PX ? 'level' : null;
    }

    function updateDrag(): void {
      const target = dragRef.current;
      if (!target) return;
      const layout = createLpLayout(p.width, p.height, AXIS_HALF);
      const world = toWorld(layout, { x: p.mouseX, y: p.mouseY });

      if (target === 'testPoint') {
        onParamsChangeRef.current({ tx: clampToScene(world.x), ty: clampToScene(world.y) });
        return;
      }
      // 拖等值線就是把 k 設成滑鼠位置的 z 值——線自然跟著手走
      onParamsChangeRef.current({ k: levelFromPoint(paramsRef.current, world) });
    }

    p.mouseMoved = () => {
      if (dragRef.current) return;
      p.cursor(pickTarget() ? 'grab' : 'default');
    };

    p.mousePressed = () => {
      dragRef.current = pickTarget();
      if (!dragRef.current) return;
      p.cursor('grabbing');
      updateDrag();
    };

    p.mouseDragged = () => {
      updateDrag();
    };

    p.mouseReleased = () => {
      dragRef.current = null;
      p.cursor(pickTarget() ? 'grab' : 'default');
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
