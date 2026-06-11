import { useEffect, useRef } from 'react';
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

type Options = {
  params: Record<string, number>;
  presetNote?: string;
  onParamsChange: (patch: Record<string, number>) => void;
};

const HIT_RADIUS = 24;
type P5WithRenderer = p5 & { _renderer?: unknown };

function distance(a: Vector2, b: Vector2): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function useEigenvectorGeometryP5({
  params,
  presetNote,
  onParamsChange,
}: Options) {
  const canvasHostRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const host = canvasHostRef.current;
    if (!host) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    const boot = async () => {
      const { default: P5 } = await import('p5');
      if (disposed) return;

      const sketch = (p: p5) => {
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

        p.setup = () => {
          const size = measureWorkCanvasSize(host);
          p.createCanvas(size, size);
          p.pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
        };

        p.draw = () => {
          const current = paramsRef.current;
          renderEigenvectorGeometryScene(p, {
            width: p.width,
            height: p.height,
            matrix: matrixFromParams(current),
            u: vectorFromParams(current),
            activeDrag: draggingURef.current,
            presetNote: presetNoteRef.current,
          });
        };

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

        p.mouseWheel = () => false;
      };

      const instance = new P5(sketch, host);

      const ro = new ResizeObserver(() => {
        if (disposed) return;
        if (!(instance as P5WithRenderer)._renderer) return;
        const size = measureWorkCanvasSize(host);
        instance.resizeCanvas(size, size);
        instance.pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
      });
      ro.observe(host);

      cleanup = () => {
        disposed = true;
        ro.disconnect();
        instance.remove();
      };
    };

    boot();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  return { canvasHostRef };
}
