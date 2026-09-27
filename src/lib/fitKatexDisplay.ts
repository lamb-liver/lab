export const KATEX_FIT_MIN_SCALE = 0.35;

export function fitKatexDisplay(
  box: HTMLElement,
  minScale = KATEX_FIT_MIN_SCALE,
): number {
  const inner = box.querySelector<HTMLElement>('.katex');
  if (!inner) return 1;

  inner.style.transform = '';
  inner.style.transformOrigin = '';
  box.style.height = '';
  box.style.textAlign = '';
  delete box.dataset.katexFitted;

  const available = box.clientWidth;
  const needed = inner.scrollWidth;
  if (!(available > 0) || needed <= available + 1) return 1;

  const scale = Math.max(minScale, available / needed);
  inner.style.display = 'inline-block';
  inner.style.transformOrigin = 'left top';
  inner.style.transform = `scale(${scale})`;
  box.style.textAlign = 'left';
  box.style.height = `${inner.getBoundingClientRect().height}px`;
  if (inner.getBoundingClientRect().width <= available + 1) {
    box.dataset.katexFitted = '';
  }
  return scale;
}

export function fitKatexDisplays(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('.prose .katex-display').forEach((el) => {
    fitKatexDisplay(el);
  });
}

export function bindKatexDisplayFit(root: ParentNode = document): () => void {
  const run = () => fitKatexDisplays(root);
  run();
  void document.fonts?.ready?.then(run);
  window.addEventListener('resize', run);
  let ro: ResizeObserver | undefined;
  if (typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(run);
    root.querySelectorAll('.prose').forEach((node) => ro?.observe(node));
  }
  return () => {
    window.removeEventListener('resize', run);
    ro?.disconnect();
  };
}
