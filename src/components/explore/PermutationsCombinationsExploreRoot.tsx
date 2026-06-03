import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { MutableRefObject } from 'react';
import type p5 from 'p5';
import {
  buildDependencyCone,
  buildPascalFrameData,
} from '../../curve/modules/pascals-triangle/geometry';
import {
  buildPathCounts,
  choose,
  generateAllPaths,
  getGridLayout,
  pathToPoints,
} from '../../curve/modules/combinatorial-path-counting/geometry';
import { renderPascalsTriangleScene } from '../../systems/rendering/pascalsTriangleRender';
import { renderCombinatorialPathCountingScene } from '../../systems/rendering/combinatorialPathCountingRender';
import '../../styles/components/explore/permutations-combinations-explore.css';

type P5WithRenderer = p5 & { _renderer?: unknown };

type Mode = 'pascal' | 'path' | 'branch';
type PascalPrime = 2 | 3 | 5 | 7;
type PathView = 'single' | 'overlay' | 'count';

type Params = {
  mode: Mode;
  pascal: {
    rows: number;
    prime: PascalPrime;
    selectedK: number;
  };
  path: {
    m: number;
    n: number;
    view: PathView;
  };
  branch: {
    factor: number;
    depth: number;
  };
};

type Rect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

const GOLD = [212, 184, 122] as const;
const WHITE = [255, 255, 255] as const;
const BLUE = [93, 173, 226] as const;

