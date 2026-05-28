import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import { PASCAL_REVEAL_SPEED } from '../../curve/modules/pascals-triangle';
import {
  PASCAL_VIEW,
  buildDependencyCone,
  buildPascalFrameData,
  pickCellAtWorld,
} from '../../curve/modules/pascals-triangle/geometry';
import type { ParamValues } from '../../curve/types';
import { renderPascalsTriangleScene } from '../../systems/rendering/pascalsTriangleRender';
import { useP5CanvasHost } from './useP5CanvasHost';

type Options = {
  defaultParams: ParamValues;
  targetParams: ParamValues;
  onRevealPctChange: (pct: number) => void;
};

export function usePascalsTriangleP5({ defaultParams, targetParams, onRevealPctChange }: Options) {
  const targetParamsRef = useRef<ParamValues>(defaultParams);
  const revealRef = useRef(0);
  const selectedCellRef = useRef<{ n: number; k: number } | null>(null);
  const highlightSetRef = useRef<Set<string>>(new Set());
  const lastParamsKeyRef = useRef(paramsKey(defaultParams));
  const lastRevealPctRef = useRef(-1);
  const onRevealPctChangeRef = useRef(onRevealPctChange);
  const pointerDownRef = useRef(false);

  useEffect(() => {
    targetParamsRef.current = targetParams;
  }, [targetParams]);

  useEffect(() => {
    onRevealPctChangeRef.current = onRevealPctChange;
  }, [onRevealPctChange]);

  const draw = useCallback((p: p5) => {
    const params = targetParamsRef.current;
    const key = paramsKey(params);
    if (key !== lastParamsKeyRef.current) {
      lastParamsKeyRef.current = key;
      revealRef.current = 0;
      selectedCellRef.current = null;
      highlightSetRef.current = new Set();
    }

    revealRef.current = Math.min(1, revealRef.current + PASCAL_REVEAL_SPEED);
    const frame = buildPascalFrameData(params);

    const pressed = p.mouseIsPressed;
    if (pressed && !pointerDownRef.current) {
      pointerDownRef.current = true;
      const world = toWorldPoint(p, p.mouseX, p.mouseY);
      const picked = pickCellAtWorld(frame.cellMap, world.x, world.y);
      if (picked) {
        selectedCellRef.current = picked;
        highlightSetRef.current = buildDependencyCone(picked.n, picked.k);
      }
    } else if (!pressed) {
      pointerDownRef.current = false;
    }

    renderPascalsTriangleScene(p, {
      width: p.width,
      height: p.height,
      frame,
      selectedCell: selectedCellRef.current,
      highlightSet: highlightSetRef.current,
      revealProgress: revealRef.current,
    });

    const pct = Math.floor(revealRef.current * 100);
    if (pct !== lastRevealPctRef.current) {
      lastRevealPctRef.current = pct;
      onRevealPctChangeRef.current(pct);
    }
  }, []);

  const canvasHostRef = useP5CanvasHost(draw, [draw]);
  return { canvasHostRef };
}

function paramsKey(params: ParamValues): string {
  return [Math.round(params.rows ?? 24), Math.round(params.prime ?? 2)].join('|');
}

function toWorldPoint(p: p5, x: number, y: number): { x: number; y: number } {
  const scale = Math.min(p.width / PASCAL_VIEW.width, p.height / PASCAL_VIEW.height);
  const offsetX = (p.width - PASCAL_VIEW.width * scale) / 2;
  const offsetY = (p.height - PASCAL_VIEW.height * scale) / 2;
  return {
    x: (x - offsetX) / scale,
    y: (y - offsetY) / scale,
  };
}
