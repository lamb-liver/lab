import { useCallback, useMemo, useState } from 'react';
import {
  DEFAULT_LP_VERTEX_OPTIMUM_PARAMS,
  computeVertexOptimumMetrics,
  edgeParallelAngle,
  lpVertexOptimumModule,
  lpVertexOptimumParamsForMetadata,
  nextVisiting,
  type LpVertexOptimumParams,
} from '../../curve/modules/lp-vertex-optimum';
import { formatPoint } from '../../curve/linearProgramming';
import type { CurveMetadata } from '../../curve/types';
import { useLpVertexOptimumP5 } from '../curve/useLpVertexOptimumP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';
import '../../styles/components/works/lp-vertex-table.css';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

function englishMetadata(metadata: CurveMetadata): CurveMetadata {
  return {
    ...metadata,
    title: 'Finding the optimum at a vertex',
    formula: metadata.formula.replace('，最優在角點取得', ', optimum at a corner point'),
    stats: metadata.stats.map((stat) => {
      const value = String(stat.value);
      switch (stat.key) {
        case 'objective':
          return { ...stat, label: 'Objective' };
        case 'sense':
          return { ...stat, label: 'Find', value: value === '最大值' ? 'maximum' : 'minimum' };
        case 'count':
          return { ...stat, label: 'Candidate vertices' };
        case 'best':
          return { ...stat, label: 'Optimal value', value: value === '不存在' ? 'none' : value };
        case 'where':
          return {
            ...stat,
            label: stat.label === '並列最優' ? 'Tied optimum' : 'Optimal vertex',
            value: value === '無' ? 'none' : value.replace(/、/g, ', '),
          };
        default:
          return stat;
      }
    }),
  };
}

export default function LpVertexOptimumCurveRoot({ controlsMountId, locale }: Props) {
  const en = locale === 'en';
  const [params, setParams] = useState<LpVertexOptimumParams>(
    DEFAULT_LP_VERTEX_OPTIMUM_PARAMS,
  );
  const [sortByValue, setSortByValue] = useState(false);

  const onParamsChange = useCallback((patch: Partial<LpVertexOptimumParams>) => {
    setParams((prev) => ({ ...prev, ...patch }));
  }, []);

  const { canvasHostRef } = useLpVertexOptimumP5({ params, onParamsChange, locale });

  const metrics = useMemo(() => computeVertexOptimumMetrics(params), [params]);
  const rawMetadata = lpVertexOptimumModule.getMetadata(lpVertexOptimumParamsForMetadata(params));
  const metadata = en ? englishMetadata(rawMetadata) : rawMetadata;

  /**
   * 排序只換顯示順序，不動 candidates 的索引——走訪與畫布高亮都用原索引，
   * 排序後仍要指到同一個頂點。
   */
  const rows = useMemo(() => {
    const indexed = metrics.candidates.map((candidate, index) => ({ candidate, index }));
    if (!sortByValue) return indexed;
    return [...indexed].sort((l, r) => l.candidate.rank - r.candidate.rank);
  }, [metrics.candidates, sortByValue]);

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={metadata}>
      <table className="lp-vertex-table">
        <caption>
          {en
            ? 'Candidates (tap a vertex in the figure to switch rows)'
            : '候選表（點圖上的頂點也可切換）'}
        </caption>
        <thead>
          <tr>
            <th scope="col">{en ? 'Vertex' : '頂點'}</th>
            <th scope="col">z</th>
            <th scope="col">{en ? 'Rank' : '名次'}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ candidate, index }) => (
            <tr
              key={`${candidate.point.x}-${candidate.point.y}`}
              data-optimal={candidate.optimal}
              data-visiting={metrics.visitingIndex === index}
            >
              <td>{formatPoint(candidate.point, 1)}</td>
              <td>{candidate.value.toFixed(2)}</td>
              <td>{candidate.rank + 1}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {metrics.tiedCount > 1 ? (
        <p className="lp-vertex-table__note">
          {en
            ? 'Two rows tie for the optimum: the level line lies along this edge, so every point on it has the same z.'
            : '兩列並列最優：等值線與這條邊重合，邊上每個點的 z 都一樣。'}
        </p>
      ) : null}

      <div className="control-field">
        <label htmlFor="lp-vertex-angle">
          <span>{en ? 'Objective direction θ' : '目標方向 θ'}</span>
          <span className="control-field__value">{params.angle.toFixed(0)}°</span>
        </label>
        <div className="range-wrap">
          <input
            id="lp-vertex-angle"
            type="range"
            className="range"
            min={0}
            max={360}
            step={1}
            value={params.angle}
            onInput={(event) => onParamsChange({ angle: Number(event.currentTarget.value) })}
          />
        </div>
      </div>

      <div className="curve-work-mode-toggle">
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={params.sense === 'max'}
          onClick={() => onParamsChange({ sense: 'max' })}
        >
          {en ? 'Maximize' : '求最大值'}
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={params.sense === 'min'}
          onClick={() => onParamsChange({ sense: 'min' })}
        >
          {en ? 'Minimize' : '求最小值'}
        </button>
      </div>

      <div className="curve-work-mode-toggle">
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={params.shape === 'quad'}
          onClick={() => onParamsChange({ shape: 'quad', visiting: -1 })}
        >
          {en ? 'Quadrilateral region' : '四邊形可行域'}
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={params.shape === 'triangle'}
          onClick={() => onParamsChange({ shape: 'triangle', visiting: -1 })}
        >
          {en ? 'Triangular region' : '三角形可行域'}
        </button>
      </div>

      <div className="curve-work-mode-toggle curve-work-mode-toggle--dense">
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed="false"
          onClick={() =>
            onParamsChange({ visiting: nextVisiting(params, metrics.candidates.length) })
          }
        >
          {en ? 'Step through' : '逐一走訪'}
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={sortByValue}
          onClick={() => setSortByValue((prev) => !prev)}
        >
          {en ? 'Sort by z' : '依 z 排序'}
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed="false"
          onClick={() => onParamsChange({ angle: edgeParallelAngle(params.shape), visiting: -1 })}
        >
          {en ? 'Edge optimum' : '邊段最優'}
        </button>
      </div>
    </WorkControlsPortal>
  );

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label={
          en
            ? 'Finding the optimum at a vertex. Tap a vertex to switch the table row.'
            : '頂點法求最優解互動：點選頂點可切換候選表的列'
        }
      />
      {controls}
    </>
  );
}
