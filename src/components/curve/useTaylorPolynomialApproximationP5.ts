import { useCallback, useEffect, useRef } from 'react';
import type p5 from 'p5';
import { measureWorkCanvasSize } from '../../curve/canvasSize';
import {
  clampA,
  type TaylorPreset,
} from '../../curve/modules/taylor-polynomial-approximation';
import {
  aFromTaylorPointer,
  isTaylorPointerInPlot,
  renderTaylorPolynomialApproximationScene,
} from '../../systems/rendering/taylorPolynomialApproximationRender';
import { useRectP5CanvasHost, type CanvasSize } from './useRectP5CanvasHost';

type Options = {
  preset: TaylorPreset;
  a: number;
  n: number;
  showError: boolean;
  showTerms: boolean;
  onAChange: (a: number) => void;
};

function measureSquareCanvas(host: HTMLElement): CanvasSize {
  const size = measureWorkCanvasSize(host);
  return { width: size, height: size };
}

export function useTaylorPolynomialApproximationP5({
  preset,
  a,
  n,
  showError,
  showTerms,
  onAChange,
}: Options) {
  const presetRef = useRef(preset);
  const aRef = useRef(a);
  const nRef = useRef(n);
  const showErrorRef = useRef(showError);
  const showTermsRef = useRef(showTerms);
  const onAChangeRef = useRef(onAChange);
  const draggingRef = useRef(false);

  useEffect(() => {
    presetRef.current = preset;
    aRef.current = clampA(preset, aRef.current);
  }, [preset]);

  useEffect(() => {
    aRef.current = a;
  }, [a]);

  useEffect(() => {
    nRef.current = n;
  }, [n]);

  useEffect(() => {
    showErrorRef.current = showError;
  }, [showError]);

  useEffect(() => {
    showTermsRef.current = showTerms;
  }, [showTerms]);

  useEffect(() => {
    onAChangeRef.current = onAChange;
  }, [onAChange]);

  const draw = useCallback((p: p5) => {
    renderTaylorPolynomialApproximationScene(p, {
      size: p.width,
      preset: presetRef.current,
      a: clampA(presetRef.current, aRef.current),
      n: nRef.current,
      showError: showErrorRef.current,
      showTerms: showTermsRef.current,
      activeDrag: draggingRef.current,
    });
  }, []);

  const extendSketch = useCallback((p: p5) => {
    const updateDrag = () => {
      if (!draggingRef.current) return;
      const next = aFromTaylorPointer(p.width, p.mouseX, presetRef.current);
      aRef.current = next;
      onAChangeRef.current(next);
      p.redraw();
    };

    p.mouseMoved = () => {
      p.cursor(isTaylorPointerInPlot(p.width, p.mouseX, p.mouseY) ? 'ew-resize' : 'default');
    };

    p.mousePressed = () => {
      if (!isTaylorPointerInPlot(p.width, p.mouseX, p.mouseY)) {
        return true;
      }
      draggingRef.current = true;
      updateDrag();
      return false;
    };

    p.mouseDragged = () => {
      updateDrag();
      return draggingRef.current ? false : true;
    };

    p.mouseReleased = () => {
      const wasDragging = draggingRef.current;
      draggingRef.current = false;
      if (wasDragging) p.redraw();
      return wasDragging ? false : true;
    };

    p.touchStarted = () => p.mousePressed();
    p.touchMoved = () => p.mouseDragged();
    p.touchEnded = () => p.mouseReleased();
    p.mouseWheel = () => !isTaylorPointerInPlot(p.width, p.mouseX, p.mouseY);
  }, []);

  const redrawKey = `${preset.id}|${a}|${n}|${showError ? 1 : 0}|${showTerms ? 1 : 0}`;
  const canvasHostRef = useRectP5CanvasHost(
    draw,
    [draw, extendSketch],
    measureSquareCanvas,
    extendSketch,
    { loop: false, redrawKey },
  );

  return { canvasHostRef };
}
