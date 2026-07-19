import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import { measureWorkCanvasSize } from '../../curve/canvasSize';
import { clamp } from '../../curve/projection3d';
import { useRectP5CanvasHost, type CanvasSize } from './useRectP5CanvasHost';

/**
 * 空間向量系列共用的「拖動畫布旋轉視角」掛載。
 *
 * 這些作品都用 p5 2D 加自寫正交投影（見 `src/curve/projection3d.ts`），
 * 視角以 yaw／pitch 兩個角度存在參數裡，靠滑鼠拖曳改變。旋轉不改變任何數學量，
 * 只換觀察方向——這正是它們要讓讀者看見的事。
 */

export type OrbitView = { yaw: number; pitch: number };

type Options<P extends OrbitView> = {
  params: P;
  onParamsChange: (patch: Partial<P>) => void;
  /** 由各作品的 renderer 決定畫什麼；`rotating` 供拖曳中的提示使用 */
  render: (p: p5, params: P, rotating: boolean) => void;
  /** 參數變動時觸發重畫的鍵值 */
  redrawKey: string;
};

/** 每像素轉多少度；橫向旋 yaw、縱向抬 pitch */
const YAW_PER_PX = 0.45;
const PITCH_PER_PX = 0.35;
const PITCH_LIMIT = 80;

function measureSquareCanvas(host: HTMLElement): CanvasSize {
  const size = measureWorkCanvasSize(host);
  return { width: size, height: size };
}

/** yaw 允許連續繞圈，正規化到 (−180, 180] 避免數值無限增長 */
export function normalizeYaw(yaw: number): number {
  return ((((yaw + 180) % 360) + 360) % 360) - 180;
}

export function clampPitch(pitch: number): number {
  return clamp(pitch, -PITCH_LIMIT, PITCH_LIMIT);
}

export function useOrbitViewP5<P extends OrbitView>({
  params,
  onParamsChange,
  render,
  redrawKey,
}: Options<P>) {
  const paramsRef = useRef(params);
  const onParamsChangeRef = useRef(onParamsChange);
  const renderRef = useRef(render);
  const rotatingRef = useRef(false);
  const lastPointerRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  useEffect(() => {
    onParamsChangeRef.current = onParamsChange;
  }, [onParamsChange]);

  useEffect(() => {
    renderRef.current = render;
  }, [render]);

  const draw = useCallback((p: p5) => {
    renderRef.current(p, paramsRef.current, rotatingRef.current);
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
      const patch = {
        yaw: normalizeYaw(current.yaw + dx * YAW_PER_PX),
        pitch: clampPitch(current.pitch + dy * PITCH_PER_PX),
      } as Partial<P>;

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

  const canvasHostRef = useRectP5CanvasHost(
    draw,
    [draw, extendSketch],
    measureSquareCanvas,
    extendSketch,
    { loop: false, redrawKey },
  );

  return { canvasHostRef };
}
