import { afterEach, describe, expect, it, vi } from 'vitest';
import type p5 from 'p5';
import {
  CANVAS_GESTURE_HOST_CLASS,
  eventClientY,
  lockCanvasTouchAction,
  observeWorksCanvasTouch,
  pointerOnCanvas,
  syncWorksCanvasTouch,
} from './touchToMouse';

function fakeP(opts: { mouseX?: number; mouseY?: number; width?: number; height?: number }): p5 {
  return {
    mouseX: opts.mouseX ?? 0,
    mouseY: opts.mouseY ?? 0,
    width: opts.width ?? 100,
    height: opts.height ?? 100,
  } as unknown as p5;
}

describe('pointerOnCanvas', () => {
  it('uses sketch coordinates when the event has no canvas target', () => {
    expect(pointerOnCanvas(fakeP({ mouseX: 10, mouseY: 10 }))).toBe(true);
    expect(pointerOnCanvas(fakeP({ mouseX: -1, mouseY: 10 }))).toBe(false);
    expect(pointerOnCanvas(fakeP({ mouseX: 10, mouseY: 200, height: 100 }))).toBe(false);
  });
});

describe('eventClientY', () => {
  it('reads clientY from pointer-like events', () => {
    expect(eventClientY({ clientY: 120 } as PointerEvent)).toBe(120);
    expect(eventClientY()).toBeNull();
  });
});

function fakeStyle() {
  const decls = new Map<string, { value: string; priority: string }>();
  return {
    writes: 0,
    setProperty(name: string, value: string, priority = '') {
      this.writes += 1;
      decls.set(name, { value, priority });
    },
    getPropertyValue(name: string) {
      return decls.get(name)?.value ?? '';
    },
    getPropertyPriority(name: string) {
      return decls.get(name)?.priority ?? '';
    },
  };
}

function makeHost(gesture = false) {
  const canvasStyle = fakeStyle();
  const hostStyle = fakeStyle();
  const classes = new Set<string>(gesture ? [CANVAS_GESTURE_HOST_CLASS] : []);
  const canvas = { style: canvasStyle };
  const host = {
    style: hostStyle,
    classList: {
      contains: (name: string) => classes.has(name),
      add: (name: string) => {
        classes.add(name);
      },
    },
    querySelector: (sel: string) => (sel === 'canvas' ? canvas : null),
  };
  return { host: host as unknown as HTMLElement, canvasStyle, hostStyle, classes };
}

function stubViewport(mobile: boolean) {
  vi.stubGlobal('window', {
    matchMedia: (query: string) => ({
      matches: mobile && query.includes('max-width: 1023px'),
      addEventListener() {},
      removeEventListener() {},
    }),
    setTimeout: (handler: TimerHandler, timeout?: number) =>
      globalThis.setTimeout(handler as () => void, timeout) as unknown as number,
    clearTimeout: (id?: number) => {
      globalThis.clearTimeout(id);
    },
  });
}

describe('syncWorksCanvasTouch', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('restores pan-y with important on mobile slider canvases', () => {
    stubViewport(true);
    const { host, canvasStyle } = makeHost();
    canvasStyle.setProperty('touch-action', 'none');
    syncWorksCanvasTouch(host);
    expect(canvasStyle.getPropertyValue('touch-action')).toBe('pan-y');
    expect(canvasStyle.getPropertyPriority('touch-action')).toBe('important');
  });

  it('keeps none with important on gesture hosts', () => {
    stubViewport(true);
    const { host, canvasStyle, hostStyle } = makeHost(true);
    syncWorksCanvasTouch(host);
    expect(canvasStyle.getPropertyValue('touch-action')).toBe('none');
    expect(hostStyle.getPropertyValue('touch-action')).toBe('none');
    expect(canvasStyle.getPropertyPriority('touch-action')).toBe('important');
    expect(hostStyle.getPropertyPriority('touch-action')).toBe('important');
  });

  it('does not overwrite p5 none on desktop', () => {
    stubViewport(false);
    const { host, canvasStyle } = makeHost();
    canvasStyle.setProperty('touch-action', 'none');
    syncWorksCanvasTouch(host);
    expect(canvasStyle.getPropertyValue('touch-action')).toBe('none');
    expect(canvasStyle.getPropertyPriority('touch-action')).toBe('');
  });

  it('does not rewrite when value and important already match', () => {
    stubViewport(true);
    const { host, canvasStyle } = makeHost();
    syncWorksCanvasTouch(host);
    const writes = canvasStyle.writes;
    syncWorksCanvasTouch(host);
    expect(canvasStyle.writes).toBe(writes);
  });
});

describe('observeWorksCanvasTouch', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('re-applies pan-y after style mutations and a 1s late sync', () => {
    vi.useFakeTimers();
    stubViewport(true);
    const callbacks: Array<() => void> = [];
    vi.stubGlobal(
      'MutationObserver',
      class {
        constructor(cb: MutationCallback) {
          callbacks.push(() => {
            cb([], this as unknown as MutationObserver);
          });
        }
        observe() {}
        disconnect() {}
      },
    );
    const { host, canvasStyle } = makeHost();
    const stop = observeWorksCanvasTouch(host);
    expect(canvasStyle.getPropertyValue('touch-action')).toBe('pan-y');

    canvasStyle.setProperty('touch-action', 'none');
    callbacks[0]?.();
    vi.advanceTimersByTime(16);
    expect(canvasStyle.getPropertyValue('touch-action')).toBe('pan-y');
    expect(canvasStyle.getPropertyPriority('touch-action')).toBe('important');

    canvasStyle.setProperty('touch-action', 'none');
    vi.advanceTimersByTime(1000);
    expect(canvasStyle.getPropertyValue('touch-action')).toBe('pan-y');

    stop();
    canvasStyle.setProperty('touch-action', 'none');
    vi.advanceTimersByTime(2000);
    expect(canvasStyle.getPropertyValue('touch-action')).toBe('none');
  });

  it('does not rewrite when the observer re-fires on an identical value', () => {
    vi.useFakeTimers();
    stubViewport(true);
    const callbacks: Array<() => void> = [];
    vi.stubGlobal(
      'MutationObserver',
      class {
        constructor(cb: MutationCallback) {
          callbacks.push(() => {
            cb([], this as unknown as MutationObserver);
          });
        }
        observe() {}
        disconnect() {}
      },
    );
    const { host, canvasStyle } = makeHost();
    observeWorksCanvasTouch(host);
    const writes = canvasStyle.writes;
    callbacks[0]?.();
    vi.advanceTimersByTime(16);
    expect(canvasStyle.writes).toBe(writes);
  });
});

describe('lockCanvasTouchAction', () => {
  it('locks the host with important none', () => {
    const { host, hostStyle, classes } = makeHost();
    lockCanvasTouchAction({} as p5, host);
    expect(hostStyle.getPropertyValue('touch-action')).toBe('none');
    expect(hostStyle.getPropertyPriority('touch-action')).toBe('important');
    expect(classes.has(CANVAS_GESTURE_HOST_CLASS)).toBe(true);
  });
});
