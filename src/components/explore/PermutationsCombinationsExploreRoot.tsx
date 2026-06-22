import { useCallback, useMemo, useRef, useState } from 'react';
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
import {
  buildCombinationStats,
  catalanContrast,
  recurrenceFormulaLabel,
  recurrenceParts,
  type CombinationMode,
} from '../../explore/permutations-combinations/geometry';
import { useRectP5CanvasHost } from '../curve/useRectP5CanvasHost';
import '../../styles/components/explore/permutations-combinations-explore.css';

type Mode = CombinationMode;
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
  recurrence: {
    n: number;
    k: number;
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
const GREEN = [84, 190, 146] as const;
const MUTED = [150, 150, 150] as const;

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
  recurrence: {
    n: 6,
    k: 2,
  },
};
const CATALAN_N4 = catalanContrast(4);

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

function renderRecurrenceScene(p: p5, params: Params['recurrence']) {
  p.background(10, 10, 10);

  const rect: Rect = {
    x: 44,
    y: 34,
    w: Math.max(240, p.width - 88),
    h: Math.max(230, p.height - 78),
  };
  const safeN = Math.max(3, Math.min(10, Math.round(params.n)));
  const safeK = Math.max(0, Math.min(safeN, Math.round(params.k)));
  const parts = recurrenceParts(safeN, safeK);
  const cone = buildDependencyCone(safeN, safeK);
  const compact = p.width < 560;
  const rowGap = rect.h / Math.max(1, safeN);
  const colGap = Math.min(rect.w / (safeN + 1), rowGap * 1.35);

  p.noFill();
  p.stroke(...WHITE, 18);
  p.strokeWeight(1);
  p.rect(rect.x, rect.y, rect.w, rect.h, 10);

  const nodeAt = (n: number, k: number) => {
    const x = rect.x + rect.w / 2 + (k - n / 2) * colGap;
    const y = rect.y + 62 + n * rowGap * 0.82;
    return { x, y };
  };

  for (let n = 1; n <= safeN; n += 1) {
    for (let k = 0; k <= n; k += 1) {
      if (!cone.has(`${n}:${k}`)) continue;
      const child = nodeAt(n, k);
      const parents = [
        { n: n - 1, k: k - 1 },
        { n: n - 1, k },
      ];
      for (const parentCell of parents) {
        if (parentCell.k < 0 || parentCell.k > parentCell.n) continue;
        if (!cone.has(`${parentCell.n}:${parentCell.k}`)) continue;
        const parent = nodeAt(parentCell.n, parentCell.k);
        const isTargetEdge = n === safeN && k === safeK;
        p.stroke(...(isTargetEdge ? GOLD : WHITE), isTargetEdge ? 128 : 26);
        p.strokeWeight(isTargetEdge ? 2.2 : 1);
        p.line(parent.x, parent.y, child.x, child.y);
      }
    }
  }

  for (let n = 0; n <= safeN; n += 1) {
    for (let k = 0; k <= n; k += 1) {
      if (!cone.has(`${n}:${k}`)) continue;
      const node = nodeAt(n, k);
      const isTarget = n === safeN && k === safeK;
      const isParent =
        n === safeN - 1 && (k === safeK - 1 || k === safeK);
      const value = choose(n, k);
      p.noStroke();
      p.fill(...(isTarget ? GOLD : isParent ? GREEN : BLUE), isTarget ? 230 : isParent ? 190 : 120);
      p.circle(node.x, node.y, isTarget ? 18 : isParent ? 15 : 11);
      p.fill(...WHITE, isTarget ? 230 : 170);
      p.textFont('monospace');
      p.textSize(isTarget ? 12 : 10);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(String(value), node.x, node.y + 0.5);
    }
  }

  p.noStroke();
  p.fill(...GOLD, 220);
  p.textFont('monospace');
  p.textSize(13);
  p.textAlign(p.LEFT, p.TOP);
  p.text(`C(${safeN}, ${safeK}) = ${fmt(parts.total)}`, rect.x + 14, rect.y + 14);

  p.fill(...MUTED, 180);
  p.textSize(11);
  p.text(recurrenceFormulaLabel(safeN, safeK), rect.x + 14, rect.y + 34);

  if (!compact) {
    p.fill(...BLUE, 150);
    p.textAlign(p.RIGHT, p.BOTTOM);
    p.text('依賴錐只保留會流入目標格的加總關係', rect.x + rect.w - 12, rect.y + rect.h - 12);
  }
}

function renderScene(
  p: p5,
  params: Params,
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

  renderRecurrenceScene(p, params.recurrence);
}

export default function PermutationsCombinationsExploreRoot() {
  const [params, setParams] = useState<Params>(DEFAULT_PARAMS);
  const paramsRef = useRef(params);

  paramsRef.current = params;

  const draw = useCallback((p: p5) => {
    renderScene(p, paramsRef.current);
  }, []);
  const canvasHostRef = useRectP5CanvasHost(draw, [draw], measurePermutationsCanvas, undefined, {
    loop: false,
    redrawKey: params,
  });

  const selectedRow = Math.max(0, params.pascal.rows - 2);
  const selectedK = clamp(params.pascal.selectedK, 0, selectedRow);

  const stats = useMemo(() => {
    return buildCombinationStats({
      mode: params.mode,
      pascal: {
        n: selectedRow,
        k: selectedK,
        prime: params.pascal.prime,
      },
      path: params.path,
      recurrence: params.recurrence,
    });
  }, [params, selectedK, selectedRow]);

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
                <option value="pascal">係數表</option>
                <option value="path">路徑模型</option>
                <option value="recurrence">遞迴依賴</option>
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

            {params.mode === 'recurrence' ? (
              <>
                <RangeControl
                  id="permutations-recurrence-n"
                  label="目標列 n"
                  min={3}
                  max={10}
                  step={1}
                  value={params.recurrence.n}
                  display={String(params.recurrence.n)}
                  onValue={(n) =>
                    setParams((prev) => ({
                      ...prev,
                      recurrence: {
                        ...prev.recurrence,
                        n,
                        k: clamp(prev.recurrence.k, 0, n),
                      },
                    }))
                  }
                />
                <RangeControl
                  id="permutations-recurrence-k"
                  label={`目標格 k（第 ${params.recurrence.n} 列）`}
                  min={0}
                  max={params.recurrence.n}
                  step={1}
                  value={params.recurrence.k}
                  display={String(params.recurrence.k)}
                  onValue={(k) =>
                    setParams((prev) => ({
                      ...prev,
                      recurrence: { ...prev.recurrence, k },
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
              同一個 C(n,k) 會同時出現在係數、格點路徑與遞迴依賴中。
            </p>
          </div>

          <div className="permutations-combinations-explore__block">
            <p className="permutations-combinations-explore__block-title">卡特蘭對照</p>
            <p className="permutations-combinations-explore__hint">
              卡特蘭數不是新的 C(n,k)：它從 C(2n,n) 的平衡路徑中排除越過限制線的路徑。
            </p>
            <p className="permutations-combinations-explore__stat">
              n = 4：全部 {fmt(CATALAN_N4.totalBalanced)}，合法 {fmt(CATALAN_N4.legal)}，排除 {fmt(CATALAN_N4.restrictedOut)}
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
