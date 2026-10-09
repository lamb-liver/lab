import { useCallback, useMemo, useState } from 'react';
import { stepLissajousAnimation } from '../../curve/modules/lissajous/animation';
import {
  lissajousModule,
  REVEAL_SPEED,
} from '../../curve/modules/lissajous';
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
  return { ...metadata, title: 'Lissajous curve' };
}

export default function LissajousCurveRoot({ controlsMountId, locale }: Props) {
  const en = locale === 'en';
  const module = lissajousModule;
  const sampleStep = module.sampleStep ?? 0.003;

  const [targetParams, setTargetParams] = useQuerySyncedParams(module.defaultParams);
  const [revealPct, setRevealPct] = useState(0);
  const [smoothDelta, setSmoothDelta] = useState(module.defaultParams.delta);

  const onRevealPctChange = useCallback((pct: number) => setRevealPct(pct), []);
  const smoothSync = useMemo(
    () => [
      {
        pick: (p: ParamValues) => p.delta,
        quantize: (v: number) => Math.floor(v * 50),
        onChange: setSmoothDelta,
      },
    ],
    [],
  );

  const { canvasHostRef, patchTargetParams } = useMorphCurveP5({
    module,
    sampleStep,
    revealSpeed: REVEAL_SPEED,
    stepAnimation: stepLissajousAnimation,
    targetParams,
    defaultParams: module.defaultParams,
    onRevealPctChange,
    smoothSync,
    locale,
  });

  const metadata = module.getMetadata(targetParams, {
    revealPct,
    smoothParams: { ...targetParams, delta: smoothDelta },
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
            setTargetParams(patchTargetParams({ [key]: value }));
          }
        }}
      />
      <DeltaPhaseControl
        moduleId={module.id}
        targetDelta={targetParams.delta}
        displayDelta={smoothDelta}
        onTargetChange={(delta) => setTargetParams(patchTargetParams({ delta }))}
        locale={locale}
      />
    </WorkControlsPortal>
  );

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label={en ? 'Lissajous curve' : '利薩茹曲線動畫'}
      />
      {controls}
    </>
  );
}
