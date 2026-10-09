import { useCallback, useState } from 'react';
import {
  MODE_AREA,
  MODE_INVERSE,
  naturalLogEGeometryModule,
} from '../../curve/modules/natural-log-e-geometry';
import type { CurveMetadata, ParamValues } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import { useNaturalLogEGeometryP5 } from '../curve/useNaturalLogEGeometryP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';
import { useQuerySyncedParams } from '../curve/useQuerySyncedParams';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const EN_STATS: Record<string, string> = {
  t: 'Endpoint t',
  n: 'Partitions n',
};

const EN_VALUES: Record<string, string> = {
  面積: 'Area',
  反函數: 'Inverse',
};

function englishMetadata(metadata: CurveMetadata): CurveMetadata {
  return {
    ...metadata,
    title: 'Geometric definition of the natural logarithm',
    stats: metadata.stats.map((stat) => ({
      ...stat,
      label: EN_STATS[stat.key] ?? stat.label,
      value: EN_VALUES[String(stat.value)] ?? stat.value,
    })),
  };
}

export default function NaturalLogEGeometryCurveRoot({ controlsMountId, locale }: Props) {
  const module = naturalLogEGeometryModule;
  const [targetParams, setTargetParams] = useQuerySyncedParams(module.defaultParams);
  const [revealPct, setRevealPct] = useState(0);

  const onRevealPctChange = useCallback((pct: number) => setRevealPct(pct), []);
  const { canvasHostRef } = useNaturalLogEGeometryP5({
    targetParams,
    onRevealPctChange,
    locale,
  });

  const mode = Math.round(targetParams.mode ?? MODE_AREA);
  const areaMode = mode === MODE_AREA;
  const riemannMode = areaMode && (targetParams.riemannMode ?? 0) !== 0;
  const modeOptions = [
    { value: MODE_AREA, label: locale === 'en' ? 'Area' : '面積' },
    { value: MODE_INVERSE, label: locale === 'en' ? 'Inverse' : '反函數' },
  ];

  const metadata = module.getMetadata(targetParams, {
    revealPct,
    smoothParams: targetParams,
  });
  const shown = locale === 'en' ? englishMetadata(metadata) : metadata;

  const visibleSchema = !areaMode || !riemannMode
    ? module.paramSchema.filter((field) => field.key === 't')
    : module.paramSchema;
  const shownSchema = locale === 'en'
    ? visibleSchema.map((field) => ({ ...field, label: EN_STATS[field.key] ?? field.label }))
    : visibleSchema;

  const patchParams = (patch: ParamValues) => {
    setTargetParams((prev) => {
      const next = { ...prev, ...patch };
      if (patch.mode === MODE_INVERSE) {
        next.riemannMode = 0;
      }
      return next;
    });
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

      <ParamControls
        module={{ ...module, paramSchema: shownSchema }}
        values={targetParams}
        onChange={(key, value) => patchParams({ [key]: value })}
      />

      {areaMode ? (
        <div className="curve-work-mode-toggle" aria-label={locale === 'en' ? 'Advanced' : '進階'}>
          <button
            type="button"
            className="curve-work-mode-button"
            aria-pressed={riemannMode}
            onClick={() => patchParams({ riemannMode: riemannMode ? 0 : 1 })}
          >
            {locale === 'en' ? 'Riemann rectangles' : '黎曼矩形'}
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
        aria-label={locale === 'en' ? 'Geometric definition of the natural logarithm' : '自然對數 e 的幾何定義互動視覺化'}
      />
      {controls}
    </>
  );
}
