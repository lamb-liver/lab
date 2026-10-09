import { useCallback, useState } from 'react';
import { logarithmicScaleModule } from '../../curve/modules/logarithmic-scale';
import type { CurveMetadata, ParamValues } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import { useLogarithmicScaleP5 } from '../curve/useLogarithmicScaleP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';
import { useQuerySyncedParams } from '../curve/useQuerySyncedParams';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const EN_FIELDS: Record<string, string> = {
  a: 'Exponential slope a',
  p: 'Power p',
  m: 'Linear factor m',
};

const EN_STATS: Record<string, string> = {
  a: 'Exponential slope a',
  formula: 'Relation',
  m: 'Linear factor m',
};

function englishMetadata(metadata: CurveMetadata): CurveMetadata {
  return {
    ...metadata,
    title: 'Logarithmic scale',
    stats: metadata.stats.map((stat) => ({
      ...stat,
      label: EN_STATS[stat.key] ?? stat.label,
    })),
  };
}

export default function LogarithmicScaleCurveRoot({ controlsMountId, locale }: Props) {
  const module = logarithmicScaleModule;
  const [targetParams, setTargetParams] = useQuerySyncedParams(module.defaultParams);
  const [revealPct, setRevealPct] = useState(0);

  const onRevealPctChange = useCallback((pct: number) => setRevealPct(pct), []);
  const { canvasHostRef } = useLogarithmicScaleP5({
    targetParams,
    onRevealPctChange,
    locale,
  });

  const compareMode = (targetParams.compareMode ?? 0) !== 0;
  const showExp = (targetParams.showExp ?? 1) !== 0;
  const showPower = (targetParams.showPower ?? 0) !== 0;
  const showLinear = (targetParams.showLinear ?? 0) !== 0;

  const metadata = module.getMetadata(targetParams, {
    revealPct,
    smoothParams: targetParams,
  });
  const shown = locale === 'en' ? englishMetadata(metadata) : metadata;

  const visibleKeys = new Set<string>(['a']);
  if (compareMode && showPower) visibleKeys.add('p');
  if (compareMode && showLinear) visibleKeys.add('m');
  const visibleSchema = module.paramSchema.filter((field) => visibleKeys.has(field.key));
  const shownSchema = locale === 'en'
    ? visibleSchema.map((field) => ({ ...field, label: EN_FIELDS[field.key] ?? field.label }))
    : visibleSchema;

  const patchParams = (patch: ParamValues) => {
    setTargetParams((prev) => ({ ...prev, ...patch }));
  };

  const patchCurveVisibility = (key: 'showExp' | 'showPower' | 'showLinear', current: boolean) => {
    const visibleCount = [showExp, showPower, showLinear].filter(Boolean).length;
    if (current && visibleCount <= 1) return;
    patchParams({ [key]: current ? 0 : 1 });
  };

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={shown}>
      <ParamControls
        module={{ ...module, paramSchema: shownSchema }}
        values={targetParams}
        onChange={(key, value) => patchParams({ [key]: value })}
      />

      <div className="curve-work-mode-toggle" aria-label={locale === 'en' ? 'Compare' : '比較模式'}>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={compareMode}
          onClick={() => patchParams(compareMode ? { compareMode: 0, showExp: 1 } : { compareMode: 1 })}
        >
          {locale === 'en' ? 'Compare' : '比較模式'}
        </button>
      </div>

      {compareMode ? (
        <div className="curve-work-mode-toggle curve-work-mode-toggle--dense" aria-label={locale === 'en' ? 'Curves' : '曲線'}>
          <button
            type="button"
            className="curve-work-mode-button"
            aria-pressed={showExp}
            onClick={() => patchCurveVisibility('showExp', showExp)}
          >
            {locale === 'en' ? 'Exponential' : '指數'}
          </button>
          <button
            type="button"
            className="curve-work-mode-button"
            aria-pressed={showPower}
            onClick={() => patchCurveVisibility('showPower', showPower)}
          >
            {locale === 'en' ? 'Power' : '冪'}
          </button>
          <button
            type="button"
            className="curve-work-mode-button"
            aria-pressed={showLinear}
            onClick={() => patchCurveVisibility('showLinear', showLinear)}
          >
            {locale === 'en' ? 'Linear' : '線性'}
          </button>
        </div>
      ) : null}
    </WorkControlsPortal>
  );

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label={locale === 'en' ? 'Logarithmic scale' : '對數尺度互動視覺化'}
      />
      {controls}
    </>
  );
}
