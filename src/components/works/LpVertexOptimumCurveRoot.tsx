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
import { useLpVertexOptimumP5 } from '../curve/useLpVertexOptimumP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';
import '../../styles/components/works/lp-vertex-table.css';

type Props = {
  controlsMountId: string;
};

export default function LpVertexOptimumCurveRoot({ controlsMountId }: Props) {
  const [params, setParams] = useState<LpVertexOptimumParams>(
    DEFAULT_LP_VERTEX_OPTIMUM_PARAMS,
  );
  const [sortByValue, setSortByValue] = useState(false);

  const onParamsChange = useCallback((patch: Partial<LpVertexOptimumParams>) => {
    setParams((prev) => ({ ...prev, ...patch }));
  }, []);

  const { canvasHostRef } = useLpVertexOptimumP5({ params, onParamsChange });

  const metrics = useMemo(() => computeVertexOptimumMetrics(params), [params]);
  const metadata = lpVertexOptimumModule.getMetadata(lpVertexOptimumParamsForMetadata(params));

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
        <caption>候選表（點圖上的頂點也可切換）</caption>
        <thead>
          <tr>
            <th scope="col">頂點</th>
            <th scope="col">z</th>
            <th scope="col">名次</th>
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
          兩列並列最優：等值線與這條邊重合，邊上每個點的 z 都一樣。
        </p>
      ) : null}

      <div className="control-field">
        <label htmlFor="lp-vertex-angle">
          <span>目標方向 θ</span>
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
          求最大值
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={params.sense === 'min'}
          onClick={() => onParamsChange({ sense: 'min' })}
        >
          求最小值
        </button>
      </div>

      <div className="curve-work-mode-toggle">
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={params.shape === 'quad'}
          onClick={() => onParamsChange({ shape: 'quad', visiting: -1 })}
        >
          四邊形可行域
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={params.shape === 'triangle'}
          onClick={() => onParamsChange({ shape: 'triangle', visiting: -1 })}
        >
          三角形可行域
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
          逐一走訪
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={sortByValue}
          onClick={() => setSortByValue((prev) => !prev)}
        >
          依 z 排序
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed="false"
          onClick={() => onParamsChange({ angle: edgeParallelAngle(params.shape), visiting: -1 })}
        >
          邊段最優
        </button>
      </div>
    </WorkControlsPortal>
  );

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label="頂點法求最優解互動：點選頂點可切換候選表的列"
      />
      {controls}
    </>
  );
}
