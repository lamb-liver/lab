import type p5 from 'p5';

export const CANVAS_GESTURE_HOST_CLASS = 'curve-work-canvas-host--gestures';

type SketchCanvasP5 = p5 & {
  canvas?: HTMLElement;
  _renderer?: { canvas?: HTMLElement };
};

export function sketchCanvasElement(p: p5): HTMLElement | null {
  const canvas = (p as SketchCanvasP5).canvas ?? (p as SketchCanvasP5)._renderer?.canvas;
  if (!canvas || typeof HTMLElement === 'undefined') return null;
  return canvas instanceof HTMLElement ? canvas : null;
}

export function pointerOnCanvas(p: p5, event?: Event): boolean {
  const canvas = sketchCanvasElement(p);
  const target = event?.target;
  if (canvas && typeof Node !== 'undefined' && target instanceof Node) {
    if (canvas === target || canvas.contains(target)) return true;
    const host = canvas.parentElement;
    if (host && (target === host || host.contains(target))) return true;
  }
  return p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height;
}

export function eventClientY(event?: Event): number | null {
  if (!event) return null;
  if ('touches' in event) {
    const touchEvent = event as TouchEvent;
    const touch = touchEvent.touches[0] ?? touchEvent.changedTouches[0];
    return touch ? touch.clientY : null;
  }
  if ('clientY' in event && typeof (event as PointerEvent).clientY === 'number') {
    return (event as PointerEvent).clientY;
  }
  return null;
}

/** 有畫布觸控拖／轉的 sketch 才呼叫。無手勢頁不要呼叫，否則會誤設 none。 */
export function lockCanvasTouchAction(p: p5): void {
  const canvas = sketchCanvasElement(p);
  if (!canvas) return;
  canvas.style.touchAction = 'none';
  const host = canvas.parentElement;
  if (!host) return;
  host.style.touchAction = 'none';
  host.classList.add(CANVAS_GESTURE_HOST_CLASS);
}

/**
 * 把觸控轉接到既有的 mouse handler，並鎖住該 canvas 的預設捲動手勢。
 *
 * Works 手機預設 `touch-action: pan-y`（純側欄頁要能從畫布捲頁）。
 * 有畫布拖／轉的頁必須把該 canvas（與 host）設成 `none`（底層保障）。
 *
 * p5 2.2 走 window pointer：`return false` 才 preventDefault。
 * mousePressed `return true` = 沒中把手，之後用 scrollBy 捲頁（none 時瀏覽器不會自己滾）。
 * touchStarted／touchMoved 回傳 false 仍保留當舊路徑雙保險。
 *
 * 在 sketch 指派完 mouse handler 之後呼叫。
 */
export function wireTouchToMouse(p: p5): void {
  lockCanvasTouchAction(p);
  const pressed = p.mousePressed;
  const dragged = p.mouseDragged;
  const released = p.mouseReleased;
  let scrolling = false;
  let lastY = 0;

  const panIfScrolling = (event?: Event): boolean => {
    const y = eventClientY(event);
    if (y != null) {
      window.scrollBy(0, lastY - y);
      lastY = y;
    }
    return false;
  };

  const onPressed = (event?: Event) => {
    scrolling = false;
    const y = eventClientY(event);
    if (y != null) lastY = y;
    const result =
      typeof pressed === 'function' ? (pressed as (event?: Event) => unknown).call(p, event) : undefined;
    if (result === true) {
      scrolling = true;
      return true;
    }
    if (result === false) return false;
    return pointerOnCanvas(p, event) ? false : undefined;
  };

  const onDragged = (event?: Event) => {
    if (scrolling) return panIfScrolling(event);
    const result =
      typeof dragged === 'function' ? (dragged as (event?: Event) => unknown).call(p, event) : undefined;
    if (result === false || result === true) return result;
    return pointerOnCanvas(p, event) ? false : undefined;
  };

  const onReleased = (event?: Event) => {
    const wasScrolling = scrolling;
    scrolling = false;
    if (wasScrolling) return false;
    const result =
      typeof released === 'function' ? (released as (event?: Event) => unknown).call(p, event) : undefined;
    if (result === false || result === true) return result;
    return pointerOnCanvas(p, event) ? false : undefined;
  };

  p.mousePressed = onPressed as typeof p.mousePressed;
  p.mouseDragged = onDragged as typeof p.mouseDragged;
  p.mouseReleased = onReleased as typeof p.mouseReleased;
  p.touchStarted = onPressed as typeof p.touchStarted;
  p.touchMoved = onDragged as typeof p.touchMoved;
  p.touchEnded = onReleased as typeof p.touchEnded;
}
