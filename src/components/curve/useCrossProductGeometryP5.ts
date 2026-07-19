import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import { measureWorkCanvasSize } from '../../curve/canvasSize';
import { clamp } from '../../curve/projection3d';
import type { CrossProductGeometryParams } from '../../curve/modules/cross-product-geometry/geometry';
import { renderCrossProductGeometryScene } from '../../systems/rendering/crossProductGeometryRender';
import { useRectP5CanvasHost, type CanvasSize } from './useRectP5CanvasHost';

type Options = {
  params: CrossProductGeometryParams;
  onParamsChange: (patch: Partial<CrossProductGeometryParams>) => void;
};

/** 每像素轉多少度；橫向旋 yaw、縱向抬 pitch */
const YAW_PER_PX = 0.45;
const PITCH_PER_PX = 0.35;
const PITCH_LIMIT = 80;

function measureSquareCanvas(host: HTMLElement): CanvasSize {
  const size = measureWorkCanvasSize(host);
  return { width: size, height: size };
}

export function useCrossProductGeometryP5({ params, onParamsChange }: Options) {
  const paramsRef = useRef(params);
  const onParamsChangeRef = useRef(onParamsChange);
  const rotatingRef = useRef(false);
  const lastPointerRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  useEffect(() => {
    onParamsChangeRef.current = onParamsChange;
  }, [onParamsChange]);

  const draw = useCallback((p: p5) => {
    renderCrossProductGeometryScene(p, {
      width: p.width,
      height: p.height,
      params: paramsRef.current,
      rotating: rotatingRef.current,
    });
  }, []);

  const extendSketch = useCallback((p: p5) => {
    function insideCanvas(): boolean {
      return p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height;
    }

    p.mouseMoved = () => {
      if (rotatingRef.current) return;
      p.cursor(insideCanvas() ? 'grab' : 'default');
    };

    p.mousePressed = () => {
      if (!insideCanvas()) return;
      rotatingRef.current = true;
      lastPointerRef.current = { x: p.mouseX, y: p.mouseY };
      p.cursor('grabbing');
      p.redraw();
    };

    p.mouseDragged = () => {
      if (!rotatingRef.current) return;
      const last = lastPointerRef.current;
      if (!last) return;

      const dx = p.mouseX - last.x;
      const dy = p.mouseY - last.y;
      lastPointerRef.current = { x: p.mouseX, y: p.mouseY };

      const current = paramsRef.current;
      // yaw 允許連續繞圈；pitch 夾住避免翻過頭導致方位難以理解
      const yaw = ((current.yaw + dx * YAW_PER_PX + 180) % 360 + 360) % 360 - 180;
      const pitch = clamp(current.pitch + dy * PITCH_PER_PX, -PITCH_LIMIT, PITCH_LIMIT);

      const patch = { yaw, pitch };
      paramsRef.current = { ...current, ...patch };
      onParamsChangeRef.current(patch);
      p.redraw();
    };

    p.mouseReleased = () => {
      rotatingRef.current = false;
      lastPointerRef.current = null;
      p.cursor(insideCanvas() ? 'grab' : 'default');
      p.redraw();
    };
  }, []);

  const redrawKey = `${params.theta}|${params.lenB}|${params.phi}|${params.yaw}|${params.pitch}|${params.mode}`;
  const canvasHostRef = useRectP5CanvasHost(
    draw,
    [draw, extendSketch],
    measureSquareCanvas,
    extendSketch,
    { loop: false, redrawKey },
  );

  return { canvasHostRef };
}
