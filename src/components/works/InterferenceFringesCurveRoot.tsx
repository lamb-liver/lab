import { useCallback, useState } from 'react';
import { interferenceFringesModule } from '../../curve/modules/interference-fringes';
import type { CurveMetadata } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import { useInterferenceFringesP5 } from '../curve/useInterferenceFringesP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';
import { useQuerySyncedParams } from '../curve/useQuerySyncedParams';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const EN_LABELS: Record<string, string> = {
  sourceDistance: 'Source distance d',
  wavelength: 'Wavelength λ',
  timeSpeed: 'Time speed ω',
};

function englishMetadata(metadata: CurveMetadata): CurveMetadata {
  return { ...metadata, title: 'Interference fringes' };
}

export default function InterferenceFringesCurveRoot({ controlsMountId, locale }: Props) {
  const en = locale === 'en';
  const module = interferenceFringesModule;

  const [targetParams, setTargetParams] = useQuerySyncedParams(module.defaultParams);
  const [revealPct, setRevealPct] = useState(0);
  const [smoothSourceDistance, setSmoothSourceDistance] = useState(
    module.defaultParams.sourceDistance,
  );

  const onRevealPctChange = useCallback((pct: number) => setRevealPct(pct), []);
  const onSmoothSourceDistanceChange = useCallback(
    (distance: number) => setSmoothSourceDistance(distance),
    [],
  );

  const { canvasHostRef } = useInterferenceFringesP5({
    targetParams,
    onRevealPctChange,
    onSmoothSourceDistanceChange,
    locale,
  });

  const metadata = module.getMetadata(targetParams, {
    revealPct,
    smoothParams: {
      ...targetParams,
      sourceDistance: smoothSourceDistance,
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
        aria-label={en ? 'Interference fringes' : '干涉條紋動畫'}
      />
      {controls}
    </>
  );
}
