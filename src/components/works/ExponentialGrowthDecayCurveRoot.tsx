import { useCallback, useState } from 'react';
import {
  MODE_DECAY,
  MODE_GROWTH,
  exponentialGrowthDecayModule,
} from '../../curve/modules/exponential-growth-decay';
import type { CurveMetadata, ParamValues } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import { useExponentialGrowthDecayP5 } from '../curve/useExponentialGrowthDecayP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';
import { useQuerySyncedParams } from '../curve/useQuerySyncedParams';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const EN_FIELDS: Record<string, string> = {
  c: 'Initial value C',
  kAbs: 'Rate |k|',
  tNorm: 'Tangent position t/tmax',
};

const EN_STAT_LABELS: Record<string, string> = {
  k: 'Rate k',
  mode: 'Mode',
  t0: 'Point of tangency t₀',
  slope: 'Slope dy/dt',
};

const EN_MODE_VALUES: Record<string, string> = {
  成長: 'Growth',
  衰減: 'Decay',
};

function englishMetadata(metadata: CurveMetadata): CurveMetadata {
  return {
    ...metadata,
    title: 'Exponential growth and decay',
    stats: metadata.stats.map((stat) => ({
      ...stat,
      label:
        stat.key === 'T'
          ? stat.label === '半衰期 T₁/₂'
            ? 'Half-life T₁/₂'
            : 'Doubling time T₊'
          : (EN_STAT_LABELS[stat.key] ?? stat.label),
      value:
        stat.key === 'mode'
          ? (EN_MODE_VALUES[String(stat.value)] ?? stat.value)
          : stat.value,
    })),
  };
}

export default function ExponentialGrowthDecayCurveRoot({ controlsMountId, locale }: Props) {
  const module = exponentialGrowthDecayModule;
  const [targetParams, setTargetParams] = useQuerySyncedParams(module.defaultParams);
  const [revealPct, setRevealPct] = useState(0);

  const onRevealPctChange = useCallback((pct: number) => setRevealPct(pct), []);
  const { canvasHostRef } = useExponentialGrowthDecayP5({
    targetParams,
    onRevealPctChange,
    locale,
  });

  const mode = Math.round(targetParams.mode ?? MODE_GROWTH);
  const logScale = (targetParams.logScale ?? 0) !== 0;
  const tangentMode = (targetParams.tangentMode ?? 0) !== 0;
  const modeOptions = [
    { value: MODE_GROWTH, label: locale === 'en' ? 'Growth' : '成長' },
    { value: MODE_DECAY, label: locale === 'en' ? 'Decay' : '衰減' },
  ];

  const metadata = module.getMetadata(targetParams, {
    revealPct,
    smoothParams: targetParams,
  });
  const shown = locale === 'en' ? englishMetadata(metadata) : metadata;

  const visibleSchema = tangentMode
    ? module.paramSchema
    : module.paramSchema.filter((field) => field.key !== 'tNorm');
  const shownSchema = locale === 'en'
    ? visibleSchema.map((field) => ({ ...field, label: EN_FIELDS[field.key] ?? field.label }))
    : visibleSchema;

  const patchParams = (patch: ParamValues) => {
    setTargetParams((prev) => ({ ...prev, ...patch }));
  };

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={shown}>
      <div className="curve-work-mode-toggle curve-work-mode-toggle--dense" aria-label={locale === 'en' ? 'Mode' : '模式'}>
        {modeOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            className="curve-work-mode-button"
            aria-pressed={mode === option.value}
            onClick={() => patchParams({ mode: option.value })}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="curve-work-mode-toggle" aria-label={locale === 'en' ? 'Display' : '顯示選項'}>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={logScale}
          onClick={() => patchParams({ logScale: logScale ? 0 : 1 })}
        >
          {locale === 'en' ? 'ln y scale' : 'ln y 尺度'}
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={tangentMode}
          onClick={() => patchParams({ tangentMode: tangentMode ? 0 : 1 })}
        >
          {locale === 'en' ? 'Tangent slope' : '切線斜率'}
        </button>
      </div>

      <ParamControls
        module={{ ...module, paramSchema: shownSchema }}
        values={targetParams}
        onChange={(key, value) => patchParams({ [key]: value })}
      />
    </WorkControlsPortal>
  );

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label={locale === 'en' ? 'Exponential growth and decay' : '指數成長與衰減互動視覺化'}
      />
      {controls}
    </>
  );
}
