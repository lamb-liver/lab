import { useCallback, useState } from 'react';
import { standingWaveModule } from '../../curve/modules/standing-wave';
import type { CurveMetadata } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import { useStandingWaveP5 } from '../curve/useStandingWaveP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';
import { useQuerySyncedParams } from '../curve/useQuerySyncedParams';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const EN_LABELS: Record<string, string> = {
  amplitude: 'Amplitude A',
  spatialFrequency: 'Spatial frequency k',
  timeSpeed: 'Time speed ω',
};

function englishMetadata(metadata: CurveMetadata): CurveMetadata {
  return { ...metadata, title: 'Stationary wave' };
}

export default function StandingWaveCurveRoot({ controlsMountId, locale }: Props) {
  const en = locale === 'en';
  const module = standingWaveModule;

  const [targetParams, setTargetParams] = useQuerySyncedParams(module.defaultParams);
  const [revealPct, setRevealPct] = useState(0);
  const [smoothAmplitude, setSmoothAmplitude] = useState(module.defaultParams.amplitude);

  const onRevealPctChange = useCallback((pct: number) => setRevealPct(pct), []);
  const onSmoothAmplitudeChange = useCallback(
    (amplitude: number) => setSmoothAmplitude(amplitude),
    [],
  );

  const { canvasHostRef } = useStandingWaveP5({
    targetParams,
    onRevealPctChange,
    onSmoothAmplitudeChange,
    locale,
  });

  const metadata = module.getMetadata(targetParams, {
    revealPct,
    smoothParams: { ...targetParams, amplitude: smoothAmplitude },
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
          setTargetParams((prev) => ({ ...prev, [key]: value }));
        }}
      />
    </WorkControlsPortal>
  );

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label={en ? 'Stationary wave' : '駐波圖動畫'}
      />
      {controls}
    </>
  );
}
