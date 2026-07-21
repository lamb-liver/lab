import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import { measureWorkCanvasSize } from '../../curve/canvasSize';
import {
  clampVectorLength,
  matrixFromParams,
  vectorFromParams,
  type Vector2,
} from '../../curve/modules/eigenvector-geometry';
import {
  createEigenvectorSceneGeometry,
  renderEigenvectorGeometryScene,
  screenToWorld,
  worldToScreen,
} from '../../systems/rendering/eigenvectorGeometryRender';
import { useRectP5CanvasHost, type CanvasSize } from './useRectP5CanvasHost';
import { wireTouchToMouse } from './touchToMouse';

type Options = {
  params: Record<string, number>;
  presetNote?: string;
  onParamsChange: (patch: Record<string, number>) => void;
};

const HIT_RADIUS = 24;

function distance(a: Vector2, b: Vector2): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function measureSquareCanvas(host: HTMLElement): CanvasSize {
  const size = measureWorkCanvasSize(host);
  return { width: size, height: size };
}

export function useEigenvectorGeometryP5({
  params,
  presetNote,
  onParamsChange,
}: Options) {
  const paramsRef = useRef(params);
  const presetNoteRef = useRef(presetNote);
  const onParamsChangeRef = useRef(onParamsChange);
  const draggingURef = useRef(false);

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  useEffect(() => {
    presetNoteRef.current = presetNote;
  }, [presetNote]);

  useEffect(() => {
    onParamsChangeRef.current = onParamsChange;
  }, [onParamsChange]);

  const draw = useCallback((p: p5) => {
    const current = paramsRef.current;
    renderEigenvectorGeometryScene(p, {
      width: p.width,
      height: p.height,
      matrix: matrixFromParams(current),
      u: vectorFromParams(current),
      activeDrag: draggingURef.current,
      presetNote: presetNoteRef.current,
    });
  }, []);
  const extendSketch = useCallback((p: p5) => {
    function updateDrag(): void {
      if (!draggingURef.current) return;
      const geo = createEigenvectorSceneGeometry(p.width, p.height);
      const current = vectorFromParams(paramsRef.current);
      const next = clampVectorLength(
        screenToWorld(geo, { x: p.mouseX, y: p.mouseY }),
        current,
      );
      onParamsChangeRef.current({ ux: next.x, uy: next.y });
    }

    function isNearU(): boolean {
      const geo = createEigenvectorSceneGeometry(p.width, p.height);
      const u = vectorFromParams(paramsRef.current);
      return distance({ x: p.mouseX, y: p.mouseY }, worldToScreen(geo, u)) <= HIT_RADIUS;
    }

    p.mouseMoved = () => {
      if (draggingURef.current) return;
      p.cursor(isNearU() ? 'grab' : 'default');
    };

    p.mousePressed = () => {
      if (!isNearU()) return;
      draggingURef.current = true;
      p.cursor('grabbing');
      updateDrag();
    };

    p.mouseDragged = () => {
      updateDrag();
    };

    p.mouseReleased = () => {
      draggingURef.current = false;
      p.cursor(isNearU() ? 'grab' : 'default');
    };

    wireTouchToMouse(p);

    p.mouseWheel = () => false;
  }, []);
  const canvasHostRef = useRectP5CanvasHost(
    draw,
    [draw, extendSketch],
    measureSquareCanvas,
    extendSketch,
  );

  return { canvasHostRef };
}
