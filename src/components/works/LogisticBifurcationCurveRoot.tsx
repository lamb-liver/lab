import { useState } from 'react';
import {
  MODE_BIFURCATION,
  MODE_COBWEB,
  MODE_COMPARE,
  MODE_ORBIT,
  logisticBifurcationModule,
} from '../../curve/modules/logistic-bifurcation';
import type { CurveMetadata, CurveModule, ParamValues } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import { useLogisticBifurcationP5 } from '../curve/useLogisticBifurcationP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';
import { useQuerySyncedParams } from '../curve/useQuerySyncedParams';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const modes = [
  { value: MODE_BIFURCATION, label: '分岔', en: 'Bifurcation' },
  { value: MODE_ORBIT, label: '軌道', en: 'Orbit' },
  { value: MODE_COBWEB, label: '蛛網', en: 'Cobweb' },
  { value: MODE_COMPARE, label: '對照', en: 'Compare' },
];

const EN_PARAM_LABELS: Record<string, string> = {
  r: 'Parameter r',
  x0: 'Initial value x₀',
};

function englishMetadata(metadata: CurveMetadata): CurveMetadata {
  return {
    ...metadata,
    title: 'Logistic map bifurcation diagram',
    stats: metadata.stats.map((stat) => {
      if (stat.key === 'mode') {
        const match = modes.find((item) => item.label === stat.value);
        return { ...stat, label: 'Mode', value: match?.en ?? stat.value };
      }
      if (stat.key === 'period') {
        return { ...stat, label: 'Period', value: stat.value === '混沌' ? 'Chaotic' : stat.value };
      }
      return stat;
    }),
  };
}

function englishControls(module: CurveModule): CurveModule {
  return {
    ...module,
    paramSchema: module.paramSchema.map((def) => ({
      ...def,
      label: EN_PARAM_LABELS[def.key] ?? def.label,
    })),
  };
}

export default function LogisticBifurcationCurveRoot({ controlsMountId, locale }: Props) {
  const en = locale === 'en';
  const module = logisticBifurcationModule;
  const [targetParams, setTargetParams] = useQuerySyncedParams(module.defaultParams);
  const [playing, setPlaying] = useState(true);
  const [replayNonce, setReplayNonce] = useState(0);

  const { canvasHostRef } = useLogisticBifurcationP5({
    targetParams,
    playing,
    replayNonce,
  });

  const rawMetadata = module.getMetadata(targetParams);
  const metadata = en ? englishMetadata(rawMetadata) : rawMetadata;

  const patchParams = (patch: ParamValues) => {
    setTargetParams((prev) => ({ ...prev, ...patch }));
  };

  const mode = Math.round(targetParams.mode ?? MODE_COMPARE);

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={metadata}>
      <div className="curve-work-mode-toggle" aria-label={en ? 'Logistic map view' : '單峰映射視圖'}>
        {modes.map((option) => (
          <button
            key={option.value}
            type="button"
            className="curve-work-mode-button"
            aria-pressed={mode === option.value}
            onClick={() => patchParams({ mode: option.value })}
          >
            {en ? option.en : option.label}
          </button>
        ))}
      </div>

      <ParamControls
        module={en ? englishControls(module) : module}
        values={targetParams}
        onChange={(key, value) => patchParams({ [key]: value })}
      />

      <div className="curve-work-mode-toggle" aria-label={en ? 'Display options' : '顯示選項'}>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={targetParams.showFeig !== 0}
          onClick={() => patchParams({ showFeig: targetParams.showFeig === 0 ? 1 : 0 })}
        >
          Feigenbaum
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={targetParams.showCobweb !== 0}
          onClick={() => patchParams({ showCobweb: targetParams.showCobweb === 0 ? 1 : 0 })}
        >
          Cobweb
        </button>
      </div>

      <div className="curve-work-mode-toggle" aria-label={en ? 'Playback' : '播放控制'}>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={!playing}
          onClick={() => setPlaying((prev) => !prev)}
        >
          {playing ? (en ? 'Pause' : '暫停') : en ? 'Play' : '播放'}
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
          {en ? 'Replay' : '重播'}
        </button>
      </div>
    </WorkControlsPortal>
  );

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label={en ? 'Logistic map bifurcation diagram' : '單峰映射分岔圖'}
      />
      {controls}
    </>
  );
}
