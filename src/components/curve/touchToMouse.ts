import type p5 from 'p5';

export const CANVAS_GESTURE_HOST_CLASS = 'curve-work-canvas-host--gestures';

type SketchCanvasP5 = p5 & {
  canvas?: HTMLElement;
  _renderer?: { canvas?: HTMLElement };
};

function asHtmlElement(value: unknown): HTMLElement | null {
  if (typeof HTMLElement === 'undefined' || value == null) return null;
  if (value instanceof HTMLElement) return value;
  if (typeof value === 'object' && 'elt' in value) {
    const elt = (value as { elt: unknown }).elt;
    if (elt instanceof HTMLElement) return elt;
  }
  return null;
}

export function sketchCanvasElement(p: p5): HTMLElement | null {
  const raw = (p as SketchCanvasP5).canvas ?? (p as SketchCanvasP5)._renderer?.canvas;
  return asHtmlElement(raw);
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

function setTouchAction(el: { style: CSSStyleDeclaration }, value: string): void {
  el.style.setProperty('touch-action', value, 'important');
}

/**
 * p5 setup 結束後會把頁上所有 canvas 設成 none。
 * 非拖點頁在手機要改回 pan-y（important），否則從圖上無法捲頁。
 */
export function syncWorksCanvasTouch(host: HTMLElement): void {
  const canvas = host.querySelector('canvas') as HTMLElement | null;
  if (!canvas?.style) return;
  if (host.classList.contains(CANVAS_GESTURE_HOST_CLASS)) {
    setTouchAction(canvas, 'none');
    setTouchAction(host, 'none');
    return;
  }
  if (typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches) {
    setTouchAction(canvas, 'pan-y');
  }
}

/** 監 childList／style／class；debounce 後同步，並在 1s 再補一次以蓋過 p5 晚寫的 none。 */
export function observeWorksCanvasTouch(host: HTMLElement): () => void {
  let debounce: ReturnType<typeof setTimeout> | undefined;
  const run = () => syncWorksCanvasTouch(host);
  const schedule = () => {
    if (debounce !== undefined) clearTimeout(debounce);
    debounce = setTimeout(run, 16);
  };
  const mo =
    typeof MutationObserver === 'undefined'
      ? null
      : new MutationObserver(schedule);
  mo?.observe(host, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class'],
  });
  run();
  const late = typeof window === 'undefined' ? undefined : window.setTimeout(run, 1000);
  return () => {
    mo?.disconnect();
    if (debounce !== undefined) clearTimeout(debounce);
    if (late !== undefined) window.clearTimeout(late);
  };
}

/** 有畫布觸控拖／轉的 sketch 才呼叫。無手勢頁不要呼叫，否則會誤設 none。 */
export function lockCanvasTouchAction(p: p5, host?: HTMLElement | null): void {
  const canvas = sketchCanvasElement(p) ?? asHtmlElement(host?.querySelector('canvas'));
  const wrap = host ?? canvas?.parentElement;
  if (canvas) setTouchAction(canvas, 'none');
  if (!wrap) return;
  setTouchAction(wrap, 'none');
  wrap.classList.add(CANVAS_GESTURE_HOST_CLASS);
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
export function wireTouchToMouse(p: p5, host?: HTMLElement | null): void {
  const lock = () => lockCanvasTouchAction(p, host);
  lock();
  queueMicrotask(lock);
  if (typeof requestAnimationFrame === 'function') requestAnimationFrame(lock);
  if (typeof window !== 'undefined') window.setTimeout(lock, 50);
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
