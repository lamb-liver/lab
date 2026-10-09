import { useCallback, useEffect, useState } from 'react';
import { juliaSetModule } from '../../curve/modules/julia-set';
import type { CurveMetadata, ParamValues } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import { useJuliaP5 } from '../curve/useJuliaP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';
import { useQuerySyncedParams } from '../curve/useQuerySyncedParams';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const EN_PARAM_LABELS: Record<string, string> = {
  cx: 'Real part Re(c)',
  cy: 'Imaginary part Im(c)',
  maxIter: 'Maximum iterations',
};

function englishMetadata(metadata: CurveMetadata): CurveMetadata {
  return {
    ...metadata,
    title: 'Julia set',
    stats: metadata.stats.map((stat) => ({
      ...stat,
      label:
        stat.key === 'mode'
          ? 'Mode'
          : stat.key === 'iter'
            ? 'Maximum iterations'
            : stat.key === 'progress'
              ? 'Progress'
              : stat.label,
      value:
        stat.key === 'mode'
          ? stat.value === 'drift'
            ? 'Parameter drift'
            : 'Manual c'
          : stat.value,
    })),
  };
}

export default function JuliaSetCurveRoot({ controlsMountId, locale }: Props) {
  const module = juliaSetModule;
  const en = locale === 'en';
  const controlsModule = en
    ? {
        ...module,
        paramSchema: module.paramSchema.map((def) => ({
          ...def,
          label: EN_PARAM_LABELS[def.key] ?? def.label,
        })),
      }
    : module;

  const [targetParams, setTargetParams] = useQuerySyncedParams(module.defaultParams);
  const [renderPct, setRenderPct] = useState(0);
  const [smoothParams, setSmoothParams] = useState<ParamValues>({
    cx: module.defaultParams.cx,
    cy: module.defaultParams.cy,
  });

  const onRenderProgress = useCallback((pct: number) => setRenderPct(pct), []);

  useEffect(() => {
    setRenderPct(0);
  }, [targetParams.cx, targetParams.cy, targetParams.maxIter]);
  const onSmoothCChange = useCallback((cx: number, cy: number) => {
    setSmoothParams((prev) => ({ ...prev, cx, cy }));
  }, []);

  const { canvasHostRef } = useJuliaP5({
    targetParams,
    onRenderProgress,
    onSmoothCChange,
  });

  const metadata = module.getMetadata(targetParams, {
    revealPct: renderPct,
    smoothParams: {
      ...targetParams,
      cx: smoothParams.cx ?? targetParams.cx,
      cy: smoothParams.cy ?? targetParams.cy,
    },
  });
  const shown = en ? englishMetadata(metadata) : metadata;

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={shown}>
      <div
        className="curve-work-mode-toggle"
        role="group"
        aria-label={en ? 'Julia set parameter drift' : '朱利亞集合參數漂移'}
      >
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={Math.round(targetParams.autoDrift ?? 0) === 0}
          onClick={() =>
            setTargetParams((prev) => ({ ...prev, autoDrift: 0 }))
          }
        >
          {en ? 'Manual c' : '手動 c'}
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={Math.round(targetParams.autoDrift ?? 0) === 1}
          onClick={() =>
            setTargetParams((prev) => ({ ...prev, autoDrift: 1 }))
          }
        >
          {en ? 'Parameter drift' : '參數漂移'}
        </button>
      </div>
      <ParamControls
        module={controlsModule}
        values={targetParams}
        onChange={(key, value) => {
          setTargetParams((prev) => ({ ...prev, [key]: value }));
        }}
      />
    </WorkControlsPortal>
  );

  return (
    <>
      <div className="julia-stage" aria-busy={renderPct < 100}>
        <div
          ref={canvasHostRef}
          className="curve-work-canvas-host work-canvas"
          aria-label={en ? 'Julia set fractal' : '朱利亞集合分形'}
        />
        {renderPct < 100 ? (
          <div className="julia-recalc" role="status">
            {en ? `Recalculating... ${renderPct}%` : `重新計算中… ${renderPct}%`}
          </div>
        ) : null}
      </div>
      {controls}
    </>
  );
}
