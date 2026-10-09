import { useCallback, useState } from 'react';
import { logisticCurveModule } from '../../curve/modules/logistic-curve';
import type { CurveMetadata, ParamValues } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import { useLogisticCurveP5 } from '../curve/useLogisticCurveP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';
import { useQuerySyncedParams } from '../curve/useQuerySyncedParams';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const EN_FIELDS: Record<string, string> = {
  L: 'Carrying capacity L',
  k: 'Growth rate k',
  a: 'Initial offset a',
};

const EN_STATS: Record<string, string> = {
  dyMax: 'Max dy/dt',
};

function englishMetadata(metadata: CurveMetadata): CurveMetadata {
  return {
    ...metadata,
    title: 'Logistic curve',
    stats: metadata.stats.map((stat) => ({
      ...stat,
      label: EN_STATS[stat.key] ?? stat.label,
    })),
  };
}

export default function LogisticCurveCurveRoot({ controlsMountId, locale }: Props) {
  const module = logisticCurveModule;
  const [targetParams, setTargetParams] = useQuerySyncedParams(module.defaultParams);
  const [smoothParams, setSmoothParams] = useState<ParamValues>(module.defaultParams);
  const [revealPct, setRevealPct] = useState(0);
  const [resetNonce, setResetNonce] = useState(0);

  const onRevealPctChange = useCallback((pct: number) => setRevealPct(pct), []);
  const onSmoothParamsChange = useCallback(
    (params: ParamValues) => setSmoothParams((prev) => ({ ...prev, ...params })),
    [],
  );

  const { canvasHostRef } = useLogisticCurveP5({
    targetParams,
    resetNonce,
    onRevealPctChange,
    onSmoothParamsChange,
    locale,
  });

  const showDyDt = (targetParams.showDyDt ?? 1) !== 0;
  const showExpCompare = (targetParams.showExpCompare ?? 1) !== 0;

  const metadata = module.getMetadata(targetParams, {
    revealPct,
    smoothParams,
  });
  const shown = locale === 'en' ? englishMetadata(metadata) : metadata;
  const shownSchema = locale === 'en'
    ? module.paramSchema.map((field) => ({ ...field, label: EN_FIELDS[field.key] ?? field.label }))
    : module.paramSchema;

  const controls = (
    <WorkControlsPortal
      controlsMountId={controlsMountId}
      metadata={shown}
      metaExtra={
        <p className="curve-work-controls__formula">
          {locale === 'en' ? 'Continuous-time model, not the discrete bifurcation diagram' : '連續時間模型，不是離散分岔圖'}
        </p>
      }
    >

      <ParamControls
        module={{ ...module, paramSchema: shownSchema }}
        values={targetParams}
        onChange={(key, value) => setTargetParams((prev) => ({ ...prev, [key]: value }))}
      />

      <div className="curve-work-mode-toggle" aria-label={locale === 'en' ? 'Display' : '顯示選項'}>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={showDyDt}
          onClick={() =>
            setTargetParams((prev) => ({
              ...prev,
              showDyDt: showDyDt ? 0 : 1,
            }))
          }
        >
          {locale === 'en' ? 'Show dy/dt' : '顯示 dy/dt'}
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={showExpCompare}
          onClick={() =>
            setTargetParams((prev) => ({
              ...prev,
              showExpCompare: showExpCompare ? 0 : 1,
            }))
          }
        >
          {locale === 'en' ? 'Compare Ce^kt' : '指數對照 Ce^kt'}
        </button>
      </div>

      <div className="curve-work-mode-toggle" aria-label={locale === 'en' ? 'Reset' : '重設'}>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={false}
          onClick={() => {
            setTargetParams(module.defaultParams);
            setResetNonce((prev) => prev + 1);
          }}
        >
          {locale === 'en' ? 'Reset' : '重設參數'}
        </button>
      </div>

    </WorkControlsPortal>
  );

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label={locale === 'en' ? 'Logistic curve' : '邏輯斯蒂曲線互動視覺化'}
      />
      {controls}
    </>
  );
}
