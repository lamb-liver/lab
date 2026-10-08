import { useCallback, useMemo, useState } from 'react';
import { stepSpirographAnimation } from '../../curve/modules/spirograph/animation';
import {
  spirographModule,
  REVEAL_SPEED,
} from '../../curve/modules/spirograph';
import type { CurveMetadata, ParamValues } from '../../curve/types';
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
  R: 'Large circle R',
  r: 'Small circle r',
  d: 'Pen d',
};

function englishMetadata(metadata: CurveMetadata): CurveMetadata {
  return { ...metadata, title: 'Spirograph curve' };
}

export default function SpirographCurveRoot({ controlsMountId, locale }: Props) {
  const en = locale === 'en';
  const module = spirographModule;
  const sampleStep = module.sampleStep ?? 0.02;

  const [targetParams, setTargetParams] = useQuerySyncedParams(module.defaultParams);
  const [revealPct, setRevealPct] = useState(0);
  const [smoothD, setSmoothD] = useState(module.defaultParams.d);

  const onRevealPctChange = useCallback((pct: number) => setRevealPct(pct), []);
  const smoothSync = useMemo(
    () => [
      {
        pick: (p: ParamValues) => p.d,
        quantize: (v: number) => Math.floor(v * 10),
        onChange: setSmoothD,
      },
    ],
    [],
  );

  const { canvasHostRef, patchTargetParams } = useMorphCurveP5({
    module,
    sampleStep,
    revealSpeed: REVEAL_SPEED,
    stepAnimation: stepSpirographAnimation,
    targetParams,
    defaultParams: module.defaultParams,
    onRevealPctChange,
    smoothSync,
    locale,
  });

  const metadata = module.getMetadata(targetParams, {
    revealPct,
    smoothParams: { ...targetParams, d: smoothD },
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
          setTargetParams(patchTargetParams({ [key]: value }));
        }}
      />
    </WorkControlsPortal>
  );

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label={en ? 'Spirograph curve' : '繁花曲線動畫'}
      />
      {controls}
    </>
  );
}
