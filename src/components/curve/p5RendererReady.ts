import type p5 from 'p5';

type RendererBackedP5 = p5 & { _renderer?: unknown };

export function isP5RendererReady(instance: p5): boolean {
  return Boolean((instance as RendererBackedP5)._renderer);
}
