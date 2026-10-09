import { useCallback, useState } from 'react';
import {
  MODE_AREA,
  MODE_COMPARE,
  MODE_EULER,
  MODE_PARAM,
  MODE_PARTIAL,
  MODE_PSERIES,
  baselProblemModule,
} from '../../curve/modules/basel-problem';
import type { CurveMetadata, CurveModule, ParamValues } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import { useBaselProblemP5 } from '../curve/useBaselProblemP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';
import { useQuerySyncedParams } from '../curve/useQuerySyncedParams';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const MODE_LABELS = {
  [MODE_PARTIAL]: { zh: '部分和', en: 'Partial sum' },
  [MODE_AREA]: { zh: '面積', en: 'Area' },
  [MODE_COMPARE]: { zh: '比較', en: 'Compare' },
  [MODE_EULER]: { zh: 'Euler', en: 'Euler' },
  [MODE_PSERIES]: { zh: 'p-級數', en: 'p-series' },
  [MODE_PARAM]: { zh: '零點', en: 'Zeros' },
} as const;

const EN_PARAM_LABELS: Record<string, string> = {
  N: 'Number of terms N',
  p: 'Exponent p',
};

function presentMetadata(metadata: CurveMetadata, locale?: 'en'): CurveMetadata {
  if (locale !== 'en') return metadata;
  return {
    ...metadata,
    title: 'Basel problem',
    stats: metadata.stats.map((stat) => {
      if (stat.key === 'mode') {
        const match = Object.values(MODE_LABELS).find((item) => item.zh === stat.value);
        return { ...stat, label: 'Mode', value: match?.en ?? stat.value };
      }
      if (stat.key === 'N') return { ...stat, label: 'Number of terms N' };
      if (stat.key === 'error') return { ...stat, label: '|Error|' };
      return stat;
    }),
  };
}

function controlsModule(module: CurveModule, locale?: 'en'): CurveModule {
  if (locale !== 'en') return module;
  return {
    ...module,
    paramSchema: module.paramSchema.map((def) => ({
      ...def,
      label: EN_PARAM_LABELS[def.key] ?? def.label,
    })),
  };
}

export default function BaselProblemCurveRoot({ controlsMountId, locale }: Props) {
  const module = baselProblemModule;
  const [targetParams, setTargetParams] = useQuerySyncedParams(module.defaultParams);
  const [revealPct, setRevealPct] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [replayNonce, setReplayNonce] = useState(0);

  const onRevealPctChange = useCallback((pct: number) => setRevealPct(pct), []);

  const { canvasHostRef } = useBaselProblemP5({
    targetParams,
    playing,
    replayNonce,
    onRevealPctChange,
    locale,
  });

  const metadata = presentMetadata(
    module.getMetadata(targetParams, {
      revealPct,
      smoothParams: targetParams,
    }),
    locale,
  );

  const patchParams = (patch: ParamValues) => {
    setTargetParams((prev) => ({ ...prev, ...patch }));
  };

  const mode = Math.round(targetParams.mode ?? MODE_PARTIAL);

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={metadata}>
      <div className="curve-work-mode-toggle curve-work-mode-toggle--dense" aria-label={locale === 'en' ? 'Basel view' : '巴塞爾視圖'}>
        {Object.entries(MODE_LABELS).map(([value, labels]) => (
          <button
            key={value}
            type="button"
            className="curve-work-mode-button"
            aria-pressed={mode === Number(value)}
            onClick={() => patchParams({ mode: Number(value) })}
          >
            {locale === 'en' ? labels.en : labels.zh}
          </button>
        ))}
      </div>

      <ParamControls
        module={controlsModule(module, locale)}
        values={targetParams}
        onChange={(key, value) => {
          patchParams({ [key]: value });
        }}
      />

      <div className="curve-work-mode-toggle" aria-label={locale === 'en' ? 'Playback' : '播放控制'}>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={!playing}
          onClick={() => setPlaying((prev) => !prev)}
        >
          {playing ? (locale === 'en' ? 'Pause' : '暫停') : locale === 'en' ? 'Play' : '播放'}
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={false}
          onClick={() => {
            setPlaying(true);
            setReplayNonce((prev) => prev + 1);
          }}
        >
          {locale === 'en' ? 'Replay' : '重播'}
        </button>
      </div>
    </WorkControlsPortal>
  );

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label={locale === 'en' ? 'Basel problem' : '巴塞爾問題視覺化'}
      />
      {controls}
    </>
  );
}
