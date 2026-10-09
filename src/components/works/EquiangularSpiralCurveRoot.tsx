import { useCallback, useState } from 'react';
import { equiangularSpiralModule } from '../../curve/modules/equiangular-spiral';
import type { CurveMetadata, ParamValues } from '../../curve/types';
import ParamControls from '../curve/ParamControls';
import { useEquiangularSpiralP5 } from '../curve/useEquiangularSpiralP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';
import { useQuerySyncedParams } from '../curve/useQuerySyncedParams';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const EN_LABELS: Record<string, string> = {
  growthB: 'Growth coefficient b',
  rotationSpeed: 'Rotation speed',
  maxTheta: 'Maximum angle θ',
};

function englishMetadata(metadata: CurveMetadata): CurveMetadata {
  return { ...metadata, title: 'Equiangular spiral' };
}

export default function EquiangularSpiralCurveRoot({ controlsMountId, locale }: Props) {
  const en = locale === 'en';
  const module = equiangularSpiralModule;

  const [targetParams, setTargetParams] = useQuerySyncedParams(module.defaultParams);
  const [revealTheta, setRevealTheta] = useState(0);
  const [smoothParams, setSmoothParams] = useState<ParamValues>(module.defaultParams);

  const onRevealThetaChange = useCallback((theta: number) => setRevealTheta(theta), []);
  const onSmoothParamsChange = useCallback(
    (params: ParamValues) => setSmoothParams((prev) => ({ ...prev, ...params })),
    [],
  );

  const { canvasHostRef } = useEquiangularSpiralP5({
    targetParams,
    onRevealThetaChange,
    onSmoothParamsChange,
    locale,
  });

  const metadata = module.getMetadata(targetParams, {
    revealPct: 0,
    smoothParams,
    revealTheta,
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
        aria-label={en ? 'Equiangular spiral' : '等角螺線動畫'}
      />
      {controls}
    </>
  );
}
