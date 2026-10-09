import { useCallback, useMemo, useState, type FormEvent } from 'react';
import { stepHarmonographAnimation } from '../../curve/modules/harmonograph/animation';
import {
  harmonographModule,
  REVEAL_SPEED,
} from '../../curve/modules/harmonograph';
import type { CurveMetadata, ParamValues } from '../../curve/types';
import DeltaPhaseControl from '../curve/DeltaPhaseControl';
import ParamControls from '../curve/ParamControls';
import { useMorphCurveP5 } from '../curve/useMorphCurveP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';
import { useQuerySyncedParams } from '../curve/useQuerySyncedParams';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const EN_LABELS: Record<string, string> = {
  a: 'Frequency a',
  b: 'Frequency b',
};

function englishMetadata(metadata: CurveMetadata): CurveMetadata {
  return { ...metadata, title: 'Harmonograph' };
}

export default function HarmonographCurveRoot({ controlsMountId, locale }: Props) {
  const en = locale === 'en';
  const module = harmonographModule;
  const sampleStep = module.sampleStep ?? 0.01;

  const [targetParams, setTargetParams] = useQuerySyncedParams(module.defaultParams);
  const [revealPct, setRevealPct] = useState(0);
  const [smoothDelta, setSmoothDelta] = useState(module.defaultParams.delta);
  const [smoothD, setSmoothD] = useState(module.defaultParams.d);

  const onRevealPctChange = useCallback((pct: number) => setRevealPct(pct), []);
  const smoothSync = useMemo(
    () => [
      {
        pick: (p: ParamValues) => p.delta,
        quantize: (v: number) => Math.floor(v * 50),
        onChange: setSmoothDelta,
      },
      {
        pick: (p: ParamValues) => p.d,
        quantize: (v: number) => Math.floor(v * 1000),
        onChange: setSmoothD,
      },
    ],
    [],
  );

  const { canvasHostRef, patchTargetParams } = useMorphCurveP5({
    module,
    sampleStep,
    revealSpeed: REVEAL_SPEED,
    stepAnimation: stepHarmonographAnimation,
    targetParams,
    defaultParams: module.defaultParams,
    onRevealPctChange,
    smoothSync,
    locale,
  });

  const commitTarget = useCallback(
    (patch: Partial<ParamValues>) => {
      setTargetParams(patchTargetParams(patch));
    },
    [patchTargetParams],
  );

  const handleDInput = useCallback(
    (e: FormEvent<HTMLInputElement>) => {
      // 必須在 handler 同步讀 value；不可在 setState updater 內讀 e.currentTarget
      const d = Number(e.currentTarget.value);
      commitTarget({ d });
    },
    [commitTarget],
  );

  const metadata = module.getMetadata(targetParams, {
    revealPct,
    smoothParams: {
      ...targetParams,
      delta: smoothDelta,
      d: smoothD,
    },
  });
  const shown = en ? englishMetadata(metadata) : metadata;
  const controlsModule = en
    ? {
        ...module,
        paramSchema: module.paramSchema.map((def) => ({
          ...def,
          label: EN_LABELS[def.key] ?? def.label,
        })),
      }
    : module;

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={shown}>
      <ParamControls
        module={controlsModule}
        values={targetParams}
        onChange={(key, value) => {
          if (key === 'a' || key === 'b') {
            commitTarget({ [key]: value });
          }
        }}
      />
      <DeltaPhaseControl
        moduleId={module.id}
        targetDelta={targetParams.delta}
        displayDelta={smoothDelta}
        onTargetChange={(delta) => commitTarget({ delta })}
        locale={locale}
      />
      <div className="control-field">
        <label htmlFor={`${module.id}-d`}>{en ? 'Damping d' : '阻尼 d'}</label>
        <div className="range-wrap">
          <input
            id={`${module.id}-d`}
            type="range"
            className="range"
            min={0}
            max={0.05}
            step={0.001}
            value={targetParams.d}
            onInput={handleDInput}
          />
        </div>
      </div>
    </WorkControlsPortal>
  );

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label={en ? 'Harmonograph' : '諧振圖動畫'}
      />
      {controls}
    </>
  );
}
