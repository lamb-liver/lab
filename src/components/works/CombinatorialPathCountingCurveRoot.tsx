import { useState } from 'react';
import {
  MODE_COUNT,
  MODE_OVERLAY,
  MODE_SINGLE,
  combinatorialPathCountingModule,
} from '../../curve/modules/combinatorial-path-counting';
import type { CurveMetadata } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import { useCombinatorialPathCountingP5 } from '../curve/useCombinatorialPathCountingP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';
import { useQuerySyncedParams } from '../curve/useQuerySyncedParams';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const modeOptions = [
  { value: MODE_SINGLE, zh: '單一路徑', en: 'One path' },
  { value: MODE_OVERLAY, zh: '路徑疊合', en: 'Path overlay' },
  { value: MODE_COUNT, zh: '計數場', en: 'Count field' },
];

const EN_PARAM_LABELS: Record<string, string> = {
  m: 'Right steps m',
  n: 'Up steps n',
};

const EN_MODE_VALUE: Record<string, string> = {
  單一路徑: 'One path',
  路徑疊合: 'Path overlay',
  計數場: 'Count field',
};

function englishMetadata(metadata: CurveMetadata): CurveMetadata {
  return {
    ...metadata,
    title: 'Path counting',
    stats: metadata.stats.map((stat) => ({
      ...stat,
      label:
        stat.key === 'grid'
          ? 'Grid'
          : stat.key === 'mode'
            ? 'Mode'
            : stat.key === 'total'
              ? 'Paths'
              : stat.label,
      value: stat.key === 'mode' ? (EN_MODE_VALUE[String(stat.value)] ?? stat.value) : stat.value,
    })),
  };
}

export default function CombinatorialPathCountingCurveRoot({ controlsMountId, locale }: Props) {
  const module = combinatorialPathCountingModule;
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
  const [rerollNonce, setRerollNonce] = useState(0);

  const { canvasHostRef } = useCombinatorialPathCountingP5({
    targetParams,
    rerollNonce,
    locale,
  });

  const metadata = module.getMetadata(targetParams);
  const shown = en ? englishMetadata(metadata) : metadata;
  const mode = Math.round(targetParams.mode ?? MODE_SINGLE);

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={shown}>
      <div
        className="curve-work-mode-toggle curve-work-mode-toggle--dense"
        aria-label={en ? 'Path mode' : '路徑模式'}
      >
        {modeOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            className="curve-work-mode-button"
            aria-pressed={mode === option.value}
            onClick={() => setTargetParams((prev) => ({ ...prev, mode: option.value }))}
          >
            {en ? option.en : option.zh}
          </button>
        ))}
      </div>

      <ParamControls
        module={controlsModule}
        values={targetParams}
        onChange={(key, value) => setTargetParams((prev) => ({ ...prev, [key]: value }))}
      />

      <div className="curve-work-mode-toggle" aria-label={en ? 'Path controls' : '路徑控制'}>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={false}
          onClick={() => setRerollNonce((prev) => prev + 1)}
        >
          {en ? 'New path' : '新路徑'}
        </button>
      </div>
    </WorkControlsPortal>
  );

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label={en ? 'Path counting' : '組合路徑計數互動視覺化'}
      />
      {controls}
    </>
  );
}