const DEFAULT_PARAMS: Params = {
  mode: 'pascal',
  pascal: {
    rows: 18,
    prime: 2,
    selectedK: 5,
  },
  path: {
    m: 5,
    n: 4,
    view: 'overlay',
  },
  branch: {
    factor: 2,
    depth: 5,
  },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function fmt(value: number) {
  return new Intl.NumberFormat('zh-TW').format(value);
}

function measurePermutationsCanvas(host: HTMLElement) {
  const width = Math.max(320, Math.floor(host.clientWidth || 640));
  const height = Math.round(clamp(width * 0.62, 340, 560));
  return { width, height };
}

function renderBranchScene(
  p: p5,
  params: Params['branch'],
  phaseRef: MutableRefObject<number>,
) {
  p.background(10, 10, 10);

  const dtSec = Math.min(p.deltaTime || 16.666, 50) / 1000;
  phaseRef.current = Math.min(params.depth, phaseRef.current + dtSec * 1.15);

  const rect: Rect = {
    x: 54,
    y: 34,
    w: Math.max(220, p.width - 108),
    h: Math.max(220, p.height - 82),
  };
  const layers = params.depth + 1;
  const dx = rect.w / Math.max(1, params.depth);
  const maxNodes = Math.max(1, params.factor ** params.depth);

  p.noFill();
  p.stroke(...WHITE, 18);
  p.strokeWeight(1);
  p.rect(rect.x, rect.y, rect.w, rect.h);
  for (let i = 0; i <= params.depth; i += 1) {
    const x = rect.x + dx * i;
    p.stroke(...WHITE, 12);
    p.line(x, rect.y, x, rect.y + rect.h);
  }

  const nodeAt = (depth: number, index: number) => {
    const count = params.factor ** depth;
    const x = rect.x + dx * depth;
    const y = rect.y + rect.h * ((index + 1) / (count + 1));
    return { x, y };
  };

  for (let depth = 0; depth < params.depth; depth += 1) {
    const reveal = clamp(phaseRef.current - depth, 0, 1);
    if (reveal <= 0) continue;
    const parentCount = params.factor ** depth;

    for (let index = 0; index < parentCount; index += 1) {
      const parent = nodeAt(depth, index);
      for (let branch = 0; branch < params.factor; branch += 1) {
        const child = nodeAt(depth + 1, index * params.factor + branch);
        const x = p.lerp(parent.x, child.x, reveal);
        const y = p.lerp(parent.y, child.y, reveal);

        p.stroke(...GOLD, 28 + reveal * 92);
        p.strokeWeight(1.4);
        p.line(parent.x, parent.y, x, y);
      }
    }
  }

  for (let depth = 0; depth < layers; depth += 1) {
    const reveal = clamp(phaseRef.current - depth + 0.65, 0, 1);
    if (reveal <= 0) continue;
    const count = params.factor ** depth;
    const step = Math.max(1, Math.ceil(count / 180));

    for (let index = 0; index < count; index += step) {
      const node = nodeAt(depth, index);
      const density = Math.log(count + 1) / Math.log(maxNodes + 1);
      p.noStroke();
      p.fill(...GOLD, (70 + density * 150) * reveal);
      p.circle(node.x, node.y, Math.max(3.5, 8 - depth * 0.45));
    }
  }

  p.noStroke();
  p.fill(...WHITE, 120);
  p.textFont('monospace');
  p.textSize(12);
  p.textAlign(p.LEFT, p.TOP);
  p.text(`${params.factor}^${params.depth} = ${fmt(maxNodes)} leaves`, rect.x + 10, rect.y + 10);

  p.fill(...BLUE, 140);
  p.textAlign(p.RIGHT, p.BOTTOM);
  p.text('每一層都是一次選擇，總數以乘法展開', rect.x + rect.w - 10, rect.y + rect.h - 10);
}

function renderScene(
  p: p5,
  params: Params,
  phaseRef: MutableRefObject<number>,
) {
  if (params.mode === 'pascal') {
    const row = Math.min(params.pascal.rows, Math.max(0, params.pascal.rows - 2));
    const selectedCell = {
      n: row,
      k: clamp(params.pascal.selectedK, 0, row),
    };
    renderPascalsTriangleScene(p, {
      width: p.width,
      height: p.height,
      frame: buildPascalFrameData({
        rows: params.pascal.rows,
        prime: params.pascal.prime,
      }),
      selectedCell,
      highlightSet: buildDependencyCone(selectedCell.n, selectedCell.k),
      revealProgress: 1,
    });
    return;
  }

  if (params.mode === 'path') {
    const layout = getGridLayout(params.path.m, params.path.n);
    const allPaths = generateAllPaths(params.path.m, params.path.n);
    const currentPath = allPaths[0] ?? [];
    renderCombinatorialPathCountingScene(p, {
      width: p.width,
      height: p.height,
      m: params.path.m,
      n: params.path.n,
      mode: params.path.view,
      layout,
      pathCounts: buildPathCounts(params.path.m, params.path.n),
      allPaths,
      currentPathPoints: pathToPoints(layout, currentPath),
      pathProgress: currentPath.length + 1,
    });
    return;
  }

  renderBranchScene(p, params.branch, phaseRef);
}

function modeName(mode: Mode) {
  if (mode === 'pascal') return '帕斯卡三角形';
  if (mode === 'path') return '路徑計數';
  return '遞迴分支';
}

function pascalValue(n: number, k: number) {
  return choose(n, k);
}

export default function PermutationsCombinationsExploreRoot() {
  const [params, setParams] = useState<Params>(DEFAULT_PARAMS);
  const paramsRef = useRef(params);
  const phaseRef = useRef(0);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<p5 | null>(null);

  useEffect(() => {
    const previousMode = paramsRef.current.mode;
    const previousBranch = paramsRef.current.branch;
    paramsRef.current = params;

    if (
      previousMode !== params.mode ||
      previousBranch.factor !== params.branch.factor ||
      previousBranch.depth !== params.branch.depth
    ) {
      phaseRef.current = params.mode === 'branch' ? 0 : 1;
    }

    instanceRef.current?.redraw();
  }, [params]);

  useEffect(() => {
    const host = canvasHostRef.current;
    if (!host) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    const boot = async () => {
      const { default: P5 } = await import('p5');
      if (disposed) return;

      const sketch = (p: p5) => {
        p.setup = () => {
          const { width, height } = measurePermutationsCanvas(host);
          p.createCanvas(width, height);
          p.pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
          p.noLoop();
        };

        p.draw = () => {
          renderScene(p, paramsRef.current, phaseRef);
          if (paramsRef.current.mode === 'branch' && phaseRef.current < paramsRef.current.branch.depth) {
            p.loop();
          } else {
            p.noLoop();
          }
        };
      };

      const instance = new P5(sketch, host);
      instanceRef.current = instance;

      const ro = new ResizeObserver(() => {
        if (disposed) return;
        if (!(instance as P5WithRenderer)._renderer) return;

        const { width, height } = measurePermutationsCanvas(host);
        instance.resizeCanvas(width, height);
        instance.pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
        instance.redraw();
      });
      ro.observe(host);

      cleanup = () => {
        disposed = true;
        ro.disconnect();
        instance.remove();
        instanceRef.current = null;
      };
    };

    boot();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  const selectedRow = Math.max(0, params.pascal.rows - 2);
  const selectedK = clamp(params.pascal.selectedK, 0, selectedRow);
  const pathTotal = useMemo(
    () => choose(params.path.m + params.path.n, params.path.m),
    [params.path.m, params.path.n],
  );
  const branchTotal = params.branch.factor ** params.branch.depth;

  const stats = useMemo(() => {
    if (params.mode === 'pascal') {
      return [
        `目前模式：${modeName(params.mode)}`,
        `觀察 C(${selectedRow}, ${selectedK}) = ${fmt(pascalValue(selectedRow, selectedK))}`,
        `模 ${params.pascal.prime} 著色保留非零係數`,
      ];
    }

    if (params.mode === 'path') {
      return [
        `目前模式：${modeName(params.mode)}`,
        `從 (0,0) 到 (${params.path.m},${params.path.n})`,
        `路徑總數 C(${params.path.m + params.path.n}, ${params.path.m}) = ${fmt(pathTotal)}`,
      ];
    }

    return [
      `目前模式：${modeName(params.mode)}`,
      `每層 ${params.branch.factor} 個選擇`,
      `葉節點 ${params.branch.factor}^${params.branch.depth} = ${fmt(branchTotal)}`,
    ];
  }, [branchTotal, params, pathTotal, selectedK, selectedRow]);

  const setMode = useCallback((mode: Mode) => {
    setParams((prev) => ({ ...prev, mode }));
  }, []);

  return (
    <div className="permutations-combinations-explore">
      <div className="permutations-combinations-explore__stage">
        <div className="permutations-combinations-explore__visual">
          <div
            ref={canvasHostRef}
            className="permutations-combinations-explore__canvas"
            role="img"
            aria-label="排列組合視覺化"
          />
        </div>

        <aside className="permutations-combinations-explore__sidebar">
          <div className="permutations-combinations-explore__block">
            <p className="permutations-combinations-explore__block-title">參數</p>

            <label className="permutations-combinations-explore__field">
              <span className="permutations-combinations-explore__field-label">模式</span>
              <select
                className="permutations-combinations-explore__select"
                value={params.mode}
                onChange={(e) => setMode(e.target.value as Mode)}
              >
                <option value="pascal">帕斯卡三角形</option>
                <option value="path">路徑計數</option>
                <option value="branch">遞迴分支</option>
              </select>
            </label>

            {params.mode === 'pascal' ? (
              <>
                <RangeControl
                  id="permutations-pascal-rows"
                  label="列數"
                  min={8}
                  max={32}
                  step={1}
                  value={params.pascal.rows}
                  display={String(params.pascal.rows)}
                  onValue={(rows) =>
                    setParams((prev) => ({
                      ...prev,
                      pascal: {
                        ...prev.pascal,
                        rows,
                        selectedK: clamp(prev.pascal.selectedK, 0, rows - 2),
                      },
                    }))
                  }
                />
                <label className="permutations-combinations-explore__field">
                  <span className="permutations-combinations-explore__field-label">模數</span>
                  <select
                    className="permutations-combinations-explore__select"
                    value={params.pascal.prime}
                    onChange={(e) =>
                      setParams((prev) => ({
                        ...prev,
                        pascal: {
                          ...prev.pascal,
                          prime: Number(e.target.value) as PascalPrime,
                        },
                      }))
                    }
                  >
                    <option value={2}>mod 2</option>
                    <option value={3}>mod 3</option>
                    <option value={5}>mod 5</option>
                    <option value={7}>mod 7</option>
                  </select>
                </label>
                <RangeControl
                  id="permutations-pascal-k"
                  label={`觀察 k（第 ${selectedRow} 列）`}
                  min={0}
                  max={selectedRow}
                  step={1}
                  value={selectedK}
                  display={String(selectedK)}
                  onValue={(selectedKValue) =>
                    setParams((prev) => ({
                      ...prev,
                      pascal: { ...prev.pascal, selectedK: selectedKValue },
                    }))
                  }
                />
              </>
            ) : null}

            {params.mode === 'path' ? (
              <>
                <label className="permutations-combinations-explore__field">
                  <span className="permutations-combinations-explore__field-label">顯示</span>
                  <select
                    className="permutations-combinations-explore__select"
                    value={params.path.view}
                    onChange={(e) =>
                      setParams((prev) => ({
                        ...prev,
                        path: { ...prev.path, view: e.target.value as PathView },
                      }))
                    }
                  >
                    <option value="single">單一路徑</option>
                    <option value="overlay">所有路徑疊加</option>
                    <option value="count">節點計數場</option>
                  </select>
                </label>
                <RangeControl
                  id="permutations-path-m"
                  label="向右步數"
                  min={2}
                  max={8}
                  step={1}
                  value={params.path.m}
                  display={String(params.path.m)}
                  onValue={(m) =>
                    setParams((prev) => ({
                      ...prev,
                      path: { ...prev.path, m },
                    }))
                  }
                />
                <RangeControl
                  id="permutations-path-n"
                  label="向上步數"
                  min={2}
                  max={8}
                  step={1}
                  value={params.path.n}
                  display={String(params.path.n)}
                  onValue={(n) =>
                    setParams((prev) => ({
                      ...prev,
                      path: { ...prev.path, n },
                    }))
                  }
                />
              </>
            ) : null}

            {params.mode === 'branch' ? (
              <>
                <RangeControl
                  id="permutations-branch-factor"
                  label="每層選擇數"
                  min={2}
                  max={5}
                  step={1}
                  value={params.branch.factor}
                  display={String(params.branch.factor)}
                  onValue={(factor) =>
                    setParams((prev) => ({
                      ...prev,
                      branch: { ...prev.branch, factor },
                    }))
                  }
                />
                <RangeControl
                  id="permutations-branch-depth"
                  label="深度"
                  min={2}
                  max={7}
                  step={1}
                  value={params.branch.depth}
                  display={String(params.branch.depth)}
                  onValue={(depth) =>
                    setParams((prev) => ({
                      ...prev,
                      branch: { ...prev.branch, depth },
                    }))
                  }
                />
              </>
            ) : null}
          </div>

          <div className="permutations-combinations-explore__block">
            <p className="permutations-combinations-explore__block-title">觀察</p>
            {stats.map((line) => (
              <p key={line} className="permutations-combinations-explore__stat">
                {line}
              </p>
            ))}
            <p className="permutations-combinations-explore__hint">
              同一個 C(n,k) 會同時出現在係數、格點路徑與選擇樹中。
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function RangeControl({
  id,
  label,
  min,
  max,
  step,
  value,
  display,
  onValue,
}: {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  display: string;
  onValue: (value: number) => void;
}) {
  return (
    <div className="control-field">
      <label htmlFor={id}>
        {label}
        <span className="permutations-combinations-explore__val">{display}</span>
      </label>
      <div className="range-wrap">
        <input
          id={id}
          type="range"
          className="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onInput={(e) => onValue(Number((e.target as HTMLInputElement).value))}
        />
      </div>
    </div>
  );
}
